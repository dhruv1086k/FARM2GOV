import dotenv from "dotenv";
dotenv.config();

// Realistic base prices (per quintal in INR) based on 2024 data
const cropBasePrices = {
  // Cereals
  rice: { base: 2100, kharif: 1.15, rabi: 0.95, zaid: 1.0 },
  wheat: { base: 2050, kharif: 0.9, rabi: 1.1, zaid: 1.0 },
  maize: { base: 1850, kharif: 1.1, rabi: 0.95, zaid: 1.05 },
  bajra: { base: 2250, kharif: 1.15, rabi: 0.9, zaid: 1.0 },
  jowar: { base: 3000, kharif: 1.1, rabi: 0.95, zaid: 1.0 },

  // Pulses
  arhar: { base: 6500, kharif: 1.1, rabi: 1.0, zaid: 1.0 },
  moong: { base: 7200, kharif: 1.15, rabi: 0.95, zaid: 1.1 },
  urad: { base: 6800, kharif: 1.1, rabi: 1.0, zaid: 1.0 },
  masoor: { base: 5500, kharif: 0.95, rabi: 1.15, zaid: 1.0 },

  // Cash Crops
  cotton: { base: 6500, kharif: 1.2, rabi: 0.9, zaid: 1.0 },
  sugarcane: { base: 3100, kharif: 1.05, rabi: 1.0, zaid: 1.05 },
  jute: { base: 4500, kharif: 1.15, rabi: 0.9, zaid: 1.0 },

  // Oilseeds
  groundnut: { base: 5500, kharif: 1.15, rabi: 0.95, zaid: 1.0 },
  soybean: { base: 4200, kharif: 1.2, rabi: 0.9, zaid: 1.0 },
  mustard: { base: 5300, kharif: 0.9, rabi: 1.2, zaid: 1.0 },
  sunflower: { base: 6200, kharif: 1.1, rabi: 1.05, zaid: 1.0 },

  // Vegetables
  potato: { base: 1200, kharif: 0.9, rabi: 1.15, zaid: 1.1 },
  onion: { base: 1500, kharif: 1.2, rabi: 0.9, zaid: 1.1 },
  tomato: { base: 1800, kharif: 1.1, rabi: 1.05, zaid: 1.15 },
  cabbage: { base: 1000, kharif: 0.95, rabi: 1.15, zaid: 1.0 },
  cauliflower: { base: 1400, kharif: 0.9, rabi: 1.2, zaid: 1.0 },
};

// State-based price multipliers
const stateMultipliers = {
  punjab: 1.15,
  haryana: 1.12,
  "uttar pradesh": 1.08,
  "madhya pradesh": 1.05,
  maharashtra: 1.1,
  karnataka: 1.08,
  "andhra pradesh": 1.07,
  telangana: 1.07,
  rajasthan: 1.05,
  gujarat: 1.06,
  bihar: 0.98,
  "west bengal": 1.0,
  odisha: 0.97,
  jharkhand: 0.96,
  chhattisgarh: 0.95,
  tamil_nadu: 1.05,
  "tamil nadu": 1.05,
  kerala: 1.03,
  assam: 0.95,
  uttarakhand: 1.02,
  "himachal pradesh": 1.0,
  "jammu and kashmir": 0.98,
  goa: 1.02,
  manipur: 0.95,
  meghalaya: 0.95,
  mizoram: 0.95,
  nagaland: 0.95,
  sikkim: 0.98,
  tripura: 0.96,
  "arunachal pradesh": 0.95,
};

// Helper functions to get available items
export function getAvailableCrops() {
  return Object.keys(cropBasePrices);
}

export function getAvailableStates() {
  // Return proper state names (not underscored versions)
  return [
    "Punjab",
    "Haryana",
    "Uttar Pradesh",
    "Madhya Pradesh",
    "Maharashtra",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana",
    "Rajasthan",
    "Gujarat",
    "Bihar",
    "West Bengal",
    "Odisha",
    "Jharkhand",
    "Chhattisgarh",
    "Tamil Nadu",
    "Kerala",
    "Assam",
    "Uttarakhand",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Goa",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Sikkim",
    "Tripura",
    "Arunachal Pradesh",
  ];
}

export async function callAIPricePredictor(prompt) {
  try {
    console.log("🤖 Using Smart AI Predictor (Rule-Based, FREE)...");

    // Extract crop, state, season from prompt
    const cropMatch = prompt.match(/Crop:\s*([^\n\r]+)/i);
    const stateMatch = prompt.match(/State:\s*([^\n\r]+)/i);
    const seasonMatch = prompt.match(/Season:\s*([^\n\r]+)/i);

    if (!cropMatch || !stateMatch || !seasonMatch) {
      throw new Error("Could not parse crop/state/season from prompt");
    }

    const crop = cropMatch[1].toLowerCase().trim();
    const state = stateMatch[1].toLowerCase().trim();
    const stateKey = state.replace(/\s+/g, "_");
    const season = seasonMatch[1].toLowerCase().trim();

    console.log(`📊 Analyzing: ${crop} in ${state} during ${season}`);

    // Validate crop
    const cropData = cropBasePrices[crop];
    if (!cropData) {
      const availableCrops = Object.keys(cropBasePrices).join(", ");
      throw new Error(
        `Crop "${crop}" not found in database. Available crops: ${availableCrops}`
      );
    }

    // Validate state
    if (!stateMultipliers[state] && !stateMultipliers[stateKey]) {
      const availableStates = getAvailableStates().join(", ");
      throw new Error(
        `State "${stateMatch[1]}" not found in database. Available states: ${availableStates}`
      );
    }

    // Validate season
    const validSeasons = ["kharif", "rabi", "zaid"];
    if (!validSeasons.includes(season)) {
      throw new Error(
        `Invalid season "${season}". Valid seasons are: Kharif, Rabi, Zaid`
      );
    }

    // Calculate price
    let price = cropData.base;

    // Apply seasonal multiplier
    if (season === "kharif") price *= cropData.kharif;
    else if (season === "rabi") price *= cropData.rabi;
    else if (season === "zaid") price *= cropData.zaid;

    // Apply state multiplier
    const stateMultiplier =
      stateMultipliers[state] || stateMultipliers[stateKey] || 1.0;
    price *= stateMultiplier;

    // Round to nearest 50
    price = Math.round(price / 50) * 50;

    console.log(`✅ Predicted price: ₹${price}/quintal`);

    return { predictedPrice: price };
  } catch (err) {
    console.error("❌ Prediction Error:", err.message);
    throw err;
  }
}
