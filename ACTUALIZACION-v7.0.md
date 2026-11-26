# EVOLUTION SBN 2027 — 7.0 Universo del Origen (beta)

Parche incremental sobre 6.0. Conserva la cuenta de fundador, el nivel 100, la F y los permisos de verificación. No modifica el motor de giro ni el joystick. No incluye contraseñas ni configuraciones de Render.

## Disponible
- Menú Universo: colección, pareja, clanes, chat, pase, eventos y fama.
- Catálogo de 20 objetos cosméticos (mascotas, marcos, avatares, temas de lobby, rastros, skins y celebraciones). Compra y regalo a amigos con monedas, equipamiento persistente, rareza y permisos Origen validados en servidor. Las mascotas son figuras 2D animadas, sin ventajas competitivas. Los skins de fundador son colores/efectos sobre el gusano existente, no modelos nuevos.
- Parejas: solicitud y aceptación entre amigos, vínculo único, ruptura, corazones diarios y visitas a perfiles. Clanes abiertos con líder, salida y ranking por victorias. Chat global y privado por consulta, bloqueo existente, reportes manuales y límite de envío. No es un chat en tiempo real con notificaciones push.
- Pase mensual de cuatro etapas por partidas online de al menos 30 segundos, reclamo único. Códigos de recompensa creados por el fundador, eventos con fechas y descripción, salón del fundador. Los eventos son publicaciones programadas, no activan automáticamente reglas especiales de partida.
- La partida rápida tiene en cuenta la arena elegida. En supervivencia e invasión con arena distinta de Neón activa el mundo avanzado existente (huevos, cofres, portales, peligros, jefes y clima); Neón conserva el modo anterior. Los otros modos conservan sus reglas. Esto puede fragmentar la búsqueda de rivales por arena. Los poderes de fuego, rayo, naturaleza y oscuridad se suman a la congelación existente en los mundos con habilidades. No modifica torneos de reglas fijas.

## Pendiente
Modelos 3D únicos, nuevos terrenos independientes (se reutilizan las arenas existentes), crecimiento de mascotas, trono 3D, efectos avanzados y sonidos/vibración nuevos, matrimonio con ceremonia/anillos, álbum, rivalidades persistentes, guerra de clanes, reglas de eventos automáticos, espectadores de partidas ajenas, repeticiones online, selector de regiones, descarga de recursos, buzón completo, recompensas de pareja, antitrampas avanzado y revisión de moderación/privacidad antes de apertura pública. Las mascotas usan un dibujo básico compartido con colores diferentes y los avatares de hidra y fénix son SVG originales. No se ha modificado la F.

## Pruebas y despliegue
37 archivos de pruebas Node ejecutados sin error, incluyendo nuevas pruebas de autorización, catálogo, compra, pareja, chat bloqueado y pase con adaptador SQL simulado. La prueba de navegador quedó bloqueada por la política del entorno; no se ha compilado APK ni probado PostgreSQL/Render reales. Haz una copia de seguridad de Neon antes de desplegar: la inicialización crea tablas y añade dos columnas sin borrar datos. Instala sobre v6.0 con la misma firma. Revisa el estado de Render y GitHub Actions; prueba con dos cuentas antes de abrir al público. No compartas claves en capturas.
