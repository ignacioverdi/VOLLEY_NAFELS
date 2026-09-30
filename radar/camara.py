# -*- coding: utf-8 -*-
"""camara.py — donde esta la camara y como ve.

Sin esto no hay metros, y sin metros no hay km/h. Se resuelve UNA vez por
posicion de camara y queda guardada en calibraciones.json. Mientras el tripode
no se mueva y no se toque el zoom, la misma calibracion sirve para siempre.

COMO SE SACO LA DEL GIMNASIO DE ENTRENAMIENTO
---------------------------------------------
Desde atras del sacador la cancha se ve casi de canto y el buscador automatico
de lineas no cierra: las lineas verdes de ese piso son de badminton, y la de
voley es la superficie beige con lineas blancas.

Se resolvio por otro lado. Las cinco lineas transversales de una cancha de
voley —fondo, ataque, central, ataque, fondo— estan a distancias fijas, y en la
imagen sus alturas tienen que cumplir y = horizonte + k/distancia. Solo un
reparto de las rayas que se ven cumple esa relacion con las cinco a la vez, y
ese reparto da la distancia de la camara a cada linea. El ancho de la cancha
(9 m) da la escala horizontal, y de ahi salen la focal y la altura.

LA COMPROBACION
---------------
El borde de arriba de la red esta a 2,43 m y NO entro en el calculo. Con la
camara resuelta cae a 0,1 px de donde se ve. Eso no pasa de casualidad.
"""
import json, os
import numpy as np

CX, CY = 640.0, 360.0      # el centro de la imagen, en 1280x720


def cargar(carpeta, nombre=None):
    ruta = os.path.join(carpeta, 'calibraciones.json')
    with open(ruta, encoding='utf-8') as f:
        todo = json.load(f)
    if nombre is None:
        return todo
    c = todo[nombre]
    return armar(c)


def armar(c):
    """De los numeros guardados a lo que usa la medicion."""
    th = np.radians(c['inclinacion_grados'])
    s, co = np.sin(th), np.cos(th)
    R = np.array([[1, 0, 0], [0, -s, -co], [0, co, -s]], float)
    C = np.array([c['desplazamiento_lateral_m'],
                  -c['distancia_a_la_linea_central_m'],
                  c['altura_camara_m']], float)
    return dict(foc=float(c['focal_px']), R=R, C=C, nombre=c.get('nombre', ''),
                tilt=float(c['inclinacion_grados']))


def proyectar(cal, P):
    """De metros de cancha (X ancho, Y largo, Z alto) a pixeles."""
    Q = cal['R'] @ (np.atleast_2d(P).T - cal['C'][:, None])
    return CX + cal['foc'] * Q[0] / Q[2], CY + cal['foc'] * Q[1] / Q[2], Q[2]


def rayo(cal, u, v, dist):
    """El punto que se ve en (u,v) y esta a esa distancia de la camara."""
    w = np.linalg.inv(cal['R']) @ np.array([(u - CX) / cal['foc'],
                                            (v - CY) / cal['foc'], 1.0])
    return cal['C'] + w / np.linalg.norm(w) * dist
