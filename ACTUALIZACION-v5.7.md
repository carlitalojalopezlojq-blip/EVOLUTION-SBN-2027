# EVOLUTION SBN 2027 · 5.7 Founder Edition
Parche incremental sobre 5.6. Actualizar servidor y APK. No cambiar credenciales de Render ni datos de Neon. El servidor ejecuta una migración aditiva e idempotente: `badge_verified57 boolean NOT NULL DEFAULT false`. La verificación de correo (`verified52`) es independiente. La F se deriva exclusivamente de la identidad de fundador preexistente (nombre y UUID), nunca de los datos enviados por el cliente.

- F Dios del Origen: corona, oro y púrpura, halo animado y versión legible en partida. V dorada únicamente para jugadores autorizados.
- Perfil > Panel del fundador: buscar por usuario o ID, otorgar o retirar la V con confirmación, consultar lista paginada (Actualizar lista tras cambios). El servidor valida la sesión y la identidad para cada solicitud; no permite cambiar la F.
- Perfil, cabecera, anuncio de llegada, feed, ranking de masa y búsqueda de jugadores muestran las insignias. Las salas activas del mismo proceso reciben las modificaciones de inmediato; el perfil se refresca al abrirlo o iniciar sesión. No se cambian las reglas de entrenamiento ni la animación lateral de llegada de 5.6.
- Las cuentas existentes empiezan sin V hasta aprobación explícita, con excepción del fundador que conserva su F. El avatar exclusivo no se modifica.
- Pruebas Node: v5.3, v5.5, v5.6 y v5.7 con SQL/WebSockets simulados; comprobación sintáctica de scripts. Pendiente prueba real en Render/Neon y APK Android. No se modifica ni incluye ninguna clave privada.
