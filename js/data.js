/**
 * Eurogrip TYRE+ | Ecosystem Data Models & Tyre Specifications Database
 */

// Comprehensive Eurogrip Tyre Catalog & Technical Specifications Database
const TYRE_DATABASE = {
  "EG-8841-27A-BLR": {
    id: "EG-8841-27A-BLR",
    model: "Eurogrip ProTorq Extreme",
    series: "ProTorq Radial Series",
    category: "High-Performance Sport Radial",
    size: "120/80-18 62P",
    position: "Rear (Directional)",
    compound: "Dual-Compound Silica-Tread Matrix",
    treadDepth: "6.5 mm (100% Prime)",
    treadDepthMm: 6.5,
    construction: "Radial Steel-Belted Tubeless (TL)",
    speedRating: "P (Up to 150 km/h)",
    loadIndex: "62 (Max 265 kg)",
    soloPsi: 32,
    pillionPsi: 36,
    batch: "2026-Q1 Madurai Plant #04",
    warranty: "5-Year Official Replacement Guarantee",
    dryGrip: 98,
    wetGrip: 94,
    mileageRating: 85,
    offRoadRating: 40,
    lifeEstimate: "28,000 - 32,000 km",
    compatibleBikes: [
      "Royal Enfield Classic 350",
      "Royal Enfield Bullet 350",
      "Jawa 42 / Classic",
      "Honda H'ness CB350"
    ],
    recommendedBike: "Royal Enfield Classic 350",
    highlightFeature: "Zero-degree steel belt for apex cornering stability, extreme lean angle confidence & razor-sharp braking response.",
    tagColor: "amber",
    tagIcon: "⚡",
    twiMarkers: "6 sidewall triangle locations",
    manufactureDate: "Feb 2026",
    qrImage: "./images/eurogrip-qr-sample.png"
  },
  "EG-DUR-4421-DEL": {
    id: "EG-DUR-4421-DEL",
    model: "Eurogrip DuraPlus",
    series: "DuraPlus Commuter Series",
    category: "High-Mileage Daily Commuter",
    size: "2.75-18 42P",
    position: "Front / All-Position",
    compound: "High-Abrasion Resistant Carbon-Black Blend",
    treadDepth: "5.8 mm (100% Prime)",
    treadDepthMm: 5.8,
    construction: "Reinforced 4-Ply Bias Tubetype / TL",
    speedRating: "P (Up to 150 km/h)",
    loadIndex: "42 (Max 150 kg)",
    soloPsi: 28,
    pillionPsi: 32,
    batch: "2026-Q1 Pantnagar Plant #02",
    warranty: "5-Year Official Extended Warranty",
    dryGrip: 88,
    wetGrip: 86,
    mileageRating: 99,
    offRoadRating: 55,
    lifeEstimate: "48,000 - 55,000 km",
    compatibleBikes: [
      "Hero Splendor+",
      "Hero HF Deluxe",
      "Bajaj Platina 100",
      "Honda CD 110 Dream"
    ],
    recommendedBike: "Hero Splendor+",
    highlightFeature: "Extra-deep continuous center groove with wear-resistant polymer delivering up to 55,000 km long tread life.",
    tagColor: "cyan",
    tagIcon: "🛡️",
    twiMarkers: "4 sidewall indicator ribs",
    manufactureDate: "Jan 2026",
    qrImage: "./images/eurogrip-qr-sample.png"
  },
  "EG-BMR-3108-MUM": {
    id: "EG-BMR-3108-MUM",
    model: "Eurogrip Beamer Y+",
    series: "Beamer Urban Series",
    category: "Agile Urban Executive",
    size: "80/100-18 54P",
    position: "Rear Tubeless",
    compound: "Silica-Enriched Quick Warmup Polymer",
    treadDepth: "6.0 mm (100% Prime)",
    treadDepthMm: 6.0,
    construction: "Tubeless Cross-Ply Belted",
    speedRating: "P (Up to 150 km/h)",
    loadIndex: "54 (Max 212 kg)",
    soloPsi: 29,
    pillionPsi: 33,
    batch: "2026-Q1 Madurai Plant #01",
    warranty: "5-Year Verified Warranty",
    dryGrip: 92,
    wetGrip: 91,
    mileageRating: 90,
    offRoadRating: 45,
    lifeEstimate: "36,000 - 42,000 km",
    compatibleBikes: [
      "Honda Shine 125",
      "Honda SP 125",
      "Hero Glamour",
      "Bajaj CT 125X"
    ],
    recommendedBike: "Honda Shine",
    highlightFeature: "Interlocking 'Y' groove architecture channels water rapidly away for skid-free wet tarmac city braking.",
    tagColor: "cyan",
    tagIcon: "🌧️",
    twiMarkers: "5 sidewall directional markers",
    manufactureDate: "Mar 2026",
    qrImage: "./images/eurogrip-qr-sample.png"
  },
  "EG-TRB-7740-PUN": {
    id: "EG-TRB-7740-PUN",
    model: "Eurogrip Terrabite Extreme",
    series: "Terrabite Dual-Sport Series",
    category: "All-Terrain & Dual-Sport Adventure",
    size: "100/90-17 55P",
    position: "Rear Dual-Sport",
    compound: "Cut & Chip Resistant Poly-Compound",
    treadDepth: "7.8 mm (100% Prime)",
    treadDepthMm: 7.8,
    construction: "Heavy-Duty 6-Ply Bias Tubeless",
    speedRating: "P (Up to 150 km/h)",
    loadIndex: "55 (Max 218 kg)",
    soloPsi: 26,
    pillionPsi: 30,
    batch: "2026-Q1 Madurai Plant #03",
    warranty: "5-Year Rough-Road Warranty",
    dryGrip: 90,
    wetGrip: 88,
    mileageRating: 88,
    offRoadRating: 82,
    lifeEstimate: "32,000 - 36,000 km",
    compatibleBikes: [
      "Bajaj Pulsar 150",
      "TVS Apache RTR 160",
      "Yamaha FZ-FI",
      "Bajaj Pulsar NS160"
    ],
    recommendedBike: "Bajaj Pulsar 150",
    highlightFeature: "Aggressive multi-angle tread blocks deliver continuous traction across tarmac, broken pavement, and dirt paths.",
    tagColor: "amber",
    tagIcon: "🏔️",
    twiMarkers: "6 reinforced groove wear bars",
    manufactureDate: "Feb 2026",
    qrImage: "./images/eurogrip-qr-sample.png"
  },
  "EG-CLM-5519-HYD": {
    id: "EG-CLM-5519-HYD",
    model: "Eurogrip Climber XC",
    series: "Climber Enduro Series",
    category: "Enduro Off-Road & Rally Trail",
    size: "90/90-21 54R",
    position: "Front Trail Block",
    compound: "High-Tear Natural Rubber Compound",
    treadDepth: "8.5 mm (100% Prime)",
    treadDepthMm: 8.5,
    construction: "Reinforced Bead Rally Tubetype",
    speedRating: "R (Up to 170 km/h)",
    loadIndex: "54 (Max 212 kg)",
    soloPsi: 22,
    pillionPsi: 25,
    batch: "2026-Q1 Madurai Plant #02",
    warranty: "5-Year Factory Puncture Shield",
    dryGrip: 85,
    wetGrip: 89,
    mileageRating: 80,
    offRoadRating: 98,
    lifeEstimate: "24,000 - 28,000 km",
    compatibleBikes: [
      "Royal Enfield Himalayan 450",
      "Hero Xpulse 200 4V",
      "KTM 390 Adventure",
      "BMW G310 GS"
    ],
    recommendedBike: "Royal Enfield Himalayan 450",
    highlightFeature: "Self-cleaning knobby tread lugs with anti-puncture sidewall reinforcement engineered for rocky climbs and gravel.",
    tagColor: "cyan",
    tagIcon: "🚵",
    twiMarkers: "6 deep-tread wear indicators",
    manufactureDate: "Jan 2026",
    qrImage: "./images/eurogrip-qr-sample.png"
  }
};

// Default Active Tyre ID for Initial State
const DEFAULT_TYRE_ID = "EG-8841-27A-BLR";

// Helper function to resolve any scanned text/payload to a matching tyre
function findTyreByPayload(payload) {
  if (!payload) return TYRE_DATABASE[DEFAULT_TYRE_ID];
  const query = String(payload).trim().toUpperCase();

  // 1. Direct ID match
  if (TYRE_DATABASE[query]) {
    return TYRE_DATABASE[query];
  }

  // 2. Partial ID match
  for (const id in TYRE_DATABASE) {
    if (id.includes(query) || query.includes(id)) {
      return TYRE_DATABASE[id];
    }
  }

  // 3. Keyword / Model name match
  for (const id in TYRE_DATABASE) {
    const t = TYRE_DATABASE[id];
    if (
      query.includes(t.model.toUpperCase()) ||
      t.model.toUpperCase().includes(query) ||
      query.includes(t.category.toUpperCase()) ||
      query.includes(t.size.toUpperCase())
    ) {
      return t;
    }
    // Check compatible bikes
    for (const b of t.compatibleBikes) {
      if (query.includes(b.toUpperCase()) || b.toUpperCase().includes(query)) {
        return t;
      }
    }
  }

  // 4. Default fallback to ProTorq Extreme
  return TYRE_DATABASE[DEFAULT_TYRE_ID];
}

// =============================================================================
// COMPREHENSIVE MOTORCYCLE CATALOG (30+ Variations across 5 Segments)
// =============================================================================
const MOTORCYCLES_CATALOG = {
  // 1. Cruisers & Modern Classics
  "Royal Enfield Classic 350": {
    category: "Cruisers & Modern Classics",
    engine: "349 cc (J-Series SOHC)",
    frontSize: "100/90-19 57P",
    rearSize: "120/80-18 62P",
    recommendedTyre: "Eurogrip ProTorq Extreme",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 30,
    pillionRearPsi: 36,
    icon: "👑",
    weightKg: 195
  },
  "Royal Enfield Hunter 350": {
    category: "Cruisers & Modern Classics",
    engine: "349 cc (J-Series)",
    frontSize: "110/70-17 54P",
    rearSize: "140/70-17 66P",
    recommendedTyre: "Eurogrip ProTorq Sport Radial",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 29,
    soloRearPsi: 32,
    pillionFrontPsi: 30,
    pillionRearPsi: 36,
    icon: "⚡",
    weightKg: 181
  },
  "Royal Enfield Meteor 350": {
    category: "Cruisers & Modern Classics",
    engine: "349 cc (Cruiser SOHC)",
    frontSize: "100/90-19 57P",
    rearSize: "140/70-17 66P",
    recommendedTyre: "Eurogrip ProTorq Cruiser Radial",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 30,
    soloRearPsi: 34,
    pillionFrontPsi: 32,
    pillionRearPsi: 38,
    icon: "🌟",
    weightKg: 191
  },
  "Royal Enfield Bullet 350": {
    category: "Cruisers & Modern Classics",
    engine: "349 cc (Iconic Thump)",
    frontSize: "100/90-19 57P",
    rearSize: "120/80-18 62P",
    recommendedTyre: "Eurogrip DuraPlus Classic",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 30,
    pillionRearPsi: 36,
    icon: "🛡️",
    weightKg: 195
  },
  "Honda H'ness CB350": {
    category: "Cruisers & Modern Classics",
    engine: "348.36 cc (PGM-FI)",
    frontSize: "100/90-19 57S",
    rearSize: "130/70-18 63S",
    recommendedTyre: "Eurogrip Beamer Y+ Tour",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 29,
    soloRearPsi: 33,
    pillionFrontPsi: 30,
    pillionRearPsi: 36,
    icon: "✨",
    weightKg: 181
  },
  "Jawa 42 / Classic": {
    category: "Cruisers & Modern Classics",
    engine: "294.7 cc (DOHC Liquid-Cooled)",
    frontSize: "90/90-18 51P",
    rearSize: "120/80-17 61P",
    recommendedTyre: "Eurogrip ProTorq Extreme",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 30,
    pillionRearPsi: 34,
    icon: "🔥",
    weightKg: 172
  },

  // 2. Commuters & Daily Executives
  "Hero Splendor+": {
    category: "Commuters & Daily Executives",
    engine: "97.2 cc (i3S APDV)",
    frontSize: "2.75-18 42P",
    rearSize: "2.75-18 48P",
    recommendedTyre: "Eurogrip DuraPlus",
    recommendedTyreId: "EG-DUR-4421-DEL",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 28,
    pillionRearPsi: 36,
    icon: "⭐",
    weightKg: 112
  },
  "Hero HF Deluxe": {
    category: "Commuters & Daily Executives",
    engine: "97.2 cc (High-Mileage)",
    frontSize: "2.75-18 42P",
    rearSize: "2.75-18 48P",
    recommendedTyre: "Eurogrip DuraPlus",
    recommendedTyreId: "EG-DUR-4421-DEL",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 28,
    pillionRearPsi: 36,
    icon: "🛵",
    weightKg: 110
  },
  "Hero Passion Pro": {
    category: "Commuters & Daily Executives",
    engine: "113.2 cc (xSens FI)",
    frontSize: "80/100-18 47P",
    rearSize: "80/100-18 54P",
    recommendedTyre: "Eurogrip DuraPlus Eco",
    recommendedTyreId: "EG-DUR-4421-DEL",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 29,
    pillionRearPsi: 36,
    icon: "💫",
    weightKg: 118
  },
  "Honda Shine 125": {
    category: "Commuters & Daily Executives",
    engine: "123.94 cc (eSP PGM-FI)",
    frontSize: "80/100-18 47P",
    rearSize: "80/100-18 54P",
    recommendedTyre: "Eurogrip Beamer Y+",
    recommendedTyreId: "EG-BMR-3108-MUM",
    soloFrontPsi: 29,
    soloRearPsi: 33,
    pillionFrontPsi: 29,
    pillionRearPsi: 36,
    icon: "✨",
    weightKg: 114
  },
  "Honda SP 125": {
    category: "Commuters & Daily Executives",
    engine: "124 cc (Sport Executive)",
    frontSize: "80/100-18 47P",
    rearSize: "100/80-18 53P",
    recommendedTyre: "Eurogrip Beamer Y+ Pro",
    recommendedTyreId: "EG-BMR-3108-MUM",
    soloFrontPsi: 29,
    soloRearPsi: 33,
    pillionFrontPsi: 29,
    pillionRearPsi: 36,
    icon: "⚡",
    weightKg: 116
  },
  "Bajaj Platina 110": {
    category: "Commuters & Daily Executives",
    engine: "115.45 cc (DTS-i Anti-Skid)",
    frontSize: "80/100-17 46P",
    rearSize: "80/100-17 53P",
    recommendedTyre: "Eurogrip DuraPlus Comfort",
    recommendedTyreId: "EG-DUR-4421-DEL",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 28,
    pillionRearPsi: 36,
    icon: "🛡️",
    weightKg: 119
  },
  "TVS Radeon": {
    category: "Commuters & Daily Executives",
    engine: "109.7 cc (DuraLife Ecothrust)",
    frontSize: "2.75-18 42P",
    rearSize: "3.00-18 52P",
    recommendedTyre: "Eurogrip DuraPlus HeavyDuty",
    recommendedTyreId: "EG-DUR-4421-DEL",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 28,
    pillionRearPsi: 36,
    icon: "⭐",
    weightKg: 113
  },

  // 3. Sports & Naked Performance
  "Bajaj Pulsar 150": {
    category: "Sports & Naked Performance",
    engine: "149.5 cc (Twin Spark DTS-i)",
    frontSize: "80/100-17 46P",
    rearSize: "100/90-17 55P",
    recommendedTyre: "Eurogrip Terrabite Extreme",
    recommendedTyreId: "EG-TRB-7740-PUN",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 28,
    pillionRearPsi: 35,
    icon: "🚀",
    weightKg: 148
  },
  "Bajaj Pulsar NS200": {
    category: "Sports & Naked Performance",
    engine: "199.5 cc (Triple Spark Liquid)",
    frontSize: "100/80-17 52P",
    rearSize: "130/70-17 62P",
    recommendedTyre: "Eurogrip ProTorq Sport Radial",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 29,
    soloRearPsi: 33,
    pillionFrontPsi: 30,
    pillionRearPsi: 36,
    icon: "🔥",
    weightKg: 158
  },
  "TVS Apache RTR 160 4V": {
    category: "Sports & Naked Performance",
    engine: "159.7 cc (Racing O3C FI)",
    frontSize: "90/90-17 49P",
    rearSize: "130/70-17 62P",
    recommendedTyre: "Eurogrip ProTorq Extreme",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 29,
    pillionRearPsi: 36,
    icon: "🏁",
    weightKg: 146
  },
  "TVS Apache RR 310": {
    category: "Sports & Naked Performance",
    engine: "312.2 cc (Track Supersport DOHC)",
    frontSize: "110/70-ZR17 54W",
    rearSize: "150/60-ZR17 66W",
    recommendedTyre: "Eurogrip ProTorq Apex ZR Track",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 32,
    soloRearPsi: 35,
    pillionFrontPsi: 32,
    pillionRearPsi: 38,
    icon: "🏎️",
    weightKg: 174
  },
  "Yamaha R15 V4": {
    category: "Sports & Naked Performance",
    engine: "155 cc (Liquid-Cooled VVA)",
    frontSize: "100/80-17 52P",
    rearSize: "140/70-R17 66H",
    recommendedTyre: "Eurogrip ProTorq Extreme Radial",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 29,
    soloRearPsi: 33,
    pillionFrontPsi: 30,
    pillionRearPsi: 36,
    icon: "⚡",
    weightKg: 142
  },
  "Yamaha MT-15 V2": {
    category: "Sports & Naked Performance",
    engine: "155 cc (Dark Warrior VVA)",
    frontSize: "100/80-17 52P",
    rearSize: "140/70-R17 66H",
    recommendedTyre: "Eurogrip ProTorq Urban Sport",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 29,
    soloRearPsi: 33,
    pillionFrontPsi: 30,
    pillionRearPsi: 36,
    icon: "🗡️",
    weightKg: 139
  },
  "KTM 390 Duke": {
    category: "Sports & Naked Performance",
    engine: "399 cc (Corner Rocket LC4c)",
    frontSize: "110/70-ZR17 54W",
    rearSize: "150/60-ZR17 66W",
    recommendedTyre: "Eurogrip ProTorq SuperSport",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 30,
    soloRearPsi: 34,
    pillionFrontPsi: 32,
    pillionRearPsi: 38,
    icon: "🧡",
    weightKg: 168
  },
  "Bajaj Dominar 400": {
    category: "Sports & Naked Performance",
    engine: "373.3 cc (DOHC Liquid Tourer)",
    frontSize: "110/70-17 54H",
    rearSize: "150/60-17 66H",
    recommendedTyre: "Eurogrip ProTorq Heavy Tourer",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 32,
    soloRearPsi: 36,
    pillionFrontPsi: 32,
    pillionRearPsi: 40,
    icon: "🏔️",
    weightKg: 193
  },

  // 4. Adventure & Dual-Sport Tourers
  "Royal Enfield Himalayan 450": {
    category: "Adventure & Dual-Sport Tourers",
    engine: "452 cc (Sherpa 450 Liquid)",
    frontSize: "90/90-21 54S",
    rearSize: "140/80-17 69S",
    recommendedTyre: "Eurogrip Climber XC",
    recommendedTyreId: "EG-CLM-5519-HYD",
    soloFrontPsi: 26,
    soloRearPsi: 30,
    pillionFrontPsi: 28,
    pillionRearPsi: 34,
    icon: "🏔️",
    weightKg: 196
  },
  "Hero Xpulse 200 4V": {
    category: "Adventure & Dual-Sport Tourers",
    engine: "199.6 cc (Rally Bred 4V)",
    frontSize: "90/90-21 54S",
    rearSize: "120/80-18 62S",
    recommendedTyre: "Eurogrip Climber XC Enduro",
    recommendedTyreId: "EG-CLM-5519-HYD",
    soloFrontPsi: 22,
    soloRearPsi: 26,
    pillionFrontPsi: 24,
    pillionRearPsi: 30,
    icon: "🚵",
    weightKg: 159
  },
  "KTM 390 Adventure": {
    category: "Adventure & Dual-Sport Tourers",
    engine: "373.2 cc (Dual-Sport ABS)",
    frontSize: "100/90-19 57H",
    rearSize: "130/80-17 65H",
    recommendedTyre: "Eurogrip Terrabite ADV",
    recommendedTyreId: "EG-TRB-7740-PUN",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 30,
    pillionRearPsi: 36,
    icon: "🧭",
    weightKg: 177
  },
  "BMW G310 GS": {
    category: "Adventure & Dual-Sport Tourers",
    engine: "313 cc (Adventure Tourer)",
    frontSize: "110/80-R19 59V",
    rearSize: "150/70-R17 69V",
    recommendedTyre: "Eurogrip Climber Tour ADV",
    recommendedTyreId: "EG-CLM-5519-HYD",
    soloFrontPsi: 30,
    soloRearPsi: 34,
    pillionFrontPsi: 30,
    pillionRearPsi: 38,
    icon: "🌐",
    weightKg: 175
  },
  "Suzuki V-Strom SX": {
    category: "Adventure & Dual-Sport Tourers",
    engine: "249 cc (SOCS Master)",
    frontSize: "100/90-19 57S",
    rearSize: "140/70-17 66S",
    recommendedTyre: "Eurogrip Terrabite Dual-Sport",
    recommendedTyreId: "EG-TRB-7740-PUN",
    soloFrontPsi: 29,
    soloRearPsi: 33,
    pillionFrontPsi: 30,
    pillionRearPsi: 36,
    icon: "⚡",
    weightKg: 167
  },

  // 5. Scooters & Urban EVs
  "Honda Activa 6G": {
    category: "Scooters & Urban EVs",
    engine: "109.5 cc (eSP Combi-Brake)",
    frontSize: "90/90-12 54J",
    rearSize: "90/100-10 53J",
    recommendedTyre: "Eurogrip Remora City Scooter",
    recommendedTyreId: "EG-DUR-4421-DEL",
    soloFrontPsi: 22,
    soloRearPsi: 29,
    pillionFrontPsi: 22,
    pillionRearPsi: 36,
    icon: "🛵",
    weightKg: 106
  },
  "TVS Jupiter 125": {
    category: "Scooters & Urban EVs",
    engine: "124.8 cc (ET-Fi EcoThrust)",
    frontSize: "90/90-12 54J",
    rearSize: "90/90-12 54J",
    recommendedTyre: "Eurogrip Remora Urban",
    recommendedTyreId: "EG-DUR-4421-DEL",
    soloFrontPsi: 24,
    soloRearPsi: 29,
    pillionFrontPsi: 24,
    pillionRearPsi: 36,
    icon: "🛵",
    weightKg: 108
  },
  "Suzuki Access 125": {
    category: "Scooters & Urban EVs",
    engine: "124 cc (SEP Eco Performance)",
    frontSize: "90/90-12 54J",
    rearSize: "90/100-10 53J",
    recommendedTyre: "Eurogrip Remora Glide",
    recommendedTyreId: "EG-DUR-4421-DEL",
    soloFrontPsi: 22,
    soloRearPsi: 29,
    pillionFrontPsi: 22,
    pillionRearPsi: 36,
    icon: "✨",
    weightKg: 103
  },
  "Yamaha Aerox 155": {
    category: "Scooters & Urban EVs",
    engine: "155 cc (Maxi Scooter VVA)",
    frontSize: "110/80-14 53P",
    rearSize: "140/70-14 62P",
    recommendedTyre: "Eurogrip ProTorq Maxi Sport",
    recommendedTyreId: "EG-8841-27A-BLR",
    soloFrontPsi: 29,
    soloRearPsi: 33,
    pillionFrontPsi: 29,
    pillionRearPsi: 36,
    icon: "🏁",
    weightKg: 126
  },
  "Ather 450X Gen 3": {
    category: "Scooters & Urban EVs",
    engine: "6.4 kW Peak Electric Motor",
    frontSize: "90/90-12 54J",
    rearSize: "100/80-12 56J",
    recommendedTyre: "Eurogrip Remora EV Low-Rolling",
    recommendedTyreId: "EG-DUR-4421-DEL",
    soloFrontPsi: 28,
    soloRearPsi: 32,
    pillionFrontPsi: 28,
    pillionRearPsi: 34,
    icon: "⚡",
    weightKg: 111
  },
  "Ola S1 Pro Gen 2": {
    category: "Scooters & Urban EVs",
    engine: "11 kW Peak Electric Motor",
    frontSize: "110/70-12 53J",
    rearSize: "110/70-12 53J",
    recommendedTyre: "Eurogrip Remora EV Grip",
    recommendedTyreId: "EG-DUR-4421-DEL",
    soloFrontPsi: 30,
    soloRearPsi: 33,
    pillionFrontPsi: 30,
    pillionRearPsi: 35,
    icon: "🔋",
    weightKg: 116
  }
};

// Backward-compatible BIKES dictionary (auto-mapped from MOTORCYCLES_CATALOG)
const BIKES = {};
for (const bikeName in MOTORCYCLES_CATALOG) {
  const m = MOTORCYCLES_CATALOG[bikeName];
  BIKES[bikeName] = "Rear " + m.rearSize.split(" ")[0] + " (" + m.recommendedTyre + ")";
}

// Phone Number Normalization Utility
// Cleans any phone input: strips +91, 0, spaces, dashes, brackets into standard digits
function cleanPhone(num) {
  if (!num) return "";
  var s = String(num).replace(/[\s\-\(\)\.]/g, "");
  if (s.startsWith("+91")) s = s.substring(3);
  else if (s.startsWith("91") && s.length === 12) s = s.substring(2);
  else if (s.startsWith("0") && s.length === 11) s = s.substring(1);
  return s;
}

// Certified Partner Garages Directory
const PARTNER_GARAGES_DB = [
  {
    id: "GAR-BLR-01",
    name: "Speedline Tyres & Laser Alignment",
    owner: "Karan Verma",
    phone: "98450 11223",
    cleanPhone: "9845011223",
    city: "Bengaluru",
    area: "Koramangala 5th Block",
    rating: 4.9,
    reviews: 248,
    tier: "Platinum",
    certifiedSince: "2023",
    services: ["Laser Wheel Balancing", "Nitrogen Inflation", "Puncture Repair", "Tread Scan"]
  },
  {
    id: "GAR-BLR-02",
    name: "MotoCare Precision Hub",
    owner: "Sunil Roy",
    phone: "98452 44332",
    cleanPhone: "9845244332",
    city: "Bengaluru",
    area: "Indiranagar 100ft Rd",
    rating: 4.8,
    reviews: 184,
    tier: "Gold",
    certifiedSince: "2024",
    services: ["Tyre Fitment", "Cold Pressure Calibration", "Rim Truing"]
  },
  {
    id: "GAR-DEL-01",
    name: "Apex Grip Wheels & Service",
    owner: "Rajesh Sharma",
    phone: "98110 88776",
    cleanPhone: "9811088776",
    city: "New Delhi",
    area: "Karol Bagh Tyre Mkt",
    rating: 4.9,
    reviews: 312,
    tier: "Platinum",
    certifiedSince: "2022",
    services: ["Official Eurogrip Dealer", "Electronic Balancing", "Warranty Claims"]
  },
  {
    id: "GAR-MUM-01",
    name: "Highway Speed Track Auto",
    owner: "Sachin Patil",
    phone: "98200 44556",
    cleanPhone: "9820044556",
    city: "Mumbai",
    area: "Andheri East",
    rating: 4.7,
    reviews: 156,
    tier: "Gold",
    certifiedSince: "2024",
    services: ["Tubeless Repair", "Superbike Fitment", "Tread Gauge Inspection"]
  },
  {
    id: "GAR-PUN-01",
    name: "Torq Master Garage",
    owner: "Amol Deshmukh",
    phone: "98900 66778",
    cleanPhone: "9890066778",
    city: "Pune",
    area: "Shivajinagar",
    rating: 4.8,
    reviews: 142,
    tier: "Silver",
    certifiedSince: "2025",
    services: ["Quick Nitrogen Fill", "Monsoon Grip Checks", "Chain & Sprocket"]
  },
  {
    id: "GAR-HYD-01",
    name: "Deccan Riders Tyre Zone",
    owner: "Mohammed Faheem",
    phone: "98490 33445",
    cleanPhone: "9849033445",
    city: "Hyderabad",
    area: "Banjara Hills",
    rating: 4.9,
    reviews: 198,
    tier: "Platinum",
    certifiedSince: "2023",
    services: ["Full Digital Tyre Check", "Eurogrip Direct Stockist", "Emergency Assist"]
  }
];

// Mechanic Connect: Point Values by Action
const PT = {
  reg: 20,
  chk: 30,
  rec: 15,
  trn: 50
};

// Mechanic Connect: Friendly Action Labels
const NM = {
  reg: "Tyre Registration",
  chk: "Health Check",
  rec: "Recommended Tyre",
  trn: "Pro Skill Module"
};

// Initial Workshop Activity Logs
const INITIAL_MECHANIC_ROWS = [
  { n: "Karan Verma", a: "reg", p: 20 },
  { n: "Sunil Roy", a: "chk", p: 30 },
  { n: "Self", a: "trn", p: 15 }
];

// Rider Rewards: Point-earning Actions [id, description, points]
const ACT = [
  ["reg2", "Scan & Register Eurogrip Tyre", 100],
  ["chk2", "Complete Garage Health Check", 50],
  ["buy", "Replace Tyre with Eurogrip", 200],
  ["ref", "Refer a Fellow Rider", 150],
  ["fb", "Verified Performance Review", 30]
];

// Rider Rewards: Milestone Catalogue [thresholdPoints, rewardDescription]
const CAT = [
  [100, "Eurogrip Carbon Cap & Decal Sticker Kit"],
  [300, "Digital Valve Pressure Gauge Kit"],
  [600, "₹750 Voucher for Next Eurogrip Tyre Set"],
  [1000, "Eurogrip All-Weather Touring Riding Jacket"]
];

// Strategic Flywheel: 9-Stage Trust Loop
const LOOP = [
  ["1. Rider Buys Eurogrip", "A rider chooses Eurogrip, often on a trusted mechanic's advice. The tyre sidewall features a distinctive Smart QR badge."],
  ["2. Seamless QR Registration", "A quick 10-second smartphone scan registers tyre serial, motorcycle model, and purchase date. Eurogrip now has an active, direct rider connection."],
  ["3. Proactive Health Reminders", "Algorithmic WhatsApp/SMS nudges alert the rider when it's time for a routine check-up, keeping Eurogrip present throughout the ownership lifespan."],
  ["4. Mechanic Inspection Visit", "The rider brings the motorcycle to a certified partner mechanic. The mechanic checks pressure, alignment, and logs the check on their dashboard."],
  ["5. Mechanic Earns & Recommends", "Armed with digital tools, training credentials, and loyalty incentives, the mechanic proudly advocates Eurogrip to every customer."],
  ["6. Elevated Ownership Experience", "The rider receives verified expert care and digital service records. Both rider and mechanic gain loyalty rewards points."],
  ["7. Enduring Brand Trust", "Post-purchase safety, genuine attention, and mechanic validation build deep emotional trust that commodity pricing cannot match."],
  ["8. Guaranteed Repeat Purchase", "When tyres reach replacement mileage, the rider and mechanic naturally choose Eurogrip again by active preference."],
  ["9. Virality & Market Dominance", "Satisfied riders refer riding clubs, certified mechanics advocate the brand across shops, and the high-trust flywheel accelerates."]
];

// =============================================================================
// DATABASE: User Accounts & Roles (Admin vs User / Rider)
// =============================================================================
const INITIAL_USERS_DB = [
  {
    id: "usr_admin_01",
    email: "admin@eurogrip.com",
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Eurogrip Ops HQ",
    badge: "Operations Command Administrator",
    avatar: "👑",
    city: "Chennai HQ",
    phone: "+91 98400 00001",
    joinedDate: "2026-01-01"
  },
  {
    id: "usr_rider_01",
    email: "rider@eurogrip.com",
    username: "rider",
    password: "user123",
    role: "user",
    name: "Arjun Sharma",
    badge: "Verified Eurogrip Rider",
    avatar: "🏍️",
    city: "Bengaluru",
    phone: "+91 98300 12345",
    joinedDate: "2026-02-15",
    bike: "Royal Enfield Classic 350",
    fittedTyreId: "EG-8841-27A-BLR",
    warrantyActive: true,
    points: 150
  }
];

// Database: Serialized Warranties & Registrations (Admin View & User Validation)
const INITIAL_WARRANTIES_DB = [
  {
    id: "WRN-2026-9012",
    tyreId: "EG-8841-27A-BLR",
    model: "Eurogrip ProTorq Extreme",
    riderName: "Arjun Sharma",
    riderPhone: "98300 12345",
    bike: "Royal Enfield Classic 350",
    regDate: "2026-02-15",
    status: "Verified Active",
    warrantyYears: 5,
    mechanicShop: "Speedline Tyres & Alignment, Koramangala"
  },
  {
    id: "WRN-2026-8431",
    tyreId: "EG-DUR-4421-DEL",
    model: "Eurogrip DuraPlus",
    riderName: "Vikram Malhotra",
    riderPhone: "98110 54321",
    bike: "Hero Splendor+",
    regDate: "2026-03-01",
    status: "Verified Active",
    warrantyYears: 5,
    mechanicShop: "Karan Moto Care, Indiranagar"
  },
  {
    id: "WRN-2026-7729",
    tyreId: "EG-BMR-3108-MUM",
    model: "Eurogrip Beamer Y+",
    riderName: "Rohan Patel",
    riderPhone: "98200 98765",
    bike: "Honda Shine",
    regDate: "2026-03-12",
    status: "Inspection Due",
    warrantyYears: 5,
    mechanicShop: "Shine Auto Garage, HSR Layout"
  }
];

// Database Storage Helper Functions
function getUsersDatabase() {
  try {
    const raw = localStorage.getItem("eurogrip_users_db");
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  saveUsersDatabase(INITIAL_USERS_DB);
  return INITIAL_USERS_DB.slice();
}

function saveUsersDatabase(users) {
  try {
    localStorage.setItem("eurogrip_users_db", JSON.stringify(users));
  } catch(e) {}
}

function getWarrantiesDatabase() {
  try {
    const raw = localStorage.getItem("eurogrip_warranties_db");
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  saveWarrantiesDatabase(INITIAL_WARRANTIES_DB);
  return INITIAL_WARRANTIES_DB.slice();
}

function saveWarrantiesDatabase(warranties) {
  try {
    localStorage.setItem("eurogrip_warranties_db", JSON.stringify(warranties));
  } catch(e) {}
}

function getSessionUser() {
  try {
    const raw = localStorage.getItem("eurogrip_current_session");
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function saveSessionUser(user) {
  try {
    if (user) {
      localStorage.setItem("eurogrip_current_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("eurogrip_current_session");
    }
  } catch(e) {}
}

