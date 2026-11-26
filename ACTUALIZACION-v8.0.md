# EVOLUTION SBN 2027 · 8.0 Evolución prohibida (beta)
Base: parche v7.4. Se conserva el avatar Ruby Origin, autenticación, controles y los diez mundos.

- Roles seleccionables antes de entrar (atacante, defensor, sanador, especialista); el servidor valida y aplica sus efectos. Modo pesadilla: +60% HP. Partidas rápidas separadas por dificultad; en salas con código manda la dificultad de la sala.
- Reyes con tres fases (60% y 20% HP), velocidad, área, daño y frecuencia crecientes. Los ataques muestran la zona de peligro. El jugador gana hasta +15% daño por dominar transformaciones de reyes (5% por cada 5 formas de mundo, se aplica al reconectar).
- Portal secreto: 10% al terminar el mundo 10 con todos registrados. Némesis tiene su propia transformación. Se mantiene el plazo de 3 min y reintento de 2 min.
- Seis grados de huevos por mundo: 1–3 dorado, 4–5 diamante, 6–7 mítico, 8–9 divino, 10 apocalíptico, 11 desconocido. Probabilidades 70/23/5/1.8/0.2% para el dorado; cada grado reduce el primer premio 4 puntos, aumenta los siguientes 2/1/0.75/0.25 puntos. En el último: 50/33/10/5.55/1.45%. Sin compras de huevos. Un huevo por rey, elegibilidad según contribución. Los duplicados siguen premiando XP.
- Cinco fusiones permanentes, con propiedad de ambas formas comprobada mediante un UPDATE atómico. No se consumen las formas base. Inventario existente para equipar. Bestiario y títulos consultables en Modos, no son títulos equipables todavía.
- Rescate cercano con 45 de energía, recupera 55% de la masa anterior (mínimo 24). Sigue disponible el mecanismo de reaparición anterior. Cofre oculto una vez por mundo, clima visual ligero (desactivado en calidad baja y ahorro de batería).
- Récord individual de tiempo simulado de expedición, no ranking de equipos ni tiempo real de pared. Evento del fundador: activa durante 1 h un Guardián Rubí en el mundo 1 de nuevas expediciones. Se desactiva al reiniciar Render. Recurso visual construido con el motor existente, no un modelo 3D nuevo.

Migración: se añade duration80 a evo73_awards automáticamente. Respaldar Neon antes de desplegar. Requiere cliente y servidor actualizados. Premios pendientes en memoria no sobreviven a un reinicio antes de ser escritos.

Pruebas: 36/43 archivos pasan; los mismos 7 archivos fallan también en la reconstrucción de v7.4 (prueban modos anteriores desactivados). Prueba nueva v80, v74 servidor, v74 y v73 pasan. No se ha probado APK real ni Neon real.

Pendiente: guardado persistente de expediciones para retomarlas otro día, intercambio bilateral seguro, eventos de 10 jugadores, variantes brillantes específicas, ranking de escuadras, títulos equipables en lobby/perfil y cinemáticas nuevas de cada rey. Los modelos nuevos siguen pendientes. No se promete eliminación de todos los fallos.
