---
title: "Modelo de costos"
description: "Costos de infraestructura, IA, mensajería y operación por usuario."
tags: ["finanzas", "costos"]
source: "Claude Design · Daury Modelo de Costos"
---

> Migrado desde: Claude Design · Daury Modelo de Costos. Conserva el contenido original; las cifras y fechas son las de ese documento.

Daury tiene un costo marginal casi nulo por usuario y un costo fijo mensual alto. Este documento explica cuánto cuesta mantener la infraestructura funcionando y cuánto cuesta cada usuario adicional.

$0.04

costo marginal de un usuario activo al mes

77%

del gasto en etapa 1 es fijo: se paga sin usuarios

~514

usuarios activos para cubrir la infraestructura del piloto

01 El modelo

## Dos gastos con comportamientos opuestos

Un costo fijo que se paga aunque nadie use la app —base de datos, salida a Internet, balanceador, WAF— y un costo variable que sigue al uso real y cobra por segundo. Hasta la etapa 2, nueve de cada diez dólares del gasto son fijos.

Reparto del gasto mensual: fijo contra variable

Reparto aproximado por configuración. El fijo no depende de cuánta gente use Daury.

De qué está hecho el costo fijo de $77

Etapa 1 · piloto, una sola zona.

$0.045

Costo marginal por usuario activo al mes. De 2,000 a 20,000 usuarios el gasto sube $803 para atender a 18,000 personas más; de 20,000 a 100,000, $3,470 para 80,000 más. La pendiente casi no cambia.

~$300

Costo fijo mensual de la configuración completa: base de datos, dos NAT Gateway, balanceador y WAF, exista o no un solo usuario. Ese número determina en qué mes los ingresos cubren el gasto de infraestructura.

Qué escala solo y qué no

Pasa el cursor sobre cada servicio para ver qué hace y cómo cobra.

Componente

¿Escala solo?

Costo con poco uso

02 Economía unitaria

## En freemium, unos pocos pagan por todos

La app es gratis para la mayoría. Solo una parte pequeña paga suscripción, pero *todos* consumen infraestructura. Por eso lo que importa no es el precio, sino cuánto ingreso deja cada usuario en promedio, contando gratuitos y pagados juntos. Mueve los dos controles y el resto del documento se recalcula.

Precio del plan pagado, al mes…

De cada 100 usuarios, cuántos pagan…

Leído en voz alta, con estos supuestos

De cada **100 usuarios** que usan Daury, **… pagan** … al mes y **… no pagan nada**. Eso son **…** de ingreso al mes, y esos mismos 100 usuarios cuestan alrededor de **…** de infraestructura. Repartido entre los 100, cada usuario —pague o no— deja **…** al mes.

Entra por usuario

promedio mensual contando gratuitos y pagados

Sale por usuario

$0.03 – $0.09

infraestructura, igual para gratuitos y pagados

Queda a 20,000 usuarios

del ingreso, ya pagada la nube

De cada $100 que entran, cuánto queda después de pagar la nube

El ingreso sube parejo con los usuarios; la infraestructura sube **a saltos**, cuando toca cambiar de configuración. En el salto se paga capacidad antes de tener los usuarios que la justifican y la curva baja. Después vuelve a subir sola.

1,000 → 2,000

La configuración no cambia: sigue costando $77. Se duplican los usuarios sin gastar un dólar más, así que la curva sube.

El bajón en 5,000

Aquí hay que graduar a la etapa 2 —base de datos más grande, NAT y balanceador completos— y el costo pasa de $77 a $425. El costo se multiplica por 5,5 mientras los usuarios solo por 2,5. Nada empeoró: se compró capacidad por adelantado.

10,000 → 50,000

El salto ya está pagado y cada usuario nuevo cuesta centavos, así que la curva se recupera. A 100,000 hay otro salto y vuelve a ceder un poco.

Usuarios activos necesarios para cubrir la infraestructura

Con … al mes y … de conversión.

Lo que dice el modelo

Regalar la app no es lo caro. Lo caro es que nadie pase al plan pagado.

Con estos supuestos, la infraestructura se lleva … del ingreso a 20,000 usuarios: los gratuitos caben de sobra dentro de lo que pagan los suscriptores. Subir el precio no cambia el costo de la nube, y sumar usuarios apenas lo mueve. Lo que decide el negocio es el porcentaje que paga.

03 Crecimiento

## Cuándo la app deja de costar y empieza a generar

Dos curvas: cómo sube el gasto según la estrategia de dimensionamiento, y en qué mes los ingresos cruzan al costo con la adopción supuesta.

Costo mensual: dimensionar por etapas vs. todo encendido desde el día uno

Escala logarítmica. Los valores intermedios son el punto medio del rango de cada etapa.

Donde está el ahorro

Por debajo de ~3,500 usuarios el gasto por etapas es menor: $77 frente a $378. Son los meses sin ingresos, y esa diferencia de $301 al mes se puede usar en otra cosa.

Donde deja de importar

Pasados los 5,000 usuarios las dos curvas convergen: el gasto lo manda el uso real, no la decisión inicial de dimensionamiento.

Punto de equilibrio: ingresos contra costo de infraestructura

Con el precio y la conversión de la sección 02, y una adopción de 200 usuarios el primer mes hasta 33,000 en el mes 18.

Empieza a generar

El costo sigue la escalera: $77 hasta 2,000 usuarios, $350–$880 hasta 20,000, $880–$4,350 hasta 100,000.

04 La escalera

## Cuatro configuraciones, una sola arquitectura

El gasto es una decisión de parámetros, no de arquitectura: mueve el número de usuarios y mira qué se enciende, cuánto cuesta y qué se sacrifica.

Usuarios activos

1,0002,00020,000100,000150,000+

Etapa

Costo / mes

Costo por usuario

Margen sobre cómputo

Ingresos de esta etapa contra su costo

Ingresos estimados…

Costo de infraestructura…

Qué está encendido en esta etapa

Pasa el cursor sobre cada componente para ver qué aporta y qué cobra.

05 Cómo se gasta el cómputo

## El gasto variable sigue la rutina de medicación

Daury no tiene carga plana: dos franjas del día concentran casi la mitad del volumen. Eso decide cómo se paga el cómputo y por qué el autoescalado por métrica no basta.

Volumen por hora del día

Las franjas 07:00–09:00 y 20:00–22:00 concentran el 45% del volumen diario. Una instancia fija se paga igual a las tres de la mañana — por eso conviene evaluar Aurora Serverless v2 en la etapa 2.

API

Métrica: **peticiones por tarea**, no CPU — la CPU reacciona tarde en cargas de entrada y salida.

Mínimo **2 tareas**, una por zona, desde que haya gente pagando.

Sube rápido (1–2 min), baja lento (10 min de enfriamiento).

Máximo siempre fijado. Un error o un ataque no debe poder gastar sin límite.

Worker

Métrica: **antigüedad del mensaje más viejo** en SQS, no profundidad de cola.

Objetivo: menos de **60 segundos**. Mide lo que le importa al usuario: que el recordatorio llegue a tiempo.

Mínimo 1 tarea, máximo según presupuesto.

La profundidad de cola no distingue entre mil mensajes rápidos y diez lentos.

El pico de las 08:00 no espera al autoescalado

El autoescalado reacciona en unos dos minutos; la oleada de recordatorios llega en segundos. La solución es barata y determinista: escalado programado, con el autoescalado por métrica como red de seguridad para lo imprevisto.

06 El límite oculto

## Lo que se rompe antes que el cómputo

Las conexiones a la base de datos. El error caro es agrandar la instancia creyendo que falta capacidad cuando faltan conexiones: se paga más y el problema sigue.

80 tareas × 10 conexiones = 800 conexiones

0 tareas20–40: límite típico80+ tareas

La solución: **RDS Proxy o PgBouncer**, ~$22 al mes sobre una instancia mediana — mucho más barato que subir de tamaño de base de datos, y hay que ponerlo antes de que haga falta.

Disparador

Conexiones activas > 60% del máximo

Ese es el momento de poner RDS Proxy, no cuando ya falló.

07 Disparadores de gasto

## Cada subida de factura tiene una condición escrita

No se gradúa por número de usuarios, sino por síntoma. Definirlos por escrito antes de necesitarlos evita decisiones improvisadas cuando ya urge decidir.

08 Guardarraíles

## El autoescalado convierte un error en una factura

Tres cosas antes de encenderlo.

Máximo de tareas

En cada servicio. Una tormenta de reintentos en el Worker puede levantar cien tareas.

Alertas de presupuesto

Umbral al 50%, 80% y 100% del gasto previsto del mes.

Etiquetado por componente

Sin etiquetas, la factura es un número sin explicación.

El modelo en tres frases

## Costo marginal casi nulo por usuario, un costo fijo mensual que hay que cubrir con ingresos, y un límite de diseño en 100,000 usuarios.

Crecer casi no cuesta

$0.04–$0.05 por usuario activo al mes. El cómputo escala solo: API por peticiones, Worker por antigüedad de cola, escalado programado para los picos.

Existir sí cuesta

El costo fijo mensual manda: $77 en piloto, ~$300 con la configuración completa. Activarla antes de tiempo significa pagar $378 al mes por capacidad para 20,000 usuarios cuando solo hay 1,000.

El gasto es una variable

Subir de etapa es cambiar parámetros, no reescribir. Más allá de 100,000 usuarios ya es ingeniería: particionado y fragmentación por care_space, de 2 a 6 meses.

El riesgo de la etapa 1 se asume con los ojos abiertos: una sola zona de disponibilidad, sin failover automático. Es aceptable mientras los usuarios sean de piloto y estén avisados. Deja de serlo el día que alguien paga.

D Daury
