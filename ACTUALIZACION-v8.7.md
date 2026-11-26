# EVOLUTION SBN 2027 — 8.7 Low Latency

## Cambios
- Simulación del servidor: 20 ticks/s sin cambios de física, colisiones, recompensas ni cuentas. Los clientes 8.7 solicitan la nueva cadencia al entrar o recuperar sesión. Las posiciones se envían normalmente a 10 Hz; se permite 20 Hz si hay hasta cuatro conexiones, el ciclo del servidor está sano y el último paquete no supera 7 KB. Si hay datos pendientes en la cola de WebSocket, se omiten instantáneas obsoletas; los mensajes de control mantienen el comportamiento anterior. Las versiones anteriores mantienen 10 Hz.
- Controles: intervalo y límite de envío de 20 ms, conservando el envío por eventos, el límite de tráfico y el latido de controles. Reconexión inicial después de 350 ms con espera creciente.
- Interpolación de posiciones adaptada a la cadencia observada; la predicción visual usa la mediana de las últimas cinco muestras RTT para reducir saltos, sin modificar la autoridad del servidor.
- Ping: valor real del último eco, sondeo cada 1,5 s aproximadamente si la conexión está libre. Si falta un eco válido por más de 5,5 s, aparece un guion. Verde hasta 60 ms, amarillo hasta 100 ms, naranja hasta 150 ms y rojo por encima.
- Se conserva la interfaz y confirmación Android anteriores y el nombre dorado autenticado de fundador. APK versionCode 61 / 8.7.

## Despliegue y validación
Subir los archivos a la rama que construye el APK y desplegar el mismo commit en Render. El cliente 8.7 puede conectarse al servidor anterior, pero la cadencia adicional requiere el servidor actualizado. La dirección del servidor y el almacenamiento de cuentas no se cambian. Los ensayos `node tests/evolution-v87.test.js` y `node tests/evolution-v87-server.test.js` no necesitan dependencias; el segundo simula conexiones, no una red real. Para una prueba antigua de modos clásicos usar `EVO_LEGACY_MODES=1 node tests/evolution-v41.test.js`.

No se promete un RTT específico: la distancia, red móvil/Wi-Fi y proveedor de alojamiento siguen determinando gran parte de la latencia. La nueva cadencia puede incrementar el tráfico si hay capacidad. Verificar en Android real y medir ping/fluidez antes y después, con el mismo servidor y conexión.
