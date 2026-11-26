# EVOLUTION SBN 2027 v2.5 — Refinamiento

Parche sobre v2.4 Domination. No modifica `.github/workflows`, la clave de firma, la configuración de red ni el servidor. `versionCode 16`, `versionName 2.5`.

- Texturas procedurales de escamas de 192×192, iluminación y detalles; caché limitada a 72 entradas. El motor sigue siendo Canvas 2D.
- Hidra: tres cabezas visibles con ataques escalonados, zonas anunciadas y efectos separados (lentitud, pérdida de energía, combinación). Comparten vida y cuerpo; las cabezas laterales no añaden hitboxes mortales independientes. Solo modo offline.
- Leyendas → Especies y temporada: editor del color del iris y cuernos (ninguno, hueso, cristal). Los ajustes se guardan localmente y se aplican al jugador y al gusano del menú.
- Leyendas → Trofeos: vitrina con perspectiva 2D y contadores reales.
- Ajustes: español, inglés y portugués para rótulos principales. Localización parcial; avisos dinámicos, historia, frutas y otros textos siguen en español.
- 12 bucles musicales originales sintetizados, uno por arena (aproximadamente 25–30 s), reproducidos mediante el puente Android o HTML audio. Se conserva el tema de suspenso para los jefes y los temas de introducción y menú.
- No modifica las reglas de bots ni de crecimiento; siguen vigentes las protecciones de la v2.4.

Pruebas: cinco scripts Node de v2.1–v2.5; comprobación de sintaxis de JS; prueba Chromium con scripts incorporados (idiomas, cuernos, trofeos, arena, selección de pista y aparición de Hidra). No se compiló ni ejecutó el APK en Android. Falta comprobar rendimiento durante partidas prolongadas, audio nativo y completar traducciones y gráficos 3D.
