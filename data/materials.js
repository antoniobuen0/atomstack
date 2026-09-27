// Capa curada sobre la tabla oficial (data.js).
// Cada material define: categoría, seguridad, consejos y presets de comunidad.
// Las filas de la wiki oficial se inyectan automáticamente desde data.js al pintar el detalle.
const MATERIAL_META = {
    // ---------- Maderas ----------
    'Basswood': { cat: 'wood' },
    'Paulownia Wood': { cat: 'wood' },
    'Cork Wood': { cat: 'wood' },
    'Yellow Peach Wood': { cat: 'wood' },
    'Bamboo': { cat: 'wood' },
    'Pine': { cat: 'wood' },
    'Mahogany': { cat: 'wood' },
    'MDF': {
        cat: 'wood',
        tips: [{
            es: 'El MDF suelta mucho humo y deja hollín en el canto: sube el aire antes de tocar la potencia.',
            en: 'MDF smokes heavily and soots the edge: raise the air before touching power.',
            sourceIds: ['lbForumPsiRecs']
        }]
    },
    'Birch Plywood': { cat: 'wood', es: 'Contrachapado de abedul', en: 'Birch plywood' },

    // ---------- Plásticos ----------
    'Acrylic': {
        cat: 'plastic',
        safety: {
            level: 'caution',
            es: 'El diodo azul no corta ni graba acrílico transparente: no absorbe 455 nm. Sí funciona en negro o pigmentado. Funde en vez de arder, así que baja el aire para evitar el canto escarchado.',
            en: 'A blue diode cannot cut or engrave clear acrylic: it doesn\'t absorb 455 nm. Black or tinted works. It melts rather than burns, so back the air off to avoid a frosted edge.',
            sourceIds: ['laserEngraverExpertReview', 'atomstackOfficialV2', 'lbForumAcrylicFrost']
        }
    },
    'Plastic': {
        cat: 'plastic',
        safety: { level: 'caution', provenance: 'pending', es: '"Plástico" no es un material: identifica el polímero antes de grabar. PVC, policarbonato y ABS son peligrosos.', en: '"Plastic" is not a material: identify the polymer before engraving. PVC, polycarbonate and ABS are hazardous.', sourceIds: ['manualsPlusAceV2'] }
    },
    'Two Color Plate': { cat: 'plastic' },
    'High Density Foam Board': { cat: 'plastic' },
    'Rubber': { cat: 'plastic' },
    'Resin': { cat: 'plastic' },
    'Kraft Paper': { cat: 'paper' },
    'Office Paper': { cat: 'paper' },
    'Oil Painting Paper': { cat: 'paper' },
    'Carton': { cat: 'paper' },

    // ---------- Metales ----------
    'Stainless Steel Sheet': {
        cat: 'metal',
        safety: { level: 'caution', provenance: 'pending', es: 'El metal pulido refleja 455 nm: el haz rebota hacia ti y hacia la óptica. Con un diodo solo cabe marcar, y en acabado oscuro o cepillado.', en: 'Polished metal reflects 455 nm: the beam bounces back at you and at the optics. On a diode, marking only, on dark or brushed finishes.', sourceIds: ['laserEngraverExpertReview'] }
    },
    'Mirror Stainless Steel': { cat: 'metal' },
    'Brushed Stainless Steel': { cat: 'metal' },
    'Galvanized Iron': { cat: 'metal', safety: { level: 'caution', provenance: 'pending', es: 'El recubrimiento de zinc desprende humos metálicos al quemarse: extracción forzada y no quedarse delante.', en: 'The zinc coating gives off metallic fumes when burned: extract the air and don\'t stand in front of it.', sourceIds: ['manualsPlusAceV2'] } },
    'Iron Sheet': { cat: 'metal' },
    'PCB Board': { cat: 'metal' },

    // ---------- Piedra, cerámica y vidrio ----------
    'Glass': { cat: 'stone' },
    'Ceramic Tile': { cat: 'stone' },
    'Ceramics': { cat: 'stone' },
    'Alumina': { cat: 'stone' },
    'Rock': { cat: 'stone' },
    'Crystal Stone': { cat: 'stone' },
    'Cobblestone': { cat: 'stone' },
    'Artificial Agate': { cat: 'stone' },
    'Mirrors': { cat: 'stone' },

    // ---------- Textil y piel ----------
    'Leather': {
        cat: 'leather',
        safety: {
            level: 'caution', provenance: 'pending', sourceIds: [],
            es: 'Repetido en la comunidad pero sin documento que hayamos podido leer: se recomienda piel curtida vegetal (veg-tan) y se desaconseja la curtida al cromo por sus humos. Si tienes el manual de AtomStack delante, confírmalo y lo marcamos como verificado.',
            en: 'Widely repeated but we have not read a document saying it: veg-tanned leather is recommended and chrome-tanned discouraged for its fumes. If you have the AtomStack manual at hand, confirm it and we mark it verified.'
        }
    },
    'Denim': { cat: 'textile' },

    // ---------- Otros ----------
    'Artificial Beef Bone': { cat: 'other' }
};

// Categorías para agrupar y filtrar
const CATEGORIES = {
    wood: { es: 'Maderas y derivados', en: 'Woods & boards', icon: '🪵' },
    plastic: { es: 'Plásticos y gomas', en: 'Plastics & rubber', icon: '🧴' },
    paper: { es: 'Papel y cartón', en: 'Paper & card', icon: '📄' },
    metal: { es: 'Metales', en: 'Metals', icon: '🔩' },
    stone: { es: 'Piedra, cerámica y vidrio', en: 'Stone, ceramic & glass', icon: '🪨' },
    leather: { es: 'Piel', en: 'Leather', icon: '🟤' },
    textile: { es: 'Textil', en: 'Textiles', icon: '🧵' },
    other: { es: 'Otros', en: 'Other', icon: '📦' }
};

// Materiales incompatibles con un diodo de 455 nm (aviso global, pestaña Fuentes).
// provenance: 'pending' = conocimiento extendido en la comunidad que AÚN no hemos podido
// citar contra un documento leído. El manual oficial (manualsPlusAceV2) es donde está la
// lista, pero su PDF bloqueó el acceso automático: lo enlazamos como "donde comprobarlo".
const PROHIBITED_GLOBAL = [
    {
        nameEs: 'PVC / vinilo', nameEn: 'PVC / vinyl', level: 'forbidden', provenance: 'verified',
        whyEs: 'Al arder forma cloruro de hidrógeno, que con cualquier humedad se vuelve ácido clorhídrico: corroe la máquina y ataca las vías respiratorias. El CDC fija un techo laboral de 5 ppm y Cal Poly lo lista como material prohibido en cortadora láser.',
        whyEn: 'Burning forms hydrogen chloride, which becomes hydrochloric acid in any moisture: it corrodes the machine and attacks the airways. CDC sets a 5 ppm occupational ceiling and Cal Poly lists PVC as prohibited in laser cutters.',
        sourceIds: ['cdcHcl', 'calPolyProhibited']
    },
    {
        nameEs: 'Policarbonato / Lexan', nameEn: 'Polycarbonate / Lexan', level: 'forbidden', provenance: 'verified',
        whyEs: 'Moderadores del foro de LightBurn y la lista de Cal Poly lo excluyen: funde en vez de vaporizarse con humos muy desagradables. Ojo con el conflicto: la tabla oficial del módulo de 30 W de AtomStack sí trae una fila de policarbonato.',
        whyEn: 'LightBurn forum moderators and Cal Poly\'s list exclude it: it melts rather than vaporises, with very unpleasant fumes. Note the conflict: AtomStack\'s own 30 W module table does carry a polycarbonate row.',
        sourceIds: ['lbForumPlastics', 'calPolyProhibited', 'atomstackMaterialListX30']
    },
    {
        nameEs: 'ABS', nameEn: 'ABS', level: 'forbidden', provenance: 'verified',
        whyEs: '«ABS does not cut well in a laser cutter» y emite cianuro de hidrógeno, según los moderadores del hilo de referencia. Funde, prende con facilidad y el humo no es asumible.',
        whyEn: '"ABS does not cut well in a laser cutter" and it emits hydrogen cyanide, per the moderators in the reference thread. It melts, ignites easily and the fumes are not acceptable.',
        sourceIds: ['lbForumAbs']
    },
    {
        nameEs: 'PTFE / teflón, siliconas y cualquier plástico sin identificar', nameEn: 'PTFE / teflon, silicone and any unlabelled plastic', level: 'forbidden', provenance: 'verified',
        whyEs: 'Si no sabes qué polímero es, no puedes predecir qué se desprende al quemarlo. Empieza por el código de resina de la pieza.',
        whyEn: 'If you can\'t name the polymer, you can\'t predict what it releases when burned. Start from the resin code on the part.',
        sourceIds: ['lbForumAbs', 'lbForumPlastics', 'calPolyProhibited']
    },
    {
        nameEs: 'FR4 / PCB, fibra de vidrio, carbono y resinas', nameEn: 'FR4 / PCB, fibreglass, carbon fibre and resins', level: 'forbidden', provenance: 'verified',
        whyEs: 'Ablar vidrio/epoxi suelta polvo respirable y humos de resina. Quienes lo hacen en el foro lo hacen con dos extracciones, sin fiarse de la máquina.',
        whyEn: 'Ablating glass/epoxy releases respirable dust and resin fumes. The forum users who do it run two extractors rather than trusting the machine.',
        sourceIds: ['lbForumPcb', 'nioshSilica']
    },
    {
        nameEs: 'Acrílico transparente, PET y mylar', nameEn: 'Clear acrylic, PET and mylar', level: 'useless', provenance: 'verified',
        whyEs: 'No es toxicidad, es física: midieron que el mylar absorbe ~16 % del 445 nm. El haz lo atraviesa y quema lo de debajo (mesa, cartón), así que "no ha marcado" no significa "no ha pasado nada".',
        whyEn: 'Not toxicity but physics: mylar was measured absorbing only ~16 % of 445 nm. The beam carries through and burns whatever is underneath (bed, card), so "it didn\'t mark" is not "nothing happened".',
        sourceIds: ['lbForumMylar', 'atomstackOfficialV2']
    },
    {
        nameEs: 'Piedra, pizarra, cerámica y alúmina (polvo)', nameEn: 'Stone, slate, ceramic and alumina (dust)', level: 'caution', provenance: 'verified',
        whyEs: 'Son grabables —la pizarra da muy buen resultado— pero el polvo que levantan es sílice cristalina respirable, carcinógeno ocupacional confirmado, con límite NIOSH de 0,05 mg/m³ y mascarilla N95 como control mínimo. Un chasis abierto no contiene ese polvo.',
        whyEn: 'These do engrave — slate gives excellent results — but the dust is respirable crystalline silica, a confirmed occupational carcinogen, with a NIOSH limit of 0.05 mg/m³ and an N95 as the minimum control. An open frame contains none of it.',
        sourceIds: ['nioshSilica', 'lbForumSlate20w']
    },
    {
        nameEs: 'Hierro galvanizado (humos de zinc)', nameEn: 'Galvanized iron (zinc fumes)', level: 'caution', provenance: 'verified',
        whyEs: 'La propia tabla de AtomStack invita a grabar "Galvanized Iron" al 80 % y 1000 mm/min, pero calentar el recubrimiento de zinc libera óxidos metálicos recién formados: es la causa clásica de la fiebre de humos metálicos, un cuadro pseudogripal.',
        whyEn: 'AtomStack\'s own table invites you to engrave "Galvanized Iron" at 80 % and 1000 mm/min, but heating the zinc coating releases freshly formed metal oxides: the classic cause of metal fume fever, a flu-like illness.',
        sourceIds: ['awsMetalFume', 'atomstackOfficialPresetTable']
    }
];

/* ---- Presets de la red, con la máquina que los produjo ----
   addCommunityPresets no pisa los tips ni la seguridad declarados arriba. */
const OFFICIAL_ENGRAVE = ['atomstackOfficialEngraveTable'];
const OFFICIAL_CUT = ['atomstackOfficialPresetTable'];
// Ambas tablas oficiales salen de un módulo de 20 W ópticos: transferibilidad directa.
const SAME_BOX = { opticalW: 20, tech: 'diode', authorKind: 'official-doc', sourceDate: '2022' };

function addCommunityPresets(matEn, presets) {
    const m = MATERIAL_META[matEn] = MATERIAL_META[matEn] || { cat: 'other' };
    m.communityPresets = (m.communityPresets || []).concat(presets);
}

addCommunityPresets('Basswood', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '20 %', speed: '3000 mm/min',
        interval: '0.1', passes: 1, imageMode: 'Threshold', airAssist: 'sin declarar',
        resultEs: 'Según la tabla oficial de GRABADO. data.js dice 80 % y Stucki para el mismo material: las dos revisiones oficiales de AtomStack no coinciden, así que prueba las dos en tu retal.',
        resultEn: 'From the official ENGRAVING table. data.js says 80 % and Stucki for the same material: AtomStack\'s two official revisions disagree, so test both on your scrap.',
        sourceIds: OFFICIAL_ENGRAVE, ...SAME_BOX
    },
    {
        software: 'LightBurn', process: 'Cutting', thicknessMm: 8, power: '100 %', speed: '200 mm/min',
        interval: '-', passes: 1, imageMode: '-', airAssist: 'sin declarar',
        resultEs: 'La misma tabla lista 10 mm a 600 mm/min, 75 % y 6 pasadas: más grueso y más rápido a la vez, lo cual es contradictorio. Trátalo como direccional.',
        resultEn: 'The same table also lists 10 mm at 600 mm/min, 75 % and 6 passes: thicker yet faster, which is contradictory. Treat it as directional.',
        sourceIds: OFFICIAL_CUT, ...SAME_BOX
    }
]);

addCommunityPresets('Pine', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '20 %', speed: '3000 mm/min',
        interval: '0.1', passes: 1, imageMode: 'Jarvis', airAssist: 'sin declarar',
        resultEs: 'Tabla oficial de grabado; data.js propone 80 % a 10000 mm/min con Jarvis.',
        resultEn: 'Official engraving table; data.js proposes 80 % at 10000 mm/min with Jarvis.',
        sourceIds: OFFICIAL_ENGRAVE, ...SAME_BOX
    },
    {
        software: 'LightBurn', process: 'Cutting', thicknessMm: 9, power: '100 %', speed: '130 mm/min',
        interval: '-', passes: 1, imageMode: '-', airAssist: 'sin declarar',
        resultEs: 'El pino de 14 mm sale en la misma tabla a 280 mm/min, 80 % y 10 pasadas: otra vez más grueso y más rápido.',
        resultEn: 'The 14 mm pine in the same table runs 280 mm/min, 80 % and 10 passes: thicker yet faster again.',
        sourceIds: OFFICIAL_CUT, ...SAME_BOX
    },
    {
        software: 'LaserGRBL', process: 'Cutting', thicknessMm: 12, power: '80 (de 0-1000)', speed: '100 mm/min',
        interval: '-', passes: 1, imageMode: '-', airAssist: 'sin declarar',
        resultEs: 'Viene del PDF oficial del módulo de 30 W: el tuyo entrega 20 W, así que baja la velocidad o añade pasadas antes de fiarte.',
        resultEn: 'From the official 30 W module PDF: yours delivers 20 W, so drop the speed or add passes before trusting it.',
        sourceIds: ['atomstackMaterialListX30'], opticalW: 30, tech: 'diode', authorKind: 'forum-user', sourceDate: '2025-06-18',
        caveatEs: '30 W ópticos: ~1,5 veces tu potencia.', caveatEn: '30 W optical: about 1.5× your power.'
    }
]);

addCommunityPresets('Bamboo', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '50 %', speed: '3000 mm/min',
        interval: '0.1', passes: 1, imageMode: 'Threshold', airAssist: 'sin declarar',
        resultEs: 'La tabla oficial pide claramente más potencia en bambú que en tilo.',
        resultEn: 'The official table plainly asks for more power on bamboo than on basswood.',
        sourceIds: OFFICIAL_ENGRAVE, ...SAME_BOX
    },
    {
        software: 'LightBurn', process: 'Cutting', thicknessMm: 6, power: '100 %', speed: '550 mm/min',
        interval: '-', passes: 3, imageMode: '-', airAssist: 'sin declarar',
        resultEs: 'El de 5 mm en la misma tabla: 400 mm/min al 100 % en 1 pasada.',
        resultEn: 'The 5 mm row in the same table: 400 mm/min at 100 % in one pass.',
        sourceIds: OFFICIAL_CUT, ...SAME_BOX
    }
]);

addCommunityPresets('Leather', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '20 %', speed: '3000 mm/min',
        interval: '0.1', passes: 1, imageMode: 'Threshold', airAssist: 'sin declarar',
        resultEs: 'Tabla oficial de grabado; data.js dice 60 % a 20000 mm/min con Stucki.',
        resultEn: 'Official engraving table; data.js says 60 % at 20000 mm/min with Stucki.',
        sourceIds: OFFICIAL_ENGRAVE, ...SAME_BOX
    }
]);

addCommunityPresets('MDF', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '20 (de 0-100)', speed: '3000 mm/min',
        interval: '0.085', passes: 1, imageMode: 'Atkinson', airAssist: 'sin declarar',
        resultEs: 'Tabla oficial de grabado, con Atkinson a 0,085 mm (≈300 DPI).',
        resultEn: 'Official engraving table, using Atkinson at 0.085 mm (≈300 DPI).',
        sourceIds: OFFICIAL_ENGRAVE, ...SAME_BOX
    },
    {
        software: 'LaserGRBL', process: 'Marking', thicknessMm: '-', power: 'S=200 (≈20 % con $30=1000)', speed: '1500 mm/min',
        interval: '-', passes: 1, imageMode: 'línea (texto)', airAssist: 'sin declarar',
        resultEs: 'Marcado de texto que sí funciona en 20 W. El mismo autor venía de un fallo de LightBurn que resultó ser una instalación no genuina: si nada más te funciona, revisa eso.',
        resultEn: 'Text marking that does work on 20 W. The same author\'s earlier LightBurn failure turned out to be a non-genuine install: if nothing else works for you, check that too.',
        sourceIds: ['lbForumX20TextFails'], opticalW: 20, tech: 'diode', authorKind: 'forum-user', sourceDate: '2024-12-21'
    },
    {
        software: 'LightBurn', process: 'Cutting', thicknessMm: 5, power: '100 %', speed: '60 mm/min',
        interval: '-', passes: 1, imageMode: '-', airAssist: 'on',
        resultEs: 'NO cortó: el valor S máximo de LightBurn estaba en 250 en vez de 1000, así que recibía ~25 % de potencia real. Corregido aquello, cortó sin problema.',
        resultEn: 'It did NOT cut: LightBurn\'s max S-value was 250 instead of 1000, so the machine received ~25 % real power. Once fixed, it cut fine.',
        sourceIds: ['lbForumA20NotCutting'], opticalW: 20, tech: 'diode', authorKind: 'forum-user', sourceDate: '2023-10-30',
        caveatEs: 'El preset es lo de menos: comprueba tu escala de potencia antes que ninguna tabla.',
        caveatEn: 'The preset is beside the point: check your power scale before any table.'
    }
]);

addCommunityPresets('Kraft Paper', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '15 %', speed: '3000 mm/min',
        interval: '0.1', passes: 1, imageMode: 'Jarvis', airAssist: 'sin declarar',
        resultEs: 'Tabla oficial de grabado; data.js pone 30 % a 20000 mm/min.',
        resultEn: 'Official engraving table; data.js says 30 % at 20000 mm/min.',
        sourceIds: OFFICIAL_ENGRAVE, ...SAME_BOX
    },
    {
        software: 'LightBurn', process: 'Cutting', thicknessMm: 0.2, power: '80 %', speed: '3000 mm/min',
        interval: '-', passes: 1, imageMode: '-', airAssist: 'sin declarar',
        resultEs: 'Corte de kraft fino.', resultEn: 'Cutting thin kraft paper.',
        sourceIds: OFFICIAL_CUT, ...SAME_BOX
    }
]);

addCommunityPresets('Office Paper', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '13 (de 0-100)', speed: '1500 mm/min',
        interval: '0.125', passes: 1, imageMode: 'Threshold', airAssist: 'sin declarar',
        resultEs: 'El papel blanco tiene un margen potentísimo: en cartulina, +0,5 % de potencia casi quema la hoja.',
        resultEn: 'White paper has a knife-edge margin: on cardstock, +0.5 % power nearly burned the sheet through.',
        sourceIds: OFFICIAL_ENGRAVE, ...SAME_BOX
    }
]);

addCommunityPresets('Cork Wood', [
    {
        software: 'LightBurn', process: 'Cutting', thicknessMm: 10, power: '100 %', speed: '600 mm/min',
        interval: '-', passes: 1, imageMode: '-', airAssist: 'sin declarar',
        resultEs: 'La fila de 15 mm dice 2000 mm/min al 70 % en 10 pasadas: casi seguro una errata de la tabla oficial (probablemente 200).',
        resultEn: 'The 15 mm row says 2000 mm/min at 70 % over 10 passes: almost certainly an errata in the official table (likely 200).',
        sourceIds: OFFICIAL_CUT, ...SAME_BOX
    }
]);

addCommunityPresets('Carton', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '15 %', speed: '3000 mm/min',
        interval: '0.1', passes: 1, imageMode: 'Threshold', airAssist: 'sin declarar',
        resultEs: 'Tabla oficial de grabado.', resultEn: 'Official engraving table.',
        sourceIds: OFFICIAL_ENGRAVE, ...SAME_BOX
    }
]);

/* ---- Materiales sin fila oficial: solo red ---- */
addCommunityPresets('Birch Plywood', [
    {
        software: 'LightBurn', process: 'Cutting', thicknessMm: 3, power: '80 %', speed: '300 mm/min',
        interval: '-', passes: 1, imageMode: '-', airAssist: 'on',
        resultEs: '"3 mm de chapa de abedul corta de forma consistente a 300 mm/s, 80 % y con aire". El autor usa notación de LightBurn: casi seguro mm/min.',
        resultEn: '"3 mm birch ply cuts consistently at 300mm/s 80%, air on" — the author uses LightBurn notation, almost certainly mm/min.',
        sourceIds: ['lbForumX20CuttingAbility'], opticalW: 20, tech: 'diode', authorKind: 'forum-user', sourceDate: '2022-09-06'
    },
    {
        software: 'LightBurn', process: 'Cutting', thicknessMm: 6, power: 'sin declarar', speed: '550 mm/min (máx. 700)',
        interval: '-', passes: '3–4', imageMode: '-', airAssist: 'on (≈30 L/min, bomba casera)',
        resultEs: '2–3 mm en 1 pasada a ~550 mm/min; el báltico de 6 mm necesita 3–4. Avisos del mismo usuario: "el enfoque es importantísimo" y casi toda hoja tiene zonas de pegamento sin cortar, repásalo con sierra o cuchillo.',
        resultEn: '2–3 mm in one pass at ~550 mm/min; 6 mm Baltic needs 3–4. Same user\'s warnings: "focus is extremely important", and virtually every sheet has uncut glue pockets — clear them with a saw or knife.',
        sourceIds: ['lbForumX20CuttingAbility'], opticalW: 20, tech: 'diode', authorKind: 'forum-user', sourceDate: '2024-03-18'
    }
]);

addCommunityPresets('Cardstock', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '16,5 %', speed: '1600 mm/min',
        interval: '0.07 (360 LPI)', passes: 1, imageMode: 'Filled (solo fill)', airAssist: 'sin declarar',
        resultEs: 'Cartulina blanca 100#: pasar de 254 a 360 LPI eliminó las rayas y quitó la necesidad de cross-hatch. Margen potentísimo: +0,5 % casi quema la hoja.',
        resultEn: '100# bright white cardstock: moving 254→360 LPI removed the streaking and made cross-hatch unnecessary. Knife-edge: +0.5 % nearly burned through.',
        sourceIds: ['lbForumCardstockStreak'], opticalW: 10, tech: 'diode', authorKind: 'forum-user', sourceDate: '2022-04-21',
        caveatEs: 'X7 Pro de 10 W: la mitad de tu potencia. La tuya irá más rápida o con menos potencia.',
        caveatEn: 'X7 Pro at 10 W: half your power. Yours will run faster or at lower power.'
    }
]);

addCommunityPresets('Chipboard', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: 0.75, power: '20 %', speed: '12000 mm/min',
        interval: '-', passes: 1, imageMode: '-', airAssist: 'on, 40 psi',
        resultEs: 'Sin olor en el taller y muy poco humo; se limpia con papel seco.',
        resultEn: 'No odour in the shop and very little smoke; wipes clean with a dry paper towel.',
        sourceIds: ['lbForumChipboard'], opticalW: 60, tech: 'co2', authorKind: 'forum-user', sourceDate: '2023-04-30',
        caveatEs: 'OJO: obtenido en una CO₂ de 60 W, no en un diodo. Es referencia de resultado, no de velocidad: 12000 mm/min no es alcanzable en tu máquina.',
        caveatEn: 'Careful: obtained on a 60 W CO2, not a diode. It is a result reference, not a speed: 12000 mm/min is not reachable on your machine.'
    }
]);

/* ---- Presets medidos por usuarios, con su máquina declarada ---- */
addCommunityPresets('Rubber', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: 'Máx 30 % / Mín 25 %', speed: '2000 mm/min',
        interval: '0.05 (500 DPI)', passes: 'sin declarar', imageMode: 'sin declarar', airAssist: 'sin declarar',
        resultEs: 'Fallo honesto y útil: «el interior de las letras queda muy irregular y se ven las líneas donde pasó el láser». La respuesta de LSS: «no es posible dejar una superficie l como un espejo con ningún láser sobre un material como la goma».',
        resultEn: 'An honest, useful failure: "the inside of the letters look very uneven and you can see the lines where the laser ran across". LSS\'s reply: "it\'s not possible to have a mirror smooth surface with any laser on a material like rubber".',
        sourceIds: ['lbForumRubber20w'], opticalW: 20, tech: 'diode', authorKind: 'forum-user', sourceDate: '2024-05-30',
        caveatEs: 'xTool D1 Pro de 20 W: misma potencia que la tuya, óptica distinta.', caveatEn: 'xTool D1 Pro at 20 W: same power as yours, different optics.'
    }
]);

addCommunityPresets('Slate', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: 'Máx 19 % (antes 16,5 %)', speed: '2700 mm/min',
        interval: '0.08 (254 DPI)', passes: 1, imageMode: 'Stucki', airAssist: 'on',
        resultEs: 'Diario de ajuste real en pizarra: primero a 300 mm/min y 16,5 % con 312 DPI tardó 6 horas sin resultado; luego salía como un negativo; y acabó contento a 3000 mm/min, 16,5 %, 240 DPI con Stucki.',
        resultEn: 'A genuine tuning diary on slate: first at 300 mm/min and 16.5 % with 312 DPI it took over 6 hours for nothing; then it came out like a negative; and it ended happy at 3000 mm/min, 16.5 %, 240 DPI with Stucki.',
        sourceIds: ['lbForumSlate20w'], opticalW: 20, tech: 'diode', authorKind: 'forum-user', sourceDate: '2025-11-10',
        caveatEs: 'Atomstack S20 Pro: el mismo módulo de 20 W que AtomStack declara para tu familia. De lo más transferible que hay en foto sobre piedra. Mascarilla: es polvo de sílice.',
        caveatEn: 'Atomstack S20 Pro: the same 20 W module AtomStack declares for your family. The most transferable photo-on-stone recipe there is. Mask up: it is silica dust.'
    }
]);

addCommunityPresets('Mirror Stainless Steel', [
    {
        software: 'LightBurn', process: 'Marking', thicknessMm: '-', power: '100 %', speed: 'sin cifra en mm/min',
        interval: '0.010', passes: 4, imageMode: 'sin declarar', airAssist: 'sin declarar',
        resultEs: 'Fracaso total: «no consiguió ni una sola marca». Respuestas del hilo: hace falta spray de marcado, y «no puedes marcar acero con un diodo pequeño de 20 W». Además avisa del rebote: la radiación reflejada puede romper el propio láser.',
        resultEn: 'Total failure: "did not have a single scratch". Replies in the thread: you need a marking spray, and "you can\'t mark steel with a tiny 20W laser diode". It also warns that reflected radiation can break the laser itself.',
        sourceIds: ['lbForumStainlessFail'], opticalW: 20, tech: 'diode', authorKind: 'forum-user', sourceDate: '2021-04-25',
        caveatEs: 'Contradice directamente la fila de la wiki oficial para acero inoxidable espejo: ahí dice 80 % y 600 mm/min como si funcionara.',
        caveatEn: 'Contradicts the official wiki row for mirror stainless outright, which gives 80 % and 600 mm/min as if it worked.'
    }
]);

addCommunityPresets('Anodized Aluminium', [
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '90 %', speed: '1400 mm/min',
        interval: 'sin declarar', passes: 'sin declarar', imageMode: 'sin declarar', airAssist: 'sin declarar',
        resultEs: 'Aluminio 6161-T3 con revestimiento negro: resultado aceptable tras una pasada de práctica. El mismo usuario perdió el tiempo intentándolo en aluminio desnudo (marca tenue) y se pasó a abedul.',
        resultEn: 'Black-coated 6161-T3 aluminium: acceptable results after a practice run. The same user wasted time on bare aluminium (faint mark) and moved to birch.',
        sourceIds: ['lbForumA20Aluminium'], opticalW: 20, tech: 'diode', authorKind: 'forum-user', sourceDate: '2023-08-22',
        caveatEs: 'A20 Pro, predecesor directo del tuyo: la coincidencia de máquina más cercana del dataset. En metal desnudo no espere marca.',
        caveatEn: 'A20 Pro, your direct predecessor: the closest machine match in the dataset. On bare metal, expect no mark.'
    },
    {
        software: 'LightBurn', process: 'Engraving', thicknessMm: '-', power: '85 %', speed: '2000 mm/min',
        interval: 'sin declarar', passes: 'sin declarar', imageMode: 'sin declarar', airAssist: 'sin declarar',
        resultEs: 'Tarjetas de aluminio anodizado grabadas «con éxito con módulos de 5,5 W y 11 W ÓPTICOS». Avisan de que las tarjetas se curvan por el calor.',
        resultEn: 'Anodised aluminium business cards engraved "successfully with 5.5W and 11W OPTICAL power". They warn the cards warp from the heat.',
        sourceIds: ['lbForumAluCards'], opticalW: 11, tech: 'diode', authorKind: 'forum-user', sourceDate: '2026-01-16',
        caveatEs: 'De 5,5 y 11 W: con tus 20 W baja la potencia o sube la velocidad respecto a esa cifra.',
        caveatEn: 'From 5.5 W and 11 W modules: on your 20 W, drop power or raise speed relative to that figure.'
    }
]);

// Etiquetas y categoría de los materiales que aporta solo la red
MATERIAL_META['Slate'] = Object.assign({ es: 'Pizarra', en: 'Slate', cat: 'stone' }, MATERIAL_META['Slate']);
MATERIAL_META['Anodized Aluminium'] = Object.assign({ es: 'Aluminio anodizado', en: 'Anodized aluminium', cat: 'metal' }, MATERIAL_META['Anodized Aluminium']);

// Materiales que solo existen en la capa de comunidad (sin fila en data.js)
const MATERIAL_COMMUNITY_ONLY = ['Birch Plywood', 'Cardstock', 'Chipboard', 'Slate', 'Anodized Aluminium'];

// Cuánto te sirve un preset que viene de otra máquina.
function transferabilityOf(opticalW, tech) {
    if (!opticalW) return { id: 'unknown', es: 'Vataje no declarado', en: 'Power not stated', tone: 'muted' };
    if (tech && tech !== 'diode') return { id: 'other', es: 'De otra tecnología', en: 'Different technology', tone: 'warn' };
    const ratio = opticalW / MACHINE_SPECS.opticalW;
    if (ratio >= 0.8 && ratio <= 1.25) return { id: 'direct', es: 'Transferible', en: 'Directly transferable', tone: 'ok' };
    return { id: 'scale', es: 'Recalcular (~' + opticalW + ' W)', en: 'Rescale (~' + opticalW + ' W)', tone: 'warn' };
}
