// Registro central de fuentes. Todo dato del panel referencia una clave de aquí.
// type: official | standards | community-forum | community-wiki | reseller | review | docs
// confidence: high (fabricante/normal/documentación oficial) | medium | low
const ACCESSED_ON = '2026-09-27';

function src(labelEs, labelEn, url, type, publisher, o = {}) {
    return {
        labelEs, labelEn, url, type, publisher,
        date: o.date || null,
        accessedOn: ACCESSED_ON,
        confidence: o.confidence || 'medium',
        machine: o.machine || null,
        opticalW: o.opticalW ?? null,
        note: o.note || null
    };
}

const LASER_SOURCES = {
    // --- AtomStack / hardware ---
    atomstackOfficialV2: src('Ficha oficial AtomStack — A20 Pro V2', 'AtomStack official product page — A20 Pro V2',
        'https://atomstack.com/es-eu/products/atomstack-ace-pro-v2', 'official', 'AtomStack', {
        confidence: 'high', machine: 'Atomstack A20 Pro V2', opticalW: 20,
        note: 'El producto se vende como "Ace Pro V2" pero la ficha lo identifica como A20 Pro V2. Página JS: verificada en navegador real.'
    }),
    atomstackOfficialPresetTable: src('Tabla oficial AtomStack — parámetros LightBurn de corte', 'AtomStack official table — LightBurn cutting parameters',
        'https://atomstackshop.com/blogs/engraving-and-cutting-parameter/lightburn-x20-pro-cutting-parameter-table', 'official', 'AtomStack', {
        machine: 'Atomstack X20 Pro (mismo módulo de 20 W ópticos)', opticalW: 20, confidence: 'medium',
        note: 'Procedencia real de data.js, confirmada en la red. Es la tabla del X20 Pro: AtomStack declara el mismo módulo de 20 W para la familia A20/X20/S20 Pro. Veremos más abajo que sus filas de corte son internamente contradictorias.'
    }),
    atomstackOfficialEngraveTable: src('Tabla oficial AtomStack — parámetros LightBurn de grabado', 'AtomStack official table — LightBurn engraving parameters',
        'https://atomstackshop.com/blogs/engraving-and-cutting-parameter/lightburn-x20-pro-engraving-parameter-table', 'official', 'AtomStack', {
        machine: 'Atomstack X20 Pro (mismo módulo de 20 W ópticos)', opticalW: 20, confidence: 'medium',
        note: 'Fuente de las filas de grabado. Usa potencias mucho más bajas que data.js (15-20 % frente a 40-80 %): la wiki del propietario parece venir de una revisión distinta.'
    }),
    atomstackMaterialListX30: src('Hilo — lista de materiales importable del X30 Pro (30 W)', 'Thread — importable material list for the X30 Pro (30 W)',
        'https://forum.lightburnsoftware.com/t/material-list-for-atomstack-x30-pro/173725', 'community-forum', 'LightBurn forum', {
        date: '2025-06-18', machine: 'Atomstack X30 Pro', opticalW: 30,
        note: 'Repubrica un PDF oficial de AtomStack para su módulo de 30 W: 50 % más de potencia que el tuyo, así que sus velocidades hay que bajarlas.'
    }),
    manualsPlusAceV2: src('Manual de usuario ACE A5/A10/A20 Pro V2', 'ACE A5/A10/A20 Pro V2 user manual',
        'https://manuals.plus/asin/B0DHG5LNKL', 'official', 'AtomStack', {
        machine: 'Atomstack A20 Pro V2', opticalW: 20, confidence: 'low',
        note: 'Descarga bloqueada (403) a agentes automáticos. Contiene lista oficial de prohibidos y seguridad: revisar en mano.'
    }),
    cncDirectA20V2: src('Ficha de revendedor TheCNCdirect — A20 Pro V2', 'TheCNCdirect reseller spec sheet — A20 Pro V2',
        'https://thecncdirect.com/products/atomstack-a20-pro-v2-laser-engraver', 'reseller', 'TheCNCdirect', {
        machine: 'Atomstack A20 Pro V2', opticalW: 20
    }),
    laserEngraverExpertReview: src('Análisis LaserEngraverExpert — Atomstack A20 Pro', 'LaserEngraverExpert review — Atomstack A20 Pro',
        'https://laserengraverexpert.com/atomstack-a20-pro-review/', 'review', 'LaserEngraverExpert', {
        machine: 'Atomstack A20 Pro', opticalW: 20
    }),

    // --- Documentación oficial LightBurn ---
    lbDocsDeviceSettings: src('Documentación LightBurn — Device Settings', 'LightBurn docs — Device Settings',
        'https://docs.lightburnsoftware.com/UI/DeviceSettings.html', 'docs', 'LightBurn', { confidence: 'high' }),
    lbDocsImageSettings: src('Documentación LightBurn — ajustes de imagen (DPI / intervalo)', 'LightBurn docs — image settings (DPI / line interval)',
        'https://docs.lightburnsoftware.com/UI/CutSettings/CutSettings-Image.html', 'docs', 'LightBurn', { confidence: 'high' }),
    lbDocsIntervalTest: src('Documentación LightBurn — Interval Test', 'LightBurn docs — Interval Test',
        'https://docs.lightburnsoftware.com/2.1/Reference/IntervalTest/', 'docs', 'LightBurn', { confidence: 'high' }),
    lbDocsMaterialTest: src('Documentación LightBurn — Material Test', 'LightBurn docs — Material Test',
        'https://docs.lightburnsoftware.com/2.1/Reference/MaterialTest/', 'docs', 'LightBurn', { confidence: 'high' }),
    lbDocsFirstMaterialTest: src('Documentación LightBurn — primera Material Test', 'LightBurn docs — first material test',
        'https://docs.lightburnsoftware.com/2.1/GetStarted/FirstMaterialTest/', 'docs', 'LightBurn', { confidence: 'high' }),
    lbDocsFocusTest: src('Documentación LightBurn — Focus Test', 'LightBurn docs — Focus Test',
        'https://docs.lightburnsoftware.com/2.1/Reference/FocusTest/', 'docs', 'LightBurn', { confidence: 'high' }),
    lbDocsOverscan: src('Documentación LightBurn — Overscanning', 'LightBurn docs — Overscanning',
        'https://docs.lightburnsoftware.com/2.1/Explainers/Overscanning/', 'docs', 'LightBurn', { confidence: 'high' }),

    // --- GRBL / LaserGRBL ---
    grblLaserMode: src('Documentación GRBL — modo láser ($32, M3 vs M4)', 'GRBL docs — laser mode ($32, M3 vs M4)',
        'https://github.com/gnea/grbl/blob/master/doc/markdown/laser_mode.md', 'standards', 'gnea/grbl', { confidence: 'high', note: 'Sin fecha; era GRBL v1.1.' }),
    laserGrblRaster: src('LaserGRBL — importación ráster y opciones de láser', 'LaserGRBL — raster import and laser options',
        'https://lasergrbl.com/usage/raster-image-import/target-image-size-and-laser-options/', 'docs', 'LaserGRBL', { confidence: 'high' }),
    laserGrblConfig: src('LaserGRBL — configuración (S-MIN / S-MAX, TTL-PWM)', 'LaserGRBL — configuration (S-MIN / S-MAX, TTL-PWM)',
        'https://lasergrbl.com/configuration/', 'docs', 'LaserGRBL', { confidence: 'high' }),

    // --- Foros LightBurn (experiencia de usuario) ---
    lbForumA20Settings: src('Hilo — ajustes de velocidad/potencia para Atomstack A20 Pro', 'Thread — speed/power settings for Atomstack A20 Pro',
        'https://forum.lightburnsoftware.com/t/need-some-speed-power-settings-for-atomstack-a20-pro/107898', 'community-forum', 'LightBurn forum', { date: '2023-08-18', machine: 'Atomstack A20 Pro' }),
    lbForumWifiA20: src('Hilo — el A20 Pro no conecta por WiFi con LightBurn', 'Thread — A20 Pro cannot connect to LightBurn over WiFi',
        'https://forum.lightburnsoftware.com/t/atomstack-a20-wont-connect-wifi-with-lightburn/93661', 'community-forum', 'LightBurn forum', { date: '2023-03', machine: 'Atomstack A20 Pro', note: 'Respuesta del representante de Atomstack. El controlador del V2 puede comportarse distinto: sin verificar.' }),
    lbForumAirPressure: src('Hilo — presión del air assist', 'Thread — air pressure for air assist',
        'https://forum.lightburnsoftware.com/t/air-pressure-for-air-assist/187715', 'community-forum', 'LightBurn forum', { date: '2026-02' }),
    lbForumPsiRecs: src('Hilo — recomendaciones de psi por material', 'Thread — psi recommendations per material',
        'https://forum.lightburnsoftware.com/t/can-anyone-tell-me-the-psi-recommentions-for-air-assist/69816', 'community-forum', 'LightBurn forum', { date: '2022-06', note: 'Mezcla máquinas CO₂/K40: no todo es transferible a un diodo de 20 W.' }),
    lbForumAcrylicFrost: src('Hilo — bordes escarchados en acrílico', 'Thread — edges of acrylic frosted',
        'https://forum.lightburnsoftware.com/t/edges-of-acrylic-frosted/62581', 'community-forum', 'LightBurn forum', { date: '2022-03' }),
    lbForumMultiPass3mm: src('Hilo — corte multipasada de contrachapado de 3 mm', 'Thread — multiple passes cutting 3 mm plywood',
        'https://forum.lightburnsoftware.com/t/multiple-passes-cutting-3mm-plywood/56407', 'community-forum', 'LightBurn forum', { date: '2022-01' }),
    lbForumAlignmentMultiPass: src('Hilo — desalineación entre pasadas', 'Thread — alignment problem with multiple passes',
        'https://forum.lightburnsoftware.com/t/alignment-problem-with-multiple-passes/87578', 'community-forum', 'LightBurn forum', { date: '2023-01' }),
    lbForumHoneycombMarks: src('Hilo — marcas por reflexión en panal', 'Thread — marks from reflecting off honeycomb bed',
        'https://forum.lightburnsoftware.com/t/marks-bumps-from-laser-refracting-off-honeycomb-laser-bed-is-that-a-thing/58558', 'community-forum', 'LightBurn forum', { date: '2022-01' }),
    lbForumGhosting: src('Hilo — líneas fantasma en grabado de diodo', 'Thread — diode laser ghosting issue',
        'https://forum.lightburnsoftware.com/t/diode-laser-ghosting-issue/173199', 'community-forum', 'LightBurn forum', { date: '2025-06' }),
    lbForumGapsCorners: src('Hilo — huecos en esquinas al cambiar de dirección', 'Thread — gaps at corners when laser changes direction',
        'https://forum.lightburnsoftware.com/t/getting-gaps-at-corners-and-or-whenever-the-laser-changes-directions/60372', 'community-forum', 'LightBurn forum', { date: '2022-02' }),
    lbForumMinPower: src('Hilo — ajuste de potencia mínima (min power)', 'Thread — min power setting',
        'https://forum.lightburnsoftware.com/t/another-question-about-min-power-setting/138315', 'community-forum', 'LightBurn forum', { date: '2024-05' }),
    lbForumRotaryScale: src('Hilo — rotativo no guarda proporción', 'Thread — tumbler rotary not holding proportion',
        'https://forum.lightburnsoftware.com/t/tumbler-engraving-on-rotary-is-not-holding-proportion/21878', 'community-forum', 'LightBurn forum', { date: '2020-09', note: 'Hardware Ruida: cifras no transferibles al A20.' }),

    // --- Guías de makers ---
    lasertinkererFocus: src('Lasertinkerer — guía de enfoque en láser de diodo', 'Lasertinkerer — diode laser focus guide',
        'https://lasertinkerer.com/guides/diode-laser-focus/', 'blog', 'lasertinkerer.com', { date: '2026-06-26' }),
    lasertinkererBirch: src('Lasertinkerer — ajustes para contrachapado de abedul 20 W', 'Lasertinkerer — birch plywood settings, 20 W class',
        'https://lasertinkerer.com/settings/birch-plywood-cutting/', 'blog', 'lasertinkerer.com', { date: '2026-06-26', machine: 'genérico 20 W', opticalW: 20 }),
    craftgineerDither: src('Craftgineer — dithering para grabado láser', 'Craftgineer — dithering for laser engraving',
        'https://craftgineer.com/blog/dithering-for-laser-engraving', 'blog', 'craftgineer.com', { date: '2026-07-18' }),
    oneLaserMaterialTest: src('OneLaser — cómo leer una Material Test card', 'OneLaser — reading a LightBurn material test card',
        'https://www.1laser.com/blogs/topic/lightburn-material-test-card', 'blog', '1laser.com', { date: '2025-10-31' }),
    makerForumsPsi: src('MakerForums — psi del aire comprimido para air assist', 'MakerForums — what psi for air assist',
        'https://forum.makerforums.info/t/what-psi-should-i-set-my-shop-system-to-for-air-assist/86899', 'community-forum', 'MakerForums', { date: '2023-01' }),
    makerForumsCurtains: src('MakerForums — banding tipo "cortina" en grabados', 'MakerForums — curtains in engravings',
        'https://forum.makerforums.info/t/curtains-in-engravings/86235', 'community-forum', 'MakerForums', { date: '2022-10', note: 'Máquina distinta.' }),
    yumiMaintenance: src('Yumi LAB — intervals de mantenimiento de óptica y correas', 'Yumi LAB — optics and belt maintenance intervals',
        'https://wiki.yumi-lab.com/Yumi_L_Series/Yumi_L_Series_Maintenance/', 'docs', 'Yumi-LAB', { date: '2024', note: 'Máquina CO₂: intervals genéricos, no específicos del A20.' }),
    atomstackMaintenanceWiki: src('AtomStack — guía de ajustes mecánicos y mantenimiento', 'AtomStack — mechanical adjustments and maintenance guide',
        'https://diode-laser-wiki.com/documentation/guide-to-mechanical-adjustments/', 'official', 'AtomStack', { confidence: 'low', note: 'Contenido renderizado por JS; sin intervals extraíbles.' }),
    diodeLaserWikiSettings: src('Diode Laser Wiki — guía de ajustes de referencia', 'Diode Laser Wiki — guideline settings reference',
        'https://diode-laser-wiki.com/documentation/guideline-settings/', 'community-wiki', 'diode-laser-wiki.com'),
    diodeLaserWikiSoftware: src('Diode Laser Wiki — montar el software y la escala de potencia', 'Diode Laser Wiki — setting up software and the power scale',
        'https://diode-laser-wiki.com/documentation/setting-up-the-software/', 'community-wiki', 'diode-laser-wiki.com', {
        confidence: 'high', note: 'Aquí está la regla: "100 % equivale a 1000 … solo si $30 y el valor S del software coinciden".'
    }),

    // --- Experiencia reportada sobre la familia A20/X20 (presets de comunidad) ---
    lbForumX20CuttingAbility: src('Hilo — capacidad de corte del X20 Pro: "no corta nada"', 'Thread — X20 Pro cutting ability: "why can\'t I cut anything"',
        'https://forum.lightburnsoftware.com/t/atomstack-x20-pro-cutting-ability-why-cant-i-cut-anything/75758', 'community-forum', 'LightBurn forum', {
        date: '2022-09 → 2024-03', machine: 'Atomstack X20 Pro 20 W', opticalW: 20
    }),
    lbForumA20NotCutting: src('Hilo — A20 Pro no corta como se ve en otros sitios', 'Thread — A20 Pro not cutting as seen elsewhere',
        'https://forum.lightburnsoftware.com/t/a20-pro-not-cutting-as-seen-elsewhere/114981', 'community-forum', 'LightBurn forum', {
        date: '2023-10-30', machine: 'Atomstack A20 Pro 20 W', opticalW: 20,
        note: 'Caso de referencia: el S-value de LightBurn estaba en 250 en vez de 1000 → entregaba ~25 % de potencia real. Corregido, "corta como un cuchillo caliente". Predecesor directo de tu V2.'
    }),
    lbForumX20TextFails: src('Hilo — grabado de texto fallido en X20 Pro', 'Thread — X20 Pro cutting/engraving text fails',
        'https://forum.lightburnsoftware.com/t/atomstack-x20-pro-cutting-engraving-text-fails-miserably/160333', 'community-forum', 'LightBurn forum', {
        date: '2024-12-21', machine: 'Atomstack X20 Pro 20 W', opticalW: 20
    }),
    lbForumCardstockStreak: src('Hilo — rayas en el grabado de cartulina (X7 Pro, 10 W)', 'Thread — streaking when engraving cardstock (X7 Pro, 10 W)',
        'https://forum.lightburnsoftware.com/t/uneven-streaking-on-bottom-of-engraved-shapes-on-cardstock-with-atomstack-x7-pro/64618', 'community-forum', 'LightBurn forum', {
        date: '2022-04', machine: 'Atomstack X7 Pro', opticalW: 10,
        note: 'La mitad de potencia que la tuya: útil para el método (LPI y fill), no para copiar la cifra.'
    }),
    lbForumBirch38: src('Hilo — contrachapado de abedul báltico de 3/8"', 'Thread — stuck on settings for 3/8" baltic birch',
        'https://forum.lightburnsoftware.com/t/stuck-on-settings-for-3-8-baltic-birch/164086', 'community-forum', 'LightBurn forum', {
        date: '2025-01-31', machine: 'Atomstack X7 Pro', opticalW: 10
    }),
    reddit20wStruggling: src('r/Laserengraving — "20W laser struggling to cut" en un A20 Pro V2', 'r/Laserengraving — 20W laser struggling to cut on an A20 Pro V2',
        'https://www.reddit.com/r/Laserengraving/comments/1lfd2fx/20w_laser_struggling_to_cut/', 'community-forum', 'Reddit', {
        date: '2025-06-19', machine: 'Atomstack A20 Pro V2', opticalW: 20,
        note: 'El único caso que encontré con TU modelo exacto: 100 pasadas al 100 % sin cortar. La causa era un agujero de quemadura en la lente de protección. Si no corta y el preset es razonable, mira la óptica antes que la tabla.'
    }),
    bonnyCreationsA20: src('Bonny Creations — ajustes por material para el A20 Pro', 'Bonny Creations — per-material settings for the A20 Pro',
        'https://www.bonnycreations.com/settings/machines/atomstack-a20-pro', 'blog', 'bonnycreations.com', {
        date: 'sin fecha, consultado 2026-09-27', machine: 'Atomstack A20 Pro 20 W', opticalW: 20, confidence: 'low',
        note: 'Agregador: cita tablas de AtomStack y hilos no verificables hoy. Algunas velocidades (3000 mm/min a 3 mm en 1 pasada) contradicen a todos los medidores reales. Lo tratamos como optimista.'
    })
};

const SOURCE_TYPE_LABEL = {
    official: { es: 'Oficial', en: 'Official' },
    standards: { es: 'Norma', en: 'Standard' },
    docs: { es: 'Documentación', en: 'Docs' },
    'community-forum': { es: 'Foro', en: 'Forum' },
    'community-wiki': { es: 'Wiki comunidad', en: 'Community wiki' },
    reseller: { es: 'Distribuidor', en: 'Reseller' },
    review: { es: 'Análisis', en: 'Review' },
    blog: { es: 'Guía maker', en: 'Maker guide' }
};

const CONFIDENCE_LABEL = {
    high: { es: 'Alta', en: 'High' },
    medium: { es: 'Media', en: 'Medium' },
    low: { es: 'Baja', en: 'Low' }
};
