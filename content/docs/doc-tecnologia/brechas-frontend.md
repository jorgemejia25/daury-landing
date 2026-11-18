---
title: "Brechas del frontend"
description: "Lo que falta en el frontend respecto al diseño."
tags: ["frontend"]
source: "daury/docs"
---

> Migrado desde: daury/docs. Conserva el contenido original; las cifras y fechas son las de ese documento.

Comparativa del MVP contra el frontend.

> **Contexto:** El frontend es un prototipo de UI. Todos los datos están
> hardcodeados, no hay estado global, persistencia ni conexión al backend.
> Se evalúa presencia de pantalla/flujo, no si "funciona de verdad".

---

## ✅ UI completa y alcanzable

| # | MVP | Pantalla |
|---|---|---|
| 1 | Vista de actividades del día con progreso | `app/(tabs)/hoy.tsx` — progreso, Ahora, Por hacer, Completadas |
| 2 | Alta de actividad manual (plantilla, hora, frecuencia) | `nueva-actividad` → `plantillas` → `configurar-actividad` |
| 3 | Tutorial de bienvenida (slides) | `onboarding/welcome` → `share` → `ai-reader` → `for-whom` → `customize` |
| 4 | Invitación de miembros (enlace/código) | `app/invitar.tsx` |

---

## ⚠️ Parcial — UI existe, falta funcionalidad

| # | MVP | Archivo | Qué falta |
|---|---|---|---|
| 5 | Modo emergencia (llamadas + ficha) | `app/emergencia.tsx` | Botones de llamada no ejecutan `tel:` |
| 6 | Gestión de miembros y roles | `familia.tsx` | Solo vista; no hay editar/cambiar rol/eliminar |
| 7 | Contactos de emergencia (alta y edición) | `emergencia.tsx`, `perfil.tsx` | Solo display; sin formulario de alta/edición |
| 8 | Lista de medicación activa | `emergencia.tsx` | Read-only, sin alta/edición. Row en perfil apunta a Salud que no tiene lista |
| 9 | Ficha de datos generales y condición | `perfil.tsx`, `emergencia.tsx` | Read-only, sin edición |
| 10 | Compartir historial con doctor (PDF) | `perfil.tsx`, `salud.tsx` | Bloqueado como "Daury Plus". Botón "Generar informe" sin `onPress` |
| 11 | Alerta automática por anomalías IA | `salud.tsx` (tab Patrones) | Disparo manual mock; no hay alertas automáticas |
| 12 | Registro de ánimo | `registro-animo.tsx` | Pantalla existe pero **es inalcanzable** — nadie navega a `/registro-animo` |
| 13 | Registro de incidentes | `registro-animo.tsx` | Solo toggle sí/no; sin detalle (tipo, descripción). Además inalcanzable |
| 14 | Adherencia semanal día-semana-mes | `salud.tsx` | Semana + barras por día ✅. Tab "Meses" es placeholder "Disponible próximamente" |
| 15 | Alta por IA (foto receta, confirmación) | `receta-ia.tsx` | Viewfinder falso (sin `expo-camera`). Falta lectura real y pantalla de confirmación |
| 16 | Auth: login y registro | `index.tsx`, `auth/email-login.tsx`, `auth/mail-signup.tsx` | Mocks (SecureStore con usuario falso). Sin verificación real. "Cerrar sesión" sin `onPress` |
| 17 | Recuperación de credenciales | `auth/email-login.tsx` | Solo un `Alert`; sin flujo de reset real |
| 18 | Captura de nombres en tutorial | `onboarding/for-whom.tsx` | Campo "Tu nombre" no es editable (no es `TextInput`) |
| 19 | Config. accesibilidad inicial (voz/texto) | `onboarding/customize.tsx` | Toggles visuales; no persisten ni modifican comportamiento |
| 20 | Reiniciar tutorial desde ajustes | `ajustes.tsx` | Row "Ver tutorial de nuevo" sin `onPress` |

---

## ❌ No implementado

| # | MVP | Evidencia |
|---|---|---|
| 21 | Recordatorios activos por actividad | `expo-notifications` no está en dependencias; no hay scheduling de notificaciones |
| 22 | Guardado local + sincronización al reconectar | Sin AsyncStorage, SQLite, MMKV ni NetInfo; nada persiste |
| 23 | Registro de observaciones de actividades | No existe ningún campo de notas/observaciones en la app |

---

## Resumen

| Estado | Cantidad |
|---|---|
| ✅ Completo | 4 |
| ⚠️ Parcial | 16 |
| ❌ Ausente | 3 |
| **Total MVP** | **23** |

## Brechas prioritarias

1. **Recordatorios** — instalar `expo-notifications` e implementar scheduling.
2. **Offline / sync** — capa de persistencia local con cola de sincronización.
3. **Observaciones** — campo de notas al completar/registrar actividades.
4. **Acciones reales** — llamadas (`Linking.openURL('tel:…')`), copiar enlace, cerrar sesión, reiniciar tutorial.
5. **Navegación rota** — conectar `registro-animo` desde Hoy y desde el fin de `realizar-actividad`.
6. **Edición de datos** — formularios para medicación, contactos de emergencia, ficha médica.
