// Usos y técnicas: qué hacer además del preset, con la fuente de cada cifra.
// caveat = "esto viene de otra máquina / no está verificado en el A20 Pro V2".
const TECHNIQUES = [
    {
        id: 'test-grid', icon: '🧪',
        titleEs: 'Empezar: matriz de prueba en vez de adivinar', titleEn: 'Start: test grid instead of guessing',
        groupEs: 'Preparación', groupEn: 'Setup',
        summaryEs: 'Antes de fiarte de cualquier preset ajeno, genera tu propia rejilla potencia/velocidad con el trozo de material que vayas a usar.',
        summaryEn: 'Before trusting anyone\'s preset, generate your own power/speed grid on the exact stock you will use.',
        items: [
            { labelEs: 'Herramienta', labelEn: 'Tool', valueEs: 'LightBurn ▸ Laser Tools ▸ Material Test', valueEn: 'LightBurn ▸ Laser Tools ▸ Material Test', noteEs: 'Rejilla 10×10 por defecto: filas = velocidad, columnas = potencia. Ejecuta primero lo de menor riesgo (más velocidad y menos potencia).', noteEn: 'Default 10×10 grid: rows = speed, columns = power. Runs lowest burn-risk first.', sourceIds: ['lbDocsMaterialTest'], confidence: 'high' },
            { labelEs: 'Valores de arranque', labelEn: 'Starting values', valueEs: 'Count 9 · Min 2 · Max power 100 %', valueEn: 'Count 9 · Min 2 · Max power 100 %', noteEs: 'El área de la tarjeta sale ≈ 80 × 95 mm: enmarca en una esquina del retal.', noteEn: 'Card is ≈ 80 × 95 mm: frame it in a scrap corner.', sourceIds: ['lbDocsFirstMaterialTest'], confidence: 'high' },
            { labelEs: 'Material de control', labelEn: 'Control material', valueEs: 'Contrachapado de abedul 3 mm', valueEn: '3 mm birch plywood', noteEs: 'Es el más reportado por la comunidad: si tu rejilla sale parecida a la de otros, tus presets ya son comparables.', noteEn: 'Most-reported material by the community, so results become comparable.', sourceIds: ['oneLaserMaterialTest', 'lasertinkererBirch'], confidence: 'medium' },
            { labelEs: 'Peligro al montarla', labelEn: 'Setup hazard', valueEs: 'Unidades de velocidad mal puestas = fuego', valueEn: 'Wrong speed units = fire', noteEs: 'La propia documentación avisa: una velocidad mucho más baja de la esperada entrega potencia excesiva y puede incendiar. Nunca dejes la máquina sola.', noteEn: 'Docs warn that unexpectedly slow speeds deliver excessive power and can start a fire. Never leave it unattended.', sourceIds: ['lbDocsMaterialTest'], confidence: 'high' }
        ]
    },
    {
        id: 'focus', icon: '🎯',
        titleEs: 'Enfoque y eje Z', titleEn: 'Focus and Z axis',
        groupEs: 'Preparación', groupEn: 'Setup',
        summaryEs: 'El A20 Pro V2 es de enfoque manual: casi todo "preset que no corta" es en realidad un problema de distancia focal.',
        summaryEn: 'The A20 Pro V2 focuses manually: most "presets that won\'t cut" are actually focal-distance problems.',
        items: [
            { labelEs: 'Método', labelEn: 'Method', valueEs: 'Separador incluido entre la boca del módulo y la superficie', valueEn: 'Included spacer between module nozzle and surface', noteEs: 'Confirma con una prueba rampa: graba una línea horizontal sobre un retal inclinado; donde salga más fina y oscura es tu foco.', noteEn: 'Confirm with a ramp test: engrave one line across a tilted scrap; the thinnest/darkest point is focus.', sourceIds: ['lasertinkererFocus'], confidence: 'medium' },
            { labelEs: 'Coste de equivocarse', labelEn: 'Cost of being wrong', valueEs: '1 mm de error ≈ más del doble de diámetro de punto', valueEn: '1 mm error ≈ more than double the spot diameter', noteEs: 'Sobre un punto nominal de 0,08 mm, la densidad de potencia cae ~4×: grabado superficial y cortes que no atraviesan.', noteEn: 'On a 0.08 mm nominal spot, power density drops ~4×: shallow engraving and cuts that don\'t go through.', sourceIds: ['lasertinkererFocus'], confidence: 'medium' },
            { labelEs: 'Distancia focal', labelEn: 'Focal distance', valueEs: 'No publicada para el V2 — mide la tuya', valueEn: 'Not published for the V2 — measure yours', noteEs: 'En esta clase de módulos suele ser 30–50 mm (xTool da 40 mm a 455 nm), pero es de otra máquina: no lo asumas.', noteEn: 'Modules of this class are usually 30–50 mm (xTool spec 40 mm at 455 nm) — different hardware, don\'t assume.', sourceIds: ['lasertinkererFocus'], confidence: 'low', caveatEs: 'Cifra de otra marca, no verificada en Atomstack.' },
            { labelEs: 'Desenfoque deliberado', labelEn: 'Deliberate defocus', valueEs: 'Baja 1–2 mm para tableros de 4–10 mm; sube 0,5–1 mm para foto suave', valueEn: 'Focus 1–2 mm below surface for 4–10 mm stock; 0.5–1 mm above for soft photo', noteEs: 'Enfocar por debajo del plano alinea el corte en material grueso; separarse ablanda y ensancha la marca en foto.', noteEn: 'Focusing below the surface straightens the kerf; moving away softens and widens photo marks.', sourceIds: ['lasertinkererFocus'], confidence: 'medium' },
            { labelEs: 'Autoenfoque', labelEn: 'Autofocus', valueEs: 'Focus Test solo funciona con Z motorizada', valueEn: 'Focus Test only works with motorised Z', noteEs: 'Sin el deslizador Z2 no tienes Z controlada: usa el método de la rampa. Además, sin Z2 no tienes detección de llamas.', noteEn: 'Without the Z2 slider you have no driven Z: use the ramp method, and you also lose flame detection.', sourceIds: ['lbDocsFocusTest', 'atomstackOfficialV2'], confidence: 'high' }
        ]
    },
    {
        id: 'photo', icon: '🖼️',
        titleEs: 'Grabado fotográfico y medios tonos', titleEn: 'Photo and halftone engraving',
        groupEs: 'Técnicas', groupEn: 'Techniques',
        summaryEs: 'La relación DPI ↔ intervalo es exacta, así que el intervalo de línea no se elige al azar.',
        summaryEn: 'DPI and line interval are mathematically linked, so interval is never a guess.',
        items: [
            { labelEs: 'Conversión', labelEn: 'Conversion', valueEs: 'DPI = 25,4 / intervalo de línea', valueEn: 'DPI = 25.4 / line interval', noteEs: '0,10 mm = 254 DPI · 0,08 mm = 318 DPI · 0,05 mm = 508 DPI. La columna "Intervalo" de esta tabla es literalmente la resolución de la foto.', noteEn: '0.10 mm = 254 DPI · 0.08 mm = 318 DPI · 0.05 mm = 508 DPI. The "Line Interval" column in this board is photo resolution.', sourceIds: ['lbDocsImageSettings'], confidence: 'high' },
            { labelEs: 'Intervalo correcto', labelEn: 'Correct interval', valueEs: 'Interval Test: que las líneas se toquen sin solaparse', valueEn: 'Interval Test: scan lines touching without overlapping', noteEs: 'Prueba entre 0,08 y 0,16 mm y quédate con el cuadrado donde las líneas se rozan. Suele salir más fino de lo que promete la ficha.', noteEn: 'Sweep 0.08–0.16 mm and pick the square where lines just touch — often finer than the datasheet implies.', sourceIds: ['lbDocsIntervalTest', 'lasertinkererFocus'], confidence: 'high' },
            { labelEs: 'Algoritmo', labelEn: 'Dither algorithm', valueEs: 'Floyd-Steinberg para caras/mascotas · Atkinson si sale oscuro en madera', valueEn: 'Floyd-Steinberg for people/pets · Atkinson if wood reads too dark', noteEs: 'Activa Invert en pizarra, azulejo oscuro y aluminio anodizado. Sube el contraste de la foto antes de importar y desactiva cualquier dithering del editor.', noteEn: 'Enable Invert for slate, dark tile and anodized. Boost source contrast first and disable editor dithering.', sourceIds: ['craftgineerDither'], confidence: 'medium' },
            { labelEs: 'Preparación de la imagen', labelEn: 'Image prep', valueEs: 'A 254 DPI → 10 px/mm → 100 mm ≈ 1000 px', valueEn: 'At 254 DPI → 10 px/mm → 100 mm ≈ 1000 px', noteEs: 'Más píxeles de los que puedes grabar solo pesa; más pocos se empastan.', noteEn: 'More pixels than you can resolve just slows things; fewer smear.', sourceIds: ['craftgineerDither'], confidence: 'high' },
            { labelEs: 'Umbral vs escala de grises', labelEn: 'Threshold vs grayscale', valueEs: 'Threshold = 2 tonos (logo, goma, metal revestido)', valueEn: 'Threshold = 2 tones (logo, rubber, coated metal)', noteEs: 'La escala de grises solo ayuda donde dosis→profundidad es lineal: madera, cuero, superficie de acrílico.', noteEn: 'Grayscale only pays where dose→depth is linear: wood, leather, acrylic surface etch.', sourceIds: ['craftgineerDither', 'atomstackOfficialPresetTable'], confidence: 'medium' },
            { labelEs: 'Receta 20 W en abedul', labelEn: '20 W recipe on birch', valueEs: '4000 mm/min · 20–30 % · 0,10 mm', valueEn: '4000 mm/min · 20–30 % · 0.10 mm', noteEs: 'Punto de partida reportado, no verificado en el A20 Pro V2.', noteEn: 'Reported starting point, not verified on the A20 Pro V2.', sourceIds: ['lasertinkererBirch'], confidence: 'medium', caveatEs: 'Módulo genérico de 20 W, óptica distinta.' }
        ]
    },
    {
        id: 'air-assist', icon: '💨',
        titleEs: 'Air assist', titleEn: 'Air assist',
        groupEs: 'Técnicas', groupEn: 'Techniques',
        summaryEs: 'No viene incluido en el A20 Pro V2 (se vende como F80 en paquetes). Su presión es el dato peor acordado de toda la red.',
        summaryEn: 'Not included with the A20 Pro V2 (sold as the F80 in bundles). Its pressure is the least-agreed number on the net.',
        items: [
            { labelEs: 'Caudal del bomba OEM', labelEn: 'OEM pump flow', valueEs: '≈ 12 L/min → "suficiente" para diodo', valueEn: '≈ 12 L/min → "adequate" for a diode', noteEs: 'La comunidad de diodo habla en L/min, no en psi: con la bomba F80 no necesitas regular presión.', noteEn: 'The diode community talks in L/min, not psi: with the F80 pump you don\'t regulate pressure.', sourceIds: ['lbForumAirPressure'], confidence: 'medium' },
            { labelEs: 'Si usas aire de taller', labelEn: 'If using shop air', valueEs: 'Empezar en 2 psi · rango habitual 5–20 psi · trampa de humedad obligatoria', valueEn: 'Start at 2 psi · typical 5–20 psi · moisture trap mandatory', noteEs: 'Las gotas de agua sobre la lente arruinan el grabado de un plumazo.', noteEn: 'Water droplets on the lens ruin the job instantly.', sourceIds: ['makerForumsPsi', 'lbForumAirPressure'], confidence: 'medium', caveatEs: 'Muchas cifras de ese rango vienen de máquinas CO₂/K40.' },
            { labelEs: 'Acrílico: bajar el aire', labelEn: 'Acrylic: back the air off', valueEs: '5–7 psi, o menos', valueEn: '5–7 psi, or less', noteEs: 'El escarchado del borde lo provoca el exceso de refrigeración, no el láser: el acrílico funde, no arde, y el aire frío malforma el corte.', noteEn: 'Edge frost comes from too much cooling air, not the laser: acrylic melts rather than burns and cold air deforms the cut.', sourceIds: ['lbForumAcrylicFrost', 'lbForumPsiRecs'], confidence: 'medium' },
            { labelEs: 'Madera y MDF', labelEn: 'Wood and MDF', valueEs: 'Más aire cuanto más humo', valueEn: 'More air as smoke increases', noteEs: 'Aquí sí interesa: limpia la lente, aplana el hollín y evita el fuego. MDF ≈ 13 psi en el reporte citado.', noteEn: 'Here more air helps: it cleans the lens, reduces soot and helps fire safety. MDF ≈ 13 psi in the cited report.', sourceIds: ['lbForumPsiRecs'], confidence: 'medium' },
            { labelEs: 'Lente', labelEn: 'Lens care', valueEs: 'Revisar y secar antes y después de cortar sin vigilancia', valueEn: 'Check and dry before and after unattended cutting', noteEs: 'Solo isopropílico y paño sin pelusa; nunca el dedo.', noteEn: 'Isopropyl and lint-free cloth only; never a fingertip.', sourceIds: ['yumiMaintenance'], confidence: 'medium' }
        ]
    },
    {
        id: 'multipass', icon: '🔁',
        titleEs: 'Corte en varias pasadas', titleEn: 'Multi-pass cutting',
        groupEs: 'Técnicas', groupEn: 'Techniques',
        summaryEs: 'Varias pasadas rápidas superan a una pasada lenta y quemada por encima de ~4 mm.',
        summaryEn: 'Several fast passes beat one slow burnt pass above ~4 mm.',
        items: [
            { labelEs: 'Receta 20 W', labelEn: '20 W recipe', valueEs: '3 mm abedul: 420 mm/min al 85 % × 2 · ~6 mm: 100 % × 3–4', valueEn: '3 mm birch: 420 mm/min at 85 % × 2 · ~6 mm: 100 % × 3–4', noteEs: 'Referencia de la comunidad para clase 20 W, comparable a tu módulo.', noteEn: 'Community reference for the 20 W class, comparable to your module.', sourceIds: ['lasertinkererBirch'], confidence: 'medium', caveatEs: 'No es un ensayo en el A20 Pro V2.' },
            { labelEs: 'Pausa entre pasadas', labelEn: 'Pause between passes', valueEs: '15–30 s', valueEn: '15–30 s', noteEs: 'Deja que el tablero pierda carbón y calor; sin pausa la capa siguiente arrastra el hollín.', noteEn: 'Lets the board shed char and heat; without it the next pass drags soot.', sourceIds: ['lasertinkererBirch'], confidence: 'medium' },
            { labelEs: 'Desalineación entre pasadas', labelEn: 'Registration drift', valueEs: 'Causa mecánica, no de software', valueEn: 'A mechanical cause, not software', noteEs: 'Revisa $1 (stepper disable time) para que los motores no se suelten entre pasadas, vuelva a home o usa "Set Finish Position".', noteEn: 'Check $1 (stepper disable time) so motors stay powered between passes, re-home or use "Set Finish Position".', sourceIds: ['lbForumAlignmentMultiPass'], confidence: 'high' },
            { labelEs: 'Geometría cerrada', labelEn: 'Closed geometry', valueEs: 'Auto-Join; si el contorno no sale discontinuo, no está cerrado', valueEn: 'Auto-Join; if the outline isn\'t dashed, corners aren\'t joined', noteEs: 'Es también la causa nº1 de "no me ha cortado una esquina".', noteEn: 'Also the #1 cause of "it didn\'t cut one corner".', sourceIds: ['lbForumMultiPass3mm'], confidence: 'medium' },
            { labelEs: 'Orden de las pasadas', labelEn: 'Pass ordering', valueEs: 'En LightBurn de 2022 se intercalaban', valueEn: 'In 2022 LightBurn interleaved them', noteEs: 'Reportado como sorpresa, no como bug confirmado: verifica en tu versión.', noteEn: 'Reported as surprising, not a confirmed bug: verify on your version.', sourceIds: ['lbForumMultiPass3mm'], confidence: 'low' }
        ]
    },
    {
        id: 'bed', icon: '🟩',
        titleEs: 'Mesa: panal, listones y reflectados', titleEn: 'Bed: honeycomb, slats and reflections',
        groupEs: 'Montaje', groupEn: 'Rig',
        summaryEs: 'El panal F4N se vende como mejora, pero con el diodo azul de 455 nm tiene un efecto secundario real.',
        summaryEn: 'The F4N honeycomb is sold as an upgrade, but with a 455 nm blue diode it has a real side effect.',
        items: [
            { labelEs: 'Reflejo en la cara inferior', labelEn: 'Underside reflection', valueEs: 'Panal limpio refleja 455 nm hacia la pieza', valueEn: 'A clean honeycomb reflects 455 nm back into the part', noteEs: 'Se traduce en motas y quemaduras por debajo. Soluciones reportadas: superficie oscura, pines magnéticos, o elevar la lámina.', noteEn: 'Shows as specks and burns underneath. Reported fixes: a dark surface, magnetic pins, or raising the sheet.', sourceIds: ['lbForumHoneycombMarks'], confidence: 'medium' },
            { labelEs: 'Piezas pequeñas', labelEn: 'Small parts', valueEs: 'Se calientan y caen por las celdas', valueEn: 'They overheat and drop through the cells', noteEs: 'Con velocidades de corte bajas del diodo, el humo se acumula si no hay flujo de aire nuevo.', noteEn: 'At the diode\'s slow cut speeds, smoke pools without fresh inflow.', sourceIds: ['lbForumHoneycombMarks'], confidence: 'medium' },
            { labelEs: 'Listones / knife bed', labelEn: 'Slat bed', valueEs: 'Menos reflectado, sombra en líneas', valueEn: 'Less reflection, shadow lines', noteEs: 'Contradicción abierta en la red: los fabricantes dicen que el panal corta más limpio y varios usuarios se mudaron de él.', noteEn: 'Open contradiction: vendors claim honeycomb cuts cleaner while several users moved away from it.', sourceIds: ['lbForumHoneycombMarks'], confidence: 'low' }
        ]
    },
    {
        id: 'controller', icon: '⚙️',
        titleEs: 'Ajustes de controladora (LightBurn y LaserGRBL)', titleEn: 'Controller settings (LightBurn and LaserGRBL)',
        groupEs: 'Montaje', groupEn: 'Rig',
        summaryEs: 'Aquí se explican la mitad de los "este preset no funciona": la escala de potencia y el modo láser no coinciden.',
        summaryEn: 'Half of all "this preset doesn\'t work" reports are power scale and laser mode mismatches.',
        items: [
            { labelEs: 'Escala de potencia', labelEn: 'Power scale', valueEs: '$30 = 1000 o 255, y debe coincidir con LightBurn', valueEn: '$30 = 1000 or 255, and it must match LightBurn', noteEs: 'Por eso la columna Potencia de la wiki oficial mezcla "%" y números de 0 a 1000: son la misma señal en escalas distintas.', noteEn: 'That\'s why the official table mixes "%" and 0–1000 numbers: same signal, different scales.', sourceIds: ['lbDocsDeviceSettings', 'laserGrblConfig'], confidence: 'high' },
            { labelEs: 'Modo láser', labelEn: 'Laser mode', valueEs: '$32 = 1 (M4 dinámico) · M3 quema al parar', valueEn: '$32 = 1 (M4 dynamic) · M3 scorches when stopped', noteEs: 'La documentación de GRBL es explícita: con M3 la potencia se mantiene aunque la máquina pare → marcas y cortes irregularmente quemados. Evitadlo con lead-in/lead-out.', noteEn: 'GRBL docs are explicit: under M3 power holds while stopped, causing scorching and uneven cuts. Use lead-in/lead-out.', sourceIds: ['grblLaserMode'], confidence: 'high' },
            { labelEs: 'Potencia mínima', labelEn: 'Min power', valueEs: '$31 — se prueba, no se copia', valueEn: '$31 — test it, don\'t copy it', noteEs: 'Demasiado alta = esquinas quemadas; el efecto empeora a más velocidad y menos potencia. Los usuarios reportan valores de 1 a 100 %.', noteEn: 'Too high burns corners, worse at high speed and low power. Users report anything from 1 to 100 %.', sourceIds: ['lbForumMinPower'], confidence: 'medium' },
            { labelEs: 'LaserGRBL', labelEn: 'LaserGRBL', valueEs: 'S-MIN suele ir a 0 · S-MAX según controladora', valueEn: 'S-MIN usually zero · S-MAX per controller', noteEs: 'Y ojo a M3 vs M4 también desde LaserGRBL.', noteEn: 'The M3/M4 choice applies from LaserGRBL too.', sourceIds: ['laserGrblConfig', 'laserGrblRaster'], confidence: 'high' },
            { labelEs: 'Overscan', labelEn: 'Overscan', valueEs: 'Solo pórticos GCode/DSP; es un % de la velocidad', valueEn: 'GCode/DSP gantries only; it is a % of speed', noteEs: 'Si subes la velocidad, el overscan crece y puedes salirte del área: el V2 tiene 365 mm en Y, no 400.', noteEn: 'Raise speed and overscan grows with it, risking out-of-bounds: the V2 has 365 mm on Y, not 400.', sourceIds: ['lbDocsOverscan', 'atomstackOfficialV2'], confidence: 'high' },
            { labelEs: 'Velocidad en espacios en blanco', labelEn: 'Whitespace speed', valueEs: 'Igualarla a la de grabado', valueEn: 'Match it to the engraving speed', noteEs: 'Arregla líneas fantasma: en el caso reportado pasaba de 3000 a 6000 mm/min entre línea y línea y dejaba bandas claras.', noteEn: 'Fixes ghost lines: in the reported case it jumped 3000→6000 mm/min between lines and left pale bands.', sourceIds: ['lbForumGhosting'], confidence: 'high' }
        ]
    },
    {
        id: 'troubleshoot', icon: '🩺',
        titleEs: 'Fallos frecuentes y su arreglo', titleEn: 'Common failures and fixes',
        groupEs: 'Diagnóstico', groupEn: 'Diagnosis',
        summaryEs: 'Ordenado por la frecuencia con la que aparece en foros para esta clase de máquina.',
        summaryEn: 'Ordered by how often it shows up in forums for this class of machine.',
        items: [
            { labelEs: 'No corta / corte fantasma', labelEn: 'Won\'t cut', valueEs: '1º enfoque · 2º potencia real (óptica, no eléctrica) · 3º pasadas', valueEn: '1st focus · 2nd real optical power · 3rd passes', noteEs: 'El fallo nº1 es confundir 120 W de consumo con 20 W de láser al comparar presets de otras máquinas.', noteEn: 'The #1 failure is comparing presets by 120 W input rather than 20 W optical output.', sourceIds: ['lasertinkererFocus', 'atomstackOfficialV2'], confidence: 'high' },
            { labelEs: 'Huecos en esquinas', labelEn: 'Gaps at corners', valueEs: 'Rango PWM desalineado ($30)', valueEn: 'Misaligned PWM range ($30)', noteEs: 'Si no recibes control PWM completo, el láser se apaga en los cambios de dirección.', noteEn: 'Without full PWM control the laser drops out at direction changes.', sourceIds: ['lbForumGapsCorners'], confidence: 'high' },
            { labelEs: 'Bandas periódicas', labelEn: 'Periodic banding', valueEs: 'Resonancia mecánica', valueEn: 'Structural resonance', noteEs: 'Bajar velocidad y aceleración no lo solucionó en el caso reportado: era vibración de la mesa.', noteEn: 'Throttling speed and accel didn\'t fix it in the reported case: it was bed vibration.', sourceIds: ['makerForumsCurtains'], confidence: 'low', caveatEs: 'Máquina distinta.' },
            { labelEs: 'WiFi intermitente', labelEn: 'WiFi dropouts', valueEs: 'El A20 Pro no conectaba a LightBurn por WiFi', valueEn: 'The A20 Pro could not reach LightBurn over WiFi', noteEs: 'Según respondió el propio representante de Atomstack: solo app de móvil. Si te pasa, trabaja por USB (115200 baudios). Sin verificar en el V2.', noteEn: 'Per Atomstack\'s own rep: phone app only. If it happens, work over USB (115200 baud). Unverified on the V2.', sourceIds: ['lbForumWifiA20', 'lbDocsDeviceSettings'], confidence: 'medium', caveatEs: 'Hilo del A20 Pro V1: la controladora del V2 puede ser distinta.' },
            { labelEs: 'Rotativo desproporcionado', labelEn: 'Rotary scaling', valueEs: 'Ajustar pasos/revolución y diámetro por separado', valueEn: 'Tune steps-per-rotation and roller diameter separately', noteEs: 'Valida marcando, girando 360° y comparando. En el caso citado el origen era firmware.', noteEn: 'Validate by marking, rotating 360° and comparing. In the cited case the root cause was firmware.', sourceIds: ['lbForumRotaryScale'], confidence: 'low', caveatEs: 'Hardware Ruida: las cifras no aplican.' }
        ]
    },
    {
        id: 'maintenance', icon: '🧽',
        titleEs: 'Mantenimiento y calibración', titleEn: 'Maintenance and calibration',
        groupEs: 'Diagnóstico', groupEn: 'Diagnosis',
        summaryEs: 'AtomStack publica una guía de ajustes mecánicos, pero no expone intervals legibles: usamos los de la comunidad y los marcamos como genéricos.',
        summaryEn: 'AtomStack publishes a mechanical adjustment guide but no readable intervals, so we use community ones flagged as generic.',
        items: [
            { labelEs: 'Óptica', labelEn: 'Optics', valueEs: 'Limpieza semanal con paño sin pelusa + isopropílico', valueEn: 'Weekly clean with lint-free cloth + isopropyl', noteEs: 'Nunca con el dedo; inspecciona el módulo cada mes.', noteEn: 'Never bare fingers; inspect the module monthly.', sourceIds: ['yumiMaintenance'], confidence: 'medium', caveatEs: 'Guía de otra marca; interval genérico.' },
            { labelEs: 'Correas', labelEn: 'Belts', valueEs: 'Revisar cada 2–3 meses', valueEn: 'Check every 2–3 months', noteEs: 'Presiona a media longitud: si flapea más de ~3–4 mm, tensa e iguala ambos lados.', noteEn: 'Press midway: if it sags more than ~3–4 mm, tension and equalise both sides.', sourceIds: ['yumiMaintenance'], confidence: 'medium' },
            { labelEs: 'Documentación del fabricante', labelEn: 'Manufacturer docs', valueEs: 'Existe guía mecánica, contenido no legible', valueEn: 'Guide exists, content not machine-readable', noteEs: 'Renderizada por JS: si la lees en mano, márcalo como verificado y subimos la confianza.', noteEn: 'JS-rendered: if you read it by hand, mark it verified and we promote its confidence.', sourceIds: ['atomstackMaintenanceWiki'], confidence: 'low' }
        ]
    }
];

// Desacuerdos abiertos entre fuentes: se muestran tal cual, sin decidir por el usuario.
const KNOWN_CONFLICTS = [
    {
        topicEs: 'Presión del air assist', topicEn: 'Air-assist pressure',
        detailEs: 'Las cifras van de 2 psi a 60 psi según máquina, y un sector insiste en hablar en L/min porque psi no significa nada sin caudal. En un diodo de 20 W con bomba F80, la referencia útil es el caudal.',
        detailEn: 'Numbers range from 2 psi to 60 psi depending on the machine, and a camp insists on L/min since psi means nothing without flow. On a 20 W diode with the F80 pump, flow is the useful figure.',
        sourceIds: ['lbForumAirPressure', 'lbForumPsiRecs', 'makerForumsPsi']
    },
    {
        topicEs: 'Panal vs superficie oscura', topicEn: 'Honeycomb vs dark surface',
        detailEs: 'AtomStack vende el panal F4N como mejora; usuarios de foro reportan motas por reflexión 455 nm en la cara inferior y se mudan a superficies oscuras o pines.',
        detailEn: 'AtomStack sells the F4N honeycomb as an upgrade; forum users report 455 nm reflection specks on the underside and move to dark surfaces or pins.',
        sourceIds: ['atomstackOfficialV2', 'lbForumHoneycombMarks']
    },
    {
        topicEs: 'Precisión de grabado', topicEn: 'Engraving precision',
        detailEs: 'La ficha oficial promete 0,01 mm en el titular y 0,02 mm en su propia tabla de especificaciones.',
        detailEn: 'The official page promises 0.01 mm in the headline and 0.02 mm in its own spec table.',
        sourceIds: ['atomstackOfficialV2']
    },
    {
        topicEs: 'Área de trabajo', topicEn: 'Working area',
        detailEs: '400 × 365 mm según la ficha oficial del V2, frente al clásico 400 × 400 mm del V1 y de casi todos los anuncios. En Y tienes 35 mm menos de lo que mucha gente asume.',
        detailEn: '400 × 365 mm per the official V2 sheet, versus the legacy 400 × 400 mm of the V1 and most listings. You have 35 mm less on Y than many assume.',
        sourceIds: ['atomstackOfficialV2', 'cncDirectA20V2']
    },
    {
        topicEs: 'Intervalo de línea por defecto', topicEn: 'Default line interval',
        detailEs: 'La tabla oficial usa 0,08–0,10 mm (254–318 DPI), pero la propia regla del Interval Test de LightBurn suele llevar a valores más finos en un punto de 0,08 mm.',
        detailEn: 'The official table uses 0.08–0.10 mm (254–318 DPI), yet LightBurn\'s own Interval Test rule often lands finer on a 0.08 mm spot.',
        sourceIds: ['atomstackOfficialPresetTable', 'lbDocsIntervalTest']
    }
];
