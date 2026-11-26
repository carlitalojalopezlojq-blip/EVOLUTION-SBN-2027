# v5.6 Founder Edition
Parche incremental sobre v5.5. No modifica autenticación, PostgreSQL ni secretos.
- Partida pública Duelo/Battle Royale/Equipos: práctica con movimiento y reaparición, sin recompensas ni reducción de zona; competición comienza con dos jugadores conectados, reiniciando la arena. Las salas privadas y torneos conservan las reglas de anfitrión y sus requisitos.
- HUD: contador de conexiones, botón Menú visible y aviso de desconexión/recuperación. No se garantiza que desaparezcan otros bloqueos del dispositivo.
- Anuncio original: entrada por derecha, pausa y salida por izquierda (4,3 s), sin capturar toques; animación reducida según preferencias de accesibilidad.
- Avatar vectorial El Progenitor, visible sólo cuando el perfil devuelto por servidor indica fundador. No es una recompensa ni un artículo de tienda. El archivo gráfico del APK puede ser extraído como cualquier recurso cliente.
- Pruebas: `node tests/evolution-v56.test.js` (WebSockets simulados); `node tests/evolution-v50-server.test.js`; `node tests/evolution-v55.test.js`. No prueba en dispositivo ni en Render real.
