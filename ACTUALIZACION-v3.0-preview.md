# EVOLUTION SBN 2027 — v3.0 preview 3D (fase 1)
Parche acumulativo sobre v2.4/v2.5. Incluye los archivos de v2.5 y añade render3d.js. No modifica .github/workflows ni claves ni servidor. Requiere el proyecto completo existente, no es un repositorio independiente.

- Renderizado WebGL 1 con mallas tubulares tridimensionales, normales, iluminación y profundidad, escamas procedurales, mallas elipsoidales de cabeza y ojos, cuernos y colmillos. Cámara ortográfica superior (zoom fijo). Menú, carga y partida usan el mismo renderizador. Las cabezas auxiliares de Hidra se dibujan en 3D y sus cuellos se conservan en 2D por ahora.
- Canvas 2D se conserva para terreno, frutas, efectos, controles y como alternativa para los dispositivos sin WebGL. En Ajustes > Motor gráfico: 3D automático, 3D WebGL, 2D clásico. El modo automático respeta el ahorro de batería; la calidad cambia detalle y resolución. Si no se puede iniciar WebGL, se usa 2D. Si se excede el presupuesto de vértices, los tramos restantes se dibujan en 2D. El motor no usa dependencias externas ni necesita internet.
- Las reglas del motor de juego no cambian respecto de v2.5. No se activa el multijugador. versionCode 17, versionName 3.0-preview; la firma permanente sigue gestionada por el flujo de trabajo existente.

## Verificación
- `node tests/evolution-v30.test.js`: mallas, profundidad, presupuesto y respaldo cuando WebGL no está disponible.
- Los cinco grupos de pruebas anteriores pasan. GLSL compilado y enlazado; mallas de prueba dibujadas usando OpenGL ES 2.0 por software.
- Chromium en el entorno de pruebas no pudo crear un contexto WebGL; en él se comprobó el arranque, menú, selector y entrenamiento con respaldo 2D. No se ha verificado WebGL en la WebView del APK ni el rendimiento en un teléfono. Vista de prueba de modelos separada del juego, no captura del APK.
- Pendientes: terrenos/frutas 3D, modelos específicos por jefe, texturas fotográficas, sombras 3D reales (ahora sombra proyectada 2D), animaciones avanzadas, previsualización 3D de todos los submenús y optimización de GPU en Android.

Si hay pantalla negra, baja fluidez o calentamiento, usa Ajustes > Motor gráfico > 2D clásico. La fase experimental debe probarse primero en entrenamiento.
