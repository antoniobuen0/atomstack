import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
import time
import os

# In CI (GitHub Actions), the workflow first exports shopping_data.js -> shopping_data_parsed.json via Node.
# Locally you can run: node -e "..." first, or this script will try to do it via subprocess.
INPUT_FILE = "shopping_data_parsed.json"
OUTPUT_JSON = "shopping_dataset_updated.json"
OUTPUT_JS = "shopping_data.js"

def extract_laserproject(soup):
    price_tag = soup.select_one('.current-price span, .product-price')
    return float(re.sub(r'[^\d,.]', '', price_tag.text).replace(',', '.')) if price_tag else None

def extract_brildor(soup):
    price_tag = soup.select_one('.price')
    return float(re.sub(r'[^\d,.]', '', price_tag.text).replace(',', '.')) if price_tag else None

def extract_esteba(soup):
    price_tag = soup.select_one('.price-wrapper .price')
    return float(re.sub(r'[^\d,.]', '', price_tag.text).replace(',', '.')) if price_tag else None

def scrape_url(url):
    print(f"🔗 Analizando: {url}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "es-ES,es;q=0.9"
    }
    
    try:
        if "amazon.es" in url or "leroymerlin" in url or "carrefour" in url:
            # Sitios gigantes que bloquean requests directas (requieren cloudflare bypass o api)
            print("  -> Sitio protegido (bot detect/reCaptcha). Omitiendo auto-scraping...")
            return None
            
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        price = None
        
        if "laserproject.es" in url:
            price = extract_laserproject(soup)
        elif "brildor.com" in url:
            price = extract_brildor(soup)
        elif "esteba.com" in url:
            price = extract_esteba(soup)
        else:
            print("  -> Parser web no programado para esta tienda, intentando genérico...")
            
        return price
    except Exception as e:
        print(f"❌ Error en {url}: {e}")
        return None

def main():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Iniciando Extracción Masiva de Precios...")

    # 1. Leer el JSON pre-exportado por Node.js (shopping_data_parsed.json)
    if not os.path.exists(INPUT_FILE):
        print(f"❌ No se encuentra {INPUT_FILE}. Ejecuta primero el paso de exportación Node.js.")
        return

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"✅ Cargados {len(data)} materiales desde {INPUT_FILE}")

    # 2. Recorrer datos y raspar precios
    updated = skipped = kept = 0
    SKIP_DOMAINS = ['amazon.es', 'leroymerlin.es', 'carrefour.es', 'ikea.com',
                    'bauhaus.es', 'cncbarato.com', 'rotulos24.com', 'barnaart.com',
                    'tejidospulido.com', 'regalopublicidad.com', 'minerapolo.com', 'prosl.es']

    for material, products in data.items():
        print(f"\n📦 {material}")
        for p in products:
            url = p.get('url', '')
            if not url or not url.startswith('http'):
                continue

            if any(skip in url for skip in SKIP_DOMAINS):
                print(f"  ⏭  {p['provider']} — protegido, manteniendo {p.get('price')} €")
                p['query_date'] = datetime.now().strftime("%Y-%m-%d")
                skipped += 1
                continue

            new_price = scrape_url(url)
            old_price = p.get('price')

            if new_price is not None and new_price > 0:
                print(f"  ✅ {p['provider']}: {old_price} → {new_price} €")
                p['price'] = new_price
                p['priceStr'] = f"{str(new_price).replace('.', ',')} €"
                updated += 1
            else:
                print(f"  ⚠️  {p['provider']}: sin detección, manteniendo {old_price} €")
                kept += 1

            p['query_date'] = datetime.now().strftime("%Y-%m-%d")
            time.sleep(1.5)

    # 3. Guardar JSON de resultados
    print(f"\n💾 Guardando {OUTPUT_JSON}...")
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    # 4. Volcar de vuelta a shopping_data.js (keys sin comillas para JS estándar)
    print(f"🔁 Actualizando {OUTPUT_JS}...")
    js_output = f"const shoppingData = {json.dumps(data, indent=4, ensure_ascii=False)};\n"
    js_output = re.sub(r'"([a-zA-Z_]\w*)":', r'\1:', js_output)
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write(js_output)

    print(f"\n✅ DONE — Actualizados: {updated} | Omitidos: {skipped} | Sin cambio: {kept}")

if __name__ == '__main__':
    main()
