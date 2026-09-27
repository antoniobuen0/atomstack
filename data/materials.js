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
    'Birch Plywood': {
        cat: 'wood', es: 'Contrachapado de abedul', en: 'Birch plywood',
        communityPresets: [
            {
                software: 'LightBurn', process: 'Cutting', thicknessMm: 3, power: '85 %',
                speed: '420 mm/min', interval: '-', passes: 2, imageMode: '-', airAssist: 'on',
                resultEs: 'Corte limpio en 2 pasadas; a 1 pasada no atraviesa y chamusca.',
                resultEn: 'Clean cut in 2 passes; a single pass doesn\'t go through and chars.',
                sourceIds: ['lasertinkererBirch'], opticalW: 20, tech: 'diode',
                authorKind: 'blog', sourceDate: '2026-06-26'
            },
            {
                software: 'LightBurn', process: 'Cutting', thicknessMm: 6, power: '100 %',
                speed: '420 mm/min', interval: '-', passes: '3–4', imageMode: '-', airAssist: 'on',
                resultEs: 'Multipasada con 15–30 s de pausa entre pasadas para que suelte el carbón.',
                resultEn: 'Multi-pass with a 15–30 s pause between passes to shed char.',
                sourceIds: ['lasertinkererBirch'], opticalW: 20, tech: 'diode',
                authorKind: 'blog', sourceDate: '2026-06-26'
            }
        ]
    },

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
        safety: { level: 'caution', es: '"Plástico" no es un material: identifica el polímero antes de grabar. PVC, policarbonato y ABS son peligrosos.', en: '"Plastic" is not a material: identify the polymer before engraving. PVC, polycarbonate and ABS are hazardous.', sourceIds: ['manualsPlusAceV2'] }
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
        safety: { level: 'caution', es: 'El metal pulido refleja 455 nm: el haz rebota hacia ti y hacia la óptica. Solo marcado, y en acabado oscuro o cepillado.', en: 'Polished metal reflects 455 nm: the beam bounces back at you and at the optics. Marking only, on dark or brushed finishes.', sourceIds: ['laserEngraverExpertReview'] }
    },
    'Mirror Stainless Steel': { cat: 'metal' },
    'Brushed Stainless Steel': { cat: 'metal' },
    'Galvanized Iron': { cat: 'metal', safety: { level: 'caution', es: 'El recubrimiento de zinc desprende humos metálicos al quemarse: extracción forzada y no quedarse delante.', en: 'The zinc coating gives off metallic fumes when burned: extract the air and don\'t stand in front of it.', sourceIds: ['manualsPlusAceV2'] } },
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
        safety: { level: 'caution', es: 'Solo piel curtida vegetal (veg-tan). La curtida al cromo desprende humos tóxicos al láser.', en: 'Veg-tanned leather only. Chrome-tanned leather releases toxic fumes under a laser.', sourceIds: ['bonnyCreationsA20'] }
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

// Materiales incompatibles con un diodo de 455 nm (aviso global, pestaña Fuentes)
const PROHIBITED_GLOBAL = [
    {
        nameEs: 'PVC / vinilo', nameEn: 'PVC / vinyl', level: 'forbidden',
        whyEs: 'Al quemarse libera cloro: corroe la máquina en horas y genera gas tóxico. Nunca en un láser, diodo incluido.',
        whyEn: 'Burning releases chlorine: it corrodes the machine within hours and produces toxic gas. Never in any laser, diode included.',
        sourceIds: ['manualsPlusAceV2']
    },
    {
        nameEs: 'Policarbonato / Makrolon', nameEn: 'Polycarbonate / Makrolon', level: 'forbidden',
        whyEs: 'Se funde, arde y desprende humos; no llega a cortar limpio con un diodo.',
        whyEn: 'It melts, ignites and fumes; it never cuts cleanly on a diode.',
        sourceIds: ['manualsPlusAceV2']
    },
    {
        nameEs: 'ABS', nameEn: 'ABS', level: 'forbidden',
        whyEs: 'Funde y arde en lugar de grabarse, con humos irritantes.',
        whyEn: 'It melts and burns instead of engraving, with irritating fumes.',
        sourceIds: ['manualsPlusAceV2']
    },
    {
        nameEs: 'Fibra de vidrio / epoxi (FR4)', nameEn: 'Fibreglass / epoxy (FR4)', level: 'forbidden',
        whyEs: 'Humos de resina y partículas de vidrio en suspensión.',
        whyEn: 'Resin fumes and airborne glass particulates.',
        sourceIds: ['manualsPlusAceV2']
    },
    {
        nameEs: 'Acrílico transparente', nameEn: 'Clear acrylic', level: 'useless',
        whyEs: 'No es tóxico: es ineficaz. El 455 nm lo atraviesa sin depositar energía.',
        whyEn: 'Not toxic, just ineffective: 455 nm passes straight through without depositing energy.',
        sourceIds: ['laserEngraverExpertReview', 'atomstackOfficialV2']
    },
    {
        nameEs: 'Cualquier material clorado o con ignífugos', nameEn: 'Any chlorinated or flame-retardant material', level: 'caution',
        whyEs: 'Si no identificas el polímero, no lo grabes. La lista del manual de AtomStack es la referencia; nos falta leerla en mano (el PDF bloquea el acceso automático).',
        whyEn: 'If you can\'t identify the polymer, don\'t engrave it. The AtomStack manual list is the reference; we still need a human to read it (the PDF blocks automated access).',
        sourceIds: ['manualsPlusAceV2']
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
    },
    {
        software: 'LightBurn', process: 'Cutting', thicknessMm: 3, power: '85–95 %', speed: '2500 mm/min',
        interval: '-', passes: 2, imageMode: '-', airAssist: 'on',
        resultEs: 'Recomiendan subir pasadas antes que potencia para no chamuscar. Solo piel vegetal.',
        resultEn: 'They advise adding passes rather than power to avoid scorching. Veg-tan only.',
        sourceIds: ['bonnyCreationsA20'], opticalW: 20, tech: 'diode', authorKind: 'blog', sourceDate: null,
        caveatEs: 'Agregador sin fecha y con fuentes ya no verificables: 2500 mm/min es optimista frente a lo medido en 20 W.',
        caveatEn: 'Undated aggregator whose sources are no longer verifiable: 2500 mm/min is optimistic against what 20 W actually measures.'
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
        sourceIds: ['lbForumX20CuttingAbility'], opticalW: 20, tech: 'diode', authorKind: 'forum-user', sourceDate: '2023-04-30'
    }
]);

// Materiales que solo existen en la capa de comunidad (sin fila en data.js)
const MATERIAL_COMMUNITY_ONLY = ['Birch Plywood', 'Cardstock', 'Chipboard'];

// Cuánto te sirve un preset que viene de otra máquina.
function transferabilityOf(opticalW, tech) {
    if (!opticalW) return { id: 'unknown', es: 'Vataje no declarado', en: 'Power not stated', tone: 'muted' };
    if (tech && tech !== 'diode') return { id: 'other', es: 'De otra tecnología', en: 'Different technology', tone: 'warn' };
    const ratio = opticalW / MACHINE_SPECS.opticalW;
    if (ratio >= 0.8 && ratio <= 1.25) return { id: 'direct', es: 'Transferible', en: 'Directly transferable', tone: 'ok' };
    return { id: 'scale', es: 'Recalcular (~' + opticalW + ' W)', en: 'Rescale (~' + opticalW + ' W)', tone: 'warn' };
}
