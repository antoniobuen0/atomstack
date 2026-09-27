/* Vistas curadas: detalle con fuentes, ficha de máquina, usos y bibliografía.
   Depende de script.js (tabla y carrito) y de data/*.js */

const OWNER_NOTES_KEY = 'a20v2.ownerNotes.v1';
let ownerNotes = {};
try { ownerNotes = JSON.parse(localStorage.getItem(OWNER_NOTES_KEY)) || {}; } catch (e) { ownerNotes = {}; }

function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

function materialSafetyMark(meta) {
    if (!meta || !meta.safety) return '';
    const lvl = meta.safety.level;
    return (lvl === 'forbidden' || lvl === 'caution' || lvl === 'useless') ? lvl : '';
}

function srcChips(ids) {
    if (!ids || !ids.length) return '';
    return '<span class="src-chips">' + ids.map(id => {
        const s = LASER_SOURCES[id];
        if (!s) return '';
        const lbl = t(s.labelEs, s.labelEn);
        const kind = SOURCE_TYPE_LABEL[s.type] ? SOURCE_TYPE_LABEL[s.type][currentLang] : s.type;
        const conf = CONFIDENCE_LABEL[s.confidence] || CONFIDENCE_LABEL.medium;
        const when = s.date ? ' · ' + s.date : '';
        return `<a class="src-chip type-${esc(s.type)}" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" title="${esc(lbl)} · ${esc(kind)}${esc(when)} · ${esc(t(conf.es, conf.en))}">${esc(s.publisher)}</a>`;
    }).join('') + '</span>';
}

function transferBadge(opticalW, tech) {
    const tr = transferabilityOf(opticalW, tech);
    return `<span class="badge badge-${tr.tone}">${esc(t(tr.es, tr.en))}</span>`;
}

function presetValues(p) {
    const cells = [
        [t('Grosor', 'Thickness'), (p.thicknessMm && p.thicknessMm !== '-') ? p.thicknessMm + (typeof p.thicknessMm === 'number' || /^\d/.test(p.thicknessMm) ? ' mm' : '') : '-'],
        [t('Potencia', 'Power'), p.power],
        [t('Velocidad', 'Speed'), p.speed],
        [t('Intervalo', 'Interval'), p.interval],
        [t('Pasadas', 'Passes'), p.passes],
        [t('Modo imagen', 'Image mode'), p.imageMode],
        [t('Air assist', 'Air assist'), p.airAssist]
    ];
    return '<div class="val-grid">' + cells.map(c =>
        `<div class="val"><span class="val-k">${esc(c[0])}</span><span class="val-v">${esc(c[1] || '-')}</span></div>`
    ).join('') + '</div>';
}

function presetKey(matEn, p) {
    return [matEn, p.software, p.process, p.thicknessMm, p.power, p.speed].join('|');
}

function saveOwnerNotes() {
    localStorage.setItem(OWNER_NOTES_KEY, JSON.stringify(ownerNotes));
    updateOwnerCount();
}

window.toggleOwnVerify = function (key, checked) {
    ownerNotes[key] = Object.assign({}, ownerNotes[key], { v: checked });
    if (!ownerNotes[key].v && !ownerNotes[key].n) delete ownerNotes[key];
    saveOwnerNotes();
    renderMaterialDetail();
};

window.toggleOwnNote = function (key, value) {
    ownerNotes[key] = Object.assign({}, ownerNotes[key], { n: value });
    if (!ownerNotes[key].v && !ownerNotes[key].n) delete ownerNotes[key];
    saveOwnerNotes();
};

window.exportOwnerNotes = function () {
    const blob = new Blob([JSON.stringify(ownerNotes, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mis-resultados-a20-pro-v2.json';
    a.click();
    URL.revokeObjectURL(a.href);
};

function updateOwnerCount() {
    const el = document.getElementById('own-count');
    if (el) el.textContent = Object.keys(ownerNotes).length;
}

/* ---------------- Detalle de material (cajón derecho) ---------------- */

function officialPresetsOf(materialEn) {
    return rawDataRows.filter(r => r[0] === materialEn).map(r => ({
        software: r[1], thicknessMm: r[2], interval: r[3], process: r[4],
        speed: r[5] + ' mm/min', power: r[6], imageMode: r[7], passes: r[8],
        origin: 'official'
    }));
}

function openMaterialDetail(materialEn, disp) {
    if (!shoppingPanel.classList.contains('open')) {
        shoppingPanel.classList.add('open');
        panelOverlay.classList.add('visible');
    }
    detailMaterial = { en: materialEn, disp: disp };
    currentActiveMaterial = detailMaterial;
    setPanelMode('detail');
    renderMaterialDetail();
}

function detailSection(title, inner, extraClass) {
    const sec = document.createElement('section');
    sec.className = 'detail-section' + (extraClass ? ' ' + extraClass : '');
    sec.innerHTML = `<h3>${esc(title)}</h3>${inner}`;
    return sec;
}

function presetCardHtml(matEn, p, sourceIds, badgeHtml) {
    const key = presetKey(matEn, p);
    const verified = !!(ownerNotes[key] && ownerNotes[key].v);
    const note = ownerNotes[key] && ownerNotes[key].n;
    return `<div class="preset${verified ? ' is-verified' : ''}">
        <div class="preset-top">
            <strong>${esc(p.process)}</strong>
            <span class="badge">${esc(p.software)}</span>
            ${badgeHtml || ''}
            ${srcChips(sourceIds)}
        </div>
        ${presetValues(p)}
        ${p.result ? `<p class="note">${esc(p.result)}</p>` : ''}
        ${p.reporter ? `<p class="muted small">${esc(t('Reportado en', 'Reported on'))}: ${esc(p.reporter)}</p>` : ''}
        ${p.caveat ? `<p class="caveat">⚠ ${esc(p.caveat)}</p>` : ''}
        <div class="owner-row">
            <label class="verify">
                <input type="checkbox" ${verified ? 'checked' : ''} onchange="toggleOwnVerify('${esc(key)}', this.checked)"/>
                ${esc(t('Verificado en mi máquina', 'Verified on my machine'))}
            </label>
            <input class="own-note" type="text" value="${esc(note || '')}"
                placeholder="${esc(t('Mi resultado…', 'My result…'))}"
                oninput="toggleOwnNote('${esc(key)}', this.value)"/>
        </div>
    </div>`;
}

function renderMaterialDetail() {
    if (!detailMaterial) return;
    const en = detailMaterial.en;
    const meta = MATERIAL_META[en] || {};
    detailContainer.innerHTML = '';

    const official = officialPresetsOf(en);
    detailContainer.appendChild(detailSection(
        t('Wiki oficial AtomStack', 'Official AtomStack wiki'),
        official.length
            ? official.map(p => presetCardHtml(en, Object.assign({}, p, { result: null }), ['atomstackOfficialPresetTable'], '')).join('')
            : `<p class="muted">${esc(t('Sin filas oficiales para este material.', 'No official rows for this material.'))}</p>`
    ));

    const community = (meta.communityPresets || []).map(p => Object.assign({}, p, {
        result: p.resultEs ? t(p.resultEs, p.resultEn) : null,
        reporter: (LASER_SOURCES[(p.sourceIds || [])[0]] || {}).machine,
        caveat: p.caveatEs ? t(p.caveatEs, p.caveatEn) : null
    }));
    detailContainer.appendChild(detailSection(
        t('Comunidad', 'Community'),
        community.length
            ? community.map(p => presetCardHtml(en, p, p.sourceIds, transferBadge(p.opticalW, p.tech))).join('')
            : `<p class="muted">${esc(t('Aún sin presets de comunidad curados aquí. Márcalo tú: tu resultado vale más que el de nadie.', 'No curated community presets here yet. Add yours: your own result beats anyone else\'s.'))}</p>`
    ));

    if (meta.safety) {
        detailContainer.appendChild(detailSection(t('Seguridad', 'Safety'),
            `<p class="safety ${esc(meta.safety.level)}">${esc(t(meta.safety.es, meta.safety.en))}</p>${srcChips(meta.safety.sourceIds)}`,
            'sec-' + esc(meta.safety.level)));
    }

    if (meta.tips && meta.tips.length) {
        detailContainer.appendChild(detailSection(t('Consejos', 'Tips'),
            meta.tips.map(tp => `<p class="note">${esc(t(tp.es, tp.en))}</p>${srcChips(tp.sourceIds)}`).join('')));
    }

    const mine = Object.keys(ownerNotes).filter(k => k.indexOf(en + '|') === 0).length;
    detailContainer.appendChild(detailSection(t('Mis resultados', 'My results'),
        `<p class="muted">${esc(t(`${mine} preset(s) anotados en este material. Se guardan en este navegador.`, `${mine} preset note(s) on this material, stored in this browser.`))}</p>
         <button class="btn btn-secondary btn-sm" onclick="exportOwnerNotes()">${esc(t('Exportar mis datos (JSON)', 'Export my data (JSON)'))}</button>
         <p class="muted small">${esc(t('Los enlaces de cada bloque abren la fuente original.', 'Every block links to its original source.'))}</p>`));
}

/* ---------------- Máquina ---------------- */

function renderMachineView() {
    const q = searchInput.value.toLowerCase().trim();
    machineView.innerHTML = '';

    machineView.appendChild(el(`<div class="hero-card">
        <div class="hero-title">${esc(MACHINE_SPECS.model)}</div>
        <div class="hero-chips">
            <span class="hero-chip"><b>${esc(String(MACHINE_SPECS.opticalW))} W</b>${esc(t('ópticos', 'optical'))}</span>
            <span class="hero-chip"><b>400 × 365</b>${esc(t(' mm de área', ' mm area'))}</span>
            <span class="hero-chip"><b>400 mm/s</b>${esc(t('velocidad máx', 'max speed'))}</span>
            <span class="hero-chip"><b>455 nm</b>${esc(t('diodo azul', 'blue diode'))}</span>
        </div>
        <p class="muted small">${esc(t('Modelo vendido también como "Ace Pro V2". Pulsa cualquier etiqueta azul para abrir su fuente.', 'Also sold as "Ace Pro V2". Click any blue chip to open its source.'))}</p>
    </div>`));

    MACHINE_SPECS.groups.forEach(g => {
        const items = g.items.filter(it => !q ||
            (t(it.labelEs, it.labelEn) + ' ' + it.value + ' ' + (it.noteEs || '')).toLowerCase().includes(q));
        if (!items.length) return;
        machineView.appendChild(el(`<section class="spec-group">
            <h3>${esc(t(g.labelEs, g.labelEn))}</h3>
            ${items.map(it => `<div class="spec-item">
                <div class="spec-k">${esc(t(it.labelEs, it.labelEn))}</div>
                <div class="spec-v">${esc(currentLang === 'es' && it.valueEs ? it.valueEs : it.value)}</div>
                ${(currentLang === 'es' ? it.noteEs : it.noteEn) ? `<div class="spec-n">${esc(currentLang === 'es' ? it.noteEs : it.noteEn)}</div>` : ''}
                <div>${srcChips(it.sourceIds)}</div>
            </div>`).join('')}
        </section>`));
    });

    if (!q) {
        machineView.appendChild(el(`<section class="spec-group gaps">
            <h3>${esc(t('Lo que AtomStack no publica', 'What AtomStack does not publish'))}</h3>
            <p class="muted">${esc(t('Huecos reales de la ficha oficial. No los hemos inventado: si los mides tú, anótalos y súbelos a la base curada.', 'Genuine gaps in the official sheet. We did not invent values: measure them yourself and we will promote them into the curated base.'))}</p>
            <ul class="gap-list">${MACHINE_SPECS.gaps.map(g => `<li>${esc(t(g.es, g.en))}</li>`).join('')}</ul>
        </section>`));
    }
}

function el(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.firstElementChild;
}

/* ---------------- Usos y técnicas ---------------- */

function renderTechniquesView() {
    const q = searchInput.value.toLowerCase().trim();
    techniquesView.innerHTML = '';

    const cards = TECHNIQUES.filter(tk => !q ||
        (t(tk.titleEs, tk.titleEn) + ' ' + t(tk.summaryEs, tk.summaryEn) + ' ' +
            tk.items.map(i => t(i.labelEs, i.labelEn) + ' ' + t(i.valueEs, i.valueEn) + ' ' + t(i.noteEs, i.noteEn)).join(' '))
            .toLowerCase().includes(q));

    if (!cards.length) {
        techniquesView.innerHTML = `<div class="empty-state"><p>${esc(t('Ningún uso coincide con tu búsqueda.', 'No use case matches your search.'))}</p></div>`;
        return;
    }

    techniquesView.appendChild(el(`<div class="view-intro">${esc(t(
        'Qué hacer además del preset. Cada cifra lleva su fuente y, si viene de otra máquina, su advertencia.',
        'What to do beyond the preset. Every figure links to its source, and to a warning if it came from another machine.'))}</div>`));

    cards.forEach(tk => {
        techniquesView.appendChild(el(`<article class="tech-card" id="tech-${esc(tk.id)}">
            <header class="tech-head">
                <span class="tech-icon">${tk.icon}</span>
                <div>
                    <h3>${esc(t(tk.titleEs, tk.titleEn))}</h3>
                    <span class="badge">${esc(t(tk.groupEs, tk.groupEn))}</span>
                </div>
            </header>
            <p class="tech-summary">${esc(t(tk.summaryEs, tk.summaryEn))}</p>
            ${tk.items.map(it => `<div class="tech-item">
                <div class="tech-k">${esc(t(it.labelEs, it.labelEn))}</div>
                <div class="tech-v">${esc(t(it.valueEs, it.valueEn))}</div>
                ${(currentLang === 'es' ? it.noteEs : it.noteEn) ? `<div class="tech-n">${esc(currentLang === 'es' ? it.noteEs : it.noteEn)}</div>` : ''}
                ${it.caveatEs ? `<div class="caveat">⚠ ${esc(t(it.caveatEs, it.caveatEn))}</div>` : ''}
                <div>${srcChips(it.sourceIds)}</div>
            </div>`).join('')}
        </article>`));
    });
}

/* ---------------- Fuentes ---------------- */

function collectSourceUsage() {
    const used = {};
    const bump = id => { if (id) used[id] = (used[id] || 0) + 1; };

    MACHINE_SPECS.groups.forEach(g => g.items.forEach(i => (i.sourceIds || []).forEach(bump)));
    TECHNIQUES.forEach(tk => tk.items.forEach(i => (i.sourceIds || []).forEach(bump)));
    KNOWN_CONFLICTS.forEach(c => (c.sourceIds || []).forEach(bump));
    PROHIBITED_GLOBAL.forEach(p => (p.sourceIds || []).forEach(bump));
    Object.keys(MATERIAL_META).forEach(k => {
        const m = MATERIAL_META[k];
        if (m.safety) (m.safety.sourceIds || []).forEach(bump);
        (m.tips || []).forEach(tp => (tp.sourceIds || []).forEach(bump));
        (m.communityPresets || []).forEach(p => (p.sourceIds || []).forEach(bump));
    });
    rawDataRows.forEach(() => { }); // la tabla oficial se atribuye en bloque a atomstackOfficialPresetTable
    used.atomstackOfficialPresetTable = (used.atomstackOfficialPresetTable || 0) + rawDataRows.length;
    return used;
}

function renderSourcesView() {
    const q = searchInput.value.toLowerCase().trim();
    const usage = collectSourceUsage();
    sourcesView.innerHTML = '';

    const all = Object.keys(LASER_SOURCES);
    const high = all.filter(k => LASER_SOURCES[k].confidence === 'high').length;

    sourcesView.appendChild(el(`<div class="hero-card">
        <div class="hero-title">${esc(t('De dónde sale cada dato', 'Where every number comes from'))}</div>
        <div class="hero-chips">
            <span class="hero-chip"><b>${all.length}</b>${esc(t('fuentes', 'sources'))}</span>
            <span class="hero-chip"><b>${high}</b>${esc(t('confianza alta', 'high confidence'))}</span>
            <span class="hero-chip"><b>${rawDataRows.length}</b>${esc(t('filas oficiales', 'official rows'))}</span>
            <span class="hero-chip"><b>${Object.keys(ownerNotes).length}</b>${esc(t('verificadas por mí', 'verified by me'))}</span>
        </div>
        <p class="muted small">${esc(t('Todas consultadas el ' + ACCESSED_ON + '. Un enlace roto es un fallo de este panel: avísame y lo sustituimos.', 'All accessed on ' + ACCESSED_ON + '. A dead link is a defect of this panel: tell me and we replace it.'))}</p>
    </div>`));

    const byType = {};
    all.forEach(k => {
        const s = LASER_SOURCES[k];
        const hay = (s.labelEs + ' ' + s.labelEn + ' ' + s.publisher + ' ' + s.url).toLowerCase();
        if (q && !hay.includes(q)) return;
        (byType[s.type] = byType[s.type] || []).push(k);
    });

    const order = ['official', 'docs', 'standards', 'community-forum', 'community-wiki', 'reseller', 'review', 'blog'];
    order.forEach(type => {
        const keys = byType[type];
        if (!keys || !keys.length) return;
        const label = SOURCE_TYPE_LABEL[type] ? t(SOURCE_TYPE_LABEL[type].es, SOURCE_TYPE_LABEL[type].en) : type;
        sourcesView.appendChild(el(`<section class="spec-group">
            <h3>${esc(label)}</h3>
            ${keys.map(k => {
            const s = LASER_SOURCES[k];
            const conf = CONFIDENCE_LABEL[s.confidence] || CONFIDENCE_LABEL.medium;
            return `<div class="src-row">
                <div class="src-main">
                    <a class="src-name" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(t(s.labelEs, s.labelEn))} ↗</a>
                    <div class="src-meta">
                        <span class="badge badge-conf-${esc(s.confidence)}">${esc(t(conf.es, conf.en))}</span>
                        ${s.date ? `<span class="muted small">${esc(t('publicado', 'published'))} ${esc(s.date)}</span>` : ''}
                        <span class="muted small">${esc(t('· usado en', '· backs'))} ${usage[k] || 0} ${esc(t('datos', 'data points'))}</span>
                        ${s.machine ? `<span class="muted small">· ${esc(s.machine)}${s.opticalW ? ' (' + esc(String(s.opticalW)) + ' W)' : ''}</span>` : ''}
                    </div>
                    ${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}
                </div>
            </div>`;
        }).join('')}
        </section>`));
    });

    if (!q) {
        sourcesView.appendChild(el(`<section class="spec-group conflicts">
            <h3>${esc(t('Desacuerdos abiertos', 'Open disagreements'))}</h3>
            <p class="muted">${esc(t('La red no está de acuerdo en esto. No decidimos por ti: te lo enseñamos.', 'The net disagrees on these. We don\'t decide for you — we show you.'))}</p>
            ${KNOWN_CONFLICTS.map(c => `<div class="conflict">
                <strong>${esc(t(c.topicEs, c.topicEn))}</strong>
                <p>${esc(t(c.detailEs, c.detailEn))}</p>
                ${srcChips(c.sourceIds)}
            </div>`).join('')}
        </section>`));

        sourcesView.appendChild(el(`<section class="spec-group">
            <h3>${esc(t('Incompatible con un diodo de 455 nm', 'Not for a 455 nm diode'))}</h3>
            ${PROHIBITED_GLOBAL.map(p => `<div class="prohibit level-${esc(p.level)}">
                <strong>${esc(t(p.nameEs, p.nameEn))}</strong>
                <p>${esc(t(p.whyEs, p.whyEn))}</p>
                ${srcChips(p.sourceIds)}
            </div>`).join('')}
        </section>`));
    }
}

/* ---- Materiales añadidos solo por la red (sin fila en la wiki oficial) ---- */
function renderExtraMaterials(searchTerm) {
    const strip = document.getElementById('extra-materials');
    if (!strip) return;
    const q = (searchTerm || '').trim();
    // Sólo tiene sentido en la vista completa: con filtros de software/proceso aplicados, fuera.
    const list = (softwareFilter.value === 'All' && processingFilter.value === 'All')
        ? MATERIAL_COMMUNITY_ONLY.filter(en => {
            const m = MATERIAL_META[en] || {};
            return !q || en.toLowerCase().includes(q) || (m.es || '').toLowerCase().includes(q);
        })
        : [];

    if (!list.length) { strip.innerHTML = ''; return; }
    strip.innerHTML = `<div class="extra-strip">
        <span class="extra-label">${esc(t('Añadidos de la red, sin fila oficial:', 'Added from the net, no official row:'))}</span>
        ${list.map(en => {
        const m = MATERIAL_META[en];
        const disp = t(m.es || en, m.en || en);
        const n = (m.communityPresets || []).length;
        return `<button class="extra-chip" onclick="openMaterialDetail('${esc(en)}','${esc(disp)}')">${esc(disp)} <span class="muted">${n}</span></button>`;
    }).join('')}
    </div>`;
}

/* ---------------- Arranque ---------------- */

parseCSV(a20ProV2Data);
initMaterialFilter();
updateUILabels();
renderTable();
updateOwnerCount();
