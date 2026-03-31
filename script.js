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
const shoppingTitle = document.getElementById('shopping-title');
const closeShoppingBtn = document.getElementById('close-shopping-btn');
const providersContainer = document.getElementById('providers-container');
const cartContainer = document.getElementById('cart-container');
const toggleShoppingBtn = document.getElementById('toggle-shopping-btn');
const cartBadge = document.getElementById('cart-count');
const floatingCartBadge = document.getElementById('floating-cart-badge');
const shoppingEmptyMsg = document.getElementById('shopping-empty-msg');
const viewCartBtn = document.getElementById('view-cart-btn');

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
        tr.classList.add('clickable-row');
        // display all columns except the hidden original index
        const displayCols = data.translatedRow.slice(0, -1);
        tr.innerHTML = displayCols.map(cell => `<td>${cell}</td>`).join('');
        
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
searchInput.addEventListener('input', renderTable);
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
    const wscols = currentHeaders.map(h => ({wch: Math.max(h.length, 12)}));
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    const sheetName = currentLang === 'es' ? 'Materiales' : 'Materials';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    const fileName = `AtomStack_A20_Pro_V2_Settings_${currentLang.toUpperCase()}.xlsx`;
    XLSX.writeFile(wb, fileName);
});

// Shopping List Logic
window.addToCart = function(materialEn, optIndex) {
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

window.updateQty = function(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
    renderCart();
};

window.checkout = function() {
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
    cartBadge.textContent = totalItems;
    floatingCartBadge.textContent = totalItems;
    floatingCartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
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

    options.forEach((opt, idx) => {
        const card = document.createElement('div');
        card.className = 'shopping-card';
        card.innerHTML = `
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

closeShoppingBtn.addEventListener('click', () => {
    shoppingPanel.classList.remove('open');
});

toggleShoppingBtn.addEventListener('click', () => {
    shoppingPanel.classList.toggle('open');
});

// Initialization
parseCSV(a20ProV2Data);
updateUILabels();
renderTable();
