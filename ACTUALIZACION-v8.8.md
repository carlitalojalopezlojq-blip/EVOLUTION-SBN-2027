# EVOLUTION SBN 2027 · 8.8 — Candidata a lanzamiento

## Cambios
- Conserva todas las correcciones de 8.7 (interfaz, fundador dorado, retroceso y latencia real).
- Renderizado con límite de 60 FPS (incluso en pantallas de 90/120 Hz). Cuando la carga sostenida lo exige, baja automáticamente a 30 y reduce detalles, con recuperación gradual. El ajuste manual de 30 FPS y el ahorro de batería siguen teniendo prioridad. La simulación y los temporizadores de controles no cambian.
- Caché de texturas 2D de uso reciente limitada a 32 entradas; menos capas decorativas en los niveles más exigentes. Conserva geometría y reglas de colisión.
- La pausa oficial de expedición por desconexión de un compañero ya no dispara falsas reconexiones en los demás. Al recuperar la sesión se comunica el estado de pausa.
- `/health`: métricas agregadas y acotadas a las últimas 1200 iteraciones (aprox. 60 segundos en funcionamiento normal): tiempo de procesamiento y separación p95, ticks tardíos, ticks de clientes con cola, pico de clientes y memoria del proceso. Sin nombres, tokens, posiciones ni direcciones IP. Informe cacheado un segundo.
- Versión Android 8.8, código 62; firma y configuración de servidor existentes sin cambios.

## Pruebas ejecutadas
- 45 de 55 scripts de regresión pasaron. Los mismos 10 scripts históricos fallaron en 8.7: v39, v40, v41, v42, v441, v50-server, v50, v510, v56, v58. No se afirma que toda la suite esté en verde; las pruebas antiguas requieren revisión de sus escenarios y contratos.
- Prueba nueva de 16 jugadores (cuatro expediciones de cuatro), 600 ticks acelerados de carga, controles, congestión de un cliente, abandono, pausa y reconexión. Usa el servidor y motor reales con transporte simulado; no mide ping de Internet, carga de PostgreSQL, GPU ni capacidad de Render. El ensayo exploratorio de modos antiguos de diez jugadores no pasó y no se habilitan esos modos.
- Prueba nueva de FPS con tiempos simulados, recuperación, caché, monitor y sintaxis HTML. No es una medición de FPS de un teléfono.
- Las dependencias npm no pudieron descargarse en el entorno de preparación por resolución DNS. No se compiló APK ni se probó un WebSocket real, Render, PostgreSQL o Android. No se publicó nada.

## Antes de lanzar públicamente
1. Aplicar el ZIP a la copia Git existente con `bash aplicar-v88.sh "$HOME/EVOLUTION-SBN-2027"` desde la carpeta descomprimida. El script copia solo los archivos de las correcciones acumuladas, verifica las pruebas recientes, crea commit y hace push; no cambia el remoto ni borra archivos. Requiere Node.js y Git.
2. Confirmar compilación y firma en GitHub Actions; comprobar que Render desplegó 8.8 abriendo `https://evolution-sbn-2027.onrender.com/health`. El servidor conserva la URL original.
3. Instalar APK firmado en varios teléfonos. Probar solo, dúo y escuadra de cuatro, durante al menos 20–30 minutos; incluir Wi-Fi y datos, una desconexión voluntaria y recuperación, varias partidas, jefe, turbo, retroceso, selección de texto, nombre dorado, cuenta y progreso.
4. Revisar FPS y ping reales, estabilidad y `/health` durante las partidas. Investigar si p95 de trabajo se acerca a 50 ms, p95 de separación se aleja de 50 ms, aumentan las colas sostenidamente, sube la memoria de forma continua o se producen desconexiones. No confundir estas métricas con el ping de cada jugador.
5. Resolver fallos relevantes observados y verificar los flujos de cuentas, privacidad, recuperación y firma antes de distribución pública. No se garantiza ausencia absoluta de lag o congelamientos. No se han cambiado límites de expedición ni proveedor de hosting.
