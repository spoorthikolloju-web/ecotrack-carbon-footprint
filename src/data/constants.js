export const EMISSION_FACTORS = {
  transport: {
    car_petrol: { label: "Car (Petrol)", factor: 0.192, unit: "km", icon: "🚗" },
    car_diesel: { label: "Car (Diesel)", factor: 0.171, unit: "km", icon: "🚙" },
    car_electric: { label: "Car (Electric)", factor: 0.053, unit: "km", icon: "⚡" },
    bus: { label: "Bus", factor: 0.089, unit: "km", icon: "🚌" },
    train: { label: "Train", factor: 0.041, unit: "km", icon: "🚆" },
    flight_domestic: { label: "Flight (Domestic)", factor: 0.255, unit: "km", icon: "✈️" },
    flight_international: { label: "Flight (International)", factor: 0.195, unit: "km", icon: "🌍" },
    bike: { label: "Bicycle / Walk", factor: 0, unit: "km", icon: "🚴" },
  },
  home: {
    electricity: { label: "Electricity", factor: 0.82, unit: "kWh", icon: "💡" },
    natural_gas: { label: "Natural Gas", factor: 2.04, unit: "m³", icon: "🔥" },
    lpg: { label: "LPG", factor: 1.51, unit: "kg", icon: "⛽" },
    wood: { label: "Firewood", factor: 0.015, unit: "kg", icon: "🪵" },
  },
  food: {
    beef: { label: "Beef", factor: 27.0, unit: "kg", icon: "🥩" },
    lamb: { label: "Lamb / Mutton", factor: 39.2, unit: "kg", icon: "🐑" },
    chicken: { label: "Chicken", factor: 6.9, unit: "kg", icon: "🍗" },
    fish: { label: "Fish / Seafood", factor: 6.1, unit: "kg", icon: "🐟" },
    dairy: { label: "Dairy (milk/cheese)", factor: 3.2, unit: "kg", icon: "🥛" },
    vegetables: { label: "Vegetables / Fruits", factor: 0.9, unit: "kg", icon: "🥦" },
    rice: { label: "Rice", factor: 2.7, unit: "kg", icon: "🍚" },
    pulses: { label: "Pulses / Lentils", factor: 0.9, unit: "kg", icon: "🫘" },
  },
  shopping: {
    clothing: { label: "New Clothing", factor: 20.0, unit: "item", icon: "👕" },
    electronics: { label: "Electronics", factor: 300.0, unit: "item", icon: "📱" },
    furniture: { label: "Furniture", factor: 50.0, unit: "item", icon: "🪑" },
    online_shopping: { label: "Online Order (package)", factor: 0.8, unit: "package", icon: "📦" },
  }
};

export const TIPS_BY_CATEGORY = {
  transport: [
    { tip: "Switch to public transport 3 days a week", saving: 400, difficulty: "Easy" },
    { tip: "Carpool with colleagues", saving: 600, difficulty: "Easy" },
    { tip: "Work from home 2 days/week", saving: 300, difficulty: "Easy" },
    { tip: "Switch to an electric vehicle", saving: 2000, difficulty: "Hard" },
    { tip: "Cycle for trips under 5km", saving: 200, difficulty: "Medium" },
  ],
  home: [
    { tip: "Switch to LED bulbs throughout your home", saving: 100, difficulty: "Easy" },
    { tip: "Install a solar water heater", saving: 400, difficulty: "Hard" },
    { tip: "Set AC at 24°C instead of 20°C", saving: 150, difficulty: "Easy" },
    { tip: "Use energy-efficient appliances (BEE 5-star)", saving: 200, difficulty: "Medium" },
    { tip: "Unplug devices when not in use", saving: 80, difficulty: "Easy" },
  ],
  food: [
    { tip: "Go meat-free 2 days a week", saving: 500, difficulty: "Easy" },
    { tip: "Reduce beef consumption by half", saving: 800, difficulty: "Medium" },
    { tip: "Buy local seasonal produce", saving: 200, difficulty: "Easy" },
    { tip: "Reduce food waste by meal planning", saving: 300, difficulty: "Medium" },
    { tip: "Start a kitchen compost", saving: 100, difficulty: "Easy" },
  ],
  shopping: [
    { tip: "Buy second-hand clothing", saving: 200, difficulty: "Easy" },
    { tip: "Repair electronics instead of replacing", saving: 300, difficulty: "Medium" },
    { tip: "Adopt a 30-day rule before big purchases", saving: 400, difficulty: "Easy" },
    { tip: "Buy only what you need", saving: 500, difficulty: "Medium" },
  ],
};

export const INDIA_AVERAGE_FOOTPRINT = 1800; // kg CO2e per year per person (India avg)
export const WORLD_AVERAGE_FOOTPRINT = 4800;
export const PARIS_GOAL = 2300; // kg CO2e target per person per year

export const EQUIVALENCIES = [
  { value: 1, label: "km driven by car", factor: 0.192 },
  { value: 1, label: "tree absorbed per year", factor: 21 },
  { value: 1, label: "smartphones charged", factor: 0.008 },
  { value: 1, label: "plastic bottles produced", factor: 0.083 },
];
