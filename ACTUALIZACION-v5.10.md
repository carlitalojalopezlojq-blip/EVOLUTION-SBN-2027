# EVOLUTION SBN 2027 v5.10 — Control directo

Parche incremental sobre v5.9. No modifica cuentas, credenciales, insignias, base de datos, velocidad base, turbo ni límites de giro.

- El servidor conserva la última entrada válida aunque dos mensajes lleguen en el mismo milisegundo. Sigue vigente el límite general de 80 mensajes/s por conexión.
- El cliente envía como máximo una entrada normal cada 25 ms, reintenta la más reciente independientemente de los FPS y mantiene el último ángulo al pasar por la zona neutra del joystick.
- El joystick conserva su captura y dirección durante la transición entre práctica y competición; la simulación conserva la dirección solicitada. El turbo de práctica caduca si deja de recibir entradas.
- La predicción del jugador propio integra el movimiento de forma continua y reconcilia con el servidor sin rehacer el último giro sobre instantáneas antiguas. Se mantiene el límite visual de 85 unidades y la corrección fuerte ante cambios de vida o desvíos grandes. Los demás jugadores conservan su interpolación.
- Se conserva el servidor como autoridad de colisiones, masa, velocidad y premios.

Pruebas: ejecutar `node tests/evolution-v510.test.js` y los demás `tests/evolution-v*.test.js`. Las pruebas son simuladas; falta validar en el APK y con la latencia real. Comparar entrenamiento offline y online con giros de 90°, 180° y turbo simultáneo.
