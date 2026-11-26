# v5.8 — Mutaciones y controles

Aplicar sobre v5.7. Actualiza tanto el servidor como el APK; no modifica Neon, las cuentas, la firma ni las claves.

- Modos: selector de mutación para la próxima partida, también accesible en Leyendas. Las seis mutaciones básicas quedan disponibles por igual para todos en partidas normales; el ADN descubierto sigue registrado en la colección. Los torneos oficiales mantienen reglas fijas sin mutaciones iniciales.
- El servidor acepta únicamente las seis mutaciones válidas, aplica el poder al entrar, reaparecer y comenzar la competición tras la práctica, y lo incluye en el estado enviado a los clientes. Las salas avanzadas conservan sus mecanismos de recompensas y cristales.
- Cibernética y Cósmica funcionan también en salas básicas. Demoníaca y Cristalina se aplican al aparecer. Radiactiva resiste fruta venenosa; Radiactiva y Prehistórica resisten la nube venenosa en salas básicas. Prehistórica no evita el límite del mapa ni la zona de eliminación de Battle Royale. Cristalina salva una colisión, no el límite del mapa.
- El control envía cambios con un intervalo mínimo de 24 ms (antes 40). Se activa la predicción visual acotada del propio gusano y el seguimiento de cámara es más rápido. Se mantiene la velocidad y el giro de la simulación original y el servidor decide colisiones, masa y resultados. La conexión real sigue influyendo en la latencia.
- Se conserva la F exclusiva, el panel de verificaciones y el anuncio lateral.

Validación: pruebas Node con WebSockets y SQL simulados, sin prueba física del APK ni conexión real a Render. Probar en celular el joystick en entrenamiento y online con otro jugador, las seis mutaciones y la transición práctica/competición.
