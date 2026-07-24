import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import json
import os

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

# Encoding maps (must match app.py)
TRANSPORT_MAP = {'bus': 0, 'train': 1, 'car': 2, 'jeep': 3, 'flight': 4, 'mixed': 2}
ACCOMMODATION_MAP = {'camping': 0, 'guest_house': 1, 'budget_hotel': 2, 'standard_hotel': 3, 'luxury_hotel': 4, 'resort': 5}
STYLE_MAP = {'budget': 0, 'standard': 1, 'luxury': 2}


def generate_trip_cost_data(n=3000):
    """Generate synthetic Pakistani trip cost dataset"""
    np.random.seed(42)

    distance_km        = np.random.uniform(100, 2000, n)
    group_size         = np.random.randint(1, 21, n)
    trip_days          = np.random.randint(1, 15, n)
    transport_mode     = np.random.randint(0, 5, n)   # 0=bus 1=train 2=car 3=jeep 4=flight
    accommodation_type = np.random.randint(0, 6, n)   # 0=camping -> 5=resort
    travel_style       = np.random.randint(0, 3, n)   # 0=budget 1=standard 2=luxury

    # Realistic PKR rates
    transport_rate_per_km = np.array([5, 8, 15, 20, 50])        # per km per person (one-way)
    accommodation_per_night = np.array([500, 1500, 3000, 6000, 15000, 25000])
    food_per_day_per_person = np.array([500, 1000, 2000])
    activity_per_day_per_person = np.array([200, 800, 2500])

    transport_cost    = transport_rate_per_km[transport_mode] * distance_km * 2 * group_size
    accommodation_cost = accommodation_per_night[accommodation_type] * trip_days
    food_cost         = food_per_day_per_person[travel_style] * trip_days * group_size
    activity_cost     = activity_per_day_per_person[travel_style] * trip_days * group_size
    misc_cost         = (transport_cost + accommodation_cost + food_cost + activity_cost) * 0.10

    total_cost = transport_cost + accommodation_cost + food_cost + activity_cost + misc_cost

    # Add ±15% noise to simulate real-world variation
    noise = np.random.uniform(0.85, 1.15, n)
    total_cost = total_cost * noise

    return pd.DataFrame({
        'distance_km':        distance_km,
        'group_size':         group_size,
        'trip_days':          trip_days,
        'transport_mode':     transport_mode,
        'accommodation_type': accommodation_type,
        'travel_style':       travel_style,
        'total_cost_pkr':     total_cost,
    })


def train_cost_model():
    print("=" * 50)
    print("Training Trip Cost Prediction Model...")
    print("=" * 50)

    df = generate_trip_cost_data(3000)
    print(f"Dataset size: {len(df)} samples")

    X = df[['distance_km', 'group_size', 'trip_days', 'transport_mode', 'accommodation_type', 'travel_style']]
    y = df['total_cost_pkr']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"Train: {len(X_train)} | Test: {len(X_test)}")

    model = RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1, max_depth=20)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2  = r2_score(y_test, y_pred)

    print(f"\nModel Evaluation:")
    print(f"  MAE (Mean Absolute Error): PKR {mae:,.0f}")
    print(f"  R² Score:                  {r2:.4f}")
    print(f"  Accuracy:                  ~{r2 * 100:.1f}%")

    print("\nFeature Importances:")
    features = ['distance_km', 'group_size', 'trip_days', 'transport_mode', 'accommodation_type', 'travel_style']
    for name, imp in sorted(zip(features, model.feature_importances_), key=lambda x: -x[1]):
        print(f"  {name:<22}: {imp:.4f}")

    model_path = os.path.join(MODEL_DIR, 'cost_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"\nModel saved -> {model_path}")
    return model


def create_hotel_dataset():
    print("\n" + "=" * 50)
    print("Creating Hotel Recommendation Dataset...")
    print("=" * 50)

    hotels = [
        # ── Hunza ──────────────────────────────────────────
        {'name': 'Serena Hotel Hunza',        'destination': 'hunza',         'style': 'luxury',   'price_per_night': 25000, 'rating': 4.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Mountain View', 'Spa'],            'family_friendly': True,  'nearby': ['karimabad', 'altit fort', 'baltit fort']},
        {'name': 'Eagle Nest Hotel',           'destination': 'hunza',         'style': 'standard', 'price_per_night':  8000, 'rating': 4.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Mountain View'],                   'family_friendly': True,  'nearby': ['karimabad', 'duiker']},
        {'name': 'Hunza Serena Inn',           'destination': 'hunza',         'style': 'standard', 'price_per_night':  6500, 'rating': 4.3, 'type': 'Guest House','amenities': ['WiFi', 'Meals', 'Scenic View'],                          'family_friendly': True,  'nearby': ['karimabad']},
        {'name': 'Old Hunza Inn',              'destination': 'hunza',         'style': 'budget',   'price_per_night':  2500, 'rating': 3.8, 'type': 'Guest House','amenities': ['Meals', 'Basic Rooms'],                                  'family_friendly': False, 'nearby': ['karimabad']},
        {'name': 'Karimabad Guest House',      'destination': 'hunza',         'style': 'budget',   'price_per_night':  1800, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms'],                                           'family_friendly': False, 'nearby': ['altit fort']},

        # ── Skardu ─────────────────────────────────────────
        {'name': 'Shangrila Resort Skardu',    'destination': 'skardu',        'style': 'luxury',   'price_per_night': 22000, 'rating': 4.7, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'Lake View', 'Boating'],            'family_friendly': True,  'nearby': ['upper kachura lake', 'shangrila lake']},
        {'name': 'K2 Motel Skardu',            'destination': 'skardu',        'style': 'standard', 'price_per_night':  7000, 'rating': 4.2, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Mountain View'],                   'family_friendly': True,  'nearby': ['skardu fort', 'kachura lake']},
        {'name': 'Indus Hotel Skardu',         'destination': 'skardu',        'style': 'standard', 'price_per_night':  5500, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Garden'],                          'family_friendly': True,  'nearby': ['kachura lake', 'skardu bazaar']},
        {'name': 'Skardu View Hotel',          'destination': 'skardu',        'style': 'budget',   'price_per_night':  2800, 'rating': 3.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': True,  'nearby': ['skardu bazaar']},
        {'name': 'Concordia Hotel Skardu',     'destination': 'skardu',        'style': 'budget',   'price_per_night':  2000, 'rating': 3.4, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['skardu bazaar']},

        # ── Murree ─────────────────────────────────────────
        {'name': 'Pearl Continental Murree',   'destination': 'murree',        'style': 'luxury',   'price_per_night': 20000, 'rating': 4.6, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Spa', 'Forest View'],              'family_friendly': True,  'nearby': ['mall road', 'patriata']},
        {'name': 'Pine Hill Resort Bhurban',   'destination': 'murree',        'style': 'luxury',   'price_per_night': 18000, 'rating': 4.5, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'Kids Area', 'Pine View', 'Pool'],  'family_friendly': True,  'nearby': ['bhurban', 'patriata']},
        {'name': 'Hotel One Murree',           'destination': 'murree',        'style': 'standard', 'price_per_night':  7500, 'rating': 4.3, 'type': 'Hotel',      'amenities': ['WiFi', 'Breakfast', 'Hill View'],                        'family_friendly': True,  'nearby': ['mall road']},
        {'name': 'Murree Hills Hotel',         'destination': 'murree',        'style': 'budget',   'price_per_night':  3000, 'rating': 3.6, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['mall road']},
        {'name': 'Green Valley Guest House',   'destination': 'murree',        'style': 'budget',   'price_per_night':  1800, 'rating': 3.3, 'type': 'Guest House','amenities': ['Basic Rooms'],                                           'family_friendly': False, 'nearby': ['nathia gali']},

        # ── Swat ───────────────────────────────────────────
        {'name': 'Serena Hotel Swat',          'destination': 'swat',          'style': 'luxury',   'price_per_night': 18000, 'rating': 4.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Pool', 'River View'],              'family_friendly': True,  'nearby': ['mingora', 'malam jabba']},
        {'name': 'Swat Continental Hotel',     'destination': 'swat',          'style': 'standard', 'price_per_night':  6000, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Garden'],                          'family_friendly': True,  'nearby': ['mingora', 'kalam']},
        {'name': 'Green Valley Hotel Swat',    'destination': 'swat',          'style': 'budget',   'price_per_night':  2500, 'rating': 3.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': False, 'nearby': ['bahrain', 'kalam']},
        {'name': 'Kalam View Guest House',     'destination': 'swat',          'style': 'budget',   'price_per_night':  1500, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['kalam', 'ushu forest']},

        # ── Naran / Kaghan ─────────────────────────────────
        {'name': 'Naran Grand Hotel',          'destination': 'naran',         'style': 'standard', 'price_per_night':  6500, 'rating': 4.1, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'River View'],                      'family_friendly': True,  'nearby': ['saiful maluk lake', 'lulusar lake']},
        {'name': 'PTDC Motel Naran',           'destination': 'naran',         'style': 'standard', 'price_per_night':  5000, 'rating': 3.9, 'type': 'Motel',      'amenities': ['Restaurant', 'Mountain View', 'Basic Rooms'],            'family_friendly': True,  'nearby': ['saiful maluk lake']},
        {'name': 'Lalazar Hotel Naran',        'destination': 'naran',         'style': 'budget',   'price_per_night':  2200, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['babusar top']},
        {'name': 'Kaghan Valley Hotel',        'destination': 'naran',         'style': 'budget',   'price_per_night':  1800, 'rating': 3.3, 'type': 'Guest House','amenities': ['Basic Rooms'],                                           'family_friendly': False, 'nearby': ['kaghan']},

        # ── Neelum Valley ──────────────────────────────────
        {'name': 'Sharda Hill Resort',         'destination': 'neelum valley', 'style': 'standard', 'price_per_night':  5500, 'rating': 4.0, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'River View'],                      'family_friendly': True,  'nearby': ['sharda']},
        {'name': 'Kel Guest House',            'destination': 'neelum valley', 'style': 'budget',   'price_per_night':  2000, 'rating': 3.6, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['kel', 'arang kel']},
        {'name': 'Keran River Lodge',          'destination': 'neelum valley', 'style': 'standard', 'price_per_night':  4500, 'rating': 3.9, 'type': 'Guest House','amenities': ['WiFi', 'Meals', 'River View'],                           'family_friendly': True,  'nearby': ['keran']},

        # ── Fairy Meadows ──────────────────────────────────
        {'name': 'Fairy Meadows Camp',         'destination': 'fairy meadows', 'style': 'budget',   'price_per_night':  1500, 'rating': 4.2, 'type': 'Camping',    'amenities': ['Meals', 'Nanga Parbat View', 'Campfire'],                'family_friendly': False, 'nearby': ['nanga parbat base camp']},
        {'name': 'Raikot Serai',               'destination': 'fairy meadows', 'style': 'standard', 'price_per_night':  4000, 'rating': 4.0, 'type': 'Guest House','amenities': ['Meals', 'Mountain View'],                                'family_friendly': True,  'nearby': ['fairy meadows trek', 'nanga parbat']},

        # ── Islamabad / Rawalpindi ─────────────────────────
        {'name': 'Marriott Islamabad',         'destination': 'islamabad',     'style': 'luxury',   'price_per_night': 30000, 'rating': 4.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Spa', 'Multiple Restaurants', 'Gym'],   'family_friendly': True,  'nearby': ['blue area', 'centaurus', 'rawalpindi', 'taxila', 'wah cantt', 'attock', 'chakwal', 'jhelum', 'hasan abdal', 'abbottabad']},
        {'name': 'Serena Hotel Islamabad',     'destination': 'islamabad',     'style': 'luxury',   'price_per_night': 28000, 'rating': 4.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Spa', 'Restaurant'],                     'family_friendly': True,  'nearby': ['diplomatic enclave', 'f6', 'rawalpindi', 'taxila', 'wah cantt', 'attock']},
        {'name': 'Hotel One Islamabad',        'destination': 'islamabad',     'style': 'standard', 'price_per_night':  9000, 'rating': 4.2, 'type': 'Hotel',      'amenities': ['WiFi', 'Breakfast', 'Gym'],                              'family_friendly': True,  'nearby': ['f6', 'centaurus', 'rawalpindi', 'chakwal', 'jhelum', 'taxila']},
        {'name': 'Ramada Islamabad',           'destination': 'islamabad',     'style': 'standard', 'price_per_night':  7500, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Pool'],                            'family_friendly': True,  'nearby': ['blue area', 'rawalpindi', 'wah cantt', 'attock', 'hasan abdal']},
        {'name': 'Potohar Hotel Rawalpindi',   'destination': 'rawalpindi',    'style': 'standard', 'price_per_night':  6000, 'rating': 3.9, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Parking'],                         'family_friendly': True,  'nearby': ['islamabad', 'taxila', 'wah cantt', 'chakwal', 'attock', 'jhelum', 'hasan abdal']},
        {'name': 'Budget Inn Rawalpindi',      'destination': 'rawalpindi',    'style': 'budget',   'price_per_night':  2500, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': False, 'nearby': ['islamabad', 'taxila', 'wah cantt', 'attock']},

        # ── Lahore & Central Punjab ────────────────────────
        {'name': 'Pearl Continental Lahore',   'destination': 'lahore',        'style': 'luxury',   'price_per_night': 25000, 'rating': 4.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Spa', 'Multiple Restaurants'],           'family_friendly': True,  'nearby': ['liberty', 'gulberg', 'pattoki', 'raiwind', 'kasur', 'sheikhupura', 'gujranwala', 'narowal', 'sialkot', 'okara', 'sahiwal', 'nankana sahib', 'narang mandi', 'narang', 'muridke', 'ferozwala', 'shahdara', 'chunian']},
        {'name': 'Avari Hotel Lahore',         'destination': 'lahore',        'style': 'luxury',   'price_per_night': 22000, 'rating': 4.6, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Restaurant', 'Gym'],                     'family_friendly': True,  'nearby': ['mall road', 'gulberg', 'pattoki', 'raiwind', 'kasur', 'sheikhupura', 'gujranwala', 'sialkot', 'narang mandi', 'narang', 'muridke', 'ferozwala']},
        {'name': 'Hotel One Lahore',           'destination': 'lahore',        'style': 'standard', 'price_per_night':  8000, 'rating': 4.3, 'type': 'Hotel',      'amenities': ['WiFi', 'Breakfast', 'Gym'],                              'family_friendly': True,  'nearby': ['gulberg', 'mm alam road', 'pattoki', 'raiwind', 'kasur', 'okara', 'sahiwal', 'narang mandi', 'narang', 'sheikhupura', 'muridke']},
        {'name': 'Grand Hotel Lahore',         'destination': 'lahore',        'style': 'budget',   'price_per_night':  3500, 'rating': 3.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': True,  'nearby': ['data darbar', 'anarkali', 'pattoki', 'raiwind', 'kasur', 'sheikhupura', 'okara', 'nankana sahib', 'narang mandi', 'narang', 'ferozwala', 'chunian']},
        {'name': 'City Guest House Lahore',    'destination': 'lahore',        'style': 'budget',   'price_per_night':  2200, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['pattoki', 'raiwind', 'kasur', 'sheikhupura', 'muridke', 'nankana sahib', 'narang mandi', 'narang', 'ferozwala']},

        # ── Faisalabad & Central Punjab ────────────────────
        {'name': 'Hotel One Faisalabad',       'destination': 'faisalabad',    'style': 'standard', 'price_per_night':  7000, 'rating': 4.1, 'type': 'Hotel',      'amenities': ['WiFi', 'Breakfast', 'Gym'],                              'family_friendly': True,  'nearby': ['jhang', 'chiniot', 'toba tek singh', 'sargodha', 'gojra', 'samundri']},
        {'name': 'Al Falah Hotel Faisalabad',  'destination': 'faisalabad',    'style': 'budget',   'price_per_night':  3000, 'rating': 3.6, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms', 'Restaurant'],                     'family_friendly': True,  'nearby': ['jhang', 'chiniot', 'toba tek singh', 'sargodha', 'gojra']},

        # ── Multan & Southern Punjab ────────────────────────
        {'name': 'Ramada Hotel Multan',        'destination': 'multan',        'style': 'luxury',   'price_per_night': 12000, 'rating': 4.4, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Restaurant', 'Gym'],                     'family_friendly': True,  'nearby': ['bahawalpur', 'lodhran', 'khanewal', 'vehari', 'muzaffargarh', 'dera ghazi khan']},
        {'name': 'Hotel One Multan',           'destination': 'multan',        'style': 'standard', 'price_per_night':  6500, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Breakfast'],                                     'family_friendly': True,  'nearby': ['bahawalpur', 'lodhran', 'khanewal', 'vehari']},
        {'name': 'Budget Hotel Multan',        'destination': 'multan',        'style': 'budget',   'price_per_night':  2800, 'rating': 3.5, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': False, 'nearby': ['bahawalpur', 'lodhran', 'khanewal', 'dera ghazi khan']},

        # ── Karachi ────────────────────────────────────────
        {'name': 'Pearl Continental Karachi',  'destination': 'karachi',       'style': 'luxury',   'price_per_night': 28000, 'rating': 4.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Spa', 'Sea View', 'Restaurant'],         'family_friendly': True,  'nearby': ['clifton', 'defence', 'hyderabad', 'thatta', 'hawkes bay', 'badin']},
        {'name': 'Marriott Karachi',           'destination': 'karachi',       'style': 'luxury',   'price_per_night': 26000, 'rating': 4.6, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Gym', 'Restaurant'],                     'family_friendly': True,  'nearby': ['clifton', 'defence', 'hyderabad', 'thatta']},
        {'name': 'Hotel Faran Karachi',        'destination': 'karachi',       'style': 'standard', 'price_per_night':  5500, 'rating': 3.9, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'AC Rooms'],                        'family_friendly': True,  'nearby': ['saddar', 'defence', 'hyderabad', 'badin', 'thatta']},
        {'name': 'Budget Inn Karachi',         'destination': 'karachi',       'style': 'budget',   'price_per_night':  2500, 'rating': 3.3, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': False, 'nearby': ['saddar', 'hyderabad', 'thatta']},

        # ── Peshawar & KPK ─────────────────────────────────
        {'name': 'Pearl Continental Peshawar', 'destination': 'peshawar',      'style': 'luxury',   'price_per_night': 18000, 'rating': 4.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Restaurant', 'Gym'],                     'family_friendly': True,  'nearby': ['nowshera', 'charsadda', 'mardan', 'khyber pass', 'landi kotal', 'darra adam khel']},
        {'name': 'Hotel One Peshawar',         'destination': 'peshawar',      'style': 'standard', 'price_per_night':  6000, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Breakfast', 'Restaurant'],                       'family_friendly': True,  'nearby': ['nowshera', 'charsadda', 'mardan', 'khyber pass']},
        {'name': 'Budget Hotel Peshawar',      'destination': 'peshawar',      'style': 'budget',   'price_per_night':  2200, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': False, 'nearby': ['nowshera', 'charsadda', 'landi kotal']},

        # ── Quetta ─────────────────────────────────────────
        {'name': 'Serena Hotel Quetta',        'destination': 'quetta',        'style': 'luxury',   'price_per_night': 15000, 'rating': 4.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Garden', 'Gym'],                   'family_friendly': True,  'nearby': ['ziarat', 'mastung', 'turbat', 'kalat', 'khuzdar']},
        {'name': 'Hotel Bloom Star Quetta',    'destination': 'quetta',        'style': 'standard', 'price_per_night':  5000, 'rating': 3.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant'],                                    'family_friendly': True,  'nearby': ['ziarat', 'mastung', 'kalat']},
        {'name': 'Budget Hotel Quetta',        'destination': 'quetta',        'style': 'budget',   'price_per_night':  2000, 'rating': 3.3, 'type': 'Hotel',      'amenities': ['Basic Rooms'],                                           'family_friendly': False, 'nearby': ['ziarat', 'mastung']},

        # ── Gwadar ─────────────────────────────────────────
        {'name': 'PC Gwadar',                  'destination': 'gwadar',        'style': 'luxury',   'price_per_night': 18000, 'rating': 4.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Sea View', 'Pool'],                'family_friendly': True,  'nearby': ['hammerhead', 'ormara', 'pasni', 'turbat']},
        {'name': 'Gwadar Marriott',            'destination': 'gwadar',        'style': 'luxury',   'price_per_night': 20000, 'rating': 4.6, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Restaurant', 'Gym'],                     'family_friendly': True,  'nearby': ['gwadar port', 'hammerhead', 'ormara']},
        {'name': 'Beach View Hotel Gwadar',    'destination': 'gwadar',        'style': 'standard', 'price_per_night':  5000, 'rating': 3.9, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Sea View'],                        'family_friendly': True,  'nearby': ['hammerhead beach', 'ormara', 'pasni']},

        # ── Gilgit & Surroundings ──────────────────────────
        {'name': 'Serena Hotel Gilgit',        'destination': 'gilgit',        'style': 'luxury',   'price_per_night': 16000, 'rating': 4.6, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Mountain View', 'Garden'],         'family_friendly': True,  'nearby': ['karimabad', 'altit fort', 'baltit fort', 'naltar', 'hunza', 'skardu', 'chilas']},
        {'name': 'Park Hotel Gilgit',          'destination': 'gilgit',        'style': 'standard', 'price_per_night':  5500, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Mountain View'],                   'family_friendly': True,  'nearby': ['gilgit bazaar', 'naltar', 'kargah buddha', 'hunza', 'danyore']},
        {'name': 'Gilgit Continental Hotel',   'destination': 'gilgit',        'style': 'budget',   'price_per_night':  2500, 'rating': 3.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': True,  'nearby': ['gilgit bazaar', 'jaglot', 'chilas']},
        {'name': 'Naltar Valley Resort',       'destination': 'naltar',        'style': 'standard', 'price_per_night':  5000, 'rating': 4.1, 'type': 'Resort',     'amenities': ['Meals', 'Mountain View', 'Skiing'],                      'family_friendly': True,  'nearby': ['gilgit', 'naltar lakes', 'pahote']},
        {'name': 'Chilas Inn',                 'destination': 'chilas',        'style': 'budget',   'price_per_night':  2200, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['gilgit', 'babusar top', 'naran', 'kohistan']},

        # ── Hunza Details ──────────────────────────────────
        {'name': 'Passu Cones View Hotel',     'destination': 'passu',         'style': 'standard', 'price_per_night':  6000, 'rating': 4.3, 'type': 'Guest House','amenities': ['WiFi', 'Meals', 'Mountain View'],                         'family_friendly': True,  'nearby': ['hunza', 'sost', 'khunjerab']},
        {'name': 'Sost Guest House',           'destination': 'sost',          'style': 'budget',   'price_per_night':  2500, 'rating': 3.6, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['khunjerab pass', 'passu', 'hunza']},
        {'name': 'Khunjerab Pass Camp',        'destination': 'khunjerab',     'style': 'budget',   'price_per_night':  2000, 'rating': 3.8, 'type': 'Camping',    'amenities': ['Meals', 'Mountain View', 'Campfire'],                   'family_friendly': False, 'nearby': ['sost', 'passu', 'china border']},

        # ── Astore & Rama Meadow ───────────────────────────
        {'name': 'Rama Meadow Retreat',        'destination': 'astore',        'style': 'standard', 'price_per_night':  4500, 'rating': 4.2, 'type': 'Guest House','amenities': ['Meals', 'Mountain View', 'Hiking'],                      'family_friendly': True,  'nearby': ['rama meadow', 'rama lake', 'chilas', 'gilgit']},
        {'name': 'Astore Valley Hotel',        'destination': 'astore',        'style': 'budget',   'price_per_night':  2000, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['rama meadow', 'minimarg', 'chilas']},

        # ── Chitral & Kalash ───────────────────────────────
        {'name': 'Hindukush Heights Chitral',  'destination': 'chitral',       'style': 'luxury',   'price_per_night': 12000, 'rating': 4.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Mountain View'],                   'family_friendly': True,  'nearby': ['kalash valley', 'bumburet', 'mastuj', 'dir', 'shandur']},
        {'name': 'Chitral View Hotel',         'destination': 'chitral',       'style': 'standard', 'price_per_night':  4500, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'River View'],                      'family_friendly': True,  'nearby': ['chitral fort', 'kalash valley', 'mastuj']},
        {'name': 'Kalash Guest House',         'destination': 'kalash valley', 'style': 'budget',   'price_per_night':  2000, 'rating': 4.1, 'type': 'Guest House','amenities': ['Meals', 'Cultural Tours', 'Mountain View'],             'family_friendly': True,  'nearby': ['bumburet', 'rumbur', 'brir', 'chitral']},
        {'name': 'Bumburet Valley Inn',        'destination': 'bumburet',      'style': 'budget',   'price_per_night':  1800, 'rating': 3.9, 'type': 'Guest House','amenities': ['Meals', 'Basic Rooms'],                                  'family_friendly': True,  'nearby': ['kalash valley', 'chitral', 'rumbur']},

        # ── Dir, Kumrat & Swat Neighbors ───────────────────
        {'name': 'Kumrat Valley Camp',         'destination': 'kumrat',        'style': 'budget',   'price_per_night':  1500, 'rating': 4.2, 'type': 'Camping',    'amenities': ['Meals', 'River View', 'Campfire'],                       'family_friendly': False, 'nearby': ['dir', 'thall', 'jahaz banda']},
        {'name': 'Dir Continental Hotel',      'destination': 'dir',           'style': 'standard', 'price_per_night':  3500, 'rating': 3.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant'],                                    'family_friendly': True,  'nearby': ['kumrat', 'timergara', 'malakand', 'chitral']},
        {'name': 'Thall Tourist Lodge',        'destination': 'thall',         'style': 'budget',   'price_per_night':  1200, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['kumrat', 'jahaz banda', 'dir']},
        {'name': 'Shandur Polo Ground Camp',   'destination': 'shandur',       'style': 'budget',   'price_per_night':  1800, 'rating': 4.0, 'type': 'Camping',    'amenities': ['Meals', 'Lake View', 'Campfire'],                        'family_friendly': False, 'nearby': ['chitral', 'gilgit', 'mastuj']},

        # ── Galiyat, Abbottabad & Mansehra ─────────────────
        {'name': 'Nathia Gali Retreat',        'destination': 'nathia gali',   'style': 'luxury',   'price_per_night': 15000, 'rating': 4.5, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'Forest View', 'Fireplace'],        'family_friendly': True,  'nearby': ['murree', 'galiyat', 'abbottabad', 'thandiani']},
        {'name': 'Thandiani Heights Hotel',    'destination': 'thandiani',     'style': 'standard', 'price_per_night':  5000, 'rating': 4.1, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Forest View'],                     'family_friendly': True,  'nearby': ['abbottabad', 'nathia gali', 'galiyat']},
        {'name': 'Serena Hotel Abbottabad',    'destination': 'abbottabad',    'style': 'luxury',   'price_per_night': 12000, 'rating': 4.4, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Restaurant', 'Gym'],                     'family_friendly': True,  'nearby': ['nathia gali', 'thandiani', 'mansehra', 'murree']},
        {'name': 'Mansehra Hills Hotel',       'destination': 'mansehra',      'style': 'standard', 'price_per_night':  4000, 'rating': 3.9, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Mountain View'],                   'family_friendly': True,  'nearby': ['naran', 'kaghan', 'shogran', 'balakot']},
        {'name': 'Balakot River View Hotel',   'destination': 'balakot',       'style': 'budget',   'price_per_night':  2000, 'rating': 3.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms', 'River View'],                     'family_friendly': True,  'nearby': ['naran', 'kaghan', 'shogran', 'mansehra']},
        {'name': 'Shogran Valley Hotel',       'destination': 'shogran',       'style': 'standard', 'price_per_night':  5500, 'rating': 4.2, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Forest View'],                     'family_friendly': True,  'nearby': ['siri paye', 'naran', 'kaghan', 'mansehra']},
        {'name': 'Siri Paye Meadows Camp',     'destination': 'siri paye',     'style': 'budget',   'price_per_night':  1500, 'rating': 4.1, 'type': 'Camping',    'amenities': ['Meals', 'Meadow View', 'Campfire'],                      'family_friendly': False, 'nearby': ['shogran', 'naran', 'kaghan']},
        {'name': 'Malam Jabba Ski Resort',     'destination': 'malam jabba',   'style': 'luxury',   'price_per_night': 14000, 'rating': 4.5, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'Skiing', 'Mountain View'],         'family_friendly': True,  'nearby': ['mingora', 'swat', 'bahrian', 'kalam']},

        # ── KPK Tribal & Frontier Districts ────────────────
        {'name': 'Kohat Guest House',          'destination': 'kohat',         'style': 'standard', 'price_per_night':  3500, 'rating': 3.7, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant'],                                    'family_friendly': True,  'nearby': ['peshawar', 'nowshera', 'bannu', 'hangu']},
        {'name': 'Bannu Continental Hotel',    'destination': 'bannu',         'style': 'budget',   'price_per_night':  2500, 'rating': 3.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': True,  'nearby': ['lakki marwat', 'd i khan', 'kohat', 'karak']},
        {'name': 'D I Khan River Hotel',       'destination': 'd i khan',      'style': 'standard', 'price_per_night':  4000, 'rating': 3.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'River View'],                      'family_friendly': True,  'nearby': ['tank', 'bannu', 'bhakkar', 'layyah']},
        {'name': 'Parachinar Green Hotel',     'destination': 'parachinar',    'style': 'budget',   'price_per_night':  2000, 'rating': 3.6, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['kurram', 'kohat', 'hangu']},
        {'name': 'Orakzai Valley Guest House', 'destination': 'orakzai',       'style': 'budget',   'price_per_night':  1500, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['hangu', 'kohat', 'kurram']},
        {'name': 'Kurram Valley Lodge',        'destination': 'kurram',        'style': 'budget',   'price_per_night':  1800, 'rating': 3.6, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['parachinar', 'hangu', 'orakzai']},
        {'name': 'Mohmand Hills Hotel',        'destination': 'mohmand',       'style': 'budget',   'price_per_night':  1500, 'rating': 3.4, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['peshawar', 'charsadda', 'bajaur']},
        {'name': 'Bajaur Tourist Inn',         'destination': 'bajaur',        'style': 'budget',   'price_per_night':  1400, 'rating': 3.3, 'type': 'Guest House','amenities': ['Basic Rooms'],                                           'family_friendly': False, 'nearby': ['mohmand', 'dir', 'malakand']},
        {'name': 'Swabi Grand Hotel',          'destination': 'swabi',         'style': 'standard', 'price_per_night':  3500, 'rating': 3.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant'],                                    'family_friendly': True,  'nearby': ['mardan', 'nowshera', 'charsadda', 'peshawar']},
        {'name': 'Haripur Hills Resort',       'destination': 'haripur',       'style': 'standard', 'price_per_night':  4500, 'rating': 4.0, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'Pool'],                            'family_friendly': True,  'nearby': ['abbottabad', 'taxila', 'wah cantt', 'islamabad']},
        {'name': 'Battagram Guest House',      'destination': 'battagram',     'style': 'budget',   'price_per_night':  1800, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['mansehra', 'shangla', 'kohistan', 'balakot']},
        {'name': 'Kohistan Mountain Lodge',    'destination': 'kohistan',      'style': 'budget',   'price_per_night':  1600, 'rating': 3.6, 'type': 'Guest House','amenities': ['Meals', 'Mountain View'],                                'family_friendly': False, 'nearby': ['battagram', 'dassu', 'chilas', 'mansehra']},
        {'name': 'Shangla Valley Hotel',       'destination': 'shangla',       'style': 'budget',   'price_per_night':  1700, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['battagram', 'mingora', 'swat']},
        {'name': 'Torghar Forest Lodge',       'destination': 'torghar',       'style': 'budget',   'price_per_night':  1500, 'rating': 3.4, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['buner', 'swabi', 'mardan']},
        {'name': 'Tank Valley Hotel',          'destination': 'tank',          'style': 'budget',   'price_per_night':  1600, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['d i khan', 'bannu', 'lakki marwat']},
        {'name': 'Lakki Marwat Guest House',   'destination': 'lakki marwat',  'style': 'budget',   'price_per_night':  1500, 'rating': 3.3, 'type': 'Guest House','amenities': ['Basic Rooms'],                                           'family_friendly': True,  'nearby': ['bannu', 'tank', 'd i khan', 'karak']},
        {'name': 'Karak Star Hotel',           'destination': 'karak',         'style': 'budget',   'price_per_night':  1800, 'rating': 3.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': True,  'nearby': ['kohat', 'bannu', 'lakki marwat']},
        {'name': 'Hangu Green Hotel',          'destination': 'hangu',         'style': 'budget',   'price_per_night':  1700, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': False, 'nearby': ['kohat', 'parachinar', 'orakzai', 'kurram']},
        {'name': 'Buner Hills Guest House',    'destination': 'buner',         'style': 'budget',   'price_per_night':  1600, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['swat', 'mardan', 'torghar', 'malakand']},
        {'name': 'Lower Dir Tourist Lodge',    'destination': 'lower dir',     'style': 'budget',   'price_per_night':  1500, 'rating': 3.4, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['timergara', 'upper dir', 'malakand']},
        {'name': 'Upper Dir Valley Hotel',     'destination': 'upper dir',     'style': 'budget',   'price_per_night':  1600, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['kumrat', 'dir', 'thall', 'chitral']},
        {'name': 'Malakand Guest Inn',         'destination': 'malakand',      'style': 'budget',   'price_per_night':  1700, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['mingora', 'swat', 'dir', 'buner']},

        # ── Southern Punjab ────────────────────────────────
        {'name': 'Bahawalpur Luxury Palace',   'destination': 'bahawalpur',    'style': 'luxury',   'price_per_night': 14000, 'rating': 4.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Restaurant', 'Heritage View'],           'family_friendly': True,  'nearby': ['derawar fort', 'cholistan', 'uch sharif', 'multan']},
        {'name': 'Hotel One Bahawalpur',       'destination': 'bahawalpur',    'style': 'standard', 'price_per_night':  6000, 'rating': 4.1, 'type': 'Hotel',      'amenities': ['WiFi', 'Breakfast', 'Gym'],                              'family_friendly': True,  'nearby': ['noor mahal', 'derawar fort', 'cholistan']},
        {'name': 'Cholistan Desert Camp',      'destination': 'cholistan',     'style': 'standard', 'price_per_night':  5000, 'rating': 4.0, 'type': 'Camping',    'amenities': ['Meals', 'Cultural Shows', 'Desert Safari'],              'family_friendly': True,  'nearby': ['bahawalpur', 'derawar fort', 'fort derawar']},
        {'name': 'Uch Sharif Heritage Inn',    'destination': 'uch sharif',    'style': 'budget',   'price_per_night':  1500, 'rating': 3.7, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['bahawalpur', 'rahim yar khan', 'multan']},
        {'name': 'Rahim Yar Khan Hotel',       'destination': 'rahim yar khan','style': 'standard', 'price_per_night':  4000, 'rating': 3.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant'],                                    'family_friendly': True,  'nearby': ['bahawalpur', 'sadiqabad', 'sukkur']},
        {'name': 'Muzaffargarh River Hotel',   'destination': 'muzaffargarh',  'style': 'budget',   'price_per_night':  2000, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['multan', 'dera ghazi khan', 'layyah']},
        {'name': 'Dera Ghazi Khan Guest House','destination': 'dera ghazi khan','style': 'budget',  'price_per_night':  1800, 'rating': 3.4, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['muzaffargarh', 'tank', 'd i khan', 'fort munro']},
        {'name': 'Fort Munro Resort',          'destination': 'fort munro',    'style': 'standard', 'price_per_night':  5000, 'rating': 4.0, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'Hill View'],                       'family_friendly': True,  'nearby': ['dera ghazi khan', 'tank', 'muzaffargarh']},
        {'name': 'Layyah City Hotel',          'destination': 'layyah',        'style': 'budget',   'price_per_night':  1500, 'rating': 3.3, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['bhakkar', 'dera ghazi khan', 'muzaffargarh']},
        {'name': 'Bhakkar Star Hotel',         'destination': 'bhakkar',       'style': 'budget',   'price_per_night':  1400, 'rating': 3.2, 'type': 'Hotel',      'amenities': ['Basic Rooms'],                                           'family_friendly': True,  'nearby': ['layyah', 'mianwali', 'd i khan']},

        # ── Central Punjab Expanded ────────────────────────
        {'name': 'Faisalabad Serena',          'destination': 'faisalabad',    'style': 'luxury',   'price_per_night': 14000, 'rating': 4.4, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Restaurant', 'Gym'],                     'family_friendly': True,  'nearby': ['chiniot', 'jhang', 'toba tek singh', 'sargodha', 'gojra']},
        {'name': 'Chiniot Heritage Hotel',     'destination': 'chiniot',       'style': 'standard', 'price_per_night':  3500, 'rating': 3.9, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Heritage View'],                   'family_friendly': True,  'nearby': ['faisalabad', 'jhang', 'sargodha']},
        {'name': 'Jhang City Hotel',           'destination': 'jhang',         'style': 'budget',   'price_per_night':  2000, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['chiniot', 'faisalabad', 'toba tek singh']},
        {'name': 'Sargodha Royal Inn',         'destination': 'sargodha',      'style': 'standard', 'price_per_night':  3500, 'rating': 3.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Gym'],                             'family_friendly': True,  'nearby': ['faisalabad', 'chiniot', 'mianwali', 'khushab']},
        {'name': 'Gujrat Grand Hotel',         'destination': 'gujrat',        'style': 'standard', 'price_per_night':  4000, 'rating': 3.9, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant'],                                    'family_friendly': True,  'nearby': ['gujranwala', 'sialkot', 'mirpur', 'jhelum']},
        {'name': 'Gujranwala Royal Hotel',     'destination': 'gujranwala',    'style': 'standard', 'price_per_night':  4500, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Gym'],                             'family_friendly': True,  'nearby': ['lahore', 'gujrat', 'sialkot', 'sheikhupura']},
        {'name': 'Sialkot Continental',        'destination': 'sialkot',       'style': 'standard', 'price_per_night':  5000, 'rating': 4.1, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Gym'],                             'family_friendly': True,  'nearby': ['gujrat', 'narowal', 'lahore', 'sambrial']},
        {'name': 'Narowal Guest House',        'destination': 'narowal',       'style': 'budget',   'price_per_night':  1800, 'rating': 3.4, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['sialkot', 'lahore', 'gujranwala', 'kasur']},
        {'name': 'Sheikhupura Heritage Inn',   'destination': 'sheikhupura',   'style': 'budget',   'price_per_night':  2000, 'rating': 3.6, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['lahore', 'kasur', 'nankana sahib', 'gujranwala']},
        {'name': 'Kasur City Hotel',           'destination': 'kasur',         'style': 'budget',   'price_per_night':  1600, 'rating': 3.3, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['lahore', 'sheikhupura', 'okara', 'india border']},
        {'name': 'Okara Star Hotel',           'destination': 'okara',         'style': 'budget',   'price_per_night':  1800, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['sahiwal', 'kasur', 'pakpattan', 'lahore']},
        {'name': 'Sahiwal Continental',        'destination': 'sahiwal',       'style': 'standard', 'price_per_night':  3500, 'rating': 3.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Gym'],                             'family_friendly': True,  'nearby': ['okara', 'multan', 'pakpattan', 'vehari']},
        {'name': 'Pakpattan Guest House',      'destination': 'pakpattan',     'style': 'budget',   'price_per_night':  1500, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['okara', 'sahiwal', 'bahawalnagar']},
        {'name': 'Vehari City Hotel',          'destination': 'vehari',        'style': 'budget',   'price_per_night':  1600, 'rating': 3.3, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['multan', 'khanewal', 'sahiwal', 'bahawalpur']},
        {'name': 'Khanewal Star Hotel',        'destination': 'khanewal',      'style': 'budget',   'price_per_night':  1700, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['multan', 'vehari', 'lodhran', 'sahiwal']},
        {'name': 'Lodhran Guest Inn',          'destination': 'lodhran',       'style': 'budget',   'price_per_night':  1500, 'rating': 3.3, 'type': 'Guest House','amenities': ['Basic Rooms'],                                           'family_friendly': True,  'nearby': ['multan', 'bahawalpur', 'khanewal']},

        # ── Sindh ──────────────────────────────────────────
        {'name': 'Sukkur Serena',              'destination': 'sukkur',        'style': 'luxury',   'price_per_night': 12000, 'rating': 4.4, 'type': 'Hotel',      'amenities': ['WiFi', 'Pool', 'Restaurant', 'River View'],              'family_friendly': True,  'nearby': ['larkana', 'rohri', 'khairpur', 'mohenjo daro']},
        {'name': 'Lansdowne Bridge Hotel',     'destination': 'sukkur',        'style': 'standard', 'price_per_night':  4000, 'rating': 3.9, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant'],                                    'family_friendly': True,  'nearby': ['rohri', 'larkana', 'khairpur']},
        {'name': 'Mohenjo-daro Heritage Hotel','destination': 'mohenjo daro',  'style': 'standard', 'price_per_night':  3500, 'rating': 4.0, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Heritage View'],                   'family_friendly': True,  'nearby': ['larkana', 'sukkur', 'dadu']},
        {'name': 'Larkana Continental',        'destination': 'larkana',       'style': 'standard', 'price_per_night':  3500, 'rating': 3.8, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant'],                                    'family_friendly': True,  'nearby': ['mohenjo daro', 'sukkur', 'kamber']},
        {'name': 'Hyderabad Guest House',      'destination': 'hyderabad',     'style': 'standard', 'price_per_night':  3000, 'rating': 3.7, 'type': 'Guest House','amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': True,  'nearby': ['karachi', 'hala', 'thatta', 'badin']},
        {'name': 'Thatta Heritage Inn',        'destination': 'thatta',        'style': 'budget',   'price_per_night':  1500, 'rating': 3.6, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['makli necropolis', 'keenjhar lake', 'hyderabad', 'karachi']},
        {'name': 'Keenjhar Lake Resort',       'destination': 'keenjhar',      'style': 'standard', 'price_per_night':  5000, 'rating': 4.1, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'Lake View', 'Boating'],            'family_friendly': True,  'nearby': ['thatta', 'hyderabad', 'karachi']},
        {'name': 'Ranikot Fort Camp',          'destination': 'ranikot',       'style': 'budget',   'price_per_night':  1800, 'rating': 4.0, 'type': 'Camping',    'amenities': ['Meals', 'Fort View', 'Campfire'],                        'family_friendly': False, 'nearby': ['sann', 'hyderabad', 'karachi', 'dadhar']},
        {'name': 'Hingol National Park Lodge', 'destination': 'hingol',        'style': 'budget',   'price_per_night':  2000, 'rating': 3.8, 'type': 'Guest House','amenities': ['Meals', 'Desert View'],                                  'family_friendly': False, 'nearby': ['gwadar', 'ormara', 'pasni', 'kund malir']},
        {'name': 'Astola Island Camp',         'destination': 'astola',        'style': 'budget',   'price_per_night':  4000, 'rating': 4.2, 'type': 'Camping',    'amenities': ['Meals', 'Sea View', 'Campfire'],                        'family_friendly': False, 'nearby': ['pasni', 'gwadar', 'ormara']},

        # ── Balochistan Expanded ───────────────────────────
        {'name': 'Ziarat Residency',           'destination': 'ziarat',        'style': 'standard', 'price_per_night':  4500, 'rating': 4.2, 'type': 'Resort',     'amenities': ['WiFi', 'Restaurant', 'Forest View', 'Juniper Forest'],   'family_friendly': True,  'nearby': ['quetta', 'sanjawi', 'harnai']},
        {'name': 'Chaman Border Hotel',        'destination': 'chaman',        'style': 'budget',   'price_per_night':  2000, 'rating': 3.5, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['quetta', 'afghan border', 'killa abdullah']},
        {'name': 'Khuzdar Mountain Lodge',     'destination': 'khuzdar',       'style': 'budget',   'price_per_night':  1800, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': False, 'nearby': ['kalat', 'quetta', 'lasbela', 'wadh']},
        {'name': 'Kalat Fort View Hotel',      'destination': 'kalat',         'style': 'budget',   'price_per_night':  1700, 'rating': 3.6, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['khuzdar', 'quetta', 'mastung']},
        {'name': 'Mastung Valley Hotel',       'destination': 'mastung',       'style': 'budget',   'price_per_night':  1600, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['quetta', 'kalat', 'ziarat', 'chaman']},
        {'name': 'Kund Malir Beach Camp',      'destination': 'kund malir',    'style': 'budget',   'price_per_night':  2500, 'rating': 4.0, 'type': 'Camping',    'amenities': ['Meals', 'Beach View', 'Campfire'],                       'family_friendly': True,  'nearby': ['hingol', 'ormara', 'gwadar', 'pasni']},

        # ── Islamabad / Rawalpindi Expanded ────────────────
        {'name': 'Chakwal City Hotel',         'destination': 'chakwal',       'style': 'budget',   'price_per_night':  2500, 'rating': 3.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': True,  'nearby': ['islamabad', 'rawalpindi', 'talagang', 'mianwali']},
        {'name': 'Taxila Heritage Hotel',      'destination': 'taxila',        'style': 'standard', 'price_per_night':  3500, 'rating': 3.9, 'type': 'Hotel',      'amenities': ['WiFi', 'Restaurant', 'Heritage View'],                   'family_friendly': True,  'nearby': ['islamabad', 'rawalpindi', 'wah cantt', 'hasan abdal']},
        {'name': 'Wah Cantt Guest House',      'destination': 'wah cantt',     'style': 'budget',   'price_per_night':  2000, 'rating': 3.5, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['islamabad', 'rawalpindi', 'taxila', 'hasan abdal']},
        {'name': 'Hasan Abdal Lodge',          'destination': 'hasan abdal',   'style': 'budget',   'price_per_night':  1800, 'rating': 3.6, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals'],                                  'family_friendly': True,  'nearby': ['taxila', 'wah cantt', 'islamabad', 'rawalpindi']},
        {'name': 'Jhelum City Hotel',          'destination': 'jhelum',        'style': 'budget',   'price_per_night':  2200, 'rating': 3.5, 'type': 'Hotel',      'amenities': ['WiFi', 'Basic Rooms'],                                   'family_friendly': True,  'nearby': ['islamabad', 'rawalpindi', 'gujrat', 'sargodha']},
        {'name': 'Mianwali Star Hotel',        'destination': 'mianwali',      'style': 'budget',   'price_per_night':  1800, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['bhakkar', 'sargodha', 'd i khan', 'talagang']},
        {'name': 'Khushab Valley Hotel',       'destination': 'khushab',       'style': 'budget',   'price_per_night':  1700, 'rating': 3.4, 'type': 'Hotel',      'amenities': ['Basic Rooms', 'WiFi'],                                   'family_friendly': True,  'nearby': ['sargodha', 'mianwali', 'jhelum']},

        # ── Northern Kashmir (Neelum Expanded) ─────────────
        {'name': 'Athmuqam Tourist Lodge',     'destination': 'athmuqam',      'style': 'budget',   'price_per_night':  1800, 'rating': 3.7, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals', 'River View'],                    'family_friendly': True,  'nearby': ['neelum valley', 'keran', 'sharda']},
        {'name': 'Taobutt Valley Hotel',       'destination': 'taobutt',       'style': 'budget',   'price_per_night':  2000, 'rating': 3.8, 'type': 'Guest House','amenities': ['Basic Rooms', 'Meals', 'Mountain View'],                 'family_friendly': False, 'nearby': ['neelum valley', 'kel', 'arang kel']},
    ]

    dataset = {'hotels': hotels, 'total': len(hotels)}
    path = os.path.join(MODEL_DIR, 'hotel_dataset.json')
    with open(path, 'w') as f:
        json.dump(dataset, f, indent=2)
    print(f"Hotel dataset saved -> {path}")
    print(f"Total hotels: {len(hotels)}")
    return dataset


if __name__ == '__main__':
    train_cost_model()
    create_hotel_dataset()
    print("\nAll models trained and saved successfully!")
