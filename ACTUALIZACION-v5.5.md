# EVOLUTION SBN 2027 · 5.5 Founder Edition
Parche acumulativo 5.4 + 5.5 para el proyecto original 5.3. Incluye HUD, V y perfil de 5.4.
- La introducción oculta completamente el acceso y el menú hasta finalizar su transición. El acceso oculta el lobby. Fondo opaco independiente y fallback de finalización de carga.
- Crear cuenta con éxito cambia a iniciar sesión, conserva el usuario y limpia las claves. El cliente nuevo solicita registro sin sesión; servidor mantiene compatibilidad con clientes anteriores.
- Nuevos usuarios: 3–12 caracteres (letras ASCII, números, guion y guion bajo; excepción reservada del fundador). Límite aplicado también en servidor. Los nombres existentes de hasta 20 caracteres siguen permitidos al iniciar sesión, para no bloquear cuentas antiguas. No cambia la base de datos ni los secretos.
- Desplegar primero servidor en Render y luego instalar APK compilado por GitHub Actions. Mantener misma firma y applicationId; no desinstalar APK anterior.
- Pruebas: node tests/evolution-v55.test.js, node tests/evolution-v53.test.js, node tests/evolution-v51.test.js. SQL simulado. No se ha probado en Android físico ni compilado APK en este entorno.
