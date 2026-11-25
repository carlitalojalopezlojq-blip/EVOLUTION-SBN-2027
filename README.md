# EVOLUTION SBN 2027
Versión inicial jugable. Android WebView + Canvas y servidor Node.js WebSocket.
## APK
Sube todos los archivos (incluida .github) a un repositorio GitHub. Actions > Android APK > Run workflow. Descarga el artifact EVOLUTION-SBN-2027-APK, descomprime e instala el APK de depuración.
## Online
En un servidor Node.js 20+: npm install && npm start. Publica el puerto 8080 (o PORT) detrás de un proxy HTTPS con soporte WebSocket. Introduce la URL wss:// pública en cada teléfono. Crea una sala y comparte el código y URL. Límite 100 conexiones por sala; rendimiento no certificado. No usa cuentas ni persistencia. GitHub Actions compila, no aloja partidas.
## Offline
Entrenamiento con 18 bots; también puedes abrir app/src/main/assets/index.html en navegador.
## Pendiente antes de producción
Pruebas Android, carga real con 100 usuarios, interpolación de rivales, seguridad y moderación adicionales, firma de release, publicación y alojamiento. No se incluyen recursos gráficos externos.
