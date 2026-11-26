# EVOLUTION SBN 2027 — v2.4 DOMINATION

Parche offline basado en v2.3. No cambia el identificador Android, GitHub Actions ni las claves/secretos de firma. Aumenta versionCode de 14 a 15. No requiere desplegar un servidor.

- Los bots no pueden quitar HP a reyes/titanes con colisión o congelación; tampoco eliminar por choque a gusanos de masa >= 500. Los jugadores humanos sí pueden combatir jefes y gusanos grandes. Los bots siguen siendo peligrosos para los pequeños y pueden morir por colisión.
- IA de bots menos agresiva: actualización de dirección cada 18 ciclos, menor predicción y uso de turbo, menos uso de poderes.
- 10 frutas míticas (64 en total), 4 especies nuevas más la clásica, 4 titanes con 520 HP, ataque anunciado y recompensas. Los titanes se alternan cada 40 minutos de simulación en modos compatibles.
- Modos Hardcore, Exploración y Personalizado; configura bots, frutas y reyes en Leyendas > Especies y temporada. Temporada offline de 50 niveles con recompensas cada 5 niveles. Estadísticas adicionales, colores personalizados, parpadeo, criaturas decorativas e interactivas, sonidos ambientales sintetizados opcionales, cámara libre local, modo fotografía (captura manual desde el dispositivo), calidad adaptable opcional.
- Conserva pantallas, controles, cámara fija, mutaciones, tienda, misiones, 12 escenarios y 8 reyes previos. No incluye traducción completa, 3D fotorrealista, pistas musicales completas por arena, editor de ojos/cuernos, ni tres cabezas independientes de Hidra. No se ha probado el APK real ni sesiones largas en Android.

Pruebas locales: node tests/evolution-v21.test.js, v22, v23 y v24. Prueba de navegador: menú de especies, partida personalizada, titán y fotografía sin errores JS. No constituye prueba de Android ni de firma.
