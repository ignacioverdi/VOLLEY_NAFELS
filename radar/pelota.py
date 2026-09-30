# -*- coding: utf-8 -*-
"""pelota.py — encontrar la pelota en cada cuadro.

El modelo devuelve un mapa de calor y un mapa de radio. Del de calor se sacan
los seis picos mas altos —no uno: la pelota casi siempre esta entre los seis
aunque no sea el primero— y del de radio, leido en el pico, sale el tamanio
aparente, que es informacion de distancia gratis.

DOS MIRADAS
-----------
El modelo trabaja en 512x288 y el cuadro es de 1280x720: entra reducido dos
veces y media. Se lo corre tambien sobre la franja por donde vuela el saque,
agrandada, para que la pelota le llegue del doble de tamanio cuando esta lejos.

EL PICO, ENTRE PIXELES
----------------------
Cada celda del mapa son 2,5 px de imagen. Tomando el maximo tal cual, la
posicion queda redondeada a esos 2,5 px, que es la mitad del error que queda
despues en el ajuste. Ajustandole una parabola a la celda mas alta y sus dos
vecinas se recupera el centro con mucha mas precision. Es lo mismo que se hace
para medir la posicion de una estrella.
"""
import numpy as np
import cv2
from scipy.ndimage import maximum_filter

SEQ, HI, WI = 9, 288, 512
FRANJA = (256, 176, 1024, 608)      # por donde vuela el saque, para la 2a mirada


def _sub(hm, x, y):
    dx = dy = 0.0
    if 0 < x < hm.shape[1] - 1:
        a, b, c = hm[y, x - 1], hm[y, x], hm[y, x + 1]
        d = a - 2 * b + c
        if d < -1e-9:
            dx = 0.5 * (a - c) / d
    if 0 < y < hm.shape[0] - 1:
        a, b, c = hm[y - 1, x], hm[y, x], hm[y + 1, x]
        d = a - 2 * b + c
        if d < -1e-9:
            dy = 0.5 * (a - c) / d
    return float(np.clip(dx, -0.8, 0.8)), float(np.clip(dy, -0.8, 0.8))


class Buscador(object):
    def __init__(self, ruta_onnx, hilos=0):
        import onnxruntime as ort
        op = ort.SessionOptions()
        if hilos:
            op.intra_op_num_threads = hilos
        self.s = ort.InferenceSession(ruta_onnx, op, providers=['CPUExecutionProvider'])
        self.ent = self.s.get_inputs()[0].name
        o = self.s.get_outputs()[0]
        self.planos = 2 if o.shape[1] == SEQ * 2 else 1

    def _picos(self, hm, k=6, umbral=0.04, dmin=6):
        mx = maximum_filter(hm, size=dmin)
        loc = (hm == mx) & (hm > umbral)
        ys, xs = np.nonzero(loc)
        if len(xs) == 0:
            return []
        v = hm[ys, xs]
        out = []
        for i in np.argsort(v)[::-1][:k]:
            x, y = int(xs[i]), int(ys[i])
            dx, dy = _sub(hm, x, y)
            out.append((x + dx, y + dy, float(v[i]), x, y))
        return out

    def _pasada(self, cuadros, caja, k=6):
        x0, y0, x1, y1 = caja
        sx, sy = (x1 - x0) / float(WI), (y1 - y0) / float(HI)
        out = {}
        buf, idx = [], []
        for i, im in enumerate(cuadros):
            g = cv2.resize(im[y0:y1, x0:x1], (WI, HI)).astype(np.float32) / 255.0
            buf.append(g); idx.append(i)
            if len(buf) == SEQ:
                y = self.s.run(None, {self.ent: np.stack(buf)[None, ...]})[0]
                for j in range(SEQ):
                    hm = y[0, j]
                    rm = y[0, SEQ + j] if self.planos == 2 else None
                    c = []
                    for (px, py, val, ix, iy) in self._picos(hm, k=k):
                        rr = float(rm[iy, ix]) * (x1 - x0) if rm is not None else 0.0
                        c.append((x0 + px * sx, y0 + py * sy, val, rr))
                    out[idx[j]] = c
                buf, idx = [], []
        return out

    def candidatos(self, cuadros, k=6, dmin=7.0, tope=9):
        """Las dos miradas, juntadas en una sola lista por cuadro."""
        h, w = cuadros[0].shape[:2]
        a = self._pasada(cuadros, (0, 0, w, h), k)
        b = self._pasada(cuadros, FRANJA, k)
        out = {}
        for f in set(a) | set(b):
            ps = list(a.get(f, []))
            for q in b.get(f, []):
                cerca = [i for i, p in enumerate(ps)
                         if np.hypot(q[0] - p[0], q[1] - p[1]) < dmin]
                if cerca:
                    i = cerca[0]
                    if q[2] > ps[i][2]:
                        ps[i] = q
                else:
                    ps.append(q)
            ps.sort(key=lambda p: -p[2])
            out[f] = ps[:tope]
        return out
