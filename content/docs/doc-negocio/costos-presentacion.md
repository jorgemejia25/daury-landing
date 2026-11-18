---
title: "Costos (presentación)"
description: "Resumen de costos preparado para presentar."
tags: ["finanzas"]
source: "Claude Design · Daury Costos Presentación v2"
---

> Migrado desde: Claude Design · Daury Costos Presentación v2. Conserva el contenido original; las cifras y fechas son las de ese documento.

Daury · infraestructura

# Costo mensual de infraestructura

Cuánto cuesta la nube en cada etapa, de dónde sale ese costo y cuántos usuarios se necesitan para pagarlo.

Precio del plan: $7.99 al mes

Usuarios que pagan: 5 %

Cifras en USD al mes

01 · Cómo se calcula

## Costo mensual = costo fijo + costo por usuario

Costo fijo

Servicios que se contratan con un tamaño definido y se pagan completos, haya o no usuarios.

Base de datos, balanceador de carga, NAT y WAF.

$59 en la etapa piloto

Costo por usuario

Servicios que cobran por uso: por segundo de cómputo, por mensaje o por gigabyte.

Fargate, S3, SQS, EventBridge y salida de datos.

$0.045 por usuario al mes, pague o no

Piloto: **$59** fijos + **$18** por uso = **$77 al mes**

02 · Costo por etapa

## El costo depende de la etapa

Misma arquitectura en las tres etapas. Cambiar de etapa es cambiar la configuración.

Etapa

Usuarios

Costo al mes

Qué incluye

1 · Piloto

hasta 2,000

$77

Una zona, instancia NAT de $4, sin WAF, sin failover automático.

2

hasta 20,000

$350 – $880

Dos zonas, NAT y balanceador gestionados, WAF encendido.

3

hasta 100,000

$880 – $4,350

Réplicas de lectura, más tareas, RDS Proxy, caché dedicada.

Siguiente

150,000 o más

Requiere desarrollo

Particionado y fragmentación por care_space: de 2 a 6 meses de ingeniería.

03 · Ingreso por usuario

## Cada usuario activo aporta $0.40 al mes

Cálculo sobre 100 usuarios: 5 pagan y 95 usan el plan gratuito.

Ingreso: 5 suscripciones × $7.99

$39.95

Costo por uso: 100 usuarios × $0.045

− $4.50

Resultado antes de sueldos y comisiones

$35.45

Ingreso promedio por usuario: $39.95 ÷ 100

$0.40

Los 95 usuarios gratuitos cuestan $4.28 al mes. Lo cubren los $39.95 de los 5 que pagan.

04 · Punto de equilibrio

## Usuarios necesarios para pagar la nube

Usuarios necesarios = costo mensual ÷ $0.40

Etapa 1 · piloto

$77 ÷ $0.40

193

de 2,000 de capacidad

Etapa 2 · costo máximo

$880 ÷ $0.40

2,200

de 20,000 de capacidad

Etapa 3 · costo máximo

$4,350 ÷ $0.40

10,875

de 100,000 de capacidad

En cada etapa, la nube se paga con alrededor del 10 % de los usuarios que esa etapa soporta.

05 · Margen

## Margen sobre la nube según número de usuarios

El margen baja al cambiar de etapa porque el costo fijo sube antes de tener los usuarios. Vuelve a subir al llenarse la etapa.

Usuarios

Ingreso

Costo

Margen

Nota

2,000

$800

$77

90 %

Etapa 1 llena

5,000

$2,000

$425

79 %

Inicio de etapa 2

20,000

$8,000

$880

89 %

Etapa 2 llena

100,000

$40,000

$4,350

89 %

Etapa 3 llena

06 · Cuándo sube el costo

## Cada aumento tiene una condición medida

Se agrega un servicio cuando se cumple su condición.

Segunda zona de disponibilidad

Al tener el primer usuario que paga.

NAT Gateway gestionado

Cuando la instancia NAT del piloto sea punto único de falla en producción.

RDS Proxy · ~$22 al mes

Conexiones activas por encima del 60 % del máximo. El límite de conexiones se alcanza entre 20 y 40 tareas, antes que el de cómputo.

Caché dedicada

Más de cuatro tareas de API.

Réplicas de lectura

Consultas de historial por encima de 200 ms, o p95 de lectura degradado.

Particionado de change_log

La tabla pasa de 50 millones de filas.

07 · Control del gasto

## Cuatro controles sobre el costo variable

Máximo de tareas por servicio

Evita que un error de reintentos en el Worker levante cien tareas.

Alertas de presupuesto

Avisos al 50 %, 80 % y 100 % del gasto previsto del mes.

Etiquetas por componente

Permiten ver cuánto gasta cada servicio en la factura.

Escalado programado

07:00–09:00 y 20:00–22:00 concentran el 45 % del volumen. Se sube capacidad a las 06:45 y 19:45, y se baja a las 09:30 y 22:30.

08 · Resumen

## Resumen

$77

Costo mensual del piloto, hasta 2,000 usuarios.

$0.045

Costo mensual de cada usuario adicional, pague o no.

193

Usuarios activos que cubren el costo del piloto.

100,000

Límite de la arquitectura actual. Más allá se requieren de 2 a 6 meses de ingeniería.

**Riesgo aceptado en etapa 1:** una sola zona de disponibilidad, sin failover automático. Se activa la segunda zona con el primer usuario que paga.
