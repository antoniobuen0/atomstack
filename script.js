// Dictionary for English to Spanish Material Translation
const translations = {
    "Basswood": "Tilo",
    "Paulownia Wood": "Madera de Paulownia",
    "Cork Wood": "Madera de corcho",
    "Yellow Peach Wood": "Madera de melocotonero amarillo",
    "Bamboo": "Bambú",
    "Acrylic": "Acrílico",
    "Ceramic Tile": "Azulejo de cerámica",
    "Kraft Paper": "Papel Kraft",
    "Office Paper": "Papel de oficina",
    "Oil Painting Paper": "Papel de pintura al óleo",
    "Mirrors": "Espejos",
    "Leather": "Cuero",
    "Stainless Steel Sheet": "Lámina de acero inoxidable",
    "Mirror Stainless Steel": "Acero inoxidable de espejo",
    "Brushed Stainless Steel": "Acero inoxidable cepillado",
    "Pine": "Pino",
    "Ceramics": "Cerámica",
    "Alumina": "Alúmina",
    "Glass": "Vidrio",
    "Denim": "Tela vaquera",
    "Plastic": "Plástico",
    "Carton": "Cartón",
    "MDF": "MDF",
    "Galvanized Iron": "Hierro galvanizado",
    "Rock": "Roca",
    "Crystal Stone": "Piedra de cristal",
    "Mahogany": "Caoba",
    "PCB Board": "Placa PCB",
    "High Density Foam Board": "Tablero de espuma de alta densidad",
    "Two Color Plate": "Placa de dos colores",
    "Resin": "Resina",
    "Artificial Beef Bone": "Hueso de res artificial",
    "Rubber": "Goma",
    "Iron Sheet": "Lámina de hierro",
    "Artificial Agate": "Ágata artificial",
    "Cobblestone": "Adoquín"
};

const i18nHeaders = {
    en: ["Material Name", "Software", "Thickness(mm)", "Line Interval / Quality", "Processing", "Speed(mm/min)", "Max-Power / S-Max", "Image Mode", "Number of Passes"],
    es: ["Nombre del Material", "Software", "Grosor(mm)", "Intervalo de línea / Calidad", "Procesamiento", "Velocidad(mm/min)", "Potencia Máx / S-Máx", "Modo de Imagen", "Número de Pasadas"]
};

let currentLang = 'es'; // 'en' or 'es'
let currentSort = 'default';
let rawDataRows = [];
let headers = [];

// DOM Elements
const tableHeadRow = document.getElementById('table-head-row');
const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('search-input');
const softwareFilter = document.getElementById('software-filter');
const processingFilter = document.getElementById('processing-filter');
const sortControls = document.getElementById('sort-controls');
const langToggleBtn = document.getElementById('lang-toggle-btn');
const langLabel = document.getElementById('lang-label');
const exportExcelBtn = document.getElementById('export-excel-btn');
const exportLabel = document.getElementById('export-label');
const subtitle = document.getElementById('subtitle');
const emptyState = document.getElementById('empty-state');
const tableContainer = document.querySelector('.table-container');

// Shopping panel elements
const shoppingPanel = document.getElementById('shopping-panel');
const panelOverlay = document.getElementById('panel-overlay');
const shoppingTitle = document.getElementById('shopping-title');
const closeShoppingBtn = document.getElementById('close-shopping-btn');
const providersContainer = document.getElementById('providers-container');
const cartContainer = document.getElementById('cart-container');
const toggleShoppingBtn = document.getElementById('toggle-shopping-btn');
const shoppingEmptyMsg = document.getElementById('shopping-empty-msg');
const viewCartBtn = document.getElementById('view-cart-btn');

// Header Cart Elements
const headerCartBtn = document.getElementById('header-cart-btn');
const headerCartCount = document.getElementById('header-cart-count');
const headerCartTotal = document.getElementById('header-cart-total');

// Tab and View Elements
const materialsView = document.getElementById('materials-view');
const productsView = document.getElementById('products-view');
const storeGrid = document.getElementById('store-grid');
const searchRow = document.querySelector('.search-bar-row');
const filterBar = document.querySelector('.filter-bar');

let cart = [];
let currentPanelView = 'catalog'; // 'catalog' | 'cart'
let currentActiveMaterial = null;

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    headers = lines[0].split(',').map(h => h.trim());
    // Store original index for default sorting
    rawDataRows = lines.slice(1).map((line, idx) => {
        let cells = line.split(',').map(cell => cell.trim());
        cells.push(idx); // Append original index at the end
        return cells;
    });
}

function getTranslatedName(nameStr, lang) {
    if (lang === 'en') return nameStr;
    let esName = translations[nameStr];
    return esName ? esName : nameStr;
}

function renderTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const sfFilter = softwareFilter.value;
    const procFilter = processingFilter.value;

    // Map rows to include translated material names explicitly for sorting/filtering
    let mappedRows = rawDataRows.map(row => {
        const materialEn = row[0];
        const materialEs = translations[materialEn] || materialEn;
        const currentName = currentLang === 'en' ? materialEn : materialEs;

        let translatedRow = [...row];
        translatedRow[0] = currentName;

        if (currentLang === 'es') {
            if (translatedRow[4] === 'Cutting') translatedRow[4] = 'Corte';
            if (translatedRow[4] === 'Engraving') translatedRow[4] = 'Grabado';
        }

        return {
            originalRow: row,
            translatedRow: translatedRow,
            currentName: currentName,
            materialEn: materialEn,
            materialEs: materialEs,
            originalIndex: row[row.length - 1]
        };
    });

    // Filtering
    let filteredRows = mappedRows.filter(data => {
        const sw = data.originalRow[1];
        const proc = data.originalRow[4];

        const matchesSearch = data.materialEn.toLowerCase().includes(searchTerm) || data.materialEs.toLowerCase().includes(searchTerm);
        const matchesSoftware = (sfFilter === 'All') || (sw === sfFilter);
        const matchesProcessing = (procFilter === 'All') || (proc === procFilter);

        return matchesSearch && matchesSoftware && matchesProcessing;
    });

    // Sorting
    filteredRows.sort((a, b) => {
        if (currentSort === 'asc') {
            return a.currentName.localeCompare(b.currentName);
        } else if (currentSort === 'desc') {
            return b.currentName.localeCompare(a.currentName);
        } else {
            // default
            return a.originalIndex - b.originalIndex;
        }
    });

    // Translate Headers
    const currentHeaders = i18nHeaders[currentLang];
    tableHeadRow.innerHTML = currentHeaders.map(h => `<th>${h}</th>`).join('');

    // Translate Rows
    tableBody.innerHTML = '';

    if (filteredRows.length === 0) {
        emptyState.style.display = 'block';
        tableContainer.style.display = 'none';
        return;
    } else {
        emptyState.style.display = 'none';
        tableContainer.style.display = 'block';
    }

    filteredRows.forEach(data => {
        const tr = document.createElement('tr');
        tr.className = 'clickable-row';
        const displayCols = data.translatedRow.slice(0, -1);
        tr.innerHTML = displayCols.map((cell, idx) => `<td data-label="${currentHeaders[idx].replace(/<[^>]*>?/gm, '')}">${cell !== undefined ? cell : '-'}</td>`).join('');

        tr.addEventListener('click', () => {
            openShoppingPanel(data.materialEn, data.currentName);
        });

        tableBody.appendChild(tr);
    });
}

function updateUILabels() {
    if (currentLang === 'es') {
        langLabel.textContent = "English";
        exportLabel.textContent = "Exportar Excel";
        subtitle.textContent = "Configuración de materiales";
        searchInput.placeholder = "Buscar material...";
        softwareFilter.options[0].text = "Todos los Software";
        processingFilter.options[0].text = "Todos los Procesos";
        processingFilter.options[1].text = "Grabado";
        processingFilter.options[2].text = "Corte";
        sortControls.options[0].text = "Orden por defecto";
        sortControls.options[1].text = "A-Z (Ascendente)";
        sortControls.options[2].text = "Z-A (Descendente)";
    } else {
        langLabel.textContent = "Castellano";
        exportLabel.textContent = "Export to Excel";
        subtitle.textContent = "Material Settings";
        searchInput.placeholder = "Search materials...";
        softwareFilter.options[0].text = "All Software";
        processingFilter.options[0].text = "All Processing";
        processingFilter.options[1].text = "Engraving";
        processingFilter.options[2].text = "Cutting";
        sortControls.options[0].text = "Default Order";
        sortControls.options[1].text = "A-Z (Ascending)";
        sortControls.options[2].text = "Z-A (Descending)";
    }
}

// Event Listeners
searchInput.addEventListener('input', () => {
    if (productsView.style.display === 'block') {
        renderStoreGrid();
    } else {
        renderTable();
    }
});
softwareFilter.addEventListener('change', renderTable);
processingFilter.addEventListener('change', renderTable);
sortControls.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTable();
});

langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    updateUILabels();
    renderTable();
});

exportExcelBtn.addEventListener('click', () => {
    const table = document.getElementById('material-table');
    const ws = XLSX.utils.table_to_sheet(table);

    const currentHeaders = i18nHeaders[currentLang];
    const wscols = currentHeaders.map(h => ({ wch: Math.max(h.length, 12) }));
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    const sheetName = currentLang === 'es' ? 'Materiales' : 'Materials';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const fileName = `AtomStack_A20_Pro_V2_Settings_${currentLang.toUpperCase()}.xlsx`;
    XLSX.writeFile(wb, fileName);
});

// Shopping List Logic
window.addToCart = function (materialEn, optIndex) {
    const opt = shoppingData[materialEn][optIndex];
    const existingItem = cart.find(item => item.material === materialEn && item.name === opt.name);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            material: materialEn,
            provider: opt.provider,
            name: opt.name,
            price: opt.price,
            priceStr: opt.priceStr,
            qty: 1
        });
    }

    updateCartUI();
    // Vuelve automáticamente al carrito o muestra feedback si quisieras
};

window.updateQty = function (index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
    renderCart();
};

window.checkout = function () {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    alert(`Procediendo a pasarela de pago.\nTotal simulado: ${total.toFixed(2)}€\nProductos: ${cart.length}`);
    cart = [];
    updateCartUI();
    renderCart();
    toggleCartView('catalog');
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalMoney = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    headerCartCount.textContent = totalItems;
    headerCartTotal.textContent = totalMoney.toFixed(2) + ' €';

    const floatingCartBadge = document.getElementById('floating-cart-badge');
    if (floatingCartBadge) {
        floatingCartBadge.textContent = totalItems;
        floatingCartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function toggleCartView(forceView) {
    if (forceView) currentPanelView = forceView;
    else currentPanelView = currentPanelView === 'catalog' ? 'cart' : 'catalog';

    if (currentPanelView === 'cart') {
        providersContainer.style.display = 'none';
        cartContainer.style.display = 'block';
        shoppingTitle.textContent = currentLang === 'es' ? 'Tu Cesta' : 'Your Cart';
        viewCartBtn.innerHTML = '🔙 Volver';
        renderCart();
    } else {
        providersContainer.style.display = 'block';
        cartContainer.style.display = 'none';
        viewCartBtn.innerHTML = `🛒 <span id="cart-count">${cart.reduce((s, i) => s + i.qty, 0)}</span>`;
        if (currentActiveMaterial) {
            shoppingTitle.textContent = currentLang === 'es' ? `Precios: ${currentActiveMaterial.disp}` : `Prices: ${currentActiveMaterial.disp}`;
        } else {
            shoppingTitle.textContent = 'Catálogo';
        }
    }
}

viewCartBtn.addEventListener('click', () => toggleCartView());

function openShoppingPanel(materialEn, materialNameDisp) {
    if (!shoppingPanel.classList.contains('open')) {
        shoppingPanel.classList.add('open');
        panelOverlay.classList.add('visible');
    }

    currentActiveMaterial = { en: materialEn, disp: materialNameDisp };

    // Switch to catalog mode whenever a new material is clicked
    toggleCartView('catalog');

    if (currentLang === 'es') {
        shoppingTitle.textContent = `Precios: ${materialNameDisp} (Todos los grosores)`;
    } else {
        shoppingTitle.textContent = `Prices for: ${materialNameDisp} (All thicknesses)`;
    }

    renderShoppingOptions(materialEn);
}

function renderShoppingOptions(materialEn) {
    const options = shoppingData[materialEn];
    providersContainer.innerHTML = '';

    if (!options || options.length === 0) {
        providersContainer.innerHTML = `
            <div class="empty-shopping">
                <span class="icon-large">📦</span>
                <p>${currentLang === 'es' ? 'No se han encontrado proveedores o dataset para este material.' : 'No suppliers found in dataset for this material.'}</p>
            </div>
        `;
        return;
    }

    const minPrice = Math.min(...options.map(o => o.price));

    options.forEach((opt, idx) => {
        const isBestPrice = opt.price === minPrice && options.length > 1;
        const card = document.createElement('div');
        card.className = 'shopping-card';
        card.innerHTML = `
            ${isBestPrice ? '<span class="best-price-badge">⭐ Mejor Precio</span>' : ''}
            <div class="shopping-provider">${opt.provider}</div>
            <div class="shopping-name">${opt.name}</div>
            <div class="shopping-specs">
                <strong>Variedad / Grosor:</strong> ${opt.specs}<br/>
                <small style="color:#666; font-size:10px;">
                    🚚 ${opt.shipping_cost === 0 ? 'Envío gratis' :
                (opt.shipping_cost ? `Envío: ${opt.shipping_cost.toFixed(2)}€` : 'Consultar envío')}
                    ${opt.free_shipping_min ? ` (Gratis desde ${opt.free_shipping_min}€)` : ''} | 
                    🗓️ ${opt.query_date}
                </small>
            </div>
            <div class="shopping-footer">
                <div class="shopping-price">
                    ${opt.priceStr}
                    ${opt.vat_included ? '<span class="vat-badge">IVA inc.</span>' : ''}
                </div>
                <div style="display:flex; gap: 8px;">
                    <a href="${opt.url}" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration:none;" rel="noopener noreferrer">Ver Web</a>
                    <button class="btn btn-primary btn-sm btn-buy" onclick="addToCart('${materialEn}', ${idx})">Añadir 🛒</button>
                </div>
            </div>
        `;
        providersContainer.appendChild(card);
    });
}

function renderCart() {
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-shopping">
                <span class="icon-large">🛍️</span>
                <p>Tu carrito está vacío.</p>
            </div>
        `;
        return;
    }

    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.priceStr} ud.</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="updateQty(${idx}, -1)">-</button>
                <span style="font-weight:bold; min-width: 16px; text-align:center;">${item.qty}</span>
                <button class="qty-btn" onclick="updateQty(${idx}, 1)">+</button>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    const summary = document.createElement('div');
    summary.className = 'cart-total-section';
    summary.innerHTML = `
        <div class="cart-total-row">
            <span>Total:</span>
            <span>${total.toFixed(2)} €</span>
        </div>
        <button class="btn btn-primary btn-checkout" onclick="checkout()">Simular Checkout</button>
    `;
    cartContainer.appendChild(summary);
}

function closeShoppingPanel() {
    shoppingPanel.classList.remove('open');
    panelOverlay.classList.remove('visible');
}

closeShoppingBtn.addEventListener('click', closeShoppingPanel);
panelOverlay.addEventListener('click', closeShoppingPanel);

toggleShoppingBtn.addEventListener('click', () => {
    shoppingPanel.classList.toggle('open');
    panelOverlay.classList.toggle('visible');
});

headerCartBtn.addEventListener('click', () => {
    shoppingPanel.classList.add('open');
    panelOverlay.classList.add('visible');
    toggleCartView('cart');
});

// Tab Logic
window.switchTab = function (tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');

    const providersView = document.getElementById('providers-view');

    if (tabId === 'materials') {
        materialsView.style.display = 'block';
        searchRow.style.display = 'block';
        filterBar.style.display = 'flex';
        productsView.style.display = 'none';
        if (providersView) providersView.style.display = 'none';
        renderTable();
    } else if (tabId === 'products') {
        materialsView.style.display = 'none';
        searchRow.style.display = 'block';
        filterBar.style.display = 'none';
        productsView.style.display = 'block';
        if (providersView) providersView.style.display = 'none';
        renderStoreGrid();
    } else if (tabId === 'providers') {
        materialsView.style.display = 'none';
        searchRow.style.display = 'block';
        filterBar.style.display = 'none';
        productsView.style.display = 'none';
        if (providersView) { providersView.style.display = 'block'; renderProvidersView(); }
    }
};

function renderStoreGrid() {
    storeGrid.innerHTML = '';
    const query = searchInput.value.toLowerCase().trim();
    const uniqueMaterials = Object.keys(shoppingData);

    let matchedCount = 0;
    uniqueMaterials.forEach(matEn => {
        const matTrans = (currentLang === 'es' && translations[matEn]) ? translations[matEn] : matEn;

        // Search Filter
        if (query && !matTrans.toLowerCase().includes(query) && !matEn.toLowerCase().includes(query)) {
            return;
        }

        const optionsCount = shoppingData[matEn].length;
        if (optionsCount === 0) return;

        matchedCount++;

        const card = document.createElement('div');
        card.className = 'store-item-card';
        card.onclick = () => openShoppingPanel(matEn, matTrans);
        card.innerHTML = `
            <div class="store-item-title">${matTrans}</div>
            <div class="store-item-meta">${optionsCount} ${optionsCount === 1 ? 'Opción disponible' : 'Opciones disponibles'}</div>
            <div class="store-item-btn">Ver Catálogo &rarr;</div>
        `;
        storeGrid.appendChild(card);
    });

    // Optional: Add an empty state if no products match
    if (matchedCount === 0) {
        storeGrid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><p>No se han encontrado insumos que coincidan con "${query}".</p></div>`;
    }
}


// Provider Directory (from research)
const providerDirectory = [
    {
        name: "Laser Project",
        url: "https://www.laserproject.es",
        profile: "pro",
        profileLabel: "Profesional",
        vatNote: "Algunos precios excluyen IVA (especialmente metales). Verificar en página.",
        freeShipping: 70.00,
        shippingCost: "5,95 €",
        shippingNote: "Envío gratis ≥70 € (sin IVA). Peninsular.",
        materials: ["Acrylic","Cork Wood","Two Color Plate","Rubber","Stainless Steel Sheet","MDF","Basswood","Alumina","Mirror Stainless Steel"]
    },
    {
        name: "Brildor",
        url: "https://www.brildor.com",
        profile: "maker",
        profileLabel: "Maker / PYME",
        vatNote: "Precios con IVA incluido (B2C).",
        freeShipping: 50.00,
        shippingCost: "5,80 €",
        shippingNote: "Envío gratis ≥50 € (sin IVA). Peninsular.",
        materials: ["Bamboo","Brushed Stainless Steel","Plastic","Two Color Plate","Rubber","Leather","Glass"]
    },
    {
        name: "TuRegalo3D",
        url: "https://www.turegalo3d.com",
        profile: "maker",
        profileLabel: "Maker / PYME",
        vatNote: "Precios con IVA incluido.",
        freeShipping: 100.00,
        shippingCost: "4,95 €",
        shippingNote: "Envío gratis ≥100 €. Urgente 6,95 €.",
        materials: ["Acrylic","MDF","Basswood","Rubber"]
    },
    {
        name: "Artesanía Chopo",
        url: "https://www.artesaniachopo.com",
        profile: "maker",
        profileLabel: "Maker / Artesanos",
        vatNote: "Precios con IVA incluido (\"impuestos incluidos\").",
        freeShipping: 60.00,
        shippingCost: null,
        shippingNote: "<25€: 4,99€ | 25–60€: 2,99€ | >60€: gratis.",
        materials: ["Cork Wood","Basswood"]
    },
    {
        name: "OPITEC",
        url: "https://www.opitec.es",
        profile: "maker",
        profileLabel: "Maker / Educación",
        vatNote: "Precios con IVA incluido (salvo indicación).",
        freeShipping: 100.00,
        shippingCost: "6,99 €",
        shippingNote: "Envío gratis ≥100 €.",
        materials: ["MDF","Cork Wood","Basswood","Paulownia Wood"]
    },
    {
        name: "Amazon España",
        url: "https://www.amazon.es",
        profile: "general",
        profileLabel: "Generalista",
        vatNote: "Precios con IVA incluido (B2C).",
        freeShipping: 29.00,
        shippingCost: "2,99–3,99 €",
        shippingNote: "Envío gratis ≥29 € (pedidos Amazon). Variables por vendedor.",
        materials: ["Basswood","Paulownia Wood","Yellow Peach Wood","Bamboo","Office Paper","Kraft Paper","Leather","Glass","Ceramics","MDF","Rock","Artificial Agate","Cobblestone","Mahogany","Artificial Beef Bone","High Density Foam Board"]
    },
    {
        name: "Leroy Merlin",
        url: "https://www.leroymerlin.es",
        profile: "general",
        profileLabel: "Bricolaje",
        vatNote: "Precios con IVA incluido (confirmado pág. comunidad LM).",
        freeShipping: null,
        shippingCost: "Variable por peso/zona",
        shippingNote: "No hay umbral único público. Coste estimado 5–15 € según bulto.",
        materials: ["Cork Wood","Pine","MDF","Galvanized Iron","Iron Sheet","Ceramic Tile","Cobblestone"]
    },
    {
        name: "Todo-grabado",
        url: "https://www.todo-grabado.com",
        profile: "pro",
        profileLabel: "Profesional / B2B",
        vatNote: "Precios SIN IVA (web orientada a profesionales). IVA añadir en checkout.",
        freeShipping: null,
        shippingCost: null,
        shippingNote: "Envío calculado en checkout.",
        materials: ["Rubber","Two Color Plate","Acrylic"]
    },
    {
        name: "Corcho24",
        url: "https://corcho24.es",
        profile: "maker",
        profileLabel: "Especialista corcho",
        vatNote: "Precios con IVA incluido.",
        freeShipping: null,
        shippingCost: null,
        shippingNote: "Consultar en web.",
        materials: ["Cork Wood"]
    },
    {
        name: "Feroca",
        url: "https://www.feroca.com",
        profile: "pro",
        profileLabel: "Profesional / Especialista",
        vatNote: "Precios con IVA incluido. Envío gratis ≥100 €.",
        freeShipping: 100.00,
        shippingCost: "5,00 €",
        shippingNote: "Envío gratis ≥100 €.",
        materials: ["Resin"]
    },
    {
        name: "Electan / Electrocomponentes",
        url: "https://www.electan.com",
        profile: "pro",
        profileLabel: "Electrónica / PCB",
        vatNote: "Consultar en web. Orientado a profesional.",
        freeShipping: null,
        shippingCost: null,
        shippingNote: "Variable.",
        materials: ["PCB Board"]
    },
    {
        name: "LaserBoost",
        url: "https://www.laserboost.es",
        profile: "pro",
        profileLabel: "Servicio de corte",
        vatNote: "Servicio de corte a medida, precio instantáneo online.",
        freeShipping: 150.00,
        shippingCost: "0 €",
        shippingNote: "Incluido en precio. Gratis ≥150 €.",
        materials: ["Stainless Steel Sheet","Galvanized Iron","Iron Sheet"]
    },
    {
        name: "Maderas Agulló",
        url: "https://www.maderasagullo.com",
        profile: "pro",
        profileLabel: "Especialista madera",
        vatNote: "Precios SIN IVA (base imponible declarada).",
        freeShipping: null,
        shippingCost: "12,00 €",
        shippingNote: "Envío ajustable al coste real según destino.",
        materials: ["Mahogany","Pine"]
    }
];

function renderProvidersView() {
    const grid = document.getElementById('providers-grid');
    const matFilter = document.getElementById('provider-material-filter');
    const query = searchInput.value.toLowerCase().trim();
    const selectedMat = matFilter ? matFilter.value : 'All';
    
    // Populate filter dropdown once
    if (matFilter && matFilter.options.length === 1) {
        const allMaterials = [...new Set(providerDirectory.flatMap(p => p.materials))].sort();
        allMaterials.forEach(mat => {
            const label = (currentLang === 'es' && translations[mat]) ? translations[mat] : mat;
            const opt = document.createElement('option');
            opt.value = mat; opt.textContent = label;
            matFilter.appendChild(opt);
        });
        matFilter.addEventListener('change', renderProvidersView);
    }
    
    grid.innerHTML = '';
    let count = 0;
    
    providerDirectory.forEach(prov => {
        // Apply search filter
        if (query && !prov.name.toLowerCase().includes(query) && 
            !prov.materials.some(m => {
                const label = translations[m] || m;
                return label.toLowerCase().includes(query) || m.toLowerCase().includes(query);
            })) return;
        
        // Apply material filter
        if (selectedMat !== 'All' && !prov.materials.includes(selectedMat)) return;
        
        count++;
        const card = document.createElement('div');
        card.className = 'provider-card';
        
        const chipsHtml = prov.materials.map(mat => {
            const label = (currentLang === 'es' && translations[mat]) ? translations[mat] : mat;
            return `<span class="material-chip" onclick="switchTab('products'); setTimeout(() => { searchInput.value='${label}'; renderStoreGrid(); }, 50)">${label}</span>`;
        }).join('');
        
        const shippingHtml = `
            ${prov.freeShipping ? `<span>🚚 Gratis &ge;${prov.freeShipping}€</span>` : '<span>🚚 Consultar</span>'}
            ${prov.shippingCost ? `<span>💰 ${prov.shippingCost}</span>` : ''}
        `;
        
        card.innerHTML = `
            <div class="provider-card-header">
                <div class="provider-name">${prov.name}</div>
                <span class="provider-badge ${prov.profile}">${prov.profileLabel}</span>
            </div>
            <div class="provider-shipping-info">${shippingHtml}</div>
            <div class="provider-materials-label">Materiales disponibles</div>
            <div class="provider-materials-chips">${chipsHtml}</div>
            <div class="provider-card-footer">
                <span class="provider-vat-note">📋 ${prov.vatNote}</span>
                <a href="${prov.url}" target="_blank" class="provider-link">Visitar →</a>
            </div>
        `;
        grid.appendChild(card);
    });
    
    if (count === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>Ningún proveedor coincide con tu búsqueda.</p></div>`;
    }
}

// Initialization
parseCSV(a20ProV2Data);
updateUILabels();
renderTable();
