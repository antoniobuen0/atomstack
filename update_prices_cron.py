import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
import time
import os

# En CI (GitHub Actions) el workflow exporta antes shopping_data.js -> shopping_data_parsed.json con Node.
INPUT_FILE = "shopping_data_parsed.json"
OUTPUT_JSON = "shopping_dataset_updated.json"
OUTPUT_JS = "shopping_data.js"

TODAY = datetime.now().strftime("%Y-%m-%d")

# Tiendas que el runner no puede leer directamente. Se mantienen en la lista sólo para las
# que de verdad bloquean; el lector con claves de render JS resuelve muchas más.
SKIP_DOMAINS = ['amazon.es', 'leroymerlin', 'carrefour', 'ikea.com', 'bauhaus.es']

# Lector que renderiza JS y salva el anti-bot básico. Sin API key: ~20 peticiones/min,
# de sobra para 50 URLs una vez al día.
READER_BASE = 'https://r.jina.ai/'

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept-Language": "es-ES,es;q=0.9"
}

# URLs que no son una ficha de producto, sino una búsqueda o una categoría:
# ahí no hay UN precio, así que no las damos por verificables.
SEARCH_PATTERNS = ['/s?', '?k=', '&k=', '/search?', '?q=', '/c/', '/busqueda', 'listing']


def url_kind(url):
    return 'search' if any(pat in url for pat in SEARCH_PATTERNS) else 'product'


def _amounts_from_text(text):
    """Importes en euros de un texto ya plano (markdown del lector)."""
    out = []
    for raw in re.findall(r'(\d{1,3}(?:[.\s]\d{3})*(?:,\d{2}|\.\d{2}))\s*(?:€|EUR)', text, re.I):
        value = _to_float(raw)
        if value and 0.2 < value < 5000:
            out.append(value)
    return out


def read_price_via_reader(url, expected):
    """Último recurso: leer la página renderizada y quedarse con el importe más plausible.

    `expected` es el precio que ya teníamos: lo usamos solo para desempatar entre varios
    importes de la página (gastos, variantes, ofertas por volumen), no para inventar.
    """
    try:
        res = requests.get(READER_BASE + url, headers=HEADERS, timeout=45)
        if res.status_code != 200:
            print(f"  -> lector HTTP {res.status_code}")
            return None
        amounts = _amounts_from_text(res.text)
    except Exception as e:
        print(f"  -> lector error: {e}")
        return None

    if not amounts:
        return None
    if expected:
        close = [a for a in amounts if abs(a - expected) / expected <= 0.4]
        if not close:
            print(f"  -> lector ve {amounts} pero nada cerca de {expected}: no confirmamos")
            return None
        return min(close, key=lambda a: abs(a - expected))
    return amounts[0]


def _to_float(text):
    """Normaliza '1.234,56 €', '24,90 €' o '€12.99' a float."""
    if not text:
        return None
    cleaned = re.sub(r'[^\d,.]', '', str(text))
    if not cleaned:
        return None
    if ',' in cleaned and '.' in cleaned:
        cleaned = cleaned.replace('.', '').replace(',', '.')
    elif ',' in cleaned:
        cleaned = cleaned.replace(',', '.')
    try:
        value = float(cleaned)
    except ValueError:
        return None
    return value if 0 < value < 100000 else None


def is_blocked(url):
    return any(skip in url for skip in SKIP_DOMAINS)


def extract_laserproject(soup):
    tag = soup.select_one('.current-price span, .product-price')
    return _to_float(tag.text if tag else None)


def extract_brildor(soup):
    tag = soup.select_one('.price')
    return _to_float(tag.text if tag else None)


def extract_esteba(soup):
    tag = soup.select_one('.price-wrapper .price')
    return _to_float(tag.text if tag else None)


def _walk_offers(node):
    found = []
    if isinstance(node, dict):
        offers = node.get('offers')
        if isinstance(offers, dict):
            found.append(_to_float(offers.get('price')))
        elif isinstance(offers, list):
            for one in offers:
                if isinstance(one, dict):
                    found.append(_to_float(one.get('price')))
        if node.get('@type') == 'AggregateOffer':
            found.append(_to_float(node.get('lowPrice')))
        for value in node.values():
            found.extend(_walk_offers(value))
    elif isinstance(node, list):
        for item in node:
            found.extend(_walk_offers(item))
    return [v for v in found if v]


def extract_jsonld(soup):
    """Estándar que ya usan muchas tiendas españolas: application/ld+json con offers.price."""
    for script in soup.find_all('script', type='application/ld+json'):
        try:
            blob = json.loads(script.string or '{}')
        except (json.JSONDecodeError, TypeError):
            continue
        prices = _walk_offers(blob)
        if prices:
            return prices[0]
    return None


def extract_generic(soup):
    """Rastros habituales en el HTML de e-commerce, solo si JSON-LD falla."""
    selectors = [
        '[itemprop="price"]', '.product-item-price .price', '.special-price .price',
        '.price-box .price', '.sale-price', '.product-price', 'p.price'
    ]
    for sel in selectors:
        tag = soup.select_one(sel)
        if tag:
            value = _to_float(tag.get('content') or tag.text)
            if value:
                return value
    meta = soup.find('meta', property='product:price:amount')
    return _to_float(meta['content']) if meta and meta.get('content') else None


PARSERS = [
    ('laserproject.es', extract_laserproject),
    ('brildor.com', extract_brildor),
    ('esteba.com', extract_esteba),
]


def scrape_url(url):
    """Devuelve (precio, cómo) o (None, motivo)."""
    print(f"🔗 Analizando: {url}...")
    if is_blocked(url):
        print("  -> Sitio protegido (bot-detection). NO damos el precio por verificado.")
        return None, 'blocked'

    try:
        res = requests.get(url, headers=HEADERS, timeout=15)
        if res.status_code != 200:
            return None, f'http{res.status_code}'
        soup = BeautifulSoup(res.text, 'html.parser')
    except Exception as e:
        print(f"❌ Error en {url}: {e}")
        return None, 'error'

    for domain, parser in PARSERS:
        if domain in url:
            price = parser(soup)
            if price:
                return price, 'selector'
            break

    price = extract_jsonld(soup)
    if price:
        return price, 'jsonld'
    price = extract_generic(soup)
    if price:
        return price, 'generic'
    return None, 'notfound'


def mark(p, state, attempt, source=None):
    """state: live | stale | blocked | search. source: selector | jsonld | generic | reader."""
    p['price_state'] = state
    p['check_attempt'] = attempt
    if source:
        p['price_source'] = source


def main():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Iniciando verificación de precios...")

    if not os.path.exists(INPUT_FILE):
        print(f"❌ No se encuentra {INPUT_FILE}. Ejecuta primero el paso de exportación Node.js.")
        return

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total = sum(len(v) for v in data.values())
    print(f"✅ Cargados {len(data)} materiales ({total} ofertas) desde {INPUT_FILE}")

    live = stale = blocked = moved = searched = 0

    for material, products in data.items():
        print(f"\n📦 {material}")
        for p in products:
            url = p.get('url', '')
            if not url or not url.startswith('http'):
                mark(p, 'stale', p.get('check_attempt'))
                stale += 1
                continue

            # Una búsqueda o una categoría no tiene UN precio: no la damos por verificada.
            if url_kind(url) == 'search':
                print(f"  🔎 {p['provider']}: es una búsqueda/categoría, no una ficha de producto")
                mark(p, 'search', TODAY)
                p['search_note'] = 'La URL apunta a resultados, no a una ficha: el precio es orientativo.'
                searched += 1
                continue

            if is_blocked(url):
                print(f"  ⛔ {p['provider']}: tienda protegida, precio NO verificado")
                mark(p, 'blocked', TODAY)
                blocked += 1
                continue

            old_price = p.get('price')
            new_price, how = scrape_url(url)

            if new_price is None:
                # Segundo intento: lector que renderiza JS y salva el anti-bot básico.
                new_price = read_price_via_reader(url, old_price)
                how = 'reader'

            if new_price is not None and new_price > 0:
                # Un salto grande no es una actualización: puede que la página exponga el
                # precio de otra variante o de un producto relacionado. Lo marcamos a revisar
                # en vez de darlo por bueno en silencio.
                jumped = bool(old_price) and abs(new_price - old_price) / old_price > 0.5
                p['price'] = new_price
                p['priceStr'] = f"{new_price:.2f}".replace('.', ',') + ' €'
                if jumped:
                    print(f"  🚩 {p['provider']}: {old_price} → {new_price} € ({how}) salto grande, revisar")
                    p['query_date'] = TODAY
                    mark(p, 'review', TODAY, how)
                    moved += 1
                else:
                    if old_price and abs(new_price - old_price) > 0.005:
                        print(f"  ✅ {p['provider']}: {old_price} → {new_price} € ({how})")
                        moved += 1
                    else:
                        print(f"  ✔  {p['provider']}: {new_price} € confirmado ({how})")
                    # query_date = fecha en la que HEMOS VISTO este precio. Solo aquí se toca.
                    p['query_date'] = TODAY
                    mark(p, 'live', TODAY, how)
                    live += 1
            else:
                print(f"  ⚠️  {p['provider']}: sin detección, conserva el último precio visto")
                mark(p, 'stale', TODAY)
                stale += 1

            time.sleep(1.5)

    print(f"\n📊 Resumen: verificados {live} · protegidos {blocked} · sin detectar {stale} · "
          f"busquedas sin ficha {searched} · precios cambiados {moved}")

    print(f"\n💾 Guardando {OUTPUT_JSON}...")
    with open(OUTPUT_JSON, "w", encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"🔁 Actualizando {OUTPUT_JS}...")
    js_output = f"const shoppingData = {json.dumps(data, indent=4, ensure_ascii=False)};\n"
    js_output = re.sub(r'"([a-zA-Z_]\w*)":', r'\1:', js_output)
    with open(OUTPUT_JS, "w", encoding='utf-8') as f:
        f.write(js_output)

    if live == 0:
        print("\n⚠️  Hoy no se ha verificado NINGÚN precio.")


if __name__ == '__main__':
    main()
