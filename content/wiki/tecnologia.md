## Una wiki compartida

Daury Wiki utiliza Next.js, React y TypeScript. UI SDK aporta los comportamientos de formularios, selectores y diálogos. El diseño conserva las fuentes, colores y componentes de Daury.

## Dónde vive la información

Los artículos, carpetas, tableros, tareas, calendarios y eventos se guardan en Cloud Firestore. Los archivos Markdown y JSON originales se conservan en el repositorio como referencia de la migración.

El contenido de los artículos se separa de sus datos de navegación para consultar las carpetas sin descargar todos los textos.

## Acceso y guardados

El acceso requiere Google y una de las seis cuentas autorizadas. Las páginas, las acciones del servidor y las reglas de Firebase comprueban los permisos.

Las mutaciones pasan por Server Actions y se guardan con transacciones. El control de versiones evita que dos personas sobrescriban cambios del mismo elemento sin advertencia.

Cada registro conserva su creador, fecha de creación y última edición. Los cambios se reflejan en las otras sesiones mediante suscripciones en tiempo real.

## Organización del proyecto

- `src/app/wiki/`: rutas de la wiki.
- `src/features/wiki/`: funciones, acciones, validación y componentes del producto.
- `src/ui/`: componentes y tokens del sistema de diseño compartido.
- `firestore.rules`: permisos y validación de la base.
- `tests/`: pruebas de reglas y guardados contra el emulador.

[Consultar la guía de edición](/wiki/guia)
