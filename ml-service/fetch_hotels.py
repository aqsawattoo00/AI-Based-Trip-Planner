#!/usr/bin/env python3
"""
fetch_hotels.py
---------------
Fetches real hotel data from Google Places API for major Pakistani cities
and saves the result to ml-service/models/hotel_dataset.json.

Run once:  python fetch_hotels.py
Then re-run train_models.py (or just restart the ML service — it reads the JSON directly).
"""

import requests
import json
import os
import time

# ─── Config ────────────────────────────────────────────────────────────────────
API_KEY   = 'AIzaSyCxf17rX4xfG-4LsLNzIlhE9eFZ1T-3R6M'
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
OUT_PATH  = os.path.join(MODEL_DIR, 'hotel_dataset.json')
os.makedirs(MODEL_DIR, exist_ok=True)

# ─── City definitions ──────────────────────────────────────────────────────────
# Each entry: query sent to Places API + destination key used in recommendations + nearby cities
CITIES = [
    {
        'query': 'hotels in Lahore Pakistan',
        'destination': 'lahore',
        'nearby': ['pattoki', 'raiwind', 'kasur', 'sheikhupura', 'gujranwala',
                   'narowal', 'sialkot', 'okara', 'sahiwal', 'nankana sahib',
                   'narang mandi', 'narang', 'muridke', 'ferozwala', 'shahdara', 'chunian'],
    },
    {
        'query': 'hotels in Islamabad Pakistan',
        'destination': 'islamabad',
        'nearby': ['rawalpindi', 'taxila', 'wah cantt', 'attock', 'chakwal',
                   'jhelum', 'hasan abdal', 'abbottabad', 'murree'],
    },
    {
        'query': 'hotels in Rawalpindi Pakistan',
        'destination': 'rawalpindi',
        'nearby': ['islamabad', 'taxila', 'wah cantt', 'chakwal', 'attock',
                   'jhelum', 'hasan abdal'],
    },
    {
        'query': 'hotels in Karachi Pakistan',
        'destination': 'karachi',
        'nearby': ['hyderabad', 'thatta', 'hawkes bay', 'clifton', 'defence',
                   'badin', 'ormara', 'pasni', 'sukkur'],
    },
    {
        'query': 'hotels in Peshawar Pakistan',
        'destination': 'peshawar',
        'nearby': ['nowshera', 'charsadda', 'mardan', 'khyber pass',
                   'landi kotal', 'darra adam khel', 'attock'],
    },
    {
        'query': 'hotels in Quetta Pakistan',
        'destination': 'quetta',
        'nearby': ['ziarat', 'mastung', 'turbat', 'kalat', 'khuzdar', 'chaman'],
    },
    {
        'query': 'hotels in Multan Pakistan',
        'destination': 'multan',
        'nearby': ['bahawalpur', 'lodhran', 'khanewal', 'vehari',
                   'muzaffargarh', 'dera ghazi khan'],
    },
    {
        'query': 'hotels in Faisalabad Pakistan',
        'destination': 'faisalabad',
        'nearby': ['jhang', 'chiniot', 'toba tek singh', 'sargodha',
                   'gojra', 'samundri', 'sheikhupura'],
    },
    {
        'query': 'hotels in Hunza Pakistan',
        'destination': 'hunza',
        'nearby': ['karimabad', 'gilgit', 'gulmit', 'passu', 'altit',
                   'baltit', 'nagar', 'aliabad'],
    },
    {
        'query': 'hotels in Skardu Pakistan',
        'destination': 'skardu',
        'nearby': ['kachura lake', 'shigar', 'khaplu', 'satpara lake',
                   'deosai', 'shangrila', 'gilgit'],
    },
    {
        'query': 'hotels in Murree Pakistan',
        'destination': 'murree',
        'nearby': ['bhurban', 'nathia gali', 'patriata', 'ayubia',
                   'abbottabad', 'islamabad', 'rawalpindi'],
    },
    {
        'query': 'hotels in Swat Pakistan',
        'destination': 'swat',
        'nearby': ['mingora', 'kalam', 'bahrain', 'malam jabba', 'fizagat',
                   'madyan', 'besham'],
    },
    {
        'query': 'hotels in Naran Pakistan',
        'destination': 'naran',
        'nearby': ['kaghan', 'saiful maluk lake', 'lulusar lake',
                   'babusar top', 'balakot', 'shogran'],
    },
    {
        'query': 'hotels in Gilgit Pakistan',
        'destination': 'gilgit',
        'nearby': ['hunza', 'skardu', 'fairy meadows', 'rakaposhi',
                   'naltar', 'ghanche', 'astore'],
    },
    {
        'query': 'hotels in Abbottabad Pakistan',
        'destination': 'abbottabad',
        'nearby': ['havelian', 'mansehra', 'nathia gali', 'murree',
                   'haripur', 'islamabad', 'shinkiari'],
    },
    {
        'query': 'hotels in Gwadar Pakistan',
        'destination': 'gwadar',
        'nearby': ['ormara', 'pasni', 'turbat', 'hammerhead beach',
                   'jiwani', 'mand'],
    },
    {
        'query': 'hotels in Chitral Pakistan',
        'destination': 'chitral',
        'nearby': ['kalash valley', 'golen gol', 'shandur', 'booni',
                   'mastuj', 'drosh'],
    },
    {
        'query': 'hotels in Bahawalpur Pakistan',
        'destination': 'bahawalpur',
        'nearby': ['multan', 'rahim yar khan', 'cholistan', 'fort derawar',
                   'ahmadpur east', 'yazman'],
    },
    {
        'query': 'hotels in Sialkot Pakistan',
        'destination': 'sialkot',
        'nearby': ['gujranwala', 'lahore', 'narowal', 'daska', 'wazirabad',
                   'sambrial', 'pasrur'],
    },
    {
        'query': 'hotels in Gujranwala Pakistan',
        'destination': 'gujranwala',
        'nearby': ['lahore', 'sialkot', 'sheikhupura', 'wazirabad',
                   'hafizabad', 'gujrat'],
    },
    {
        'query': 'hotels in Neelum Valley Pakistan',
        'destination': 'neelum valley',
        'nearby': ['muzaffarabad', 'sharda', 'keran', 'kel', 'arang kel',
                   'dawarian'],
    },
    {
        'query': 'hotels in Muzaffarabad Pakistan',
        'destination': 'muzaffarabad',
        'nearby': ['neelum valley', 'rawalakot', 'mirpur', 'kotli',
                   'bagh', 'abbottabad'],
    },
    {
        'query': 'hotels in Sukkur Pakistan',
        'destination': 'sukkur',
        'nearby': ['rohri', 'khairpur', 'larkana', 'shikarpur',
                   'jacobabad', 'sadiqabad'],
    },
    {
        'query': 'hotels in Hyderabad Pakistan',
        'destination': 'hyderabad',
        'nearby': ['karachi', 'thatta', 'badin', 'mirpurkhas',
                   'tando adam', 'matiari'],
    },
]

# ─── Price level -> PKR & style ────────────────────────────────────────────────
# Google price_level: 0=free 1=cheap 2=moderate 3=expensive 4=very expensive
PRICE_MAP = {
    0: {'price': 2000,  'style': 'budget'},
    1: {'price': 3500,  'style': 'budget'},
    2: {'price': 7000,  'style': 'standard'},
    3: {'price': 14000, 'style': 'luxury'},
    4: {'price': 25000, 'style': 'luxury'},
}

# Fallback when price_level is missing — inferred from rating
def infer_price_level(rating):
    if rating is None:
        return 1
    if rating >= 4.5:
        return 3
    if rating >= 4.0:
        return 2
    return 1


def build_amenities(style):
    if style == 'luxury':
        return ['WiFi', 'Restaurant', 'Pool', 'Spa', 'Gym', 'Room Service']
    if style == 'standard':
        return ['WiFi', 'Restaurant', 'Breakfast', 'Parking']
    return ['WiFi', 'Basic Rooms']


def get_hotel_type(types):
    if not types:
        return 'Hotel'
    type_set = set(types)
    if 'resort' in type_set:
        return 'Resort'
    if 'campground' in type_set:
        return 'Camping'
    if 'guest_house' in type_set:
        return 'Guest House'
    return 'Hotel'


# ─── Places API calls ──────────────────────────────────────────────────────────
TEXT_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json'

def fetch_page(params):
    resp = requests.get(TEXT_SEARCH_URL, params=params, timeout=20)
    resp.raise_for_status()
    return resp.json()


def fetch_city_hotels(city_cfg):
    hotels = []
    seen_ids = set()

    params = {
        'query': city_cfg['query'],
        'type': 'lodging',
        'key': API_KEY,
    }

    for page_num in range(1, 4):  # max 3 pages -> up to 60 results
        try:
            data = fetch_page(params)
        except Exception as exc:
            print(f"    Request error (page {page_num}): {exc}")
            break

        status = data.get('status')
        if status == 'ZERO_RESULTS':
            break
        if status != 'OK':
            msg = data.get('error_message', status)
            print(f"    API error: {msg}")
            break

        for place in data.get('results', []):
            pid = place.get('place_id', '')
            if pid in seen_ids:
                continue
            seen_ids.add(pid)

            place_types = place.get('types', [])
            # Skip places that are clearly not hotels
            if not any(t in place_types for t in ('lodging', 'hotel', 'guest_house',
                                                    'motel', 'resort', 'campground')):
                continue

            rating      = place.get('rating')
            price_level = place.get('price_level')

            if price_level is None:
                price_level = infer_price_level(rating)

            price_info = PRICE_MAP.get(price_level, PRICE_MAP[1])
            style      = price_info['style']
            price      = price_info['price']

            hotels.append({
                'name':             place.get('name', 'Unknown'),
                'destination':      city_cfg['destination'],
                'style':            style,
                'price_per_night':  price,
                'rating':           round(float(rating), 1) if rating else 3.5,
                'type':             get_hotel_type(place_types),
                'amenities':        build_amenities(style),
                'family_friendly':  style in ('standard', 'luxury') or (rating or 0) >= 4.0,
                'nearby':           city_cfg['nearby'],
                'address':          place.get('formatted_address', ''),
            })

        token = data.get('next_page_token')
        if not token:
            break

        # Google requires a short delay before using next_page_token
        time.sleep(2)
        params = {'pagetoken': token, 'key': API_KEY}

    return hotels


# ─── Main ──────────────────────────────────────────────────────────────────────
def main():
    print('=' * 60)
    print('  Google Places Hotel Fetcher — Pakistan')
    print('=' * 60)

    all_hotels = []

    for i, city in enumerate(CITIES, 1):
        dest = city['destination'].title()
        print(f"\n[{i:02d}/{len(CITIES)}] {dest}")
        try:
            hotels = fetch_city_hotels(city)
            all_hotels.extend(hotels)
            print(f"    Fetched {len(hotels)} hotels")
        except Exception as exc:
            print(f"    Failed: {exc}")

        time.sleep(0.3)  # gentle rate limiting between cities

    # Deduplicate by lowercase name
    seen_names = set()
    unique = []
    for h in all_hotels:
        key = h['name'].lower().strip()
        if key not in seen_names:
            seen_names.add(key)
            unique.append(h)

    print(f"\n{'=' * 60}")
    print(f"Total fetched   : {len(all_hotels)}")
    print(f"After dedup     : {len(unique)}")

    # Style breakdown
    from collections import Counter
    counts = Counter(h['style'] for h in unique)
    for s, c in sorted(counts.items()):
        print(f"  {s:<12}: {c}")

    dataset = {'hotels': unique, 'total': len(unique)}

    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)

    print(f"\nSaved -> {OUT_PATH}")
    print("Done! Restart the ML service to use the new data.")


if __name__ == '__main__':
    main()
