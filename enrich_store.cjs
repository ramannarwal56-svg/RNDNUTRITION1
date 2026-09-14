const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/rnd_store.json', 'utf8'));

const enrichments = {
  "rnd-whey-concentrate": {
    name: "RND Titanium 100% Whey Protein Concentrate",
    slug: "rnd-titanium-whey-concentrate",
    shortDescription: "Premium Grade Concentrate. 24g Protein, 5.5g BCAAs, Ultra-Fast Digestion.",
    description: "Our RND Titanium Whey Protein Concentrate is engineered for rapid absorption, delivering high-quality muscle-building amino acids instantly after your intense workouts. Zero fillers and instant mixability."
  },
  "rnd-whey-isolate": {
    name: "RND Titanium 100% Whey Protein Isolate",
    slug: "rnd-titanium-whey-isolate",
    shortDescription: "28g Pure Isolate Protein, 6.3g BCAAs, 0g Added Sugar per scoop.",
    description: "Ultra-pure cross-flow micro-filtered whey protein isolate engineered for rapid amino acid delivery and lean muscle synthesis. Zero fillers, ultra-low carbs, and instant mixability."
  },
  "rnd-whey-blend": {
    name: "RND Titanium Whey Protein Blend (Concentrate + Isolate)",
    slug: "rnd-titanium-whey-blend",
    shortDescription: "Optimal Matrix: 26g Protein, Sustained Release, Enriched with Digestive Enzymes.",
    description: "The ultimate hybrid formula combining the fast-absorbing power of Isolate with the sustained release of Concentrate. Perfect for anytime recovery and continuous muscle nourishment."
  },
  "rnd-yeast-protein": {
    name: "RND Titanium Vegan Yeast Protein",
    slug: "rnd-titanium-yeast-protein",
    shortDescription: "24g Dairy-Free Protein. Premium Vegan Muscle Support.",
    description: "Advanced bio-fermented Yeast Protein offering a complete amino acid profile. Highly bioavailable, eco-friendly, and perfect for lactose-sensitive athletes."
  },
  "rnd-mass-gainer-1kg": {
    name: "RND COLOSSUS Mass Gainer (1 kg)",
    slug: "rnd-colossus-mass-gainer-1kg",
    shortDescription: "Anabolic Ratio 1:5 | High Quality Protein | High Calories.",
    description: "RND COLOSSUS Mass Gainer is a clinically formulated dense calorie matrix designed for extreme hardgainers. Packed with complex carbs and premium protein to force muscle hypertrophy."
  },
  "rnd-mass-gainer-3kg": {
    name: "RND COLOSSUS Mega Mass Gainer (3 kg)",
    slug: "rnd-colossus-mega-mass-gainer-3kg",
    shortDescription: "54g High Quality Protein, 1050 Calories, 3g Micronized Creatine. BIOZYME.",
    description: "The ultimate sizing formula. COLOSSUS features a 1:5 Anabolic Ratio, clinically formulated with Biozyme for enhanced digestion, massive calorie surplus, and raw muscle growth."
  },
  "rnd-creatine": {
    name: "RND CRE AMP Micronised Creatine Monohydrate",
    slug: "rnd-cre-amp-creatine",
    shortDescription: "3g Micronised Creatine Monohydrate. Trustified Certified.",
    description: "Pure, ultra-micronised Creatine Monohydrate for maximum cell volumization, explosive strength, and rapid ATP regeneration during high-intensity training. Clinically tested purity."
  },
  "rnd-preworkout": {
    name: "RND IGNITION X Extreme Pre-Workout",
    slug: "rnd-ignition-x-pre-workout",
    shortDescription: "6000mg Citrulline Malate, 3200mg Beta-Alanine, 300mg Caffeine.",
    description: "Advanced explosive performance formula. 100% Clinical Dose for unparalleled pump, blood flow, endurance, and hyper-focus. Experience the ignition of extreme energy."
  },
  "rnd-bcaa": {
    name: "RND Amino X Branched-Chain Amino Acids (BCAA)",
    slug: "rnd-amino-x-bcaa",
    shortDescription: "2:1:1 Clinical Ratio BCAAs for Endurance and Intra-Workout Recovery.",
    description: "Fuel your training with precision dosed BCAAs. Promotes rapid recovery, prevents muscle breakdown (catabolism), and sustains endurance during the most grueling sessions."
  },
  "rnd-glutamine": {
    name: "RND Pure L-Glutamine",
    slug: "rnd-pure-l-glutamine",
    shortDescription: "5g Pure L-Glutamine per serving for Rapid Recovery & Immunity.",
    description: "100% Pure unflavored L-Glutamine to replenish depleted muscle stores, support gut health, and boost your immune system after heavy physical stress."
  },
  "rnd-multivitamin": {
    name: "RND ALPHA SHIELD Athlete Multivitamin",
    slug: "rnd-alpha-shield-multivitamin",
    shortDescription: "45 Ingredients, KSM-66® Ashwagandha, Testosterone Support.",
    description: "Clinically formulated 100% RDA multivitamin engineered specifically for high-performance athletes. Features 45 critical micronutrients, adaptogenic KSM-66 Ashwagandha, and targeted testosterone support."
  }
};

data.products.forEach(p => {
  if (enrichments[p.id]) {
    p.name = enrichments[p.id].name;
    p.slug = enrichments[p.id].slug;
    p.shortDescription = enrichments[p.id].shortDescription;
    p.description = enrichments[p.id].description;
  }
});

fs.writeFileSync('data/rnd_store.json', JSON.stringify(data, null, 2));
console.log("Rich formatting updated.");
