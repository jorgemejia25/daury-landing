---
title: "Transcripción de la sesión financiera"
description: "Transcripción de la sesión de finanzas del programa ILAN."
tags: ["finanzas", "ilan"]
source: "ILAN · Financiero/transcripción.txt"
---

> Migrado desde: ILAN · Financiero/transcripción.txt. Conserva el contenido original; las cifras y fechas son las de ese documento.

Hola mucha, ¿cómo están? Perdón que les mande un vídeo pero se me hacía más fácil explicarles así porque son muchas cosas las que hay que ver. Este es el costo mensual de infraestructura tomando en cuenta un precio de plan de $7.99 dólares al mes sólo tomándolo como ingreso del modelo freemium de la aplicación. Tomando en cuenta que un 5% de usuarios van a pagar el 95% de usar el plan gratuito. 

Es bastante rentable de hecho. Aquí está el costo mensual de la app, ¿cómo se manejaría? Tenemos un costo fijo y un costo por usuario. Esto quiere decir que el costo fijo no es auto trasladable, mientras que el costo por usuario sí. 

Dentro del costo fijo tenemos que servicios que se contratan por un tamaño definido y se pagan completos, haya o no hay usuarios. Mientras que en el costo por usuario tenemos servicios que cobran por uso, por segundo de cómputo, por mensaje o por gigabyte, como el Fargate, S3, SQS, Heavenreach y salida de datos. En cambio el costo fijo tenemos base de datos, balanceador de carga, NAT y WAF que son las cosas de red. 

La base de datos es un poco, medio costo fijo y medio costo por usuario, es un poco híbrida porque de aquí a los 2.000 usuarios vamos a ver una tier de base de datos, de los 2.000 a 10.000 otra tier, y de los 10.000 a 100.000 otra tier, entonces es como escalable a medias. Y acá tenemos un costo estimado a $59 dólares pero ahorita les voy a explicar. Como les mencioné el costo depende mucho de la etapa, ¿por qué? Tenemos una etapa llamada piloto en la cual consideramos tener hasta 2.000 usuarios, esto incluye 77 dólares de costos al mes, que pueden ir variando, tiene una zona que es una instancia de NAT de 4 dólares, sin WAF y sin failover automático. 

Luego en la segunda etapa que es llegando de 2.000 hasta 20.000 usuarios, tenemos un costo que va de entre 350 a 880 dólares mensuales, que son dos zonas NAT y balanceador gestionados y WAF encendido. Luego yendo hasta 100.000 usuarios, que esto ya es un poco más caro, empezamos desde los 880 dólares anterior y vamos subiendo hasta 4.350, con réplicas de lectura, más tareas, RDS proxy, caché dedicado, y luego ya en siguiente que son 150.000 o más. Esto es muy complicado y no es suficiente la cantidad de personas que somos, entonces queda un poquito descartado. 

La app está pensada hasta 100.000 usuarios por ahora. Acá está lo que les mencioné, cada usuario activo aporta 0.40 dólares al mes, ¿por qué? De 100 usuarios, 5 paran y 95 usan el plan gratuito, entonces nuestros ingresos serían 39.95 dólares. Nuestro costo por 100 usuarios sería, cada uno nos equivale a 0.045 dólares, tomando en cuenta de cierta forma el autoscaling y demás.

Entonces 100 por 0.045 tenemos en cuenta que mantener los 100 usuarios son 4.50 dólares. Luego ante sueldos y comisiones, que esto es algo que se incluyó acá, pero yo creo que acá ninguno de nosotros va a pagar. Para pagar la nube en la etapa 1 necesitamos 193 de 2.000 usuarios. 

Para la etapa 2 necesitamos 2.200 de 20.000 usuarios. Y luego en la etapa 3 necesitamos 10.875 usuarios que paran de 100.000. Acá está el ingreso, el costo, el margen. La etapa 1 es bastante ganancia, la etapa 2 es un poquito más complicada, pero si se dan cuenta solo necesitamos que pocos usuarios paran para que la app se sostenga. 

Esto es algo que nos da bastante ventaja. Acá están los servicios. Máximo de 4 tareas por servicio. 

Esto es para recomendaciones para nuestro sistema. El escalado, cómo se realiza, que es programado, no se hace así automáticamente porque si no nos jode. Y acá un resumen, básicamente.
