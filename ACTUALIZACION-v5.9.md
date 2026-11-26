# EVOLUTION SBN 2027 v5.9 — Controles de precisión

Parche incremental para v5.8. Actualizar servidor y APK juntos. No hay cambios en autenticación, PostgreSQL, datos de usuario, insignias, mutaciones ni recursos de firma.

- Motor compartido: giro máximo por tick de 50 ms de 0,55 rad para masa 24, descendiendo a 0,35 rad a partir de masa 324. Antes: 0,25 a 0,18 rad. Los reyes conservan su giro de 0,095 rad. El avance y consumo de turbo no cambian. El cambio de trayectoria puede alterar las colisiones de forma natural.
- Predicción visual: misma fórmula angular que el servidor, respuesta angular al nuevo objetivo cada fotograma, reconciliación posicional más rápida, reinicio al cambiar de vida o perder frescura de datos. El servidor sigue siendo la autoridad de posiciones, colisiones y recompensas. No elimina la latencia física de Internet.
- Entrada: reintento de envío en fotogramas activos, límite de 20 ms entre envíos ordinarios, mantenimiento de protección de búfer y límite de mensajes del servidor.
- Cámara: suavizado independiente de FPS (20 ms de constante de tiempo con predicción online, 45 ms en otros casos).
- Pruebas: 34 archivos de pruebas Node ejecutados individualmente sin fallos, incluido v5.9. El test histórico v3.9 selecciona explícitamente el giro legado para comprobar la equivalencia histórica; las pruebas v5.9 ejercitan el giro nuevo.
- Pendiente: prueba física en Android y partida en el servidor Render real. Los 300 ms de giro de 180 grados para masa inicial corresponden a 6 ticks de simulación (sin contar red ni procesamiento de pantalla).

## Instalar en Termux

Desde el repositorio limpio v5.8:

```sh
cd ~/EVOLUTION-SBN-2027 && git status
unzip -o ~/storage/downloads/EVOLUTION-v5.9-parche.zip
node tests/evolution-v59.test.js
git add server.js app/build.gradle app/src/main/assets/engine.js app/src/main/assets/online41.js app/src/main/assets/index.html tests/evolution-v39.test.js tests/evolution-v59.test.js ACTUALIZACION-v5.9.md
git commit -m "v5.9 Controles de precision"
git push origin main
```

Comprobar Render Live y GitHub Actions en verde, descargar e instalar el APK sin desinstalar el anterior. La raíz del servidor debe mostrar `5.9-responsive-controls`. Probar giro de 90/180 grados, cambios rápidos, turbo, reaparición y entrenamiento/online.
