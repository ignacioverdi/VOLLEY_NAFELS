# -*- coding: utf-8 -*-
"""vuelo.py — de la pelota en pantalla a los km/h.

El vuelo se ajusta en metros de cancha: la unica aceleracion permitida es la
gravedad, 9,81 hacia abajo, mas el rozamiento del aire en contra de la marcha.
Lo unico que se busca es donde empieza y con que velocidad; la camara ya se
sabe.

Se compara contra dos cosas que se ven y son independientes entre si: donde
esta la pelota en pantalla, y de que tamanio se ve. La segunda es una medida de
distancia que la primera no tiene.

LA ESTELA
---------
Con el obturador en automatico (1/60 s) la pelota deja estela y el modelo le
mide un radio inflado. En un saque fuerte, que se corre 25 px por cuadro, eso
es mas de un tercio de mas, y acorta el vuelo calculado. Se corrige restandole
al radio una fraccion del desplazamiento por cuadro. Es un parche: filmando con
el obturador en 1/500 la correccion sobra.
"""
import numpy as np
from scipy.optimize import least_squares
from .camara import proyectar, rayo, CX, CY

RAD = 0.105                 # metros: el radio de la pelota
G = 9.81
# rozamiento: 0.5*rho*Cd*A/m, con Cd 0,20, A = pi*R^2 y 270 g
K_AIRE = 0.5 * 1.20 * 0.20 * (np.pi * RAD ** 2) / 0.270
ESTELA = 0.18               # cuanto del corrimiento por cuadro infla el radio


def integrar(P0, V0, t, k=K_AIRE):
    n = len(t)
    P = np.empty((n, 3)); P[0] = P0
    X = np.array(P0, float); V = np.array(V0, float)
    for i in range(1, n):
        h = t[i] - t[i - 1]
        m = max(1, int(np.ceil(h / 0.003))); dt = h / m
        for _ in range(m):
            a = np.array([0.0, 0.0, -G]) - k * np.linalg.norm(V) * V
            V = V + a * dt
            X = X + V * dt
        P[i] = X
    return P


def _andar(P0, V0, hasta_y, atras, dt=0.002, tope=900):
    X = np.array(P0, float); V = np.array(V0, float)
    paso = -dt if atras else dt
    for _ in range(tope):
        if (atras and X[1] <= hasta_y) or (not atras and X[1] >= hasta_y):
            return X, V
        a = np.array([0.0, 0.0, -G]) - K_AIRE * np.linalg.norm(V) * V
        if atras:
            V = V - a * dt; X = X - V * dt
        else:
            V = V + a * dt; X = X + V * dt
    return None, None


def corregir_estela(u, v, r, estela=None):
    if estela is None:
        estela = ESTELA
    d = np.hypot(np.diff(u), np.diff(v))
    d = np.r_[d, d[-1]] if len(d) else np.zeros_like(r)
    return np.maximum(r - estela * d, 2.0)


def ajustar(cal, t, u, v, r, s_uv=2.0, s_r=0.13, peso_r=1.5):
    t = np.asarray(t, float); u = np.asarray(u, float)
    v = np.asarray(v, float); r = np.asarray(r, float)

    def pred(x):
        P = integrar(x[:3], x[3:6], t)
        pu, pv, _ = proyectar(cal, P)
        d = np.linalg.norm(P - cal['C'], axis=1)
        return pu, pv, cal['foc'] * RAD / d, P

    def res(x):
        pu, pv, pr, _ = pred(x)
        return np.r_[(pu - u) / s_uv, (pv - v) / s_uv,
                     peso_r * (pr - r) / (s_r * r)]

    d0 = cal['foc'] * RAD / r
    P0 = rayo(cal, u[0], v[0], d0[0])
    Pf = rayo(cal, u[-1], v[-1], d0[-1])
    V0 = (Pf - P0) / max(t[-1] - t[0], 1e-3)
    lo = np.r_[-9, -12, 0.2, -60, -60, -60]
    hi = np.r_[9, 14, 4.5, 60, 60, 60]
    s = least_squares(res, np.clip(np.r_[P0, V0], lo, hi), bounds=(lo, hi),
                      method='trf', loss='soft_l1', f_scale=2.0,
                      max_nfev=30000, x_scale='jac')
    pu, pv, pr, P = pred(s.x)
    return dict(P0=P[0].tolist(), V0=s.x[3:6].tolist(),
                res_uv=float(np.sqrt(((pu - u) ** 2 + (pv - v) ** 2).mean())),
                res_r=float(np.abs(pr - r).mean()), n=len(t))


def golpe(aj):
    """La velocidad al cruzar la linea de fondo: el mismo punto del vuelo para
    todos los saques, y el mas parecido a lo que lee una pistola."""
    P, V = _andar(aj['P0'], aj['V0'], -9.0, True)
    if P is None:
        return None
    return dict(kmh=float(np.linalg.norm(V) * 3.6), x=float(P[0]),
                z=float(P[2]))


def en_la_red(aj):
    P, V = _andar(aj['P0'], aj['V0'], 0.0, aj['P0'][1] >= 0)
    if P is None:
        return None
    return dict(x=float(P[0]), z=float(P[2]),
                kmh=float(np.linalg.norm(V) * 3.6))
