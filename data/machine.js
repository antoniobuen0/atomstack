// Ficha técnica del A20 Pro V2. Valores tomados de la ficha oficial (verificada en navegador,
// la página renderiza por JS y no es legible con fetch simple).
const MACHINE_SPECS = {
    model: 'Atomstack A20 Pro V2',
    aka: 'Ace Pro V2 (nombre comercial del mismo modelo)',
    opticalW: 20,
    areaMm: [400, 365],
    maxSpeedMmS: 400,
    groups: [
        {
            id: 'optics', labelEs: 'Óptica', labelEn: 'Optics',
            items: [
                { labelEs: 'Potencia de salida (óptica)', labelEn: 'Optical output power', value: '20 W', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Potencia de entrada', labelEn: 'Input power', value: '120 W', sourceIds: ['atomstackOfficialV2'], noteEs: 'No confundir con los 20 W ópticos: el marketing de otros modelos anuncia "120W" como si fuera potencia de láser.', noteEn: 'Not the laser power: 120 W is electrical input.' },
                { labelEs: 'Longitud de onda', labelEn: 'Wavelength', value: '455 ± 5 nm', sourceIds: ['atomstackOfficialV2'], noteEs: 'Diodo azul. Las gafas deben filtrar en 450 nm, no las genéricas.', noteEn: 'Blue diode. Goggles must filter ~450 nm.' },
                { labelEs: 'Tamaño de punto', labelEn: 'Spot size', value: '0,08 × 0,10 mm', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Principio de funcionamiento', labelEn: 'Operating mode', value: 'Grabado y corte', valueEn: 'Engraving and cutting', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Método de enfoque', labelEn: 'Focus method', value: 'Manual', valueEn: 'Manual', sourceIds: ['atomstackOfficialV2'], noteEs: 'Sin autoenfoque: se fija con el separador incluido. Si montas Z2, re-verificas altura en cada material.', noteEn: 'No autofocus. Spacer tool; re-check height per material.' }
            ]
        },
        {
            id: 'mechanics', labelEs: 'Área y precisión', labelEn: 'Area & precision',
            items: [
                { labelEs: 'Área de grabado', labelEn: 'Engraving area', value: '400 × 365 mm', sourceIds: ['atomstackOfficialV2'], noteEs: 'Ojo: el A20 Pro V1 y muchos anuncios dicen 400 × 400 mm. En el V2 la ficha oficial dice 365 mm en el eje Y.', noteEn: 'V1 and many listings say 400 × 400 mm; the official V2 sheet says 365 mm on Y.' },
                { labelEs: 'Velocidad máxima', labelEn: 'Max speed', value: '400 mm/s (= 24000 mm/min)', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Precisión de grabado', labelEn: 'Engraving precision', value: '0,02 mm', sourceIds: ['atomstackOfficialV2'], noteEs: 'La propia página contradice sus cifras: el titular promete 0,01 mm y la tabla 0,02 mm.', noteEn: 'The page contradicts itself: headline says 0.01 mm, spec table 0.02 mm.' },
                { labelEs: 'Estructura', labelEn: 'Structure', value: 'Rieles guía', valueEn: 'Guide rails', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Posicionamiento cruzado', labelEn: 'Cross positioning', value: 'Sí', valueEn: 'Yes', sourceIds: ['atomstackOfficialV2'] }
            ]
        },
        {
            id: 'connectivity', labelEs: 'Conectividad y software', labelEn: 'Connectivity & software',
            items: [
                { labelEs: 'Conexión', labelEn: 'Connection', value: 'USB · Wi-Fi 2,4 GHz', valueEn: 'USB · 2.4 GHz Wi-Fi', sourceIds: ['atomstackOfficialV2'], noteEs: 'Solo 2,4 GHz: si tu router es 5 GHz, necesitas red separada o el cable.', noteEn: '2.4 GHz only.' },
                { labelEs: 'Software soportado', labelEn: 'Supported software', value: 'LightBurn · LaserGRBL · AtomStack PC · App AtomStack', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Sistemas operativos', labelEn: 'Operating systems', value: 'Windows · macOS · Android · iOS', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Actualización de firmware', labelEn: 'Firmware update', value: 'App AtomStack o unidad USB', valueEn: 'AtomStack app or USB drive', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Formatos de archivo', labelEn: 'File formats', value: 'JPG · JPEG · SVG · PNG · BMP · PDF · G-Code · DXF', sourceIds: ['atomstackOfficialV2'] }
            ]
        },
        {
            id: 'safety', labelEs: 'Seguridad', labelEn: 'Safety',
            items: [
                { labelEs: 'Alarma de vuelco', labelEn: 'Tip-over alarm', value: 'Ángulo > 15° → zumbador', valueEn: '> 15° → buzzer', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Detección de llamas', labelEn: 'Flame detection', value: 'Sí, requiere el deslizador de eje Z2', valueEn: 'Yes, needs the Z2 slider', sourceIds: ['atomstackOfficialV2'], noteEs: 'Sin Z2 montado no tienes detección de fuego: vigila o compra el Z2.', noteEn: 'Without Z2 fitted you have no flame detection.' },
                { labelEs: 'Certificaciones', labelEn: 'Certifications', value: 'IEC 60825 · CE · FCC · RoHS · FDA · PSE · UKCA', sourceIds: ['atomstackOfficialV2'] }
            ]
        },
        {
            id: 'materials', labelEs: 'Materiales declarados por el fabricante', labelEn: 'Manufacturer-stated materials',
            items: [
                { labelEs: 'Materiales de corte indicados', labelEn: 'Stated cuttable materials', value: 'Chapa fina de acero · cartón · tela no tejida · madera · acrílico negro · plásticos finos · esponja', valueEn: 'Thin steel sheet · cardboard · non-woven fabric · wood · black acrylic · thin plastics · sponge', sourceIds: ['atomstackOfficialV2'], noteEs: 'Negra / pigmentada: el diodo azul no corta acrílico transparente.', noteEn: 'Dark or tinted only: a blue diode will not cut clear acrylic.' }
            ]
        },
        {
            id: 'accessories', labelEs: 'Accesorios y módulos', labelEn: 'Accessories & modules',
            items: [
                { labelEs: 'Air assist', labelEn: 'Air assist', value: 'No incluida · F80 (en paquetes "aéreo" y "profesional")', valueEn: 'Not included · F80 (in bundles)', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Mesa', labelEn: 'Bed', value: 'Panal F4N (en paquetes Básico y Profesional)', valueEn: 'F4N honeycomb (in bundles)', sourceIds: ['atomstackOfficialV2'] },
                { labelEs: 'Rotativo', labelEn: 'Rotary', value: 'Juego de rodillos R8 Pro ("Paquete rotativo")', valueEn: 'R8 Pro roller kit', sourceIds: ['atomstackOfficialV2'], noteEs: 'Diámetro máximo soportado: no publicado.', noteEn: 'Max supported diameter not published.' },
                { labelEs: 'Módulo IR', labelEn: 'IR module', value: 'AtomStack R20-A, 1,8 W · 1064 nm (vendido como compatible con Swift / A20 Pro V2)', valueEn: 'AtomStack R20-A, 1.8 W · 1064 nm (listed as compatible with Swift / A20 Pro V2)', sourceIds: ['atomstackOfficialV2'], noteEs: '1064 nm fibra: graba metal sin dañar plásticos, pero NO usa los presets de esta tabla. Otro material, otra física.', noteEn: 'Fibre IR: different physics, so none of the presets on this board apply.' },
                { labelEs: 'Otros', labelEn: 'Other', value: 'Cámara inalámbrica AC2 · caja FB2 · deslizador Z2', valueEn: 'AC2 wireless camera · FB2 box · Z2 slider', sourceIds: ['atomstackOfficialV2'] }
            ]
        }
    ],

    // Huecos reales: la ficha oficial no los publica. Los mostramos para no inventar.
    gaps: [
        { es: 'Nivel de ruido (dB)', en: 'Noise level (dB)' },
        { es: 'Límite de ciclo de trabajo / temperatura de operación', en: 'Duty-cycle / operating temperature limits' },
        { es: 'Grabado offline por tarjeta SD (no documentado para el V2)', en: 'SD-card offline engraving (not documented for V2)' },
        { es: 'Modelo exacto de controladora y versión de firmware GRBL', en: 'Exact controller board and GRBL firmware version' },
        { es: 'Presión y caudal recomendados del air assist F80', en: 'Recommended F80 air-assist pressure and flow' },
        { es: 'Diámetro máximo admitido por el rotativo R8 Pro', en: 'Max diameter supported by R8 Pro rotary' },
        { es: 'OD y longitud de onda de las gafas incluidas', en: 'Included goggles OD and wavelength rating' },
        { es: 'Lista oficial de materiales prohibidos (en el manual PDF, no accesible a máquinas)', en: 'Official prohibited-material list (in the manual PDF, not machine-readable)' }
    ]
};
