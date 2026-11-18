---
title: "Costo de escalar"
description: "Cuánto cuesta operar Daury por etapas de crecimiento."
tags: ["finanzas", "escala"]
source: "Claude Design · Daury Costo de Escalar"
---

> Migrado desde: Claude Design · Daury Costo de Escalar. Conserva el contenido original; las cifras y fechas son las de ese documento.

D Daury · Estrategia de escalado

# ¿Puede la aplicación crecer sola pagando lo justo?

El cómputo sí escala solo y casi no cuesta. El resto no. Con la arquitectura pensada para 100,000 usuarios encendida desde el día uno, con 1,000 usuarios se pagarían $378 al mes por capacidad que podría servir a 20,000.

$77

al mes en etapa piloto, 0–2,000 usuarios

5×

menos costo por usuario que arrancar con todo encendido

1

arquitectura, cuatro configuraciones — solo cambian variables

01 Qué escala solo, qué no

## El problema no es el cómputo, es el piso fijo

Base de datos, NAT, balanceador y WAF suman cerca de $300 al mes aunque no haya un solo usuario. El resto — Fargate, S3, SQS, EventBridge — cobra por uso y con poco tráfico es casi gratis.

Componente

¿Escala solo?

Costo con poco uso

02 Crecimiento

## Cómo se ve el crecimiento, y cuándo la app empieza a generar

Tres lecturas: cómo sube el costo según la estrategia, de qué está hecho el piso de la etapa 1, y en qué mes los ingresos cruzan al costo.

Costo mensual: la escalera vs. todo encendido desde el día uno

Escala logarítmica. Los valores intermedios son el punto medio del rango de cada etapa.

Donde está el ahorro

Por debajo de ~3,500 usuarios la escalera cuesta menos que la configuración completa: $77 frente a $378. Son justo los meses en los que todavía no hay ingresos.

Donde deja de importar

Pasados los 5,000 usuarios las dos curvas convergen: a partir de ahí el gasto lo manda el uso real, no la decisión inicial de dimensionamiento.

De qué está hecho el piso de $77

Etapa 1 · piloto, una sola zona.

Volumen por hora del día

Las franjas 07:00–09:00 y 20:00–22:00 concentran el 45% del volumen diario. Por eso el escalado programado gana al autoescalado por métrica.

Punto de equilibrio: ingresos contra costo de infraestructura

Los ingresos son un supuesto ajustable — el costo no: sale de la escalera de etapas. Mueve precio y conversión para ver en qué mes se cruzan.

Empieza a generar

Precio por usuario pagador / mes…

Conversión a plan pagado…

Curva de adopción supuesta: 200 usuarios el primer mes hasta 33,000 en el mes 18. El costo sigue la escalera: $77 hasta 2,000 usuarios, $350–$880 hasta 20,000, $880–$4,350 hasta 100,000.

03 La escalera

## Cuatro configuraciones, una sola arquitectura

Mueve el número de usuarios y mira qué etapa aplica, qué se enciende y cuánto costaría al mes. Todo esto son variables del mismo código de infraestructura, no despliegues distintos.

Usuarios activos

02,00020,000100,000150,000+

Etapa

Costo estimado / mes

Costo por usuario

vs. arrancar con la configuración completa (dimensionada para 100,000) a 1,000 usuarios

Etapa actual (…)…

Configuración completa desde el día uno$378

Qué está encendido en esta etapa

Mismo código, distintos parámetros.

04 Autoescalado

## Cómo configurarlo: API y Worker

La CPU reacciona tarde en cargas de entrada y salida. Cada servicio se mide con la métrica que refleja lo que le importa al usuario.

API

Métrica: **peticiones por tarea**, no CPU.

Mínimo **2 tareas**, una por zona, desde que haya gente pagando.

Sube rápido (1–2 min), baja lento (10 min de enfriamiento).

Máximo siempre fijado. Un error o ataque no gasta sin límite.

Worker

Métrica: **antigüedad del mensaje más viejo** en SQS, no profundidad de cola.

Objetivo: menos de **60 segundos** de antigüedad.

Mínimo 1 tarea, máximo según presupuesto.

La antigüedad mide lo que le importa al usuario: que el recordatorio llegue a tiempo.

El pico de las 08:00 no espera al autoescalado

El autoescalado reacciona en ~2 minutos; la oleada de recordatorios llega en segundos. La solución es barata y determinista: escalado programado, con el autoescalado por métrica como red de seguridad.

05 El límite oculto

## Lo que se rompe antes que el cómputo

Las conexiones a la base de datos. PostgreSQL no lleva bien cientos de conexiones simultáneas, y el límite aparece bastante antes de necesitar una instancia más grande.

80 tareas × 10 conexiones = 800 conexiones

0 tareas20–40: límite típico80+ tareas

La solución: **RDS Proxy o PgBouncer**, ~$22/mes sobre una instancia mediana — y hay que ponerlo antes de que haga falta. Agrandar la base de datos pensando que es capacidad, cuando es conexiones, es uno de los errores más comunes al escalar.

Disparador

Conexiones activas > 60% del máximo

Ese es el momento de poner RDS Proxy, no cuando ya falló.

06 Disparadores

## Cuándo graduar de etapa

No por número de usuarios, sino por síntoma. Los números orientan; el síntoma es la señal real — y conviene tenerlos escritos de antemano.

07 Guardarraíles

## El autoescalado convierte un error en una factura

Tres cosas antes de encenderlo.

Máximo de tareas

En cada servicio. Una tormenta de reintentos en el Worker puede levantar cien tareas.

Alertas de presupuesto

Umbral al 50%, 80% y 100% del gasto previsto del mes.

Etiquetado por componente

Sin etiquetas, la factura es un número sin explicación.

La respuesta directa

## ¿Puede crecer sola? El cómputo sí. ¿Con 1,000 usuarios se pagaría lo justo? Solo en etapa piloto.

El cómputo escala solo

API por peticiones, Worker por antigüedad de cola, más escalado programado para los picos de medicación.

$77 vs. $378 al mes

La configuración de piloto cuesta cinco veces menos durante los meses sin ingresos.

Recomendación: arrancar en etapa 1, con el código de infraestructura preparado para que subir de etapa sea cambiar variables y no reescribir nada — y tener escritos de antemano los disparadores de la sección 6.

El riesgo de la etapa 1 es real: una sola zona de disponibilidad, sin failover automático. Aceptable con usuarios de piloto y avisados. Deja de serlo el día que alguien paga.

D Daury
