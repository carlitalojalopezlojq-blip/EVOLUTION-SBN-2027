# v5.4 Founder Edition — actualización del cliente Android
- HUD: masa, etapa, ranking, evento, minimapa, joystick, turbo y voz. Las acciones secundarias se agrupan en ⋯; los FPS y ping se muestran solo con diagnóstico activo. Pausa local disponible.
- Perfil: tarjeta con emblema, nombre, ID público, XP, récord, victorias y eliminaciones online; progreso local separado. La insignia V dorada original se muestra en el perfil, menú, avisos y sobre el gusano solo para la identidad autenticada por el servidor.
- Laboratorio: tarjetas de mutación con color, habilidad y estado; navegación reinicia el desplazamiento al abrir cada pantalla.
- Estabilidad: separa la introducción del acceso, limita la superposición, evita cerrar el panel al actualizar el perfil, protege el dibujo de segmentos ausentes, intenta modo 2D tras errores consecutivos y usa la reconexión existente si faltan estados de partida. No es garantía de resolver todos los congelamientos; requiere prueba en Android real.
- Solo cliente: no modifica server.js, autenticación, Neon, variables de Render, firma Android ni workflow. Versión Android 5.4, versionCode 41; el servidor sigue anunciando 5.3-origin-beta por compatibilidad.
- Validación: sintaxis JavaScript y pruebas v5.3, v4.1 y v5.2.2 correctas. No se pudo realizar prueba de navegador (navegación bloqueada en el entorno) ni compilar el APK firmado aquí.

## Instalar el parche desde Termux
1. Guarda el ZIP en Descargas. Abre la carpeta del repositorio Git existente (no crees otro).
2. Ejecuta `git status` y conserva cualquier cambio local antes de aplicar.
3. Ejecuta `unzip -o ~/storage/downloads/EVOLUTION-v5.4-parche.zip` desde la raíz del repositorio. Si no tienes acceso a Descargas, ejecuta antes `termux-setup-storage` y concede permiso.
4. Revisa `git diff --stat` y `git status`. Añade los seis archivos del parche, haz commit y push a main. El workflow existente construye y firma el APK.
5. Descarga el artefacto de GitHub Actions y actualiza el APK sin desinstalarlo. Prueba una partida y vuelve a abrir el perfil.
