#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""El idioma de las placas y los videos.

POR QUÉ UNA CAPA Y NO UNA TRADUCCIÓN
------------------------------------
Las placas de Näfels van en inglés y las de GELP en español. Traducir a mano
sería tener dos códigos que se despegan en la tercera semana. Acá están todos
los textos que se ven, en los dos idiomas, y el resto del sistema no sabe en
qué idioma está trabajando.

PARA CAMBIARLO, UNA LÍNEA:

    IDIOMA = 'en'     # 'en' inglés · 'es' español

Lo que NO se traduce, a propósito:

  · la consola y PUBLICAR.txt, que los leés vos
  · los nombres de jugadores y clubes, que salen del .dvw
  · la escala DataVolley (# / + ! - =), que es la misma en todo el mundo

Para agregar alemán: copiar el bloque 'en', traducirlo y poner IDIOMA = 'de'.
"""

IDIOMA = 'en'

LIGA = {'es': 'Liga Nacional A · Suiza', 'en': 'Nationalliga A · Switzerland'}

# Cómo se llama una fecha. En Europa el término del vóley es "round".
FECHA = {'es': 'Fecha %s', 'en': 'Round %s'}


# ── LOS TEXTOS ─────────────────────────────────────────────────────────────
_T = {
'es': {
# --- placas2: etiquetas fijas del dibujo
'red': 'RED', 'menos': 'menos', 'mas': 'más',
'firma': 'Análisis: Ignacio Verdi', 'fuente': 'Fuente',
'deslizar': 'DESLIZÁ &rsaquo;',
'armador_en': 'ARMADOR EN %s',
'balon': 'balón', 'balones': 'balones',
'figura': 'FIGURA', 'pts': 'PTS',
'desglose': '%d atk · %d blq · %d ace',
'nota_seis': ('Por zona de salida del ataque: balones distribuidos arriba, y '
              'abajo % de distribución · % de punto. Cancha en vista del '
              'rival, como se scoutea.'),
'nota_rot': ('Side-out = porcentaje de rallies ganados recibiendo, en cada '
             'rotación. La rotación se nombra por la posición del armador. '
             'El número chico es cuántos rallies. Verde: su mejor rotación. '
             'Rojo: su peor.'),
# --- placas2: el llamado de abajo, uno por tipo de placa
'cta_ficha': ('Esta misma ficha, de cualquier jugador de tu próximo rival.',
              'Y de cada jugador de tu plantel, en su celular.'),
'cta_mapa': ('Este mapa, de tu liga y del rival que te toca el sábado.',
             'Actualizado solo, fecha a fecha.'),
'cta_seis': ('La distribución en K1 del armador rival, antes de jugar.',
             'Con el video de cada balón, a un doble clic.'),
'cta_tabla': ('Esta tabla, con tu plantel, todas las semanas.',
              'Sin cargar nada a mano: sale del scout del partido.'),
'cta_siete': ('Tu equipo medido con la misma vara, fecha a fecha.',
              'Y cada jugador viendo lo suyo en su celular.'),
'cta_rotaciones': ('Las seis rotaciones del rival del sábado, antes de jugar.',
                   'Dónde presionarlo con el saque, y cuál es la tuya que se '
                   'rompe.'),
# --- puestos
'punta': 'PUNTA', 'central': 'CENTRAL', 'opuesto': 'OPUESTO',
'libero': 'LÍBERO', 'armador': 'ARMADOR',
'punta_z': 'Punta', 'central_z': 'Central', 'opuesto_z': 'Opuesto',
'pipe_z': 'Pipe',
# --- títulos y bajadas de las placas
'tit_resultados': 'Cómo salió la fecha',
'baj_resultados': 'Los partidos de la fecha, set a set, con la figura de cada uno.',
'pie_resultados': 'El set a set es el parcial de cada set, en orden.',
'tit_saque': 'El mejor saque de la fecha',
'baj_saque': ('Dónde caen sus mejores saques, y qué rinde con cada tipo de '
              'servicio.'),
'tit_recepcion': 'El receptor más sólido',
'baj_recepcion': ('Desde qué zonas recibe cuando la deja armable, y qué rinde '
                  'contra potencia y contra flotado.'),
'tit_armado': 'La distribución del armador en K1',
'baj_armado': 'A quién le pone el balón en cada rotación cuando la recepción es buena.',
'pie_armado': ('Solo K1 con recepción # o +: esto es lo que elige cuando puede '
               'elegir. El K1 de emergencia y el K2 de transición responden a '
               'otra lógica, y promediarlos borra el patrón. La rotación se '
               'nombra por la posición del armador.'),
'tit_ataque': 'El atacante más eficaz',
'baj_ataque': ('Dónde caen sus ataques cuando hace punto, y qué rinde en '
               'side-out y en transición.'),
'tit_bloqueo': 'El bloqueo de la fecha',
'baj_bloqueo': ('Los %d mejores por bloqueo útil: punto directo (#) más '
                'bloqueo de control (+), el que deja el balón jugable para su '
                'equipo.'),
'pie_bloqueo': ('El bloqueo-punto es solo una parte. El bloqueo que frena el '
                'balón y lo deja defendible gana el rally igual, y por eso la '
                'tabla ordena por # más +, no por punto directo.'),
'tit_defensa': 'El mejor defensor de la fecha',
'baj_defensa': ('Desde qué zonas levanta los balones que quedan jugables, y la '
                'escala completa de su defensa.'),
'pie_defensa': ('Se mide por el balón que queda jugable, no por el que se '
                'levanta: una defensa que salva la pelota y la manda a '
                'cualquier lado no sirve. Por eso cuenta # más +.'),
'tit_siete': 'El siete ideal de la fecha',
'baj_siete': ('Puntas por ataque y recepción; centrales por bloqueo y ataque; '
              'opuesto por ataque; líbero por recepción. Ningún puesto se '
              'elige por un solo número.'),
'pie_siete': ('El punta pondera 60% ataque y 40% recepción; el central, mitad '
              'y mitad bloqueo y ataque. Cada componente se mide contra la '
              'media de la liga. El armador es el único sin estadística '
              'propia: va el del equipo con mejor ataque.'),
'tit_rotaciones': 'El side-out, rotación por rotación',
'baj_rotaciones': ('Cuánto sostiene cada equipo su recepción en cada una de '
                   'sus seis rotaciones. Es el número sobre el que se arma '
                   'todo plan de partido.'),
'pie_rotaciones': ('Side-out alto significa que el equipo gana el punto cuando '
                   'recibe. Break point es lo mismo del lado del que saca.'),
'pie_ataque': ('Eficacia = (punto - error - bloqueado) / total, la fórmula '
               'estándar internacional. El mapa deja solo el ataque que gana '
               'el rally o deja al rival sin contraataque.'),
'pie_saque': ('El mapa deja solo los saques con los que complica al receptor. '
              'Esa es su zona: es adónde va a sacar el sábado.'),
'pie_recepcion': ('El mapa deja solo la recepción perfecta y la positiva, que '
                  'son las que dejan armar. Las zonas que quedan vacías son '
                  'por donde hay que sacarle.'),
# --- la barra que dice qué se está mostrando
'en_la_cancha': 'En la cancha', 'en_las_canchas': 'En las canchas',
'la_tabla': 'La tabla', 'sobre': 'Sobre', 'calculado': 'Calculado sobre',
'volumen_min': 'Volumen mínimo', 'no_entra': 'por debajo, no entra',
'de_de': '%d de %d %s', 'de_ataques': '%d de %d ataques',
'solo_k1': 'solo K1 con recepción # +',
'ordenada_blq': 'ordenada por % de bloqueo útil',
'desde_blq': 'desde %d bloqueos',
'rallies_saque': '%d rallies con saque',
'min_rot': 'mínimo 6 rallies por rotación',
'oficial': 'resultado oficial del scout',
'partidos_sets': '%d partidos · %d sets',
'escala_tira': 'Escala DataVolley · sus %d %s',
'min_sup': ' · mínimo %d %s, %d jugadores lo superaron',
'fuente_corta': '%d partidos · %d equipos',
'fuente_larga': 'Volley-Stats · %d partidos scouteados con nuestro sistema · %d equipos',
'placas_partidos': '%d placas · %d partidos · todo del scout',
'siete_faltan': ('Con %d partidos todavía no hay volumen para llenar los '
                 'siete puestos. Los que faltan se completan solos a medida '
                 'que avance la temporada.'),
'y_mas': '      ... y %d más',
'sin_volumen': 'sin volumen<br>suficiente',
'fuera_zona': '%d balones salieron de otra zona y no están dibujados.',
# --- plural de cada fundamento, para las tiras
'p_saque': 'saques', 'p_recepcion': 'recepciones', 'p_ataque': 'ataques',
'p_bloqueo': 'bloqueos', 'p_defensa': 'defensas',
'f_saque': 'solo saque positivo · # / +',
'f_recepcion': 'solo recepción positiva · # +',
'f_ataque': 'solo ataque positivo · # +',
'f_bloqueo': 'solo bloqueo útil · # +',
'f_defensa': 'solo defensa jugable · # +',
# --- la conclusión de rotaciones
'titular_rot': ('A %s hay que sacarle en %s: ahí sostiene el %d%% de su '
                'side-out, contra el %d%% de su %s. Son %d puntos de '
                'diferencia.'),
},

'en': {
'red': 'NET', 'menos': 'less', 'mas': 'more',
'firma': 'Analysis: Ignacio Verdi', 'fuente': 'Source',
'deslizar': 'SWIPE &rsaquo;',
'armador_en': 'SETTER IN %s',
'balon': 'ball', 'balones': 'balls',
'figura': 'TOP SCORER', 'pts': 'PTS',
'desglose': '%d att · %d blk · %d ace',
'nota_seis': ('By attack start zone: balls distributed on top, distribution % '
              'and kill % below. Court seen from the opponent, the way it is '
              'scouted.'),
'nota_rot': ('Side-out = share of rallies won while receiving, in each '
             'rotation. Rotations are named after the setter position. The '
             'small number is how many rallies. Green: best rotation. Red: '
             'worst.'),
'cta_ficha': ("This same profile, for any player on Saturday's opponent.",
              'And for every player on your roster, on their phone.'),
'cta_mapa': ('This map, for your league and for the team you play next.',
             'Updated on its own, round after round.'),
'cta_seis': ("The opposing setter's side-out distribution, before you play.",
             'With the video of every ball, one double-click away.'),
'cta_tabla': ('This table, with your own roster, every week.',
              'Nothing typed in by hand: it comes from the match scout.'),
'cta_siete': ('Your team measured against the same benchmark, round by round.',
              'And every player seeing their own numbers on their phone.'),
'cta_rotaciones': ("Saturday opponent's six rotations, before you play.",
                   'Where to press with the serve, and which one of yours '
                   'breaks.'),
'punta': 'OUTSIDE', 'central': 'MIDDLE', 'opuesto': 'OPPOSITE',
'libero': 'LIBERO', 'armador': 'SETTER',
'punta_z': 'Outside', 'central_z': 'Middle', 'opuesto_z': 'Opposite',
'pipe_z': 'Pipe',
'tit_resultados': 'How the round finished',
'baj_resultados': ('Every match of the round, set by set, with the top scorer '
                   'of each.'),
'pie_resultados': 'The set-by-set line is each set score, in order.',
'tit_saque': 'The best serve of the round',
'baj_saque': ('Where his best serves land, and what he does with jump serve '
              'and with float.'),
'tit_recepcion': 'The best receiver of the round',
'baj_recepcion': ('The zones he passes from when he keeps the setter in '
                  'system, and how he holds up against jump and float serve.'),
'tit_armado': 'The setter in side-out',
'baj_armado': 'Which attacker he sets in each rotation when the pass is good.',
'pie_armado': ('Side-out on # or + reception only: this is what he picks when '
               'he can pick. Out-of-system side-out and transition follow a '
               'different logic, and averaging them erases the pattern. '
               'Rotations are named after the setter position.'),
'tit_ataque': 'The most efficient attacker',
'baj_ataque': ('Where his attacks land when he scores, and what he does in '
               'side-out and in transition.'),
'tit_bloqueo': 'The block of the round',
'baj_bloqueo': ('The %d best by useful block: the kill block plus the block '
                'that slows the ball down and keeps it playable for his own '
                'team.'),
'pie_bloqueo': ('The kill block is only part of it. A block that slows the '
                'ball down and leaves it defendable wins the rally just the '
                'same, which is why the table is ranked by # plus +, not by '
                'kill blocks alone.'),
'tit_defensa': 'The best defender of the round',
'baj_defensa': ('The zones he digs from when the ball stays playable, and the '
                'full scale of his defence.'),
'pie_defensa': ('It is measured by the ball that stays playable, not by the '
                'one that merely gets up: a dig that saves the ball and sends '
                'it anywhere is no use. That is why it counts # plus +.'),
'tit_siete': 'Team of the round',
'baj_siete': ('Outsides by attack and reception; middles by block and attack; '
              'opposite by attack; libero by reception. No position is picked '
              'on a single number.'),
'pie_siete': ('The outside weighs 60% attack and 40% reception; the middle, '
              'half block and half attack. Every component is measured '
              'against the league average. The setter is the only one with no '
              "statistic of his own: it goes to the best attacking team's."),
'tit_rotaciones': 'Side-out, rotation by rotation',
'baj_rotaciones': ('How well each team holds its reception in each of its six '
                   'rotations. This is the number every game plan is built '
                   'on.'),
'pie_rotaciones': ('A high side-out means the team wins the point when it '
                   'receives. Break point is the same thing from the serving '
                   'side.'),
'pie_ataque': ('Efficiency = (kill - error - blocked) / total, the standard '
               'international formula. The map keeps only the attacks that '
               'win the rally or leave the opponent with no counter-attack.'),
'pie_saque': ('The map keeps only the serves that hurt the passer. That is '
              'his zone: that is where he will serve on Saturday.'),
'pie_recepcion': ('The map keeps only perfect and positive reception, the two '
                  'that leave the setter in system. The empty zones are where '
                  'he should be served.'),
'en_la_cancha': 'On court', 'en_las_canchas': 'On court',
'la_tabla': 'The table', 'sobre': 'Over', 'calculado': 'Measured over',
'volumen_min': 'Minimum volume', 'no_entra': 'below that, not eligible',
'de_de': '%d of %d %s', 'de_ataques': '%d of %d attacks',
'solo_k1': 'side-out on # + reception only',
'ordenada_blq': 'ranked by useful block %',
'desde_blq': 'from %d blocks',
'rallies_saque': '%d served rallies',
'min_rot': 'minimum 6 rallies per rotation',
'oficial': 'official result from the scout',
'partidos_sets': '%d matches · %d sets',
'escala_tira': 'DataVolley scale · his %d %s',
'min_sup': ' · minimum %d %s, %d players above it',
'fuente_corta': '%d matches · %d teams',
'fuente_larga': 'Volley-Stats · %d matches scouted with our system · %d teams',
'placas_partidos': '%d cards · %d matches · straight from the scout',
'siete_faltan': ('With %d matches there is not enough volume yet to fill all '
                 'seven positions. The missing ones fill in on their own as '
                 'the season goes.'),
'y_mas': '      ... and %d more',
'sin_volumen': 'not enough<br>volume',
'fuera_zona': '%d balls started from another zone and are not drawn.',
'p_saque': 'serves', 'p_recepcion': 'receptions', 'p_ataque': 'attacks',
'p_bloqueo': 'blocks', 'p_defensa': 'digs',
'f_saque': 'positive serve only · # / +',
'f_recepcion': 'positive reception only · # +',
'f_ataque': 'positive attack only · # +',
'f_bloqueo': 'useful block only · # +',
'f_defensa': 'playable dig only · # +',
'titular_rot': ('%s has to be served in %s: there it holds %d%% of its '
                'side-out, against %d%% in %s. That is a %d-point gap.'),
},
}


def t(clave, *a):
    d = _T.get(IDIOMA) or _T['es']
    s = d.get(clave, _T['es'].get(clave, clave))
    return (s % a) if a else s


def liga():
    return LIGA.get(IDIOMA, LIGA['es'])


def fecha(n):
    return FECHA.get(IDIOMA, FECHA['es']) % n


# ── LAS ESCALAS ────────────────────────────────────────────────────────────
# La escala DataVolley es la misma en todo el mundo; lo que cambia es cómo se
# llama cada símbolo. El símbolo y el color no se tocan nunca.
_ESCALAS = {
'es': {
 'saque':     [('#', 'ACE'), ('/', 'SIN ATAQUE'), ('+', 'POSITIVO'),
               ('!', 'NEUTRO'), ('-', 'NEGATIVO'), ('=', 'ERROR')],
 'recepcion': [('#', 'PERFECTA'), ('+', 'POSITIVA'), ('!', 'REGULAR'),
               ('-', 'NEGATIVA'), ('/', 'PASADA'), ('=', 'ERROR')],
 'ataque':    [('#', 'PUNTO'), ('+', 'POSITIVO'), ('!', 'NEUTRO'),
               ('-', 'NEGATIVO'), ('/', 'BLOQUEADO'), ('=', 'ERROR')],
 'bloqueo':   [('#', 'PUNTO'), ('+', 'CONTROL'), ('!', 'TOQUE'),
               ('=', 'ERROR')],
 'defensa':   [('#', 'PERFECTA'), ('+', 'POSITIVA'), ('!', 'REGULAR'),
               ('-', 'NEGATIVA'), ('=', 'ERROR')],
},
'en': {
 'saque':     [('#', 'ACE'), ('/', 'NO ATTACK'), ('+', 'POSITIVE'),
               ('!', 'NEUTRAL'), ('-', 'NEGATIVE'), ('=', 'ERROR')],
 'recepcion': [('#', 'PERFECT'), ('+', 'POSITIVE'), ('!', 'FAIR'),
               ('-', 'POOR'), ('/', 'OVERPASS'), ('=', 'ERROR')],
 'ataque':    [('#', 'KILL'), ('+', 'POSITIVE'), ('!', 'NEUTRAL'),
               ('-', 'NEGATIVE'), ('/', 'BLOCKED'), ('=', 'ERROR')],
 'bloqueo':   [('#', 'KILL BLOCK'), ('+', 'CONTROL'), ('!', 'TOUCH'),
               ('=', 'ERROR')],
 'defensa':   [('#', 'PERFECT'), ('+', 'POSITIVE'), ('!', 'FAIR'),
               ('-', 'POOR'), ('=', 'ERROR')],
},
}


def escala(fund):
    d = _ESCALAS.get(IDIOMA) or _ESCALAS['es']
    return d.get(fund, [])


_CORTES = {
'es': {'k1': 'EN K1', 'k2': 'EN TRANSICIÓN', 'potencia': 'DE POTENCIA',
       'flotado': 'FLOTADO', 'vs_potencia': 'VS POTENCIA',
       'vs_flotado': 'VS FLOTADO', 'eficiencia': 'EFICIENCIA',
       'eficacia': 'EFICACIA', 'ace_error': 'ACE / ERROR', 'pct_ace': '% ACE',
       'pct_punto': '% PUNTO', 'err_blq': 'ERR + BLQ', 'jugable': '% JUGABLE',
       'perfecta': '% PERFECTA', 'levantadas': 'LEVANTADAS',
       'util': '% ÚTIL', 'total': 'TOTAL', 'punto': '# PUNTO',
       'control': '+ CONTROL', 'error': '= ERROR', 'jugador': 'JUGADOR',
       'side_out': 'SIDE-OUT', 'break': 'BREAK', 'media_liga': 'media liga %d%%',
       'partido': 'PARTIDO', 'partidos': 'PARTIDOS'},
'en': {'k1': 'IN SIDE-OUT', 'k2': 'IN TRANSITION', 'potencia': 'JUMP SERVE',
       'flotado': 'FLOAT SERVE', 'vs_potencia': 'VS JUMP', 'vs_flotado': 'VS FLOAT',
       'eficiencia': 'EFFICIENCY', 'eficacia': 'EFFICIENCY',
       'ace_error': 'ACE / ERROR', 'pct_ace': 'ACE %', 'pct_punto': 'KILL %',
       'err_blq': 'ERR + BLK', 'jugable': 'PLAYABLE %',
       'perfecta': 'PERFECT %', 'levantadas': 'DIGS',
       'util': 'USEFUL %', 'total': 'TOTAL', 'punto': '# KILL BLOCK',
       'control': '+ CONTROL', 'error': '= ERROR', 'jugador': 'PLAYER',
       'side_out': 'SIDE-OUT', 'break': 'BREAK', 'media_liga': 'league avg %d%%',
       'partido': 'MATCH', 'partidos': 'MATCHES'},
}


def c(clave, *a):
    d = _CORTES.get(IDIOMA) or _CORTES['es']
    s = d.get(clave, _CORTES['es'].get(clave, clave))
    return (s % a) if a else s


# Los puestos del siete ideal. Internamente se manejan en español (son las
# claves del diccionario que arma la placa); acá se traducen al dibujar.
_PUESTOS = {
'es': {'Punta 1': 'Punta 1', 'Punta 2': 'Punta 2', 'Central 1': 'Central 1',
       'Central 2': 'Central 2', 'Opuesto': 'Opuesto', 'Armador': 'Armador',
       'Líbero': 'Líbero', 'sin_volumen': 'sin volumen<br>suficiente'},
'en': {'Punta 1': 'Outside 1', 'Punta 2': 'Outside 2', 'Central 1': 'Middle 1',
       'Central 2': 'Middle 2', 'Opuesto': 'Opposite', 'Armador': 'Setter',
       'Líbero': 'Libero', 'sin_volumen': 'not enough<br>volume'},
}


def puesto(p):
    d = _PUESTOS.get(IDIOMA) or _PUESTOS['es']
    return d.get(p, p)


# Las zonas de salida del ataque, para la leyenda de la placa del armador.
_ZONAS = {
'es': {4: 'Punta (z4)', 3: 'Central (z3)', 2: 'Opuesto (z2)',
       7: 'Zaga izq. (z7)', 8: 'Pipe (z8)', 9: 'Zaga der. (z9)',
       1: 'Otra', 6: 'Otra', 5: 'Otra'},
'en': {4: 'Outside (z4)', 3: 'Middle (z3)', 2: 'Opposite (z2)',
       7: 'Back left (z7)', 8: 'Pipe (z8)', 9: 'Back right (z9)',
       1: 'Other', 6: 'Other', 5: 'Other'},
}


def zona(z):
    d = _ZONAS.get(IDIOMA) or _ZONAS['es']
    return d.get(z, 'z%d' % z)


# ── LA MARCA Y LOS VIDEOS ──────────────────────────────────────────────────
_MARCA = {
'es': {'lema': 'El vóley, explicado con datos',
       'cierre_tt': 'Seguí para ver la próxima fecha',
       'cierre_yt': 'Suscribite y no te perdés ninguna fecha',
       'pitch': ('Todo sale del scout del partido, con el sistema que usan '
                 'los clubes')},
'en': {'lema': 'Volleyball, explained with data',
       'cierre_tt': 'Follow for the next round',
       'cierre_yt': 'Subscribe and never miss a round',
       'pitch': ('All of it comes from the match scout, with the system the '
                 'clubs use')},
}


def m(clave):
    d = _MARCA.get(IDIOMA) or _MARCA['es']
    return d.get(clave, _MARCA['es'].get(clave, clave))


# El rótulo de cada acción en el video y el gancho de cada corto.
_VIDEO = {
'es': {
 'ev_ace': 'ACE', 'ev_sin_ataque': 'SIN ATAQUE', 'ev_positivo': 'POSITIVO',
 'ev_punto': 'PUNTO', 'ev_neutro': 'NEUTRO', 'ev_negativo': 'NEGATIVO',
 'ev_error': 'ERROR', 'ev_perfecta': 'PERFECTA', 'ev_positiva': 'POSITIVA',
 'ev_blq_punto': 'PUNTO DE BLOQUEO', 'ev_blq_control': 'CONTROL',
 'ev_def_perfecta': 'DEFENSA PERFECTA', 'ev_def_positiva': 'DEFENSA POSITIVA',
 'set_n': '%d° SET', 'final': 'FINAL',
 'g_saque': 'El mejor saque de la fecha',
 'g_recepcion': 'El receptor más sólido',
 'g_armado': 'Cómo reparte el mejor armador',
 'g_ataque': 'El atacante más eficaz',
 'g_bloqueo': 'El mejor bloqueo de la fecha',
 'g_defensa': 'Las mejores defensas de la fecha',
 'b_saque': 'El mejor saque', 'b_recepcion': 'El mejor receptor',
 'b_armado': 'El mejor armador', 'b_ataque': 'El mejor atacante',
 'b_bloqueo': 'El mejor bloqueo', 'b_defensa': 'Las mejores defensas',
},
'en': {
 'ev_ace': 'ACE', 'ev_sin_ataque': 'NO ATTACK', 'ev_positivo': 'POSITIVE',
 'ev_punto': 'KILL', 'ev_neutro': 'NEUTRAL', 'ev_negativo': 'NEGATIVE',
 'ev_error': 'ERROR', 'ev_perfecta': 'PERFECT', 'ev_positiva': 'POSITIVE',
 'ev_blq_punto': 'KILL BLOCK', 'ev_blq_control': 'CONTROL BLOCK',
 'ev_def_perfecta': 'PERFECT DIG', 'ev_def_positiva': 'POSITIVE DIG',
 'set_n': 'SET %d', 'final': 'FINAL',
 'g_saque': 'The best serve of the round',
 'g_recepcion': 'The best receiver of the round',
 'g_armado': 'How the best setter distributes',
 'g_ataque': 'The most efficient attacker',
 'g_bloqueo': 'The best block of the round',
 'g_defensa': 'The best digs of the round',
 'b_saque': 'Best serve', 'b_recepcion': 'Best receiver',
 'b_armado': 'Best setter', 'b_ataque': 'Best attacker',
 'b_bloqueo': 'Best block', 'b_defensa': 'Best digs',
},
}


def v(clave, *a):
    d = _VIDEO.get(IDIOMA) or _VIDEO['es']
    s = d.get(clave, _VIDEO['es'].get(clave, clave))
    return (s % a) if a else s


_ROTULO = {
'es': {'fecha': 'Fecha %s · %s', 'hasta': 'Fechas 1 a %s · %s',
       'temporada': 'Temporada %s'},
'en': {'fecha': 'Round %s · %s', 'hasta': 'Rounds 1 to %s · %s',
       'temporada': 'Season %s'},
}


def rotulo(clave, *a):
    d = _ROTULO.get(IDIOMA) or _ROTULO['es']
    return d.get(clave, _ROTULO['es'][clave]) % a


# ── LOS TEXTOS DE LAS PUBLICACIONES ───────────────────────────────────────
# Estos se PUBLICAN, así que van en el idioma de las placas. Las
# instrucciones de PUBLICAR.txt quedan siempre en español: las leés vos.
_POST = {
'es': {
 'hook': '%s de la %s: cómo salió y quién la jugó mejor.',
 'linea': '%s · %s de %s en %s',
 'vs_liga': ' (la liga promedia %d%%)',
 'deslizar': ('Deslizá para ver las %d placas. Todo sale del scout de los '
              'partidos, acción por acción.'),
 'firma': 'Análisis: Ignacio Verdi · volley-stats.com',
 'contra': ', contra un promedio de liga de %d%%',
 'hashtags': ('#volleyball #voley #volleyballstats #analisis #scouting '
              '#datavolley #volleystats'),
 'f_saque': 'saque', 'f_recepcion': 'recepción', 'f_armado': 'armado',
 'f_ataque': 'ataque', 'f_bloqueo': 'bloqueo', 'f_defensa': 'defensa',
 'yt_titulo': '%s · %s — el resumen en datos',
},
'en': {
 'hook': '%s of the %s: how it finished and who played it best.',
 'linea': '%s · %s %s in %s',
 'vs_liga': ' (league average %d%%)',
 'deslizar': ('Swipe for all %d cards. Every number comes from the match '
              'scout, action by action.'),
 'firma': 'Analysis: Ignacio Verdi · volley-stats.com',
 'contra': ', against a league average of %d%%',
 'hashtags': ('#volleyball #volleyballstats #volleyballanalytics #scouting '
              '#datavolley #nationalliga #swissvolley #volleystats'),
 'f_saque': 'serve', 'f_recepcion': 'reception', 'f_armado': 'setting',
 'f_ataque': 'attack', 'f_bloqueo': 'block', 'f_defensa': 'defence',
 'yt_titulo': '%s · %s — the round in data',
},
}


def post(clave, *a):
    d = _POST.get(IDIOMA) or _POST['es']
    s = d.get(clave, _POST['es'].get(clave, clave))
    return (s % a) if a else s


# El puesto tal como se muestra en la ficha y en el chip. La clave interna
# va siempre en español; esto solo traduce al dibujar.
_PUESTO_FICHA = {
'es': {'PUNTA': 'PUNTA', 'OPUESTO': 'OPUESTO', 'CENTRAL': 'CENTRAL',
       'ARMADOR': 'ARMADOR', 'LÍBERO': 'LÍBERO'},
'en': {'PUNTA': 'OUTSIDE', 'OPUESTO': 'OPPOSITE', 'CENTRAL': 'MIDDLE',
       'ARMADOR': 'SETTER', 'LÍBERO': 'LIBERO'},
}


def puesto_ficha(p):
    d = _PUESTO_FICHA.get(IDIOMA) or _PUESTO_FICHA['es']
    return d.get(p, p)


_SIETE = {
'es': {'ATK': 'ATK', 'BLQ': 'BLQ', 'REC': 'REC',
       'equipo_atk': 'ATAQUE EQUIPO %d%%'},
'en': {'ATK': 'ATT', 'BLQ': 'BLK', 'REC': 'REC',
       'equipo_atk': 'TEAM ATTACK %d%%'},
}


def s7(clave, *a):
    d = _SIETE.get(IDIOMA) or _SIETE['es']
    s = d.get(clave, _SIETE['es'].get(clave, clave))
    return (s % a) if a else s
