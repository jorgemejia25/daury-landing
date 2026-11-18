---
title: "Informe de implementación de la app"
description: "Informe de la implementación de la app móvil (versión 6)."
tags: ["app", "informe"]
source: "Documentation/Informes · v6"
---

> Migrado desde: Documentation/Informes · v6. Conserva el contenido original; las cifras y fechas son las de ese documento.

APP MÓVIL · INFORME DE IMPLEMENTACIÓN · V6

Emergencia con dos llamadas y frecuencia de la caminata Cambios pequeños de interfaz. No se tocaron la arquitectura, el esquema de eventos ni el registro solo de inserción. FECHA

BUILD PROBADO

RAMA

21 de octubre de

Release · iOS 18.6 (simulador), instalación

feat/mobile-registro-local ·

2026

limpia

7a38d65

13 / 13

pruebas unitarias

botones de llamada en Emergencia

Paso 4 de 6 en la pantalla de acción

0 capturas con el nombre de la marca

por falta de aire

Antes y después

D ÓN DE

A N TE S

A HO RA

Emergencia ·

Emergencias (911), Dr. Hernández

Emergencias (911) y el profesional registrado en Perfil (Dra.

llamadas

(neurólogo), María (hija). Teléfonos fijos en el código.

Elena Morales, +502 5555 0198). Se lee del mismo registro local que Perfil: si se edita ahí, cambia aquí.

Emergencia · dirección

Calle Roble 24, Col. Centro.

Eliminada.

Emergencia · medicación

Paracetamol 500 mg y donepezilo 5 mg.

Sección eliminada.

Emergencia ·

«Leer datos» mostraba un texto con

«Escuchar» lee en voz alta: «Modo emergencia. Llame al 911 o

audio

dirección y medicación.

a Dra. Elena Morales.»

Perfil · caminata

Todos los días · 16:00 · 10 minutos

Todos los días · 16:00 · 10 días · sesión de 10 minutos

Hoy · acceso

Emergencia · llamar y datos

Emergencia · llamar (la pantalla ya no muestra datos).

(ajuste derivado)

La tableta mantiene «Todos los días · 8:00 · 7 días»: no tiene duración de sesión, así que no se agrega esa parte.

Verificación

Sin cambios

Pasan las 13 pruebas unitarias. tsc --noEmit y npm run lint sin errores ni advertencias. El build

Modelo, esquema de eventos, registro solo de inserción y seed. La interrupción del recorrido sigue el

Release se instaló desde cero y se recorrió la

flujo existente: la pantalla de acción indica el paso 4

caminata hasta el paso 4, con interrupción por «Le falta el aire más de lo normal».

de 6 y Hoy muestra la caminata como «Interrumpido · 16:00».

Emergencia y Perfil: antes y después

EMERGENCIA · ANTES (V5)

D) EMERGENCIA · DESPUÉS

PERFIL · ANTES (V5)

PERFIL · DESPUÉS

Tres llamadas, dirección y medicación.

Solo 911 y la profesional registrada en Perfil.

«16:00 · 10 minutos».

«16:00 · 10 días · sesión de 10 minutos».

Capturas pedidas (build Release)

CONTEXTO

A) SEÑALES DE ALTO

B) PANTALLA DE ACCIÓN

C) HOY

Paso 4 de 6, crítico, tras las dos comprobaciones.

Control «Alto» abierto en el paso 4.

«Guía detenida · paso 4 de 6». Detener, sentarle y llamar al profesional.

Caminata en «Ya registradas» como «Interrumpido · 16:00».

Capturas del build Release en el simulador de iOS (iOS 18.6), instalación limpia, revisadas con OCR: ninguna muestra el nombre de la marca. Android sigue sin probar.
