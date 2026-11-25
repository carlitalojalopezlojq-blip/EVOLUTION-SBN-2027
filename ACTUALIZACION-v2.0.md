# v2.0 — Evolution Online (preparación de despliegue)
Parche acumulativo de v1.9. El juego conserva entrenamiento, resurrección, reyes, frutas y reglas existentes. La versión del APK pasa a 2.0 (código 11).

## Despliegue desde GitHub
1. Sube este parche a main. No hay cambios al workflow Android existente.
2. En Render crea un Web Service (no Static Site), conecta el repositorio, rama main, runtime Docker; utiliza el Dockerfile en la raíz. La comprobación HTTP puede apuntar a /. El servidor utiliza PORT.
3. Para pruebas, Free: puede tardar cerca de un minuto en despertar y el almacenamiento es efímero. No uses cuentas reales ni progreso importante ahí. Para servicio continuo, selecciona un plan de pago y almacenamiento persistente con EVO_DATA_FILE en una ruta escribible por el proceso Node. El almacenamiento de cuentas es un prototipo; no está auditado para producción.
4. Después de un despliegue exitoso, copia la dirección HTTPS pública asignada por Render. En Termux, con Node.js instalado, ejecuta `node scripts/configurar-servidor.js URL_HTTPS_REAL` (sustituye URL_HTTPS_REAL). Este script valida la URL y escribe server-config.js. No incorpora credenciales. Confirma y sube ese archivo a GitHub; se reconstruirá el APK automáticamente. No se debe publicar una URL inventada.
5. Descarga e instala el APK de la nueva compilación. Jugar online > Partida pública, Crear sala o Unirse. El campo WSS se oculta si se integró la URL; el servidor oficial tiene prioridad frente a cualquier URL de prueba almacenada. Las solicitudes de cuenta usan la misma URL. Hay aviso de conexión, cancelación y reintentos durante unos 90 s para el inicio en frío. El código de sala debe tener entre 4 y 12 letras o números.
6. Prueba dos celulares en una misma sala, movimiento mutuo, resurrección, reconexión y el modo invitado. Si se crea cuenta de prueba, utiliza una contraseña única, nunca reutilizada. La compilación preliminar sin URL no tiene conexión automática a un servidor real.

## Verificación local
Sintaxis de servidor, cliente y configurador; pruebas del motor v1.8, cuentas y resurrección v1.9; normalización HTTPS a WSS y rechazo de credenciales, rutas y protocolos inseguros. No se contrató servidor ni se realizó prueba de red real, Android, 100 jugadores o persistencia alojada.
