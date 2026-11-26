# EVOLUTION SBN 2027 — v8.6 beta

Actualización incremental del ZIP v8.5. Se preservan mapas, reyes, recursos gráficos y sonoros, identificador Android, configuración de Render, cuentas y firma permanente.

## Cambios
- Expediciones: solitario 1, dúo 1–2, escuadra 1–4. Todos los presentes marcan Listo. El anfitrión inicia. La dificultad de los reyes y la puerta se ajustan al número real de participantes. No se agregan bots para llenar espacios. Si alguien se desconecta después de iniciar se mantiene la regla anterior de pausa y abandono; reconexión hasta 30 segundos, no garantizada si el servidor se reinicia.
- Botón EVOLUCIÓN dentro de expediciones online: árbol de habilidades personal por expedición. Cada 15 frutas no venenosas se gana un punto (máximo 8 en total), cada 3 frutas un material. Guardián, Tormenta y Cazador requieren 100 de masa y 1 punto; Gigante, 300 de masa, Guardián y 2 puntos. Formas temporales (8–10 s), recarga 30 s y coste 35 de energía. Gigante amplía el radio 40% y aumenta daño contra reyes 20%; Cazador aumenta daño 30%; Guardián ofrece escudo; Tormenta recupera energía. Los valores son propuestas de balance, no definitivos.
- Fabricación instantánea de escudo (4 materiales) y energía (3); recarga de fabricación 5 s. Cuatro emotes visibles para jugadores cercanos y auras animadas de las formas.
- Prestigio automático cada 100 000 XP adicionales después del umbral de nivel 100 (495 000 XP); no borra nivel ni XP. Se muestra en Perfil.
- Pareja: nivel de afinidad por cada 10 corazones intercambiados, acceso a corazón diario y chat privado. Conserva las reglas de amistad, consentimiento y bloqueo existentes. No añade matrimonio ni recompensas de pareja.
- Guardado persistente en PostgreSQL: con cuenta iniciada y modo solitario, tras superar mundos 1–9, abrir EVOLUCIÓN y pulsar Guardar y salir antes de cruzar la puerta. Guarda el siguiente mundo, masa, dificultad y progreso de evolución; huevos pendientes no se conservan. Para continuar, crear una sala solitaria, marcar Listo y pulsar Recuperar expedición guardada. El guardado se consume al cargarlo. No hay guardado de equipos ni de combate a mitad de fase. Se requiere actualizar servidor y APK.
- Seguridad: acciones de evolución validadas por el servidor, límites de frecuencia, coste y tiempos; una conexión reemplazada no puede emitir acciones. Reconexión ampliada. No constituye un antitrampas completo. Se mantienen chat de voz, tutorial, espectador, controles editables, historial, cinemáticas y notificaciones existentes; no se han rediseñado.
- Rendimiento: se conserva el sistema de FPS adaptativo, renderizador y envío por área visible; el nuevo panel evita actualizar controles cuando los datos no cambian. No se han medido FPS en un dispositivo real.

## Instalación
1. Hacer copia o commit del proyecto original. Descomprimir el ZIP y copiar su contenido a la raíz del repositorio existente (incluye `.github`), sin borrar `.git` ni credenciales. Revisar `git diff` y conservar ajustes locales personalizados.
2. Probar: `node tests/evolution-v86.test.js` y `node tests/evolution-v86-server.test.js`. Para servidor real: `npm install` y `npm start` (Node 20+).
3. Subir a GitHub en la rama main y desplegar en Render el nuevo servidor. La URL wss original sigue en `app/src/main/assets/server-config.js`. PostgreSQL debe estar configurado mediante `DATABASE_URL`; el servidor crea automáticamente la tabla de guardados.
4. GitHub Actions > Android APK; descargar el artifact. Es necesario conservar el secreto `EVOLUTION_ANDROID_SIGNING` y la misma clave permanente para instalar sobre el APK anterior. No reemplazar ni compartir esta clave. No se incluye un APK compilado.

## Validación
51 archivos de prueba Node ejecutados individualmente: 41 pasan, 10 fallan tanto en el ZIP original como en la versión modificada (v39, v40, v41, v42, v441, v50-server, v50, v510, v56, v58). Las dos pruebas nuevas pasan. Los tests de sockets son simulaciones. No se verificó PostgreSQL real, WebView Android, Render, firma APK ni rendimiento real en teléfonos. No publicar como versión final sin estas verificaciones.
