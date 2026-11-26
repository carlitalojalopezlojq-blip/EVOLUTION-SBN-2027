# EVOLUTION SBN 2027 · v3.3 — Acabado 3D

Parche incremental sobre v3.2. Mantiene las reglas, datos locales, identidad Android y workflow de firma. No activa ningún servidor.

- Mapa procedural de 512×512 (albedo, relieve y rugosidad), iluminación y detalle de escamas/suelos en GLSL ES. No incluye imágenes fotográficas externas.
- Introducción de 6,5 segundos con tres tomas y desplazamiento, acercamiento y retirada de los modelos. Los eventos pueden mostrar un retrato 3D no interactivo a 10 FPS si WebGL está activo y la calidad no es baja. Ajuste de cinemáticas reducidas; se respeta la preferencia de movimiento reducido para el retrato y las tomas nuevas.
- Galería 3D: pedestales, placas, asas continuas, detalle de copas, selección de trofeo y acercamiento, giro táctil, datos de progreso. Respaldo 2D si WebGL no está disponible.
- Código Android 20, nombre 3.3.

## Verificación

Nueve pruebas Node superadas; compilación/enlace GLSL y dibujo de escena y galería con Mesa OpenGL ES 2.0 sin errores. Prueba de navegador de introducción, entrenamiento y avisos sin errores JavaScript con respaldo 2D. El navegador de prueba no habilitó WebGL. Falta comprobar la integración WebGL, audio, fluidez y APK firmado en Android. El fotorrealismo completo y las cinemáticas con producción audiovisual avanzada no se han alcanzado.

## Archivos modificados

app/build.gradle, index.html, render3d.js, material33.js, cinema32.js, cinema33.js, tests/evolution-v33.test.js y este documento. No se incluye `.github`, ni claves de firma.
