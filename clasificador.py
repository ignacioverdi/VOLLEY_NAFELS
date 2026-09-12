# -*- coding: utf-8 -*-
"""
DEDUCIR EL PUESTO DE UN JUGADOR MIRANDO LO QUE HACE
===================================================

Por que hace falta
------------------
El puesto viene declarado en el .dvw, pero eso falla seguido:

  · de los RIVALES no tenemos plantel cargado, y sus archivos muchas veces
    traen la columna del puesto vacia
  · un scout apurado la deja en blanco o pone cualquier cosa
  · los archivos que se bajan de VolleyMetrics no la traen

Cuando falta, el sistema tiene que DEDUCIRLO, no inventarlo. Y se puede,
porque cada puesto deja una huella distinta en el scout.

Las huellas, medidas sobre datos reales
---------------------------------------
Este es el plantel de Näfels, con el puesto que sabemos de verdad:

    num  puesto     saque  recep  ataque  bloqueo  armado
    #2   LIBERO         0    256       0        0     136
    #20  LIBERO         0    272       0        0     130
    #4   ARMADOR      125      0       6       13     355
    #13  ARMADOR       86      0       2       10     256
    #5   CENTRAL      129      1      49       44     113
    #7   CENTRAL      128      1      46       65     104
    #1   PUNTA         99    264      76        6     115
    #17  PUNTA        107    261      63       10     106
    #11  PUNTA        118    158      82        8     123
    #10  PUNTA         97    149      55       18     110
    #3   OPUESTO       83      0      57        6      78
    #9   OPUESTO      131      0      90       21      99

Se lee solo:

  LIBERO   no saca NUNCA y no ataca NUNCA, pero recibe muchisimo
  ARMADOR  arma el triple que cualquier otro, y casi no ataca
  PUNTA    RECIBE. Es lo que lo separa del opuesto y del central
  CENTRAL  no recibe, y BLOQUEA mucho mas que el resto
  OPUESTO  no recibe, ataca mucho, pero bloquea como un punta

El armado hay que mirarlo EN RELACION al equipo, no en absoluto: en el
ejercicio de pelota alta arman todos, asi que todos tienen numeros altos.
El armador de verdad duplica al resto.
"""

import collections


# ══════════════════════════════════════════════════════════════════════════
#  LA COMBINACION DE ATAQUE DICE EL PUESTO
#  ------------------------------------------------------------------------
#  Cada combinacion es una jugada concreta, y cada jugada la hace un puesto.
#  No es una tendencia: es como se llama la pelota.
#
#  Esta tabla NO esta inventada. Sale de contar 1.018 ataques de los que si
#  sabemos el puesto —Näfels y cinco equipos de la liga— y quedarse con las
#  combinaciones donde un puesto se lleva al menos el 75%:
#
#      combo   usos   puesto     seguridad
#      J1        63   CENTRAL      100%
#      J2        32   CENTRAL       97%
#      J4        19   CENTRAL      100%
#      X7        30   CENTRAL      100%
#      X1        19   CENTRAL       89%
#      W4       167   PUNTA         97%
#      G4       128   PUNTA         98%
#      X5        90   PUNTA         87%
#      V5        48   PUNTA         92%
#      Y8        32   PUNTA        100%
#      Y1        14   PUNTA        100%
#      XP        13   PUNTA        100%
#      W2        67   OPUESTO       84%
#      G2        48   OPUESTO       90%
#      X6        44   OPUESTO       93%
#      X8        27   OPUESTO       96%
#      Y9        56   OPUESTO       77%
#      G9        15   OPUESTO       80%
#      V6        20   OPUESTO       75%
#      JJ        15   ARMADOR      100%
#
#  Se lee solo: las J son primer tiempo (central), las que terminan en 4 son
#  de zona 4 (punta), las que terminan en 2 son de zona 2 (opuesto), y JJ es
#  el armador atacando el segundo toque.
#
#  PR quedo AFUERA a proposito: 53% de seguridad, la usan todos. Una
#  combinacion que no distingue no sirve, y meterla ensuciaria el resto.
# ══════════════════════════════════════════════════════════════════════════
COMBO_PUESTO = {
    'J1': 'CENTRAL', 'J2': 'CENTRAL', 'J4': 'CENTRAL', 'X1': 'CENTRAL', 'X7': 'CENTRAL',
    'X2': 'CENTRAL', 'XM': 'CENTRAL', 'XC': 'CENTRAL', 'XB': 'CENTRAL', 'XD': 'CENTRAL',
    'W4': 'PUNTA',   'G4': 'PUNTA',   'X5': 'PUNTA',   'V5': 'PUNTA',
    'Y8': 'PUNTA',   'Y1': 'PUNTA',   'XP': 'PUNTA',   'C5': 'PUNTA',
    'W2': 'OPUESTO', 'G2': 'OPUESTO', 'X6': 'OPUESTO', 'X8': 'OPUESTO',
    'Y9': 'OPUESTO', 'G9': 'OPUESTO', 'V6': 'OPUESTO', 'V8': 'OPUESTO',
    'JJ': 'ARMADOR',
}


def _contar(acciones):
    """Cuenta las acciones de cada jugador por fundamento."""
    st = collections.defaultdict(collections.Counter)
    for a in acciones:
        num = a.get('num')
        sk = a.get('skill')
        if not num or not sk:
            continue
        st[int(num)][sk] += 1
        if sk == 'A':
            # el TIPO de ataque: Q = primer tiempo, H = alta, T = tensa.
            # Es la señal que mejor identifica al central.
            st[int(num)]['tipo_' + (a.get('tipo') or '')] += 1
            st[int(num)]['combo_' + (a.get('combo') or '')] += 1
    return st


def deducir_puestos(acciones, declarados=None):
    """Devuelve {numero: puesto} deduciendo de lo que hace cada jugador.

    'declarados' son los puestos que YA se conocen. Esos no se tocan: la
    deduccion es solo para los que faltan.

    EL ORDEN DE LAS PREGUNTAS IMPORTA. Va de la señal mas firme a la mas
    debil, para que una respuesta segura no quede tapada por una dudosa.
    """
    declarados = dict(declarados or {})
    st = _contar(acciones)
    if not st:
        return declarados

    # El armado se compara contra el equipo: en el ejercicio de pelota alta
    # arman todos y los numeros sueltos no dicen nada.
    armados = sorted((c['E'] for c in st.values()), reverse=True)
    medio_arm = armados[len(armados) // 2] if armados else 0

    out = {}
    for num, c in st.items():
        if num in declarados and declarados[num] not in ('', '?', None):
            out[num] = declarados[num]
            continue

        saq, rec, atq, blq, dfs, arm = c['S'], c['R'], c['A'], c['B'], c['D'], c['E']
        total = saq + rec + atq + blq + dfs + arm
        if total < 5:
            out[num] = ''
            continue

        # ── 1. LIBERO ────────────────────────────────────────────────────
        # No saca NUNCA y no ataca NUNCA: es regla de juego, no una tendencia.
        # Y recibe. Es la señal mas firme de todas.
        if saq == 0 and atq == 0 and rec >= 5:
            out[num] = 'LIBERO'
            continue

        # ── 2. ARMADOR ───────────────────────────────────────────────────
        # Arma mucho mas que el resto y casi no ataca. Medido: el armador de
        # un partido arma 68-75 pelotas contra 0-7 de los demas.
        if arm >= max(15, medio_arm * 1.8) and atq <= max(8, arm * 0.2):
            out[num] = 'ARMADOR'
            continue

        # ── 3. LA COMBINACION DE ATAQUE ──────────────────────────────────
        # Es la señal mas directa de todas: cada combinacion es una jugada
        # concreta y cada jugada la hace un puesto. Si la mayoria de los
        # ataques de un jugador son de un mismo puesto, ese es su puesto.
        #
        # Va antes que el tipo de ataque y que la recepcion porque es mas
        # especifica: "W4" dice zona 4 y pelota alta; el tipo solo dice alta.
        votos = collections.Counter()
        for k, v in c.items():
            if k.startswith('combo_'):
                p = COMBO_PUESTO.get(k[6:].strip().upper())
                if p:
                    votos[p] += v
        if votos:
            _gana, _n = votos.most_common(1)[0]
            _tot_c = sum(votos.values())
            # hacen falta al menos 3 ataques reconocidos y una mayoria clara
            if _tot_c >= 3 and _n >= _tot_c * 0.6:
                # el armador no se decide por ataques: ataca poquisimo
                if _gana != 'ARMADOR':
                    out[num] = _gana
                    continue

        # ── 4. CENTRAL, POR EL PRIMER TIEMPO ─────────────────────────────
        # Medido sobre 480 ataques de la liga, el tipo de ataque separa los
        # puestos casi solo:
        #
        #     puesto     Q(primer tiempo)   T(tensa)   H(alta)
        #     CENTRAL          73%            14%        4%
        #     PUNTA             1%            43%       29%
        #     OPUESTO           0%            44%       25%
        #
        # El primer tiempo lo hace el central y nadie mas. Va ANTES que la
        # recepcion porque es mas confiable: un central puede recibir alguna
        # pelota suelta, pero nadie que no sea central ataca en primer tiempo.
        rapidos = c['tipo_Q'] + c['tipo_N']
        if atq >= 3 and rapidos >= atq * 0.4:
            out[num] = 'CENTRAL'
            continue

        # ── 5. PUNTA, POR LA RECEPCION ───────────────────────────────────
        # Es lo unico que lo separa del opuesto: los dos atacan parecido,
        # pero el opuesto NO entra al sistema de recepcion. Medido: los
        # opuestos reciben 0 en todos los partidos revisados; los puntas,
        # entre 5 y 28 por partido.
        if rec >= 5 and atq >= 1:
            out[num] = 'PUNTA'
            continue

        # ── 6. LO QUE QUEDA: CENTRAL O OPUESTO ───────────────────────────
        # Ninguno recibe. Los separa el bloqueo: el central vive en la red.
        if atq == 0 and blq == 0:
            out[num] = ''
            continue
        # Con menos de 3 ataques no se decide NADA. Antes, un jugador con un
        # solo ataque y un solo bloqueo salia "central" porque 1 >= 0.55.
        # Preferir el vacio a inventar: el vacio se nota y se corrige, un
        # puesto inventado se toma por bueno.
        if atq < 3:
            out[num] = ''
        elif blq >= atq * 0.55:
            out[num] = 'CENTRAL'
        else:
            out[num] = 'OPUESTO'

    for k, v in declarados.items():
        out.setdefault(k, v)
    return out
