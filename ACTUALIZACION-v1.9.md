# EVOLUTION SBN 2027 v1.9 — Renacimiento
Parche acumulativo sobre el repositorio original. Mantiene 54 frutas, 7 reyes, 6 arenas, 5 modos y el motor 2D.

## Derrota
La pantalla de derrota permanece sobre la arena. En supervivencia, equipos e invasión, RESUCITAR crea un gusano de masa 24 en la misma arena, con 100 ticks (5 s) de protección frente a colisiones. Duelo y Battle Royale no permiten resurrección competitiva; el entrenamiento ofrece nueva partida. MENÚ PRINCIPAL abandona la sala. La puntuación local se registra una vez por vida. El servidor decide si puede resucitar.

## Cuenta online
En PERFIL se puede registrar e iniciar sesión (usuario 3–20 letras ASCII minúsculas, números o _, contraseña 8–128 caracteres). El servidor almacena hashes scrypt con sal y tokens con caducidad, nunca contraseñas en texto claro. Ranking calculado con las masas de partidas online observadas por el servidor; no se importa la masa offline como puntuación competitiva. Amigos mediante nombre de usuario; se invita desde el botón en una partida activa y el destinatario consulta las invitaciones en PERFIL. Las invitaciones caducan en 5 minutos. Datos en un archivo JSON del servidor (prototipo de una sola instancia, no una solución de producción auditada). No hay recuperación de contraseña, verificación de identidad ni moderación todavía.

## Despliegue (separado del APK)
El repositorio ya tiene package.json con dependencia ws. El Dockerfile proporciona una forma de ejecutar Node 22, puerto 8080 y volumen /data. En un proveedor de alojamiento de tu elección, configura HTTPS/WSS válido y almacenamiento persistente en /data; no publiques el archivo accounts.json ni tokens. También puedes ejecutar npm install y npm start en un servidor Node, con EVO_DATA_FILE apuntando a almacenamiento persistente fuera del repositorio. Configura URL pública wss:// en app/src/main/assets/server-config.js antes de recompilar, o introdúcela en Jugar online > Servidor / conexión. La dirección no se inventa y queda vacía de forma predeterminada. APK y servidor deben actualizarse juntos. No se creó ni contrató ningún servidor.

## Controles básicos contra trampas
El motor del servidor calcula colisiones, masa, energía, reaparición y ranking. Se valida la dirección del movimiento, se limitan mensajes y solicitudes de cuenta. No es un antitrampas completo. El rugido sintetizado y los latidos con panorama estéreo dependen del soporte Web Audio del dispositivo.

## Pruebas
node tests/evolution-v18.test.js
node tests/evolution-v19.test.js
Sintaxis del cliente y del servidor validada. Prueba de escritorio: muerte, resucitar en la misma instancia de mundo, salir al menú y nueva partida en duelo. El módulo de cuentas fue probado con un archivo temporal. Falta ejecutar servidor WebSocket con clientes reales (ws no instalado en el entorno de prueba), probar APK en Android, alojamiento, persistencia real, capacidad para 100 jugadores, auditoría de seguridad. Torneos con llaves y gráficos 3D fotorrealistas siguen pendientes; no se simula que ya existen.
