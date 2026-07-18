/* correcciones_tecnicas.js — Biblioteca de correcciones técnico-tácticas (nivel elite).
   FOCO PRINCIPAL: TÉCNICA (fases, biomecánica y cues de contacto).
   Editable: sumá/quitá items acá o desde el Plan de Desarrollo (modo editor).
   Estructura: window.CORRECCIONES = { <fundamento>: [ {t:"texto", c:"categoría"}, ... ] }
   Categorías: Técnica · Táctica · Lectura · Físico/Coordinación · Mental        */
window.CORRECCIONES = {

  "saque": [
    /* ---- TÉCNICA · FLOTADO ---- */
    {t:"Flotado: soltar la pelota con una mano (no lanzarla con fuerza), sin rotación.", c:"Técnica"},
    {t:"Flotado: lanzamiento bajo (30-50 cm sobre la mano) y adelante del hombro que golpea.", c:"Técnica"},
    {t:"Flotado: punto de lanzamiento SIEMPRE idéntico para ganar consistencia.", c:"Técnica"},
    {t:"Flotado: brazo de armado alto, codo a la altura de la oreja, mano abierta detrás de la pelota.", c:"Técnica"},
    {t:"Flotado: contacto con el talón/base de la palma, dedos firmes.", c:"Técnica"},
    {t:"Flotado: golpe seco y corto, SIN acompañar (frenar la mano justo en el contacto).", c:"Técnica"},
    {t:"Flotado: pegarle al centro exacto de la pelota para que no rote (que \u201cflote\u201d).", c:"Técnica"},
    {t:"Flotado: muñeca bloqueada y firme en el impacto, no floja.", c:"Técnica"},
    {t:"Flotado: transferir el peso de atrás hacia adelante durante el golpe.", c:"Técnica"},
    {t:"Flotado: hombros perpendiculares a la red, contacto delante del cuerpo (no encima de la cabeza).", c:"Técnica"},
    /* ---- TÉCNICA · POTENCIA / SALTO ---- */
    {t:"Salto: lanzamiento alto y adelante, dentro de la cancha, a la altura del ataque.", c:"Técnica"},
    {t:"Salto: soltar el lanzamiento arriba y adelante, consistente en altura y punto.", c:"Técnica"},
    {t:"Salto: carrera de 3 pasos con aceleración progresiva (der-izq-der en diestros).", c:"Técnica"},
    {t:"Salto: penúltimo paso largo y de freno para transformar el avance en salto vertical.", c:"Técnica"},
    {t:"Salto: armado del brazo en \u201carco y flecha\u201d, codo alto y atrás, mano armada.", c:"Técnica"},
    {t:"Salto: contacto arriba y adelante, brazo extendido, en el punto más alto.", c:"Técnica"},
    {t:"Salto: látigo de muñeca hacia adelante-abajo (topspin) para que la pelota caiga.", c:"Técnica"},
    {t:"Salto: rotar hombro y tronco en el golpe (cadena cinética completa).", c:"Técnica"},
    {t:"Salto: aterrizar equilibrado con ambos pies dentro de la cancha.", c:"Técnica"},
    /* ---- TÁCTICA / LECTURA / MENTAL ---- */
    {t:"Elegir la zona antes de lanzar: mirar cómo está parada la recepción rival.", c:"Táctica"},
    {t:"Atacar zonas de conflicto: entre dos receptores, al cuerpo, o zonas 1 y 5.", c:"Táctica"},
    {t:"Buscar al receptor más débil o al que rota a atacar (romperle el approach).", c:"Táctica"},
    {t:"Saque corto para sacar al armador de la red y romper el K1 rival.", c:"Táctica"},
    {t:"Variar ritmo, altura y zona para no volverse predecible.", c:"Táctica"},
    {t:"Rutina previa fija (respiración + botar la pelota) para estabilizar bajo presión.", c:"Mental"},
    {t:"Bajo presión: priorizar consistencia y zona antes que potencia máxima.", c:"Mental"},
    /* ---- ERRORES COMUNES · QUÉ NO HACER ---- */
    {t:"Lanzamiento inconsistente: distinta altura/posición cada vez.", c:"Errores comunes"},
    {t:"Acompañar el golpe en el flotado → la pelota rota y no flota.", c:"Errores comunes"},
    {t:"Contactar la pelota descentrada → sale con efecto y previsible.", c:"Errores comunes"},
    {t:"Frenar la carrera antes de saltar (en salto) → pierde potencia.", c:"Errores comunes"},
    {t:"No lanzar la pelota atrás ni encima de la cabeza.", c:"Qué NO hacer"},
    {t:"No sacar siempre a la misma zona o al mismo receptor.", c:"Qué NO hacer"},
    {t:"No arriesgar potencia máxima en los momentos de presión.", c:"Qué NO hacer"}
  ],

  "recepcion": [
    /* ---- TÉCNICA · PLATAFORMA Y POSTURA ---- */
    {t:"Plataforma: antebrazos juntos, codos extendidos y trabados, pulgares paralelos y hacia abajo.", c:"Técnica"},
    {t:"Formar la plataforma ANTES de que la pelota cruce la red, no en el último momento.", c:"Técnica"},
    {t:"Contactar en la parte carnosa del antebrazo, no en muñecas ni codos.", c:"Técnica"},
    {t:"El ángulo de la plataforma dirige la pelota: hombros y plataforma apuntando al blanco (zona 2-3).", c:"Técnica"},
    {t:"Meter el cuerpo detrás de la pelota; contactar frente a la línea media del cuerpo.", c:"Técnica"},
    {t:"Base amplia y piernas flexionadas, peso en las puntas de los pies (listo para avanzar).", c:"Técnica"},
    {t:"Postura adelantada: hombros por delante de las rodillas, rodillas por delante de los pies.", c:"Técnica"},
    {t:"No mover los brazos hacia la pelota: llevar el cuerpo, plataforma quieta.", c:"Técnica"},
    {t:"No juntar las manos recién en el contacto: plataforma armada y estable de antemano.", c:"Técnica"},
    {t:"Contacto por debajo de la línea de la cintura, brazos alejados del cuerpo.", c:"Técnica"},
    /* ---- TÉCNICA · SEGÚN EL SAQUE ---- */
    {t:"Flotado: absorber bajando levemente la plataforma en el contacto (no golpear la pelota).", c:"Técnica"},
    {t:"Flotado lateral: abrir la cadera y recibir de costado para poder empujar mejor.", c:"Técnica"},
    {t:"Saque potente: plataforma firme, ceder con hombros y flexión de piernas para amortiguar.", c:"Técnica"},
    {t:"Pelota alta (sobre los hombros): usar dedos (toque) en vez de plataforma.", c:"Técnica"},
    /* ---- TÉCNICA · MOVILIDAD ---- */
    {t:"Primer paso corto de ajuste y después plataforma; no correr con los brazos ya juntos.", c:"Técnica"},
    {t:"Terminar equilibrado y reordenar los pies para transicionar a atacar.", c:"Técnica"},
    /* ---- LECTURA / TÁCTICA / MENTAL ---- */
    {t:"Leer el brazo y la salida de mano del sacador para arrancar temprano.", c:"Lectura"},
    {t:"Reconocer flotado vs. potencia por el approach del sacador y ajustar la base.", c:"Lectura"},
    {t:"Llamar la pelota temprano y fuerte; dividir el campo con el compañero.", c:"Táctica"},
    {t:"Definir zonas de responsabilidad según la rotación (quién toma el centro).", c:"Táctica"},
    {t:"Contra un buen sacador, achicar el objetivo: pase seguro y alto al centro.", c:"Mental"},
    /* ---- ERRORES COMUNES · QUÉ NO HACER ---- */
    {t:"Formar la plataforma tarde, con la pelota ya encima.", c:"Errores comunes"},
    {t:"Recibir con los brazos en vez de meter el cuerpo detrás.", c:"Errores comunes"},
    {t:"Plataforma muy alta (contacto sobre la cintura) → descontrol.", c:"Errores comunes"},
    {t:"Quedarse plantado sin el primer paso de ajuste.", c:"Errores comunes"},
    {t:"No recibir con los brazos estirados al costado.", c:"Qué NO hacer"},
    {t:"No juntar las manos recién en el momento del contacto.", c:"Qué NO hacer"},
    {t:"No retroceder para recibir: siempre listo para avanzar.", c:"Qué NO hacer"}
  ],

  "armado": [
    /* ---- TÉCNICA · LLEGADA Y BASE ---- */
    {t:"Llevar los pies al balón: llegar debajo y detrás de la pelota antes del contacto.", c:"Técnica"},
    {t:"Pie derecho levemente adelante (diestros), base estable y peso adelante.", c:"Técnica"},
    {t:"Contactar en equilibrio, con los pies en el piso (salvo jump-set), no en desplazamiento.", c:"Técnica"},
    /* ---- TÉCNICA · MANOS Y CONTACTO ---- */
    {t:"Contacto arriba de la frente, no delante de la cara.", c:"Técnica"},
    {t:"Ventana con las manos: pulgares e índices formando un triángulo.", c:"Técnica"},
    {t:"Contactar con las yemas/almohadillas de los dedos, no con las palmas.", c:"Técnica"},
    {t:"Muñecas hacia atrás al recibir el balón y luego empuje adelante-arriba.", c:"Técnica"},
    {t:"Contacto simétrico con ambas manos (no empujar más con una).", c:"Técnica"},
    {t:"Codos flexionados apuntando adelante y afuera, no pegados al cuerpo.", c:"Técnica"},
    /* ---- TÉCNICA · CADENA Y SALIDA ---- */
    {t:"Extensión simultánea de tobillos, rodillas, cadera, codos y muñecas (cadena cinética).", c:"Técnica"},
    {t:"Terminar con brazos extendidos hacia el objetivo (follow-through al blanco).", c:"Técnica"},
    {t:"La dirección del pase la marca el follow-through de manos y muñecas.", c:"Técnica"},
    {t:"Amortiguar balones rápidos con muñecas suaves; empujar los lentos con piernas.", c:"Técnica"},
    {t:"Hombros cuadrados y neutros para no delatar la dirección del pase.", c:"Técnica"},
    /* ---- TÉCNICA · VARIANTES ---- */
    {t:"Back set: arquear levemente la espalda y empujar arriba-atrás, misma mecánica de manos.", c:"Técnica"},
    {t:"Jump set: saltar, contactar en el punto alto y empuje corto de muñecas.", c:"Técnica"},
    {t:"Pase lejos de la red: priorizar altura y separación del net.", c:"Técnica"},
    /* ---- LECTURA / TÁCTICA / MENTAL ---- */
    {t:"Leer el bloqueo: armar al lado del bloqueador lento o al 1x1.", c:"Lectura"},
    {t:"Reconocer la calidad de recepción y decidir el tempo en consecuencia.", c:"Lectura"},
    {t:"Recepción perfecta: activar el rápido o la segunda intención al central.", c:"Táctica"},
    {t:"Distribuir para romper el bloqueo: alternar tempos y zonas.", c:"Táctica"},
    {t:"Bajo presión: asegurar un balón atacable antes de arriesgar el rápido.", c:"Mental"},
    /* ---- ERRORES COMUNES · QUÉ NO HACER ---- */
    {t:"Armar solo de brazos, sin llevar los pies al balón.", c:"Errores comunes"},
    {t:"Contactar delante de la cara en vez de sobre la frente.", c:"Errores comunes"},
    {t:"Empujar más con una mano → el pase se va de dirección.", c:"Errores comunes"},
    {t:"Delatar la dirección del pase con los hombros.", c:"Errores comunes"},
    {t:"No contactar con las palmas (retención).", c:"Qué NO hacer"},
    {t:"No forzar el rápido con recepción mala.", c:"Qué NO hacer"},
    {t:"No armar desequilibrado si se puede llegar en balance.", c:"Qué NO hacer"}
  ],

  "ataque": [
    /* ---- TÉCNICA · APPROACH / CARRERA ---- */
    {t:"Carrera de 3-4 pasos en aceleración (izq-der-izq en diestros), los últimos dos rápidos.", c:"Técnica"},
    {t:"Penúltimo paso largo (zancada) para frenar el avance horizontal.", c:"Técnica"},
    {t:"Último paso corto de cierre, pies casi juntos, para saltar vertical y no invadir la red.", c:"Técnica"},
    {t:"Talón-punta en el paso de freno para transferir la energía al salto.", c:"Técnica"},
    {t:"Llevar ambos brazos atrás en el penúltimo paso (armado del doble brazo).", c:"Técnica"},
    /* ---- TÉCNICA · SALTO ---- */
    {t:"Balancear los dos brazos hacia arriba en el despegue (block-and-swing) para ganar altura.", c:"Técnica"},
    {t:"Salto vertical, no hacia adelante: despegar detrás de la pelota.", c:"Técnica"},
    /* ---- TÉCNICA · BRAZO Y GOLPE ---- */
    {t:"Armado en \u201carco y flecha\u201d: codo alto (sobre el hombro) y mano armada atrás.", c:"Técnica"},
    {t:"Levantar la mano izquierda (no dominante) hacia la pelota e ir hacia ella, no esperarla.", c:"Técnica"},
    {t:"El codo lidera el swing y después se extiende el antebrazo (latigazo).", c:"Técnica"},
    {t:"\u201cTirar\u201d el brazo no dominante hacia abajo-atrás para elevar el hombro del golpe.", c:"Técnica"},
    {t:"Contactar la pelota arriba y adelante, brazo extendido, en el punto más alto.", c:"Técnica"},
    {t:"Contacto con mano abierta y firme, palma completa sobre la pelota.", c:"Técnica"},
    {t:"Látigo de muñeca hacia adelante-abajo (topspin) para bajar la pelota dentro.", c:"Técnica"},
    {t:"Rotación de tronco y hombro acompañando el golpe (cadena cinética).", c:"Técnica"},
    /* ---- TÉCNICA · ATERRIZAJE ---- */
    {t:"Aterrizar con ambos pies y rodillas flexionadas, equilibrado para transicionar.", c:"Técnica"},
    /* ---- LECTURA / TÁCTICA / MENTAL ---- */
    {t:"Ver el bloqueo en el aire y decidir: potencia, dirección o finta/\u201ctool\u201d.", c:"Lectura"},
    {t:"Leer la defensa/piso y elegir diagonal larga o línea.", c:"Lectura"},
    {t:"Ajustar el approach a la calidad del pase (pase separado: esperar y potencia).", c:"Lectura"},
    {t:"Usar el bloqueo (mano afuera) cuando está bien armado.", c:"Táctica"},
    {t:"Cambio de ritmo: rodada o finta cuando el bloqueo salta bien.", c:"Táctica"},
    {t:"Repetir el approach siempre igual para no delatar el tiempo.", c:"Mental"},
    /* ---- ERRORES COMUNES · QUÉ NO HACER ---- */
    {t:"Esperar la pelota en vez de ir hacia ella.", c:"Errores comunes"},
    {t:"Brazo bajo / codo caído en el armado.", c:"Errores comunes"},
    {t:"Llegar frenado al salto (sin paso de freno).", c:"Errores comunes"},
    {t:"Contactar la pelota atrás de la cabeza.", c:"Errores comunes"},
    {t:"Saltar hacia adelante e invadir la red.", c:"Errores comunes"},
    {t:"No pegarle siempre a la misma zona.", c:"Qué NO hacer"},
    {t:"No golpear de frente al bloqueo bien armado (mano fuera o finta).", c:"Qué NO hacer"},
    {t:"No forzar potencia con un pase separado de la red.", c:"Qué NO hacer"}
  ],

  "bloqueo": [
    /* ---- TÉCNICA · POSTURA Y DESPLAZAMIENTO ---- */
    {t:"Postura de espera: manos a la altura de los hombros, palmas al frente, base flexionada.", c:"Técnica"},
    {t:"Desplazamiento corto con paso lateral (shuffle); largo con paso cruzado.", c:"Técnica"},
    {t:"Cerrar cuadrado a la red antes de saltar (hombros paralelos al net).", c:"Técnica"},
    {t:"Central: pies cuadrados en el salto tras el desplazamiento, no saltar de costado.", c:"Técnica"},
    /* ---- TÉCNICA · SALTO Y MANOS ---- */
    {t:"Salto vertical desde base estable, sin desplazarse en el aire.", c:"Técnica"},
    {t:"Extender los brazos arriba y ADELANTE, penetrando al campo rival.", c:"Técnica"},
    {t:"Manos firmes, dedos bien abiertos y tensos, pulgares arriba.", c:"Técnica"},
    {t:"\u201cTapar\u201d la pelota: orientar las manos hacia el piso rival (bloqueo agresivo).", c:"Técnica"},
    {t:"Muñecas firmes y flexionadas hacia adelante en el contacto.", c:"Técnica"},
    {t:"Manos por encima del borde de la red el mayor tiempo posible.", c:"Técnica"},
    {t:"Cerrar el bloqueo con el compañero: manos juntas, sin hueco entre bloqueadores.", c:"Técnica"},
    /* ---- TÉCNICA · TIMING Y CAÍDA ---- */
    {t:"Timing: saltar DESPUÉS del atacante (esperar su salto), no simultáneo.", c:"Técnica"},
    {t:"No tirar los brazos hacia atrás al bajar (cuidar la red y la articulación).", c:"Técnica"},
    {t:"Bajar equilibrado, con las manos arriba, listo para re-jugar.", c:"Técnica"},
    /* ---- LECTURA / TÁCTICA ---- */
    {t:"Leer la zona y las manos del armador antes que la pelota.", c:"Lectura"},
    {t:"No saltar al primer engaño: leer el brazo del atacante.", c:"Lectura"},
    {t:"Tomar diagonal o línea según el sistema defensivo acordado.", c:"Táctica"},
    {t:"Tapar la mano/zona fuerte del atacante según el scouting.", c:"Táctica"},
    /* ---- ERRORES COMUNES · QUÉ NO HACER ---- */
    {t:"Saltar antes que el atacante (mal timing).", c:"Errores comunes"},
    {t:"Bloquear vertical sin penetrar las manos.", c:"Errores comunes"},
    {t:"Dejar hueco entre los dos bloqueadores.", c:"Errores comunes"},
    {t:"Bajar los brazos hacia atrás al caer.", c:"Errores comunes"},
    {t:"No saltar al primer amague del atacante.", c:"Qué NO hacer"},
    {t:"No bloquear con los dedos flojos o juntos.", c:"Qué NO hacer"},
    {t:"No abrir el bloqueo dejando hueco al centro.", c:"Qué NO hacer"}
  ],

  "defensa": [
    /* ---- TÉCNICA · POSTURA Y BASE ---- */
    {t:"Postura baja: piernas más anchas que los hombros, rodillas flexionadas, peso adelante.", c:"Técnica"},
    {t:"Peso en las puntas de los pies, talones apenas despegados, listo para arrancar.", c:"Técnica"},
    {t:"Manos separadas y adelante del cuerpo, brazos relajados hasta el contacto.", c:"Técnica"},
    {t:"Split step (frenar y armar la base) justo antes del contacto del atacante.", c:"Técnica"},
    {t:"No caer al piso anticipadamente: mantener la base hasta leer el golpe.", c:"Técnica"},
    /* ---- TÉCNICA · CONTACTO ---- */
    {t:"Contactar la pelota delante del cuerpo, no al costado ni encima.", c:"Técnica"},
    {t:"Pelota potente: plataforma firme, casi sin mover los brazos (rebote controlado).", c:"Técnica"},
    {t:"Ángulo de plataforma hacia arriba y al centro (dig alto para reconstruir).", c:"Técnica"},
    {t:"Manos en \u201ccopa\u201d/tomahawk para pelotas altas y rápidas por encima de los hombros.", c:"Técnica"},
    /* ---- TÉCNICA · DESPLAZAMIENTO ---- */
    {t:"Rodar o plancha (sprawl) para pelotas lejanas, protegiendo el contacto.", c:"Técnica"},
    {t:"Pies activos, dar siempre el segundo paso hacia la pelota.", c:"Técnica"},
    {t:"Terminar el dig equilibrado para pasar al contraataque.", c:"Técnica"},
    /* ---- LECTURA / TÁCTICA / MENTAL ---- */
    {t:"Leer al atacante (brazo, cuerpo) y qué zona tapa el bloqueo.", c:"Lectura"},
    {t:"Posicionarse según lo que deja libre el bloqueo (defender el hueco).", c:"Lectura"},
    {t:"Cubrir al bloqueo en los rebotes cortos (coberturas).", c:"Táctica"},
    {t:"Convertir la defensa en contraataque: primer pase jugable al armador.", c:"Táctica"},
    {t:"Comunicar en voz alta antes y durante la jugada (\u201ctoco\u201d, \u201cmía\u201d, \u201cfuera\u201d).", c:"Mental"},
    /* ---- ERRORES COMUNES · QUÉ NO HACER ---- */
    {t:"Caer al piso antes de leer el golpe.", c:"Errores comunes"},
    {t:"Base alta o peso en los talones.", c:"Errores comunes"},
    {t:"Defender al costado del cuerpo, no al frente.", c:"Errores comunes"},
    {t:"Armar la plataforma antes de tiempo, sin leer.", c:"Errores comunes"},
    {t:"No quedarse plantado esperando la pelota.", c:"Qué NO hacer"},
    {t:"No empujar la pelota potente (dejar que rebote en la plataforma).", c:"Qué NO hacer"},
    {t:"No defender sin mirar qué zona tapa el bloqueo.", c:"Qué NO hacer"}
  ]
};
