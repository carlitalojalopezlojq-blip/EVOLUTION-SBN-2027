# v8.1 — Identidad del fundador
Parche sobre v8.0. No modifica tablas, niveles, física ni el avatar Ruby Origin.
- Insignias del servidor en lista de sala, chat de sala, chat global/privado, lista de jugadores, amigos e invitaciones, solicitudes, bloqueos, parejas, visitas, líder de clan, voz y clasificaciones de temporada/torneo/expedición.
- En entrenamiento, nombre e insignia de la cuenta iniciada (solo presentación local), ranking y repetición. No se deduce la F de un nombre editable ni de una partida guardada.
- Se reutiliza el SVG y la animación existentes, con texto insertado como nodos, no HTML. La V sigue dependiendo del permiso del servidor. Los mensajes de sala de miembros que ya salieron conservan la insignia al enviarse; el chat persistente consulta la insignia vigente.
- Se requiere actualizar servidor y APK. Sin dependencias nuevas ni migraciones. Pruebas locales de identidad y chat con SQL simulado; no se probó Android ni Neon reales. En una sesión sin cuenta cargada no se muestra una F offline.
