---
title: "Revisión del modelo con enfermería"
description: "Presentación para revisar con enfermería el modelo de instrucción, registro y escalamiento."
tags: ["enfermería", "presentación", "tesis"]
source: "Presentación «Revisión del modelo con enfermería» (Claude)"
---

> Migrado desde: Presentación «Revisión del modelo con enfermería» (Claude). Conserva el contenido original; las cifras y fechas son las de ese documento.

## Diapositiva 1

Trabajo de graduación · USAC

### Revisión del modelo de cuidado en casa

Instrucción, registro y escalamiento para cuidadores sin formación clínica

Jorge Andrés Mejía Súchite · Ingeniería en Ciencias y Sistemas

> **Notas del presentador:** Gracias por su tiempo. Soy Jorge Mejía, estudiante de Ingeniería en Ciencias y Sistemas de la USAC.
> >
> > Antes de empezar: su participación aparecería en el trabajo como profesional colaboradora. ¿Está de acuerdo? ¿Me permite grabar la conversación para no perder detalles?
> >
> > Anotar: nombre completo, grado académico, número de colegiado y años de experiencia.


## Diapositiva 2

### El problema

Ejecución

### Error de ejecución

El cuidador omite un paso, cambia la dosis o la hora, o continúa pese a una señal de alarma.

Registro

### Omisión de registro

Lo que hizo el cuidador no queda anotado, y el profesional decide sin ese dato.

El modelo tiene tres partes: instrucción, registro y escalamiento

> **Notas del presentador:** Mi trabajo de graduación busca reducir dos problemas del cuidado en casa: los errores que comete un cuidador sin formación clínica al ejecutar una indicación del personal de salud, y las veces en que no queda registro de lo que hizo.
> >
> > Para eso diseñé un modelo con tres partes: cómo se le presenta la indicación al cuidador, cómo se registra lo que hizo y cuándo debe detenerse y avisar. Lo voy a probar con un prototipo en el teléfono.


## Diapositiva 3

### Qué necesito de usted

1

### Su experiencia con cuidadores

Qué información necesitan, en qué se equivocan y qué necesita usted saber después.

2

### Definir los pasos correctos

De dos tareas simuladas: qué es correcto y qué cuenta como error.

Duración aproximada: 60 minutos

> **Notas del presentador:** Necesito su experiencia para dos cosas: conocer cómo se da hoy una indicación en casa y dónde fallan los cuidadores, para ajustar el modelo; y definir, paso por paso, cómo se hacen correctamente las tareas con que voy a medir los errores.


## Diapositiva 4

### Campos de cada indicación

| Campo               | Qué contiene                               |
|---------------------|--------------------------------------------|
| **Tarea**           | Nombre breve y un ícono                    |
| **Horario**         | Hora y duración, como usted las fijó       |
| **Preparación**     | Lo que debe estar listo antes              |
| **Comprobación**    | Pregunta de sí o no antes del paso crítico |
| **Pasos**           | Una acción por pantalla, con audio         |
| **Señales de alto** | Cuándo detenerse y qué hacer               |
| **Qué evitar**      | Lo que no debe hacerse                     |

> **Notas del presentador:** Le muestro cómo queda una indicación. Cada una se organiza en siete campos: la tarea, el horario, la preparación, una comprobación antes del paso crítico, los pasos uno por uno, las señales de alto y lo que no debe hacerse.
> >
> > Antes de empezar, el cuidador ve qué necesita, qué no debe hacer y cuándo debe detenerse. Cada cosa se puede escuchar.
> >
> > (Si tienes el teléfono a mano: abre la tableta de la mañana y toca Escuchar una vez.)


## Diapositiva 5

### Guía de ejecución: un paso por pantalla

Comprobación previa

Paso crítico con audio

Confirmación final

> **Notas del presentador:** Después ve un paso por pantalla. Antes del paso crítico, confirma que el nombre y la concentración de la caja coinciden con los de la pantalla. Si no coinciden, la guía se detiene y le indica que le llame a usted.
> >
> > Cada paso se puede escuchar las veces que haga falta. Al confirmar el último paso, la tarea queda registrada como realizada.
> >
> > (En el teléfono: responde Sí y avanza al paso crítico.)


## Diapositiva 6

### Señales de alto

Cada señal debe ser

### Observable por otra persona

Correcto: no puede tragar la tableta
Incorrecto: se siente mal

### En palabras comunes

Correcto: se le hinchan los labios
Incorrecto: presenta edema facial

### Con una acción definida

Llamar al profesional o buscar atención de emergencia

> **Notas del presentador:** En cada paso hay un botón de alto. Si el cuidador ve una de estas señales, la guía se detiene y le dice exactamente qué hacer: llamarle a usted o buscar atención de emergencia. El cuidador no decide nada.
> >
> > Las señales deben poder reconocerse sin conocimiento clínico: algo que cualquiera vea, dicho con palabras de todos los días, y siempre con una acción fija.
> >
> > (En el teléfono: toca Alto, elige una señal y muestra la pantalla de acción.)


## Diapositiva 7

### Registro automático

El cuidador no escribe nada. Cada tarea queda con su estado, la hora y el paso.

| Estado           | Cuándo                     |
|------------------|----------------------------|
| **Pendiente**    | Pasó la hora sin confirmar |
| **Realizado**    | Confirmó el último paso    |
| **No realizado** | Indicó que no lo hizo      |
| **Interrumpido** | Marcó una señal de alto    |

> **Notas del presentador:** El cuidador no llena ningún formulario. La aplicación registra sola si la tarea se hizo, no se hizo o se interrumpió, con la hora y el paso. Esto es lo que usted vería en el reporte, que también se puede compartir en PDF.
> >
> > La aplicación no diagnostica ni cambia la indicación. Solo la presenta, guía la ejecución y registra lo que pasó.
> >
> > (En el teléfono: vuelve a Hoy, entra a Perfil y abre el reporte para el profesional.)


## Diapositiva 8

### Ejemplos para revisar

| Campo | Medicamento oral | Caminata asistida |
|----|----|----|
| **Tarea** | Tableta de la mañana | Caminata de la tarde |
| **Horario** | 8:00, diario, durante siete días | 16:00, diario, durante diez minutos |
| **Preparación** | Caja del medicamento y un vaso de agua | Zapatos cerrados, bastón si fue indicado, camino despejado |
| **Comprobación** | ¿El nombre y la concentración de la caja coinciden con la pantalla? | ¿El piso está seco y sin objetos en el camino? |
| **Pasos** | 1 Lávese las manos · 2 Saque una sola tableta · 3 Désela con el vaso de agua · 4 Espere a que la trague | 1 Ayúdele a sentarse en la orilla de la cama · 2 Póngase a su lado · 3 Ayúdele a pararse despacio · 4 Caminen juntos hasta la sala · 5 Ayúdele a sentarse |
| **Señales de alto** | Se atraganta o no puede tragar · Se le hinchan los labios o la cara | Se marea o dice que se va a caer · Le falta el aire más de lo normal |
| **Qué evitar** | Dar más de una tableta en la misma toma | Soltarle mientras camina |

> **Notas del presentador:** Estos dos ejemplos son ilustrativos: no vienen de una receta real.
> >
> > Las comprobaciones y las señales de alto están tomadas de guías publicadas; la siguiente diapositiva muestra las fuentes.


## Diapositiva 9

### Criterios tomados de guías publicadas

| Tarea | Criterio y acción | Fuente |
|----|----|----|
| **Ambas** | Paso crítico: aquel en que un error llega al paciente (dar la tableta, ponerlo de pie) | NCC MERP (1998) |
| **Tableta** | Comprobar nombre del medicamento y dosis antes de darlo | OMS, 5 Momentos (2022); OpenRN (2022) |
| **Tableta** | No puede hablar o respira con dificultad tras atragantarse: **emergencia** | Mayo Clinic, atragantamiento |
| **Tableta** | Hinchazón de labios o cara, dificultad para respirar o tragar: **emergencia** | Mayo Clinic, anafilaxia |
| **Caminata** | Piso despejado y seco, calzado antideslizante | CDC, Lista de seguridad; OpenRN (2022) |
| **Caminata** | Mareo: **detener y llamar al profesional** | Manual MSD (2026); OpenRN (2022) |
| **Caminata** | Falta de aire mayor de lo normal: **detener y llamar al profesional** | Baptist Health (2026) |

> **Notas del presentador:** Diapositiva informativa, no se pregunta. Explica que los pasos críticos, las comprobaciones y las señales de alto no dependen de la opinión de nadie: salen de una definición y de guías publicadas.
> >
> > Si ella menciona una norma o protocolo que use en su trabajo, anota el nombre para citarlo.


## Diapositiva 10

Pregunta 1 de 5

### ¿Cómo le explica hoy una indicación a un familiar que va a cuidar en casa?

¿De palabra, por escrito o con demostración? ¿Qué parte entiende mal u olvida con más frecuencia?

> **Notas del presentador:** Para qué sirve: describe cómo llega hoy la indicación al hogar y dónde se pierde información. Sirve para comparar con el esquema de instrucción del capítulo 3 (apartado 3.4), sin mencionarle la app.
> >
> > Si responde en general, pide un caso concreto reciente. Anota en la pregunta 1 de la página del guion.


## Diapositiva 11

Pregunta 2 de 5

### ¿Qué errores cometen los familiares al dar medicamentos o al ayudar a caminar a una persona en casa?

¿Cuáles son los más frecuentes y en qué momento de la tarea ocurren?

> **Notas del presentador:** Para qué sirve: define qué cuenta como error en la rúbrica (apartado 5.1) y muestra si las categorías del estudio (omitir un paso, dosis u hora equivocada, no verificar, seguir pese a una molestia) cubren lo que pasa en casa. No le leas las categorías: deja que responda primero.
> >
> > Pide un ejemplo concreto de cada error. Anota en la pregunta 2.


## Diapositiva 12

Pregunta 3 de 5

### ¿Qué decisiones toman los familiares por su cuenta, sin consultarle?

¿Cuáles de esas decisiones le preocupan más y por qué?

> **Notas del presentador:** Para qué sirve: cada decisión que mencione es un punto donde el cuidador hoy usa juicio clínico. El modelo debe convertirla en una instrucción cerrada: un «qué evitar» o una señal de alto con acción definida (apartado 3.4).
> >
> > Si no surge solo, pregunta por repetir una dosis olvidada, partir una tableta o suspender por una molestia. Anota en la pregunta 3.


## Diapositiva 13

Pregunta 4 de 5

### ¿Cómo se entera usted de lo que pasó en casa entre una visita y otra?

¿Qué información le falta con más frecuencia cuando revisa al paciente?

> **Notas del presentador:** Para qué sirve: describe cómo vuelve hoy la información del hogar al profesional y qué datos faltan. Sustenta el mecanismo de registro y el reporte (apartados 3.2 y 3.4) con un dato de la práctica, sin mencionarle la app.
> >
> > Pide un ejemplo de una decisión que tuvo que tomar sin saber si el tratamiento se cumplió. Anota en la pregunta 4.


## Diapositiva 14

Pregunta 5 de 5

### ¿Cómo se hacen correctamente, paso a paso, estas dos tareas en casa?

Dar un medicamento oral

Ayudar a caminar a una persona

En cada paso, ¿qué cuenta como hacerlo mal?

> **Notas del presentador:** Para qué sirve: es la rúbrica de ejecución correcta (apartado 5.1) y reemplaza los ejemplos ilustrativos de la tabla 8. Pídele que dicte los pasos en orden, con sus palabras, y anótalos tal cual en las rúbricas A y B de la página del guion.
> >
> > Si en la parte de tareas ella eligió otras tareas, haz esta misma pregunta con esas.


## Diapositiva 15

### Dos tareas para la medición

Cada tarea debe ser

Frecuente en casa

Propensa a error

Simulable sin paciente real

De dificultad parecida a la otra

Propuesta

### Tableta oral

### Caminata asistida

De respaldo

Higiene de manos
Toma de presión arterial
Prevención de broncoaspiración

Por cada tarea: los pasos correctos, qué cuenta como error y cuál paso es crítico

> **Notas del presentador:** Ahora necesito su ayuda con la medición. Varios cuidadores harán dos tareas simuladas, sin un paciente real: una con la indicación en papel, como se hace hoy, y otra con la aplicación.
> >
> > Para saber si se equivocaron necesito un patrón: los pasos correctos según usted y qué cuenta como error en cada uno.
> >
> > ¿Qué tareas me recomienda? La decisión es suya. Las de respaldo son las de mayor frecuencia de error documentada (Mira et al., 2025).
> >
> > Llena las dos rúbricas en la página del guion. Al final pregunta: ¿las dos tareas tienen una dificultad comparable?


## Diapositiva 16

### Simulación de las tareas

Cada participante hace una tarea con la indicación en papel y otra con la app; el orden se alterna. Una persona del equipo hace de paciente.

### Insumos

¿Qué usamos en lugar del medicamento y cómo rotulamos la caja?

### Señal de alto

¿En qué paso se presenta y cómo debe actuarse?

### Hoja en papel

¿Cómo es la hoja de control que se entrega en casa?

### Duración y riesgos

¿Cuánto debe durar cada tarea y qué incomodidad debemos prever?

> **Notas del presentador:** Por último, quiero que la simulación se parezca a lo que pasa en una casa. No habrá un paciente real: una persona del equipo hará ese papel.
> >
> > Insumos: opciones como dulces del tamaño de una tableta o tabletas sin principio activo.
> Hoja en papel: pide, si puede, un ejemplo o una foto.
> >
> > Anota las respuestas en la sección «Cómo simular las tareas» de la página del guion.


## Diapositiva 17

### Cierre

### Segundo revisor

¿Quién más puede revisar las rúbricas?

### Envío

Fecha para mandarle las rúbricas en limpio

### Cita

Cómo prefiere aparecer en el trabajo

Gracias

> **Notas del presentador:** Le agradezco mucho. Voy a pasar en limpio las rúbricas y se las envío para su visto bueno.
> >
> > La medición pide que un segundo profesional revise las rúbricas. ¿Conoce a alguien que pueda hacerlo?
> >
> > ¿Cómo prefiere aparecer citada en el trabajo?
> >
> > Antes de irte: deja tus datos de contacto y guarda la grabación con la fecha.

