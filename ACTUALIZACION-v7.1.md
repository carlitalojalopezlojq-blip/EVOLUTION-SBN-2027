# EVOLUTION SBN 2027 — v7.1 Rendimiento adaptativo (beta)

Parche incremental sobre v7.0. Instalar tanto el servidor como el APK. No cambia Neon, las tablas, la autenticación, los permisos del fundador, los niveles, la física ni el protocolo de juego. Conserva el intervalo de simulación de 50 ms y el de snapshots de 100 ms. El control táctil, su envío independiente y la predicción de v5.10 se conservan.

## Optimizaciones
- Calidad adaptativa también en 2D: niveles de reducción ante cuadros lentos, recuperación gradual. En 30 FPS y ahorro de batería se reduce el detalle sin alterar la simulación.
- Frutas comunes con sprites precalculados en niveles gráficos reducidos; las especiales mantienen 3D en el nivel intermedio. En el nivel de máxima reducción todas usan sprites. No se eliminan objetos ni se cambian recompensas.
- Reducción adaptativa de sombras 3D, partículas ambientales y ondulación puramente visual de gusanos normales. En 2D, menos capas decorativas a detalle reducido. Conserva los efectos distintivos, el HUD, la insignia y las mascotas.
- Reutilización de patrones de Canvas; caché de geometría de frutas limitada a 8 MiB; diagnóstico con muestras acotadas. No se dibuja la arena cuando la página no es visible o está pausada. Menú a menor frecuencia con ahorro de batería o preset de rendimiento.
- Evita actualizar texto idéntico repetidamente en el HUD, contador de jugadores y ping; no dibuja etiquetas de cabezas fuera del área visible.
- Servidor: cachea el empaquetado de frutas y metadatos de jugadores por snapshot; evita preparar snapshots cuando no hay ningún socket capaz de recibir. Preserva el orden, precisión y contenido de los datos. Reduce cálculo repetido de radio de colisión sin cambiar su resultado.

## Pruebas
`node --test --test-concurrency=4 tests/*test.js`: 38 archivos aprobados. Incluye pruebas deterministas de física, WebSocket simulado, permisos, progresión, sincronización, geometría, calidad adaptativa y equivalencia del empaquetado de frutas. No se compiló el APK ni se midieron FPS en un dispositivo Android. La velocidad de red depende de Render, la región y la conexión. No es una garantía de FPS ni una certificación de carga en producción.

## Aplicación
En Termux, desde el repositorio limpio v7.0, extraer el ZIP y subir los archivos a GitHub. Verificar el despliegue Render 7.1 y el APK 7.1 (versionCode 50). Instalar sobre el APK anterior con la misma firma. No modificar variables de entorno.

## Prueba recomendada en teléfono
Comparar el mismo modo y mapa con la calidad media, 60 FPS, preset equilibrado y diagnóstico activado. Después usar preset rendimiento y comparar. Verificar FPS y ping por separado, giro, turbo, F, mascotas, partículas, contador de práctica, competición y reconexión. Repetir con más de un jugador. Si hay errores, conservar capturas y registros del servidor.
