# 🌿 EcoTrack – Carbon Footprint Awareness Platform

A full-featured React web app to help individuals **track, understand, and reduce** their carbon footprint with personalized insights.

## 🚀 Live Demo
https://ecotrack-carbon-footprint-3g64f8jkv-spoorthi-s-project.vercel.app/

## ✨ Features

### 🏠 Dashboard
- Monthly CO₂e summary with color-coded score badge
- 7-day emissions trend line chart
- Category breakdown pie chart (transport, home, food, shopping)
- Comparison bars vs India average, World average, and Paris Agreement goal
- Equivalencies (trees needed to offset, car equivalent)

### 🧮 Calculator
- Covers 4 categories: Transport, Home Energy, Food, Shopping
- 20+ emission sources with real Indian emission factors
- Selectable period: daily / weekly / monthly / annual
- Real-time total with one-click save to log

### 📋 Daily Log
- 10 Quick Add buttons for common activities
- Custom entry form (select category + type + quantity)
- Entry management with remove option
- 7-day history bar chart with date selector

### 💡 Reduction Tips
- 20+ actionable tips categorized by type
- Difficulty rating (Easy / Medium / Hard)
- "Commit" toggle with total potential savings tracker

### 🏆 Eco Challenges
- 8 time-bound challenges (Meatless Monday, Zero Waste Week, etc.)
- Active/completed state tracking
- CO₂e savings displayed per challenge
- Progress stats panel

## 🛠️ Tech Stack
- **React 18** (Create React App)
- **Recharts** – interactive charts
- **LocalStorage** – persistent data, no backend needed
- **Google Fonts** – Inter + Space Grotesk
- **Emission factors** – sourced from IPCC, Our World in Data, India-specific values

## 📦 Setup

```bash
npm install
npm start        # dev server at localhost:3000
npm run build    # production build
```

## 🚢 To  Deploy (Vercel)
```bash
npm install -g vercel
vercel --prod
```

## 🌍 Impact

Built for **Challenge 3 – Carbon Footprint Awareness Platform** at Hack2Skill.

Helps users understand that small daily choices — switching to public transport, reducing meat intake, using efficient appliances — collectively make a major difference. Grounded in India-specific emission factors and benchmarks against India's national average and the Paris Agreement 2.3t/year target.

## 📊 Emission Factors Used
| Source | Factor |
|--------|--------|
| Petrol car | 0.192 kg CO₂e/km |
| Indian electricity grid | 0.82 kg CO₂e/kWh |
| Beef | 27 kg CO₂e/kg |
| Train | 0.041 kg CO₂e/km |
| LPG | 1.51 kg CO₂e/kg |



____
