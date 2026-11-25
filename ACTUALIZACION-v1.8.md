# EVOLUTION SBN 2027 — v1.8 Evolution Survival
Parche acumulativo para repositorio original o v1.4–v1.7. No sustituye los archivos Gradle de raíz ni GitHub Actions. Actualiza también server.js; instalar solo el APK no actualiza el servidor.

## Incluido
- 9 frutas anteriores, 40 especies adicionales (49 naturales) y 5 variantes especiales: 54 en total. Catálogo con dibujo y descripción. Las variantes dorada y legendaria dan más masa; eléctrica recarga turbo; protectora evita choques con otros cuerpos durante 5 s (no con límites); venenosa resta masa salvo escudo.
- Cuatro etapas de evolución visual con cambios de color y aura; cámara fija, grosor limitado y crecimiento progresivo sin tope de masa impuesto por reglas.
- Siete reyes: dorado, fuego, hielo, venenoso (zonas), sombras (ocultamiento visual), eléctrico (drena energía), ancestral (velocidad). El rey de sombras se atenúa visualmente, no es invulnerable.
- Seis escenarios, texturas 2D y partículas; cinco modos (supervivencia, Battle Royale, equipos sin colisiones entre aliados, invasión de tres reyes, duelo). 18 bots en los modos de entrenamiento salvo duelo (1); no reaparecen en Royale/duelo. No hay torneo completo ni marcador de equipos.
- Perfil local, XP/rangos, historial local, FPS, ping, música original distinta para menú y carga, efectos sintéticos de evolución/latido.
- Servidor con simulación autoritativa, validación de entrada, tramos visibles por cliente, partida pública por modo, reconexión hasta 15 s (si el jugador sigue vivo). Requiere desplegar la nueva versión de servidor y utilizar WSS; protocolo de instantáneas nuevo (actualizar clientes a 1.8). No incluye hosting, dirección WSS predeterminada, seguridad antitrampas completa, autenticación, amigos, base de datos, ranking mundial ni sincronización en nube.

## Pruebas
`node tests/evolution-v18.test.js` comprueba 54 frutas, efectos especiales, aparición y desaparición de los siete reyes, invasión, reglas de equipos, Royale y evolución. Se verificó sintaxis de motor, servidor e interfaz; Chromium de escritorio abrió menú, catálogo, entrenamiento de invasión y perfil sin errores JS. No se compiló ni probó el APK Android en esta revisión; audio, vibración, conexión real, reconexión, latencia y carga de 100 jugadores pendientes. Los gusanos se dibujan en 2D, no son modelos fotorrealistas 3D. Las pistas originales de arcade y suspenso se conservan; los rugidos elaborados y sonido direccional quedan pendientes.
