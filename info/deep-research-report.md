# Spain purchasing dataset for laser-tested materials

## Scope, constraints, and what was concretely verified

You asked me to “navigate” the site you provided (`https://breezy-bikes-pump.loca.lt`) and then build a Spain-focused, VAT-homogenized purchasing dataset with 2–3 affordable buying options per material, including shipping thresholds, shipping costs, and “who buys where” (amateurs vs pros).  

Two hard constraints affected completeness:

- The localtunnel site appears to be client-rendered (and/or otherwise not fully extractable in this environment), so I could not reliably scrape its full materials table directly from that URL.
- Because of tool-budget limits within this chat session, I could not perform a true “2–3 options for every single material” sweep across all rows. Instead, I prioritized: (a) verifying a **solid subset** end-to-end (price + VAT status + shipping policy) and (b) identifying **where your current `shoppingData` is wrong** (so you don’t propagate bad procurement data).

To avoid guessing the materials list, I used a publicly available, machine-material table (the same kind of “laser parameters by material” list your site likely mirrors) as a reference for the *canonical set of material names* and for spotting missing rows. citeturn7view0

## Material list normalization

A widely circulated material/parameter table for an entity["company","Atomstack","laser engraver brand"]-class diode machine lists (among others) **Basswood, Cedarwood, Beech, Yellow peach wood, Mahogany, Pine, Paulownia wood, Bamboo, Leather, Denim, Ceramics, Ceramic Tile, Alumina, Glass, Acrylic, Translucent Acrylic, Two color plate, Plastic, Resin, Artificial beef bone, High density foam board, Rubber, Kraft Paper, Office Paper, Oil Painting Paper, Carton, MDF, Mirrors, Rock, Cobblestone, Crystal Stone, PCB Board, Mirror Stainless Steel, Brushed Stainless Steel**. citeturn7view0

This matters because your current `shoppingData` is **not** aligned with that canonical list:

- It **misses** at least **Cedarwood, Beech, and Translucent Acrylic** as explicit materials (they exist in the reference table). citeturn7view0
- Some of your rows are **category-mismatched**, meaning you’d be shopping the wrong substrate.

## Dataset design and VAT/shipping homogenization

You asked for homogeneous “price with VAT” (or explicitly flagged if VAT is excluded), plus shipping and free-shipping thresholds.

### Columns used

In the downloadable dataset I generated, each row is one purchasable option with:

- `material_en`, `material_es`
- `provider`, `product_name`, `url`
- `query_date` (set to **2026-03-31**)
- `price_eur_listed`, `vat_included_listed`, `vat_rate_assumed` (default **0.21** where conversion is needed)
- `price_eur_vat_incl`, `price_eur_vat_excl`
- `specs`, `unit`
- `shipping_cost_eur`, `free_shipping_min_eur`, `shipping_note`
- `verified_from_sources` (True when price/VAT/shipping were actually verified from the cited pages)
- `source_refs` (IDs mapping each row back to the evidence pages used)

### VAT rules applied (important)

Different suppliers in Spain present VAT differently:

- Some are consumer-facing and explicitly show **“Impuestos incluidos”** (VAT included). Example: a cork sheet at entity["local_business","Artesanía Chopo","madrid, es"] shows “Impuestos incluidos.” citeturn38view0  
- Some are B2B-oriented and explicitly state that prices are **VAT excluded** and shipping is excluded (shown at checkout). Example: entity["company","Todo-grabado.com","engraving materials spain"] states that web prices **do not include VAT** and **exclude shipping** because sales are aimed at businesses/professionals. citeturn49view1  
- Some suppliers are internally inconsistent across pages. Example: entity["company","Laser Project","laser materials spain"] has a contracting page saying prices include VAT, yet at least one metal product page explicitly says **“IVA excl.”**, and their older catalog PDF also labels sheet pricing as **“IVA no incluido.”** citeturn14view0turn54view0turn56search7  
  Because of this, I treated Laser Project prices as VAT-excluded when explicitly labeled (and noted ambiguity when not).

### Shipping rules captured

Where the seller gave explicit tiering, I recorded it:

- entity["local_business","Artesanía Chopo","madrid, es"] (Spain peninsular): **<25€ → 4.99€**, **25–60€ → 2.99€**, **>60€ → free**. citeturn40view0  
- entity["company","TuRegalo3D","delima maker materials, es"]: normal shipping **4.95€** below **100€**, urgent **6.95€**, free shipping once cart reaches **100€**. citeturn51search3  
- entity["company","OPITEC","craft supplies retailer eu"]: shipping **6.99€**, free from **100€** order value. citeturn51search0  
- entity["company","Brildor","personalization supplies spain"]: peninsular shipping starts at **5.80€**, and free shipping applies above **50€ before VAT**. citeturn21search2turn21search4  
- entity["company","Leroy Merlin","home improvement retailer spain"] shipping depends on carrier method and package weight bands; marketplace sellers can have their own shipping logic. citeturn51search6turn51search10

## Verified “cheap-first” purchase options

Because you asked for affordability, I prioritized options with (a) low unit price and (b) predictable procurement (clear VAT + shipping terms).

### Cork and sheet goods

A 3 mm cork sheet from Artesanía Chopo is priced **7.82€ (VAT included)** for **60.5×91 cm**, with free shipping above 60€ in peninsular Spain. citeturn38view0turn40view0  
A cheaper *listed* cork option exists via Leroy Merlin marketplace: **4.04€** for **100×50 cm, 3 mm**, but its indicated home delivery is **14.90€** (so the landed cost can be worse if you only buy one). citeturn41view0

### Acrylic / PMMA for laser

A strong “maker” price reference point in Spain is TuRegalo3D: cast acrylic 3 mm is shown as **1.90€–7.60€ VAT included** depending on size (300×200 up to 600×400). citeturn43view0  
Their shipping is also explicit (4.95€ standard <100€, free ≥100€). citeturn51search3

Laser Project also sells cast acrylic sheets, but you must treat VAT status carefully because at least some pages use VAT-excluded labeling and older catalog pricing is VAT-excluded. citeturn42view0turn54view0turn56search7

### MDF and plywood

For MDF (DM), Laser Project lists low “from” pricing on a multi-variant board product; however VAT inclusion is not consistently labeled across pages, so I tagged it conservatively and included the evidence reference. citeturn50search0turn56search7  
For a clear B2C “small board” alternative, CreativeLaser shows a starting MDF price and explicitly states taxes are included. citeturn50search8

For poplar plywood, OPITEC provides a clearly priced 3×300×600 mm poplar plywood sheet (VAT included) and has explicit shipping rules. citeturn50search12turn51search0turn51search8

### Rubber for stamps

This is one of the cleanest categories to price-compare because multiple suppliers publish explicit prices:

- Brildor shows an A4 rubber sheet with VAT-included price **12.04€** and provides shipping thresholds. citeturn45search7turn21search2turn21search4  
- Todo-grabado lists rubber sheets at **7.88€** but their terms say prices exclude VAT and shipping (B2B/pro oriented), so the comparable VAT-included price must be computed. citeturn45search14turn49view1

### PCB board (FR4 copper clad)

For FR4 copper-clad boards, multiple Spain-based electronics stores publish prices:

- Retroamplis shows **1.95€ VAT included** for 100×160 mm single-sided copper-clad FR4 (delivery extra). citeturn52search6  
- Electrónica Embajadores shows both ex-VAT and VAT-inc values (2.24€ ex VAT / 2.71€ inc VAT) for a dual-sided 100×160 mm board. citeturn52search17  
- Conectrol lists a **7.50€ VAT-included** photoresist FR4 board (noting stock state during capture). citeturn52search14

## Supplier landscape in Spain

Based on the *documented commercial posture* (VAT presentation, shipping policy, and catalog focus), you can segment suppliers like this:

Professional / production-leaning suppliers (often show prices ex VAT, shipping at checkout):
- Todo-grabado explicitly frames web pricing for **business/professional** customers, with **VAT excluded** and shipping shown during checkout. citeturn49view1  
- Maderas Agulló states that displayed prices are **base imponible (VAT excluded)** and shipping is calculated and can be adjusted to actual cost. citeturn34view0  

Maker / small business friendly (clear VAT-included pricing + explicit shipping thresholds):
- Artesanía Chopo publishes retail “tax-included” pricing and a simple shipping tier table. citeturn38view0turn40view0  
- TuRegalo3D publishes VAT-included pricing and explicit shipping costs and free-shipping threshold. citeturn43view0turn51search3  
- OPITEC states that its prices are VAT-included (unless noted) and publishes a clear shipping fee + free-shipping threshold. citeturn51search8turn51search0  

Big-box retail (useful for staples; shipping & marketplace seller variability matters):
- Leroy Merlin publishes general shipping info by parcel weight and explains that marketplace costs vary by seller. citeturn51search6turn51search10  
- IKEA can be cost-effective for mirror packs, but delivery pricing often requires interactive checkout. citeturn52search1  

## Blunt corrections to your current `shoppingData`

Some entries in your object are simply wrong (or at least mislabeled in a way that will break procurement logic):

- Your **“Glass”** row is not glass: it’s labeled “vidrio acrílico,” which is acrylic/PMMA, not silica glass. Laser Project itself lists metacrilato as “Acrílico” at the material field level, confirming the category mismatch. citeturn42view0  
- Your **shipping thresholds for Laser Project** look off: you used free shipping at 75€, but Laser Project’s own shipping page states free economy shipping above **70€ (VAT excluded)**. citeturn13view0  
- Your **VAT handling needs per-vendor rules**. For example, Todo-grabado is explicit that their web prices **exclude VAT and shipping**. If you store those numbers as VAT-included, you will systematically understate costs and break invoices. citeturn49view1  
- Your **materials list is likely incomplete** versus the canonical parameter table (missing Cedarwood, Beech, Translucent Acrylic as separate rows). citeturn7view0  

## Dataset outputs and current coverage

The dataset generated in this session is **a verified core** (where possible: price + VAT status + shipping terms) plus provider policy notes. It does **not yet** meet your requirement of “2–3 affordable buying options for every material in the full list,” because the localtunnel site could not be scraped and the session tool budget limited full row-by-row expansion.

Download files:

- [Download the CSV](sandbox:/mnt/data/spain_laser_materials_shopping_dataset_2026-03-31.csv)  
- [Download the Excel](sandbox:/mnt/data/spain_laser_materials_shopping_dataset_2026-03-31.xlsx) (includes a `provider_policies` sheet)  
- [Download the JSON](sandbox:/mnt/data/spain_laser_materials_shopping_dataset_2026-03-31.json)