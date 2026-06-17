# 🏐 Revisión Elite — La app desde los ojos de un jugador profesional

**Foco de esta revisión:** lo que vos pediste — **claridad y facilidad de lectura por encima de todo.** Me puse en el lugar de un jugador profesional que abre la app en el celular antes y después de entrenar, y me pregunté en cada pantalla: *"¿entiendo esto en 2 segundos? ¿sé qué hacer con esto? ¿me sirve para jugar mejor?"*

---

## 1) Resumen en 30 segundos

La app **ya tiene una base impresionante** — más completa que muchas apps de clubes profesionales. El perfil del jugador, el wellness y los heatmaps son de nivel alto. El problema **no es falta de información: es que hay demasiada y poco "masticada"** para el jugador.

Las tres cosas que más impacto tendrían, en orden:

1. **Darle CONTEXTO a cada número** (¿es bueno? ¿vengo mejorando? ¿qué hago con esto?). Hoy el jugador ve "EFF 45%" y no sabe si festejar o preocuparse. Este es el cambio más grande de claridad.
2. **Separar la vista de jugador de la del entrenador.** Hoy el jugador termina viendo herramientas que no son para él (Importar DVW, Cargar Videos, Panel en Vivo, Scouting). Eso confunde y "ensucia".
3. **Una pantalla de inicio que diga QUÉ HACER HOY,** no un menú de funciones. El jugador no quiere "explorar el sistema": quiere saber si le falta el wellness, cuál es su rutina de hoy y cuándo es el próximo partido.

---

## 2) Lo que YA está muy bien (no tocar)

Para ser justos, esto ya es de nivel profesional:

- **Perfil del jugador** (`jugador.html`): número, posición, foto, stats rápidas (saques/recepciones/ataques/eff) y accesos personalizados según la posición (al armador le aparece "Distribución", al punta "Recepción", etc.). Muy bien pensado.
- **Wellness**: las 6 preguntas de readiness + RPE, con el semáforo (🟢 Óptimo / 🟡 / 🔴 Alerta) y el % de disponibilidad. Es exactamente lo que usan los equipos serios.
- **Heatmaps por jugador** (ataque/saque/recepción/armado): oro puro para un jugador visual.
- **Mis Cortes** (video sincronizado por acción): esto es lo que más valora un jugador. Tenerlo ya es enorme.
- **Stats separadas Partido vs Entrenamiento**: distinción que muchos equipos no hacen.

La base está. Lo que sigue es cómo hacerla **leíble y accionable** para el jugador.

---

## 3) PRIORIDAD 1 — Claridad de lectura (lo que más pediste)

### 3.1 — Un número solo es ruido. Hay que decirle al jugador qué significa.

Hoy un jugador ve **"Eff. Ataque: 45%"**. No tiene forma de saber si eso está bien o mal. Un jugador profesional necesita, al lado de cada número clave, **cuatro cosas en un golpe de vista**:

- **El valor** (45%)
- **Comparado con su objetivo/meta** — y acá está lo bueno: **ya tenés el sistema de objetivos cargado** (`OBJETIVOS_CONFIG`, las "baterías"). Falta mostrarlo al lado del número con un semáforo: 🟢 si llegó a la meta, 🟡 cerca, 🔴 lejos.
- **La tendencia** — una flechita ↑ / ↓ comparando con sus últimos 3 partidos. "¿Vengo mejorando o cayendo?" es la pregunta #1 de un jugador.
- **Una frase en castellano simple** — *"Tu recepción viene subiendo: +8% en los últimos 3 partidos. Seguí así."* Una línea vale más que diez números.

**Por qué es lo más importante:** transforma la app de "planilla de datos" a "entrenador en el bolsillo". El jugador entiende en 2 segundos sin pensar. **Este es el corazón de la claridad.**

### 3.2 — Sacar la jerga (o explicarla en una línea)

EFF, RPE, "baterías", siglas… el jugador sabe de vóley, no de analytics. El wellness ya hace algo genial: pone pistas tipo *"10 = dormí excelente"*. **Hay que llevar ese mismo estilo a las stats**: un "¿?" tocable o una línea que diga *"EFF = eficiencia: cuántos de tus ataques terminan en punto, descontando los errores."* Nada de obligar al jugador a adivinar.

### 3.3 — Vista de jugador ≠ vista de entrenador

Hoy, cuando el jugador toca "Hub", cae en la grilla completa con **Importar DVW, Cargar Videos, Panel en Vivo, Scouting, Game Plan (editor)** — herramientas tuyas, no de él. Eso es ruido y le quita seriedad/claridad.

**La solución es de bajo esfuerzo porque el sistema ya sabe quién es cada uno** (`casla_role` = player / coach / pf / at). Con eso se puede mostrar:
- **Jugador:** solo lo suyo — Mi perfil, Mis stats, Mi rutina, Mi wellness, Mis cortes, Heatmaps, Ranking, Calendario, Próximo rival (su versión).
- **Entrenador/Staff:** todo, como ahora.

Limpio, profesional, y cada uno ve lo que le sirve.

### 3.4 — Menos es más en cada pantalla

Regla de oro para el celular del jugador: **lo más importante arriba, grande, y poco scroll.** Si una pantalla tiene 12 cosas, probablemente 3 son las que el jugador mira el 90% del tiempo. El resto va más abajo o en "ver más".

---

## 4) PRIORIDAD 2 — Lo que un jugador pro QUIERE y todavía no está

### 4.1 — Pantalla "HOY" (lo primero que debería ver)

En vez de abrir y ver un menú, el jugador debería ver una tarjeta arriba de todo que le diga **qué tiene pendiente hoy**:

- 🩺 *"Te falta el wellness de hoy"* → botón directo (y se enlaza con la notificación que ya armamos).
- 💪 *"Tu rutina de hoy: Fuerza tren inferior"* → botón.
- 📅 *"Próximo partido en 3 días vs Amriswil"* → cuenta regresiva.
- 🆕 *"Hay clips nuevos tuyos del último partido"* / *"Tus stats ya están subidas"*.

Esto convierte la app en un hábito diario, no en algo que se abre "cuando me acuerdo".

### 4.2 — "Mis Objetivos" visible y personal

Ya tenés las metas del equipo cargadas. Falta que el jugador **vea su objetivo como una barra de progreso**: *"Recepción positiva — Meta 55% · Vos 48% 🟡"*. Y que vos como coach puedas ponerle **un objetivo personal** ("esta semana: 3 saques flotantes a zona 1 por set"). Los jugadores de elite viven para los objetivos medibles.

### 4.3 — Mi video, curado (no solo crudo)

"Mis Cortes" ya existe — buenísimo. El próximo nivel es **organizarlo para el jugador**: *"Mis 5 mejores ataques"*, *"Mis errores de recepción para corregir"*, y la posibilidad de que vos le dejes **un comentario en un clip** ("acá llegaste tarde al apoyo"). El video con una nota tuya es lo que más hace crecer a un jugador.

### 4.4 — Cerrar el círculo del Wellness

Hoy el jugador completa el wellness… ¿y después qué ve? Debería ver **su tendencia de los últimos 7 días** (una mini-curva) y un mensaje simple: *"Venís 🟡 hace 3 días — cuidá la recuperación."* Que sienta que sirve para algo, no que es un trámite. (Y la notificación automática que armamos lo va a sostener.)

### 4.5 — El próximo rival, en versión jugador

El Game Plan es detalladísimo (perfecto para vos). El jugador quiere **su parte**, masticada: *"Te va a tocar recibir el saque salto del #7 (difícil, va mucho a zona 5). En ataque, su bloqueo es flojo por zona 4: buscá la diagonal."* Tres frases, no veinte gráficos.

### 4.6 — Récords y logros personales

A los jugadores los motivan los récords. *"Tu mejor partido: 18 puntos vs Schönenwerd"*, *"Racha: 4 partidos seguidos con +50% de eficiencia"*. Barato de hacer (los datos ya están) y muy motivador.

---

## 5) Tabla de prioridades (impacto vs esfuerzo)

| # | Mejora | Impacto en claridad | Esfuerzo | Cuándo |
|---|--------|:---:|:---:|---|
| 1 | Contexto en cada número (meta + tendencia + frase) | 🔥🔥🔥 | Medio | **Primero** |
| 2 | Vista jugador ≠ entrenador (usar el rol que ya existe) | 🔥🔥🔥 | **Bajo** | **Primero (quick win)** |
| 3 | Pantalla "HOY" con pendientes | 🔥🔥🔥 | Medio | Segundo |
| 4 | Sacar/explicar jerga (estilo pistas del wellness) | 🔥🔥 | Bajo | Quick win |
| 5 | "Mis Objetivos" como barra de progreso | 🔥🔥 | Medio | Segundo |
| 6 | Cerrar el círculo del wellness (tendencia 7 días) | 🔥🔥 | Medio | Tercero |
| 7 | Próximo rival versión jugador | 🔥🔥 | Medio | Tercero |
| 8 | Video curado + comentario del coach | 🔥🔥 | Alto | Más adelante |
| 9 | Récords y logros personales | 🔥 | Bajo | Cuando quieras |

---

## 6) Por dónde empezaría yo

Si fuera vos, arrancaría por los **dos quick wins de mayor impacto en claridad**, que además casi no tienen riesgo de romper nada:

1. **Vista jugador ≠ entrenador** (#2): el sistema ya sabe el rol de cada uno, así que es filtrar qué tarjetas ve cada perfil. Limpia toda la experiencia del jugador de un saque.
2. **Contexto en los números** (#1): el cambio que más se va a notar. Cada stat con su meta (🟢🟡🔴), su flechita de tendencia y una frase. Acá la app pasa de "planilla" a "coach de bolsillo".

Con esos dos, la app salta de nivel en claridad sin tocar nada de lo que ya funciona.

---

## 7) Una reflexión final (de jugador)

La diferencia entre una app que el jugador **abre todos los días** y una que abre una vez y abandona es una sola: **¿me dice algo útil sobre MÍ, rápido y claro?** No gana la que tiene más datos — gana la que me hace sentir que tengo un entrenador personal en el bolsillo que me dice *dónde estoy, si mejoro, y qué hacer ahora*. Esta app está a **dos o tres cambios** de ser exactamente eso.

---

*Cuando vuelvas, decime por cuál querés arrancar y lo armo (preservando todo lo que ya anda). Mi recomendación: los dos quick wins de arriba.* 🏐
