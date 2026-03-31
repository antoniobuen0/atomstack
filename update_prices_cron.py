import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
import time
import os

JS_FILE = "shopping_data.js"
OUTPUT_FILE = "shopping_dataset_raw.json"

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
    
    # 1. Leer shopping_data.js
    if not os.path.exists(JS_FILE):
        print(f"No se encuentra {JS_FILE}")
        return
        
    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js_content = f.read()
        
    # Extraer el objeto {...}
    match = re.search(r'const shoppingData = ({.*});?', js_content, re.DOTALL)
    if not match:
        print("No se encontró 'const shoppingData = {' en el fichero.")
        return
        
    raw_json = match.group(1)
    
    # Sanear las claves no entrecomilladas (ej: provider: -> "provider":) y quitar comentarios JS
    # Eliminamos comentarios de linea plana
    raw_json = re.sub(r'//.*', '', raw_json)
    # Entrecomillamos las keys
    raw_json = re.sub(r'(?m)^\s*([a-zA-Z0-9_]+)\s*:', r'"\1":', raw_json)
    
    try:
        data = json.loads(raw_json)
    except json.JSONDecodeError as e:
        print(f"Error parseando JSON (necesitas limpiar manual shopping_data.js si hay sintaxis extraña): {e}")
        return

    # 2. Recorrer datos y raspar precios
    for material, products in data.items():
        print(f"\n📦 Material: {material}")
        for p in products:
            old_price = p.get('price')
            url = p.get('url', '')
            if not url or url.startswith('http') is False:
                continue
                
            new_price = scrape_url(url)
            
            if new_price is not None and new_price > 0:
                print(f"  -> Precio actualizado: {old_price} € --> {new_price} €")
                p['price'] = new_price
                p['priceStr'] = f"{str(new_price).replace('.', ',')} €"
            else:
                print(f"  -> Manteniendo precio actual: {old_price} €")
            
            p['query_date'] = datetime.now().strftime("%Y-%m-%d")
            time.sleep(1) # Pequeño delay cortesia
            
    # 3. Guardar el resultado en .json para su uso o volcarlos tal cual.
    print(f"\n💾 Guardando resultados como JSON crudo en {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    # Extra: Volcar también de regreso al JS
    print("🔁 Escribiendo también de vuelta a shopping_data.js (sobreescribiendo)...")
    js_output = f"const shoppingData = {json.dumps(data, indent=4, ensure_ascii=False)};\n"
    # Quitamos comillas a las keys principales para que se parezca al código JS estandar
    js_output = re.sub(r'"([a-zA-Z_]\w*)":', r'\1:', js_output)
    
    with open(JS_FILE, "w", encoding="utf-8") as f:
        f.write(js_output)

    print("✅ ¡Terminado exitosamente! Tu web tiene el dataset más fresco posible.")

if __name__ == '__main__':
    main()
