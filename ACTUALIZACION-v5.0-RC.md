# EVOLUTION SBN 2027 · 5.0 RC1

Candidata de lanzamiento: no es una certificación de estabilidad ni una publicación en Google Play. Compatible con v4.4 con diagnóstico Neon y v4.4.1. No cambia el identificador de Android, la configuración de firma, el servidor oficial ni los audios y texturas.

## Torneos privados
Desde el panel online, inicia sesión, pulsa Crear torneo, comparte el código y reúnete con 2–9 amigos con cuentas distintas. Marca Listo en cada invitado. Battle Royale, sin bots, reyes ni poderes especiales, sin resurrección. El anfitrión no puede alterar las reglas. El vencedor conectado recibe 500 monedas y 250 XP cuando se completan al menos 30 segundos de simulación y todos los demás participantes han sido eliminados por la simulación (abandonar sin morir invalida el premio). Un premio máximo por cuenta por día UTC. El ranking mensual de torneos cuenta premios confirmados, no todas las victorias. No hay apuestas ni premios de dinero real. No hay aún llaves de eliminación, matchmaking global de torneos ni premios por segundo/tercer lugar.

## Rendimiento y seguridad
Empaquetado de tramos en una sola pasada, reutilización de marcadores y lista de jugadores por envío, pantalla final limitada a 2 avisos/segundo y fondo de menú detenido en sala de espera. Perfil Rendimiento limita la densidad del lienzo principal a 1.15 (ligera pérdida de nitidez posible); otros perfiles mantienen su resolución. No se limita la longitud del gusano ni se cambia la simulación offline. Se limitan conexiones y operaciones simultáneas de cuenta, se validan los mensajes y se desactiva turbo obsoleto. El servidor decide colisiones y premios; SQL evita duplicados por ronda y por día. No evita toda forma de colusión, cuentas alternativas, bots externos o ataques de red.

## Validación antes de distribuir
1. Render: 5.0-rc1, ok:true, cloud:true; revisar logs sin publicar secretos. GitHub Actions: compilación verde. Instalar encima de 4.4/4.4.1, sin desinstalar.
2. Comprobar registro e inicio de sesión, saldo y piel antes y después de cerrar la app en dos teléfonos. Nunca incluir DATABASE_URL en el APK.
3. Tres cuentas distintas: crear torneo, unirse, iniciar, completar ronda válida, comprobar premio en perfil, ranking, repetir y comprobar que no se duplica. Probar desconexión y abandono.
4. Probar salas normales, modo offline, reyes/titanes y audio. Medir FPS y ping durante 30 minutos con 2, 5 y, si es estable, 10 jugadores. No asumir 60 FPS constantes. El plan gratuito puede suspenderse e interrumpir partidas.
5. Revisar seguridad, privacidad, reglas de chat, política de datos, requisitos vigentes de la tienda y pruebas en dispositivos antes del lanzamiento público. Conservar respaldo de la firma y base de datos. Las operaciones SQL nuevas se probaron con adaptadores simulados; la base real y Android requieren validación. Los premios pendientes en memoria pueden perderse si Render se reinicia antes de confirmar la escritura.
