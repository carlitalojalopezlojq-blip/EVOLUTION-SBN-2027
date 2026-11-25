# EVOLUTION SBN 2027 · v1.2
Parche para el repositorio existente. No contiene la foto personal ni altera el archivo JPG ya instalado. Conserva el workflow de compilación actual.

Desde Termux, dentro de ~/EVOLUTION-SBN-2027:
```
unzip -o ~/storage/downloads/EVOLUTION-SBN-2027-v1.2.zip
bash aplicar-v12.sh
git status --short
git add app server.js aplicar-v12.sh ACTUALIZACION-v1.2.md
git commit -m "SBN v1.2 fruits king music and smoother rendering"
git push origin main
```
El rey aparece cada 6000 ticks (5 min a 20 ticks/s), dura 1200 ticks (1 min), persigue al gusano más cercano y mata al contacto. La cuenta comienza con cada partida offline o con la creación de cada sala online. La música instrumental original se guarda localmente y puede silenciarse.

Para jugar online, hay que actualizar y reiniciar el servidor Node.js que usa este mismo repositorio. GitHub Actions no aloja el servidor. Se necesita una URL wss:// válida. El APK es de depuración; si Android rechaza una actualización por firma, se debe usar la misma clave de firma o desinstalar la versión anterior (se pierden los datos locales).

Pruebas ejecutadas: sintaxis de JS, XML bien formado, frutas, crecimiento, aparición y desaparición del rey, colisión con el rey y simulación de 100 agentes durante 400 ticks. No se han ejecutado pruebas de APK, WebView en móvil ni de red con 100 usuarios. El entorno de navegador de pruebas bloqueó la navegación local.
