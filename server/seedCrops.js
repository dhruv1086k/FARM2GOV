// server/seedCrops.js
// Run with: node seedCrops.js
// Inserts 3 demo farmers + 15 crop listings with realistic Indian agri data.

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Farmer from "./models/Farmer.js";
import Crop from "./models/Crop.js";

/* ─────────────────────────────────────────────────────────
   DEMO FARMERS  (will be skipped if phone already exists)
───────────────────────────────────────────────────────── */
const demoFarmers = [
  {
    name: "Ramesh Kumar",
    phone: "9876543210",
    email: "ramesh.kumar@demo.farm",
    state: "Punjab",
    language: "hi",
  },
  {
    name: "Priya Devi",
    phone: "9876543211",
    email: "priya.devi@demo.farm",
    state: "Maharashtra",
    language: "hi",
  },
  {
    name: "Suresh Reddy",
    phone: "9876543212",
    email: "suresh.reddy@demo.farm",
    state: "Andhra Pradesh",
    language: "en",
  },
  {
    name: "Anita Singh",
    phone: "9876543213",
    email: "anita.singh@demo.farm",
    state: "Uttar Pradesh",
    language: "hi",
  },
  {
    name: "Mohan Patel",
    phone: "9876543214",
    email: "mohan.patel@demo.farm",
    state: "Gujarat",
    language: "en",
  },
];

/* ─────────────────────────────────────────────────────────
   DEMO CROPS  – realistic mandi prices (May 2025)
   pricePerQuintal sourced from AGMARKNET / e-NAM averages
───────────────────────────────────────────────────────── */
const cropTemplates = [
  /* ── CEREALS ── */
  {
    cropName: "Wheat",
    quantity: 200,
    unit: "quintal",
    pricePerQuintal: 2275,
    category: "Cereals",
    description:
      "Grade-A Sharbati wheat from Ludhiana. Moisture <12%. MSP-compliant. Ideal for flour mills and bulk procurement.",
    state: "Punjab",
    location: "Ludhiana",
    farmerIndex: 0, // Ramesh Kumar
    status: "Available",
  },
  {
    cropName: "Basmati Rice",
    quantity: 80,
    unit: "quintal",
    pricePerQuintal: 5200,
    category: "Cereals",
    description:
      "Pusa Basmati 1121 variety. Long-grain, aromatic. Polished and ready for export packaging.",
    state: "Punjab",
    location: "Amritsar",
    farmerIndex: 0, // Ramesh Kumar
    status: "Available",
  },
  {
    cropName: "Maize",
    quantity: 150,
    unit: "quintal",
    pricePerQuintal: 1850,
    category: "Cereals",
    description:
      "Yellow hybrid maize (Pioneer 30V92). Dry, moisture 14%. Suitable for poultry feed and starch industry.",
    state: "Maharashtra",
    location: "Aurangabad",
    farmerIndex: 1, // Priya Devi
    status: "Available",
  },
  {
    cropName: "Sorghum (Jowar)",
    quantity: 60,
    unit: "quintal",
    pricePerQuintal: 3200,
    category: "Cereals",
    description:
      "White jowar, traditional variety. Drought-resistant crop grown without pesticides. Suitable for flour and animal feed.",
    state: "Maharashtra",
    location: "Solapur",
    farmerIndex: 1, // Priya Devi
    status: "Available",
  },

  /* ── PULSES ── */
  {
    cropName: "Tur Dal (Arhar)",
    quantity: 40,
    unit: "quintal",
    pricePerQuintal: 7500,
    category: "Pulses",
    description:
      "ICPL 87 variety. Bold seeds, 95%+ purity. MSP ₹7,550/qtl. Sorted and cleaned at farm level.",
    state: "Andhra Pradesh",
    location: "Kurnool",
    farmerIndex: 2, // Suresh Reddy
    status: "Available",
  },
  {
    cropName: "Chana (Gram)",
    quantity: 90,
    unit: "quintal",
    pricePerQuintal: 5440,
    category: "Pulses",
    description:
      "Desi chana, kabuli grade. Average seed size 8mm. Ready for direct sale to dal mills.",
    state: "Uttar Pradesh",
    location: "Kanpur",
    farmerIndex: 3, // Anita Singh
    status: "Available",
  },
  {
    cropName: "Moong Dal (Green Gram)",
    quantity: 25,
    unit: "quintal",
    pricePerQuintal: 8558,
    category: "Pulses",
    description:
      "Summer moong, SML-668 variety. Bright green, uniform size. MSP rate ₹8,558/qtl. Premium quality.",
    state: "Gujarat",
    location: "Mehsana",
    farmerIndex: 4, // Mohan Patel
    status: "Available",
  },
  {
    cropName: "Masoor Dal (Red Lentil)",
    quantity: 35,
    unit: "quintal",
    pricePerQuintal: 6000,
    category: "Pulses",
    description:
      "HUL-57 variety, medium-sized red lentil. Clean, sorted. Suitable for processing and retail packaging.",
    state: "Uttar Pradesh",
    location: "Allahabad",
    farmerIndex: 3, // Anita Singh
    status: "Available",
  },

  /* ── VEGETABLES ── */
  {
    cropName: "Tomato",
    quantity: 30,
    unit: "quintal",
    pricePerQuintal: 2800,
    category: "Vegetables",
    description:
      "Hybrid tomato (Namdhari NS-538). Firm, red, uniform 50-60g size. Suitable for retail, processing & ketchup units.",
    state: "Andhra Pradesh",
    location: "Madanapalle",
    farmerIndex: 2, // Suresh Reddy
    status: "Available",
  },
  {
    cropName: "Onion",
    quantity: 120,
    unit: "quintal",
    pricePerQuintal: 1600,
    category: "Vegetables",
    description:
      "Nasik red onion, Agrifound Light Red variety. 40-60mm diameter. Low moisture, excellent shelf life up to 6 months.",
    state: "Maharashtra",
    location: "Nashik",
    farmerIndex: 1, // Priya Devi
    status: "Available",
  },
  {
    cropName: "Potato",
    quantity: 200,
    unit: "quintal",
    pricePerQuintal: 1050,
    category: "Vegetables",
    description:
      "Kufri Sindhuri variety. Round, red-skinned. Suitable for chips, fries, and table use. Fresh harvest from cold storage.",
    state: "Uttar Pradesh",
    location: "Agra",
    farmerIndex: 3, // Anita Singh
    status: "Available",
  },

  /* ── FRUITS ── */
  {
    cropName: "Mango (Kesar)",
    quantity: 20,
    unit: "quintal",
    pricePerQuintal: 12000,
    category: "Fruits",
    description:
      "GI-tagged Kesar mango from Gir region. Saffron pulp, sweet aroma, export quality. Ready for direct buyers & exporters.",
    state: "Gujarat",
    location: "Junagadh",
    farmerIndex: 4, // Mohan Patel
    status: "Available",
  },
  {
    cropName: "Banana (Robusta)",
    quantity: 50,
    unit: "quintal",
    pricePerQuintal: 2400,
    category: "Fruits",
    description:
      "Robusta banana, 150-175mm length. Harvested at 75% maturity for ripening transport. Suitable for retail chains.",
    state: "Andhra Pradesh",
    location: "Nellore",
    farmerIndex: 2, // Suresh Reddy
    status: "Available",
  },

  /* ── SPICES ── */
  {
    cropName: "Turmeric",
    quantity: 15,
    unit: "quintal",
    pricePerQuintal: 13500,
    category: "Spices",
    description:
      "Erode turmeric (Salem line), 3-5% curcumin content. Polished fingers. Ready for bulk and retail packaging.",
    state: "Andhra Pradesh",
    location: "Nizamabad",
    farmerIndex: 2, // Suresh Reddy
    status: "Available",
  },
  {
    cropName: "Cumin (Jeera)",
    quantity: 12,
    unit: "quintal",
    pricePerQuintal: 28000,
    category: "Spices",
    description:
      "Gujarat Jeera, RZ-209 variety. Bold seeds, 2.5mm+. Moisture <8%. Premium quality, suitable for export.",
    state: "Gujarat",
    location: "Unjha",
    farmerIndex: 4, // Mohan Patel
    status: "Available",
  },
];

/* ─────────────────────────────────────────────────────────
   SEED FUNCTION
───────────────────────────────────────────────────────── */
const seed = async () => {
  await connectDB();

  const hashedPass = await bcrypt.hash("Demo@1234", 10);

  // 1. Upsert demo farmers
  const farmerDocs = [];
  for (const f of demoFarmers) {
    let farmer = await Farmer.findOne({ phone: f.phone });
    if (!farmer) {
      farmer = await Farmer.create({ ...f, password: hashedPass });
      console.log(`✅ Created farmer: ${farmer.name} (${farmer.phone})`);
    } else {
      console.log(`⏭  Farmer exists: ${farmer.name} (${farmer.phone})`);
    }
    farmerDocs.push(farmer);
  }

  // 2. Insert crops (skip if same name + farmerId already exists)
  let inserted = 0;
  let skipped = 0;

  for (const template of cropTemplates) {
    const farmer = farmerDocs[template.farmerIndex];
    const exists = await Crop.findOne({
      cropName: template.cropName,
      farmerId: farmer._id,
    });

    if (exists) {
      console.log(`⏭  Crop exists: ${template.cropName} by ${farmer.name}`);
      skipped++;
      continue;
    }

    await Crop.create({
      cropName: template.cropName,
      quantity: template.quantity,
      unit: template.unit,
      pricePerQuintal: template.pricePerQuintal,
      category: template.category,
      description: template.description,
      state: template.state,
      location: template.location,
      farmerId: farmer._id,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      status: template.status,
    });

    console.log(`🌾 Seeded: ${template.cropName} by ${farmer.name}`);
    inserted++;
  }

  console.log(`\n🎉 Done! Inserted ${inserted} crops, skipped ${skipped}.`);
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
