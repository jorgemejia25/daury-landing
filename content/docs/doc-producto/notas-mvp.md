---
title: "Notas del MVP"
description: "Apuntes de trabajo sobre el alcance del MVP."
tags: ["mvp"]
source: "Notas del proyecto"
---

> Migrado desde: Notas del proyecto. Conserva el contenido original; las cifras y fechas son las de ese documento.

**Usuario**: cuidador familiar sin entrenamiento clínico, cuidando a un adulto mayor con deterioro cognitivo. Baja o nula alfabetización en el cuidador es el escenario por defecto, no la excepción. Un solo cuidador principal usa la app activamente. Niños quedan fuera por completo.

**Lo que la app demuestra de principio a fin**: las rutinas de la persona mayor —clínicas y de vida diaria— se organizan, se ejecutan con el mínimo esfuerzo de lectura o memoria, se registran, y generan una alerta cuando algo se sale de lo esperado.

## Principios de diseño (aplican a todas las pantallas)

- Ícono antes que palabra
- Audio en cada pantalla (leer en voz alta activado por defecto)
- Color y forma para el estado, no solo texto
- Caras para ánimo/dolor, no palabras
- Voz en vez de texto escrito
- Un solo concepto por pantalla / una sola instrucción a la vez

## Núcleo diario

- **Onboarding** — configuración inicial: nombre del cuidador, a quién cuida, preferencias. 3 pantallas swipeables, ícono + frase corta + audio, botón "Omitir".
- **Hoy** (pantalla principal) — saludo, progreso del día, tareas por hacer/completadas, sección "Para ti" (alerta de patrón, ánimo, emergencia).
- **Semana (Salud)** — adherencia semanal, alertas de patrones, ánimo por día (caras), tabla de actividades por día, detalle de un día con notas de voz.

## Gestión de actividades

- **Nueva actividad** — elegir entre "Tomar foto" (clínica, con IA) o "Plantilla diaria" (no clínica).
- **Cámara** — escanear receta o etiqueta.
- **Procesando** — "Leyendo la receta..." mientras la IA interpreta la foto.
- **Confirmar** ("Revisa y escucha") — tarjeta editable con lo que la IA extrajo (ícono, frecuencia, restricciones). Debe incluir: miniatura de la foto original, audio automático al abrir (no depender de que el cuidador lo toque), botón "Esto no es correcto / tomar otra foto" al mismo nivel que "Guardar".
- **Plantillas** — grid de íconos predefinidos (comida, higiene, descanso, actividad física, hidratación) para crear actividades de vida diaria sin IA.
- **Fijar hora** — selector simple, sin teclado.
- **Guía** — una sola instrucción visible a la vez, nunca lista larga. Señales de alto en tarjeta de advertencia separada. Botón "Siguiente paso" si hay varios.
- **Registro** — escala de 3 caras (leve/medio/fuerte), nota de voz (no texto), toggle de incidente, botón "Guardar".
- **Error foto** — si el escaneo falla: reintento o caída a plantilla manual, nunca bloqueado.

## Familia y persona a cargo

- **Rosa (Perfil)** — datos de la persona cuidada: nombre, edad, condición, medicación, contactos.
- **Familia** (versión simplificada, no sistema de coordinación):
  - **Invitar** — enlace de solo lectura compartido por WhatsApp. Quien lo recibe ve historial y rutina de hoy sin cuenta ni descarga de app.
  - **Equipo** — directorio simple: nombre + relación (hijo, vecino, profesional) + acceso sí/no. Sin turnos, sin asignación de tareas, sin coordinación activa.
  - *Fuera del MVP: Handoff / pase de turno entre cuidadores — es coordinación operativa multi-persona, terreno de competidores tipo Caring Village, no de Daury.*

## Cuidador y salud

- **Reporte doctor** — resumen para consulta médica + preguntas sugeridas, generado a partir de datos que ya existen en Historial. Sin pantallas nuevas de captura.

- *Fuera del MVP o redefinir con cuidado: "Emergencia" / modo pánico — riesgo de romper el límite ético de que Daury no es un dispositivo de seguridad. Si se construye, limitar estrictamente a "acceso rápido a contactos y datos médicos guardados", sin framing de emergencia/pánico que sugiera que la app responde a la crisis.*

## Sistema

- **Ajustes** — accesibilidad (texto/voz, leer en voz alta ON por defecto), integración Alexa, modo offline.
- **Alexa** — skill opcional, 1-2 intents ("¿qué sigue?", "ya lo hice"), vinculación con el dispositivo. Extra, no canal principal — no debe ser necesario para que la app funcione.

## Explícitamente fuera del MVP

- Login/portal completo para el profesional de salud (solo el toggle "compartir con terapeuta")
- Multi-paciente
- Handoff / coordinación operativa multi-cuidador
- Niños
- Transcripción o análisis de notas de voz
- Audio en idiomas mayas (roadmap, no MVP)
- Telemedicina o chat con el profesional

## Límites éticos explícitos

- Daury no diagnostica ni prescribe.
- Daury no es un dispositivo de seguridad — no reemplaza supervisión humana, localización ni detección de caídas.
- La decisión clínica es siempre del profesional; la app organiza lo indicado o lo que la familia define como rutina diaria.

## Diferenciación vs. Caring Village

- Caring Village depende de que toda la familia se una a la plataforma (modelo "village" en tiempo real) → débil en contextos de baja conectividad.
- Daury: un cuidador principal activo + familia extendida como solo-lectura vía enlace/WhatsApp
- Accesibilidad (ícono + audio + baja alfabetización) como núcleo de diseño, no como feature adicional.
- La IA de Daury convierte foto de instrucción → rutina estructurada (ahorra trabajo manual), distinto al chatbot conversacional tipo "Julia" de Caring Village.
- Mensaje para pitch: "Ellos necesitan que toda la familia esté dentro de su plataforma. Nosotros llevamos la información a donde la familia ya está, incluso sin internet."

# Incluir cuentas

## Criterio de éxito de la demo

1. Foto de una instrucción clínica → escuchar y confirmar el resultado de la IA
2. Crear una actividad de vida diaria con plantilla, sin IA
3. Ver y escuchar ambas en la rutina de hoy
4. Completar una, registrar con caras + nota de voz
5. Ver el historial reflejando ambas, con una alerta simulada por patrón repetido
6. (Opcional, bonus) "Alexa, ¿qué sigue?" respondiendo en vivo desde un Echo

## Posicionamiento

- "Daury no reemplaza cuidadores ni doctores, es darles un plus"

## Related

- [[Pitch y Estrategia]]
- [[Funcionalidades y OCR]]
- [[Roadmap y Equipo]]
- [[Seguridad y Legal]]
