# -*- coding: utf-8 -*-
"""cadena.py — cual de todas las pelotas del gimnasio es la del saque.

En un ejercicio de saque hay varias pelotas en el aire a la vez. La del saque
es la unica que hace las tres cosas juntas: se aleja (su tamanio aparente cae a
la mitad o menos en menos de un segundo), sale de atras de la linea de fondo a
altura de golpe, y pasa por arriba de la red. Ninguna otra cumple las tres.

Se arman cadenas hacia adelante desde cada candidato, se prueban varios
comienzos —el golpe es un quiebre: estirar de mas arruina el ajuste— y gana la
que, ajustada como vuelo de verdad, deja menos residuo.
"""
import numpy as np
# Cuanto se le afloja al ajuste por cada pixel que se corre la pelota entre
# cuadro y cuadro. Con el obturador en automatico la pelota deja estela y el
# centro que devuelve el modelo no puede ser preciso: con un limite fijo se
# caian justo los saques de potencia. Filmando a 1/500 esto tiende a cero.
COEF_BORROSO = 0.40
from .vuelo import ajustar, golpe, en_la_red, corregir_estela


def _suave(x, k=5):
    x = list(x)
    if len(x) < k:
        return np.array(x, float)
    p = np.r_[[x[0]] * (k // 2), x, [x[-1]] * (k // 2)]
    return np.convolve(p, np.ones(k) / k, 'valid')[:len(x)]


def _hacia(cand, f_ini, p0, f_lim, adelante=True, salto=45.0, min_sc=0.08, huecos=5):
    paso = 1 if adelante else -1
    fs, pts = ([f_ini], [p0]) if adelante else ([], [])
    prev = np.array(p0[:2], float); vel = np.zeros(2); r_ant = p0[3]
    falta = 0
    f = f_ini + paso
    while (f <= f_lim) if adelante else (f >= f_lim):
        pred = prev + vel
        mejor, dm = None, 1e9
        for p in cand.get(f, []):
            if p[2] < min_sc:
                continue
            lo, hi = (0.55, 1.7) if adelante else (0.6, 1.9)
            if r_ant > 0 and p[3] > 0 and not (lo * r_ant < p[3] < hi * r_ant):
                continue
            d = float(np.hypot(p[0] - pred[0], p[1] - pred[1]))
            if d < dm:
                mejor, dm = p, d
        if mejor is None or dm > salto * (1 + falta):
            falta += 1
            if falta > huecos:
                break
            prev = pred; f += paso
            continue
        falta = 0
        q = np.array(mejor[:2], float)
        vel = 0.55 * vel + 0.45 * (q - prev)
        prev = q; r_ant = 0.65 * r_ant + 0.35 * mejor[3]
        fs.append(f); pts.append(mejor)
        f += paso
    if adelante:
        return fs, pts
    return fs[::-1], pts[::-1]


def _tramo(r, tope=90):
    j = int(np.argmax(r)); mn = r[j]; i = j
    for k in range(j + 1, min(len(r), j + tope + 1)):
        if r[k] < mn:
            mn = r[k]; i = k
        elif r[k] > mn * 1.14:
            break
    return j, i


def _calidad(t, u, v, r):
    A = np.c_[np.ones_like(t), t, t ** 2, t ** 3]
    e = 0.0
    for S in (u, v):
        c, *_ = np.linalg.lstsq(A, S, rcond=None)
        e += float(np.sqrt(((A @ c - S) ** 2).mean()))
    B = np.c_[np.ones_like(t), t]
    inv = 1.0 / np.maximum(r, 1.0)
    c, *_ = np.linalg.lstsq(B, inv, rcond=None)
    if c[1] <= 0:
        return 1e9, 1e9
    er = float(np.sqrt(((B @ c - inv) ** 2).mean()) / max(inv.mean(), 1e-9))
    return e / 2.0, er


def buscar(cal, cand, fps, min_largo=28, corto=16, rapido=10.0,
           caida=1.35, cand_max=10, salto=100.0,
           res_max=6.0, alto=(1.75, 3.90), red_min=2.30, estela=True,
           golpe_esperado=None, peso_momento=3.0, todos=None):
    """Devuelve el mejor vuelo, o None si no hay ninguno que sea un saque.

    golpe_esperado: en que segundo de la ventana deberia empezar el vuelo. El
    scout marca la S en el lanzamiento y el golpe viene alrededor de un segundo
    despues, siempre parecido. Un vuelo que arranca lejos de ahi puede ser una
    pelota impecable, pero no es ESTE saque. No se descarta de una —el golpe no
    siempre cae igual— sino que se lo penaliza.

    todos: si se le pasa una lista, se le agregan TODOS los vuelos que pasaron
    las pruebas, no solo el ganador. Sirve para ver despues si el bueno estaba
    y perdio por poco.
    """
    if not cand:
        return None
    f0, f1 = min(cand), max(cand)
    bruto = []
    for f in range(f0, f1 - min_largo):
        for p in cand.get(f, [])[:4]:
            if p[2] < 0.13 or p[3] < 9.0:
                continue
            fs, pts = _hacia(cand, f, p, f1, True, salto=salto)
            if len(fs) < corto:
                continue
            rs = _suave([q[3] for q in pts])
            j, i = _tramo(rs)
            if i - j < corto or rs[j] / max(rs[i], 1e-6) < caida:
                continue
            # CUANTOS CUADROS SE LE EXIGEN A UN VUELO
            # Un saque flotado de 60 km/h cruza en un segundo: da sesenta
            # cuadros y de sobra. Uno de potencia de 107 cruza en medio segundo
            # y el modelo lo agarra en trece. Pidiendoles a los dos la misma
            # cantidad de cuadros, el fuerte —el unico que interesa— no entra
            # nunca; aflojando para todos, entra cualquier pelotita lenta mal
            # seguida. Asi que la exigencia baja SOLO cuando la pelota se mueve
            # rapido en pantalla, que es justo cuando no puede durar.
            _u = np.array([pts[k][0] for k in range(j + 2, i + 1)])
            _v = np.array([pts[k][1] for k in range(j + 2, i + 1)])
            _d = float(np.median(np.hypot(np.diff(_u), np.diff(_v)))) if len(_u) > 2 else 0.0
            if (i - j) < min_largo and _d < rapido:
                continue
            a = min(j + 2, i - 10)
            sub = list(range(a, i + 1))
            t = (np.array([fs[k] for k in sub]) - fs[sub[0]]) / fps
            u = np.array([pts[k][0] for k in sub]); v = np.array([pts[k][1] for k in sub])
            r = np.array([pts[k][3] for k in sub])
            euv, er = _calidad(t, u, v, r)
            if euv > 7.0 or er > 0.16:
                continue
            bruto.append((len(sub) / (1 + euv) / (1 + 8 * er),
                          [fs[k] for k in sub], [pts[k] for k in sub]))
    if not bruto:
        return None
    bruto.sort(key=lambda x: -x[0])
    elegidos = []
    for b in bruto:
        s = set(b[1])
        if any(len(s & set(e[1])) > 0.7 * min(len(s), len(e[1])) for e in elegidos):
            continue
        elegidos.append(b)
        if len(elegidos) >= cand_max:
            break

    variantes = []
    for _, fs, pts in elegidos:
        variantes.append((fs, pts))
        fa, pa = _hacia(cand, fs[0], pts[0], f0, False, salto=salto)
        for k in (4, 8, 14):
            if len(fa) >= k:
                variantes.append((fa[-k:] + fs, pa[-k:] + pts))

    mejor = None
    for fs, pts in variantes:
        t = (np.array(fs) - fs[0]) / fps
        u = np.array([p[0] for p in pts]); v = np.array([p[1] for p in pts])
        r = np.array([p[3] for p in pts])
        if estela:
            r = corregir_estela(u, v, r)
        try:
            aj = ajustar(cal, t, u, v, r)
        except Exception:
            continue
        # Cuanto se le permite fallar al ajuste depende de lo borrosa que venga
        # la pelota. Con el obturador en automatico una pelota que se corre 30
        # px por cuadro deja una estela de 30 px: el centro que devuelve el
        # modelo no puede ser tan preciso como el de una pelota quieta. Con un
        # limite fijo se caian justo los saques fuertes —el unico vuelo bueno
        # del saque 8 daba 85,5 km/h contra 87 de la pistola y quedaba afuera
        # por medio pixel de mas.
        desp = float(np.median(np.hypot(np.diff(u), np.diff(v)))) if len(u) > 2 else 0.0
        if aj['res_uv'] > res_max + COEF_BORROSO * desp:
            continue
        g = golpe(aj)
        if g is None or not (alto[0] < g['z'] < alto[1]) or abs(g['x']) > 6.0:
            continue
        red = en_la_red(aj)
        if red is None or red['z'] < red_min:
            continue
        t0 = fs[0] / float(fps)
        punt = aj['res_uv'] - 0.02 * len(fs)
        if golpe_esperado is not None:
            punt += peso_momento * abs(t0 - golpe_esperado)
        aj['golpe'] = g; aj['red'] = red
        aj['cuadros'] = [int(x) for x in fs]
        aj['arranque_s'] = round(t0, 3)
        aj['puntaje'] = round(punt, 3)
        if todos is not None:
            todos.append(dict(arranque_s=aj['arranque_s'], kmh=round(g['kmh'], 1),
                              res_uv=round(aj['res_uv'], 2), cuadros=len(fs),
                              z_golpe=round(g['z'], 2), z_red=round(red['z'], 2),
                              puntaje=aj['puntaje']))
        if mejor is None or punt < mejor[0]:
            mejor = (punt, aj)
    return mejor[1] if mejor else None
