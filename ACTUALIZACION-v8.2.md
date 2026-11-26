# v8.2 — Amigos y equipo
Aplicar sobre v8.1. Actualizar servidor y APK. No requiere tablas nuevas: utiliza evo44_friends, evo44_invites, evo52_requests y evo52_blocks.
- Social: lista de amistades mutuas, búsqueda exacta por nombre o ID, solicitudes de amistad, aceptar/rechazar.
- Presencia aproximada: consulta cada 15 s con app visible; desconectado después de 45 s sin actividad social (salvo conexiones reales a salas). Estados: conectado, en sala, en partida, desconectado.
- Botón Invitar amigos en sala de expedición. Invitación de cinco minutos, validación servidor de amistad mutua, bloqueos, capacidad y sala activa. Aceptar entra al código de sala; se mantienen Listo e inicio del líder. No reserva plaza; puede llenarse entre aceptación y conexión.
- Aviso dentro del juego con nombre e insignia real F/V. Las solicitudes de amistad quedan en Neon; no hay notificaciones del sistema con APK cerrado. La presencia es local a la instancia Render y se reconstruye tras reinicio.
- Pruebas locales con SQL simulado y pruebas anteriores de expedición, fundador y comunidad. No verificado en Android, Neon ni Render reales.
