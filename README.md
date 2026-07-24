# TripAI — AI-Based Trip Planner

A full-stack AI-powered trip planning application built as a university project. Users fill a multi-step form with their travel preferences and receive a complete, personalized trip itinerary generated — enriched with **real-time Google Maps route data**, **live OpenWeatherMap forecasts**, and **ML-powered cost & hotel predictions** from a Python microservice.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| ML Service | Python Flask, scikit-learn RandomForestRegressor, Content-Based Filtering |
| Maps | Google Maps Directions API + Places API + Embed API |
| Weather | OpenWeatherMap API |

---

## Project Structure

```
ai-based-trip-planner/
├── client/my-app/          # React + Vite frontend
│   └── src/
│       ├── screens/        # All page components
│       ├── components/     # Shared components (Navbar, CityAutocomplete)
│       ├── hooks/          # React Query hooks
│       ├── redux/          # Redux Toolkit slices + store
│       ├── services/       # API service functions
│       └── constant/       # App constants + Yup schemas
│
├── server/                 # Node.js + Express backend
│   ├── controllers/        # Route controllers
│   ├── handlers/           # Business logic handlers
│   ├── routes/             # Express routes
│   ├── models/             # Mongoose models
│   ├── queues/             # BullMQ job queue (Redis)
│   ├── workers/            # BullMQ worker (processes AI jobs)
│   ├── llmProvider/        # OpenAI streaming integration
│   ├── prompts/            # AI prompt template
│   └── services/           # Google Maps, Weather, ML service clients
│
├── ml-service/             # Python Flask ML microservice
│   ├── app.py              # Flask API (port 5001)
│   ├── train_models.py     # Model training script
│   ├── models/             # Saved model files (generated)
│   └── requirements.txt    # Python dependencies
│
└── docker-compose.yml      # Redis container
```

---

## Features

- **AI Trip Planning** — Multi-step form collects trip preferences; GPT-4.1-mini generates a structured 10-section itinerary streamed in real-time via SSE
- **Live Route Data** — Google Maps Directions API returns distance, duration, and route summary between origin and destination
- **Live Weather** — OpenWeatherMap API fetches current weather and 5-day forecast for the destination city
- **ML Cost Prediction** — RandomForestRegressor (trained on 3,000 synthetic Pakistani travel samples) predicts total trip cost with per-person breakdown
- **ML Hotel Recommendations** — Content-Based Filtering algorithm scores and ranks hotels by budget fit, travel style, group size, and rating
- **Real-Time Streaming** — AI output streams token-by-token via SSE with a typing animation on the frontend
- **User Authentication** — Register → OTP email verification → Login → JWT-protected routes with redirect-back support
- **Protected Routes** — Unauthenticated users are redirected to login before accessing `/ai-planning` or `/projects`
- **Projects Dashboard** — All generated plans saved to MongoDB; users can switch between past plans in a sidebar
- **Google Maps Route Embed** — Interactive driving-route map displayed for each saved trip plan
- **PDF Export** — AI trip plan exported to a clean, print-styled PDF via the browser's native print dialog
- **Route Validation (3-layer)** — City inputs validated by Yup regex, Google Places Autocomplete (Pakistan-restricted), and server-side Geocoding API with type + similarity checks
- **Markdown Rendering** — AI output (including tables, headers, lists) rendered with ReactMarkdown + remark-gfm

---

## Route Validation

City inputs go through three independent validation layers to prevent random or invalid locations:

| Layer | Where | What it catches |
|---|---|---|
| Yup schema | Client | Pure numbers (`123`), special characters (`!@#`) |
| Google Places Autocomplete | Client | Shows only real Pakistani cities; blocks Next Section until a valid dropdown selection is made |
| Google Geocoding API | Server | Checks result type (`locality`, `administrative_area_level_2`, etc.), confirms country is Pakistan, and verifies the geocoded name is a close match to the input |

---

## ML Models

### Cost Prediction — Random Forest Regressor
- **Features:** `distance_km`, `group_size`, `trip_days`, `transport_mode`, `accommodation_type`, `travel_style`
- **Training data:** 3,000 synthetic samples of Pakistani travel routes
- **Output:** `total_cost_pkr`, `per_person_cost_pkr`, cost breakdown (transport, accommodation, food, activities, misc)
- **Fallback:** Formula-based calculation if model file not found

### Hotel Recommendations — Content-Based Filtering
- **Dataset:** 38 Pakistani hotels across 12 major destinations
- **Scoring:** Budget fit (3.0 pts) + Style match (4.0 pts) + Group suitability (1.5 pts) + Rating bonus
- **Output:** Top 5 ranked hotels with amenities and pricing

---

## Prerequisites

- Node.js v18+
- Python 3.10+
- Redis (via Docker or local install)
- MongoDB (local or Atlas)
- API keys for OpenAI, Google Maps (Directions + Places + Geocoding + Embed), and OpenWeatherMap

> **Google Maps API key** must have the following APIs enabled in Google Cloud Console:
> Directions API, Geocoding API, Maps JavaScript API (with Places library), Maps Embed API

---

## Setup & Running

### 1. Start Redis

```bash
docker-compose up -d
```

### 2. Backend (Node.js)

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=4000
MONGOOSEDB_URL=mongodb://localhost:27017/tripPlanner
JWT_SECRET_KEY=your_jwt_secret

OPEN_AI_API_KEY=sk-...
GOOGLE_MAPS_API_KEY=AIza...
OPENWEATHER_API_KEY=your_openweather_key
ML_SERVICE_URL=http://localhost:5001
```

```bash
npm run dev
```

### 3. ML Microservice (Python)

```bash
cd ml-service
pip install -r requirements.txt

# Train the models first (generates cost_model.pkl and hotel_dataset.json)
python train_models.py

# Start the Flask API
python app.py
```

The ML service runs on `http://localhost:5001`.

### 4. Frontend (React)

```bash
cd client/my-app
npm install
npm run dev
```

Create `client/my-app/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_API_VERSION=/v1
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

Frontend runs on `http://localhost:5173`.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/ai/auth/register` | Register new user |
| POST | `/api/v1/ai/auth/login` | Login |
| POST | `/api/v1/ai/auth/verify-otp` | Verify OTP |
| POST | `/api/v1/ai/auth/resend-otp` | Resend OTP email |
| POST | `/api/v1/ai/auth/forgot-password` | Request password reset |

### AI Planning
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/ai-analysis/generate-report` | Submit trip form → validate cities → enrich with live data → queue AI job → return jobId |
| GET | `/api/v1/ai-analysis/stream/:jobId` | SSE stream — receives AI output token by token |
| GET | `/api/v1/ai-analysis/projects/:userId` | Get all saved projects for a user |

### ML Service (Port 5001)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check model load status |
| POST | `/predict-cost` | Predict trip cost using RandomForest |
| POST | `/recommend-hotels` | Get top 5 hotel recommendations |

---

## How It Works

```
User fills multi-step form (city inputs validated via Google Places Autocomplete)
      ↓
On submit → server validates cities via Google Geocoding API
  └── Invalid city → 422 error shown inline, generation blocked
      ↓
Node.js enriches data in parallel:
  ├── Google Maps Directions API  (route + distance)
  ├── OpenWeatherMap API          (live weather)
  └── Python ML service           (cost prediction + hotel recommendations)
      ↓
Enriched data queued via BullMQ (Redis)
      ↓
Worker picks up job → calls OpenAI GPT-4.1-mini (streaming)
      ↓
Each token published to Redis pub/sub channel
      ↓
Frontend SSE connection receives tokens → typing animation
      ↓
Full result saved to MongoDB
      ↓
User lands on Projects page:
  ├── AI plan rendered via ReactMarkdown
  ├── Interactive Google Maps route embed
  └── Download PDF button → clean print-styled PDF via browser print dialog
```

---

## Environment Variables Summary

| Variable | Service | Description |
|---|---|---|
| `PORT` | Server | Express server port (default 4000) |
| `MONGOOSEDB_URL` | Server | MongoDB connection string |
| `JWT_SECRET_KEY` | Server | JWT signing secret |
| `OPEN_AI_API_KEY` | Server | OpenAI API key |
| `GOOGLE_MAPS_API_KEY` | Server | Google Maps Directions + Geocoding API key |
| `OPENWEATHER_API_KEY` | Server | OpenWeatherMap API key |
| `ML_SERVICE_URL` | Server | Python ML service URL (default http://localhost:5001) |
| `VITE_API_BASE_URL` | Frontend | Backend base URL |
| `VITE_API_VERSION` | Frontend | API version prefix (e.g. `/v1`) |
| `VITE_GOOGLE_MAPS_API_KEY` | Frontend | Google Maps key for Places Autocomplete + Embed |

---

## University Project Notes

This project satisfies the following requirements:

- **Machine Learning Models** — RandomForestRegressor (cost prediction) + Content-Based Filtering (hotel recommendations) built and trained in Python
- **Real APIs** — Google Maps Directions + Geocoding + Places APIs + OpenWeatherMap API for live data
- **Generative AI** — GPT-4.1-mini integrated via OpenAI streaming API
- **Full-Stack** — React frontend + Node.js backend + Python ML microservice
- **Database** — MongoDB for user data and saved trip plans
- **Authentication** — JWT-based auth with OTP email verification and protected routes
- **Real-Time** — Server-Sent Events for streaming AI output
- **Input Validation** — Multi-layer city validation (client regex + Places Autocomplete + server geocoding)
- **PDF Export** — Clean browser-native PDF generation from AI-rendered markdown

---

## Author

University AI Trip Planner Project — 2026
