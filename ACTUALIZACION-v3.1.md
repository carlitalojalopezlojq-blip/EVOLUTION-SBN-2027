# EVOLUTION SBN 2027 — v3.1 Mundo 3D
Parche sobre v3.0-preview (versionCode 18). No modifica firma, workflow, servidor ni simulación.
- Geometría WebGL para las 64 frutas, mediante familias de formas y colores; 12 terrenos de relieve bajo y decoración procedural; 12 tipos de jefe con detalles propios; cuellos de Hidra, huevos, cofres, habilidades y criaturas compatibles. Vista de piel animada. Sombras proyectadas en calidad media/alta.
- Cámara superior de zoom fijo y controles 2D integrados, respaldo 2D y límite de geometría por cuadro (las entidades que exceden presupuesto conservan representación 2D). Los terrenos decorativos no alteran las colisiones.
- No requiere descargas externas ni servidor. No incluye texturas fotográficas, escenas cinematográficas completas o sala de trofeos completamente 3D.
- Pruebas: siete suites Node, sintaxis JS, compilación/link GLSL y render de geometría en OpenGL ES 2.0 software. Prueba de interfaz 2D en Chromium; WebGL integrado y rendimiento móvil pendientes de validar en Android.
