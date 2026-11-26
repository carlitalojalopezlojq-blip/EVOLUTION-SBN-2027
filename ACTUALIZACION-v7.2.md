# EVOLUTION SBN 2027 · v7.2 — Ruby Origin

Parche sobre v7.1. Solo cambia la presentación del avatar del fundador y la versión del APK. No modifica la base de datos, el servidor, las insignias, niveles, física ni permisos.

- Clip aportado por el creador: 10 s, convertido a 448×448, H.264/AAC, ~1,5 MB; imagen estática de respaldo.
- Reproducción automática una vez al abrir el perfil del fundador, o al consultar su perfil en Universo > Pareja > Popularidad y visitas y en Social > Buscar jugador. Se usa la identidad devuelta por el servidor (no el texto que escribe el visitante).
- Botón ↻ para repetir. Respeta silencio y volumen de efectos; si el reproductor bloquea el audio, intenta reproducir sin sonido. En caso de error permanece la imagen estática.
- Al salir de la vista, al pasar a segundo plano o al terminar el video se libera el recurso de reproducción. No se dibuja en la arena.
- Archivo local dentro del APK; requiere que los visitantes instalen la v7.2. No se requiere desplegar una modificación de servidor.
- Verificado: sintaxis JS, test simulado del ciclo de reproducción, regresión v7.1, decodificación completa del clip. La navegación de Chromium fue bloqueada por el entorno; no se probó en Android real ni con cuentas online reales.
