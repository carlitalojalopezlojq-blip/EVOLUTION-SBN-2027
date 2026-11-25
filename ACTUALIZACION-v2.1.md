# EVOLUTION SBN 2027 v2.1 — Supervivencia y espectador
Parche incremental sobre v2.0 (commit de firma 1a4b0aa). No contiene workflows ni claves de firma, ni cambia el identificador de Android. El versionCode pasa a 12.

- Reyes: velocidad normal 6.1 (ancestral 6.5), fuego con ráfagas breves de 8.5; jugador 7 y turbo 12. Giros del rey más amplios, persecución a menos de 460 unidades, aparición preferentemente lejos de los jugadores y 3 segundos sin daño de contacto ni habilidades del rey recién aparecido. Habilidades de hielo y electricidad reducidas. El turbo funciona incluso con masa inicial y consume energía.
- Derrota: registra la causa de eliminación y el identificador de la vida del atacante. El botón de espectador sigue al atacante vivo sin controlar su personaje; si desaparece o muere, vuelve a las opciones. Resucitar conserva la arena en los modos permitidos. En duelo y Battle Royale finalizados no se ofrece espectador en directo.
- El servidor incorpora el protocolo de espectador, sin habilitar ni alojar el multijugador. Se requiere actualizar el servidor para usar esta función online.
- Pruebas: node tests/evolution-v18.test.js, node tests/evolution-v19.test.js, node tests/evolution-v21.test.js; comprobación de sintaxis y recorrido offline en Chromium con derrota simulada. Pendiente prueba APK en Android y prueba online real.
