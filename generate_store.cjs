const fs = require('fs');

const productsData = [
  {
    id: "rnd-whey-concentrate",
    name: "Whey Protein Concentrate",
    slug: "whey-protein-concentrate",
    category: "Whey Protein",
    brand: "RND",
    description: "High-quality Whey Protein Concentrate for muscle recovery and growth.",
    shortDescription: "Premium concentrate for muscle building.",
    images: ["./images/rnd_whey_tub_1789192143915.jpg"],
    price: 950 * 2.5,
    salePrice: 950 * 2.5,
    discountPercentage: 0,
    sku: "WPC-1KG",
    barcode: "890001",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Chocolate",
    weightOrPackSize: "1 kg",
    servings: 30,
    variants: [
      { id: "v1", flavour: "Chocolate", size: "1 kg", price: 950 * 2.5, salePrice: 950 * 2.5, sku: "WPC-1KG-CHOC", stock: 100 },
      { id: "v2", flavour: "Vanilla", size: "1 kg", price: 950 * 2.5, salePrice: 950 * 2.5, sku: "WPC-1KG-VAN", stock: 100 },
      { id: "v3", flavour: "Unflavoured", size: "1 kg", price: 950 * 2.5, salePrice: 950 * 2.5, sku: "WPC-1KG-UNF", stock: 100 }
    ]
  },
  {
    id: "rnd-whey-isolate",
    name: "Whey Protein Isolate",
    slug: "whey-protein-isolate",
    category: "Whey Protein",
    brand: "RND",
    description: "Ultra-pure Whey Protein Isolate for lean muscle synthesis.",
    shortDescription: "Pure isolate protein.",
    images: ["./images/rnd_whey_iso_1789227825582.jpg"],
    price: 1500 * 2.5,
    salePrice: 1500 * 2.5,
    discountPercentage: 0,
    sku: "WPI-1KG",
    barcode: "890002",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Chocolate",
    weightOrPackSize: "1 kg",
    servings: 30,
    variants: [
      { id: "v1", flavour: "Chocolate", size: "1 kg", price: 1500 * 2.5, salePrice: 1500 * 2.5, sku: "WPI-1KG-CHOC", stock: 100 },
      { id: "v2", flavour: "Vanilla", size: "1 kg", price: 1500 * 2.5, salePrice: 1500 * 2.5, sku: "WPI-1KG-VAN", stock: 100 },
      { id: "v3", flavour: "Unflavoured", size: "1 kg", price: 1500 * 2.5, salePrice: 1500 * 2.5, sku: "WPI-1KG-UNF", stock: 100 }
    ]
  },
  {
    id: "rnd-whey-blend",
    name: "Whey Protein Blend (Concentrate + Isolate)",
    slug: "whey-protein-blend",
    category: "Whey Protein",
    brand: "RND",
    description: "A perfect blend of Concentrate and Isolate for sustained protein release.",
    shortDescription: "Optimal protein blend.",
    images: ["./images/rnd_whey_protein_1789192519698.jpg"],
    price: 1700 * 2.5,
    salePrice: 1700 * 2.5,
    discountPercentage: 0,
    sku: "WPB-1KG",
    barcode: "890003",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Chocolate",
    weightOrPackSize: "1 kg",
    servings: 30,
    variants: [
      { id: "v1", flavour: "Chocolate", size: "1 kg", price: 1700 * 2.5, salePrice: 1700 * 2.5, sku: "WPB-1KG-CHOC", stock: 100 },
      { id: "v2", flavour: "Vanilla", size: "1 kg", price: 1700 * 2.5, salePrice: 1700 * 2.5, sku: "WPB-1KG-VAN", stock: 100 },
      { id: "v3", flavour: "Unflavoured", size: "1 kg", price: 1700 * 2.5, salePrice: 1700 * 2.5, sku: "WPB-1KG-UNF", stock: 100 }
    ]
  },
  {
    id: "rnd-yeast-protein",
    name: "Yeast Protein",
    slug: "yeast-protein",
    category: "Proteins",
    brand: "RND",
    description: "High-quality yeast protein for vegan and dairy-free diets.",
    shortDescription: "Dairy-free protein source.",
    images: ["./images/rnd_whey_tub_1789192143915.jpg"],
    price: 750 * 2.5,
    salePrice: 750 * 2.5,
    discountPercentage: 0,
    sku: "YP-1KG",
    barcode: "890004",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Unflavoured",
    weightOrPackSize: "1 kg",
    servings: 30,
    variants: [
      { id: "v1", flavour: "Unflavoured", size: "1 kg", price: 750 * 2.5, salePrice: 750 * 2.5, sku: "YP-1KG-UNF", stock: 100 }
    ]
  },
  {
    id: "rnd-mass-gainer-1kg",
    name: "COLOSSUS Mass Gainer (1 kg)",
    slug: "colossus-mass-gainer-1kg",
    category: "Mass Gainer",
    brand: "RND",
    description: "High-calorie COLOSSUS mass gainer to help you bulk up.",
    shortDescription: "Calorie-dense gainer.",
    images: ["./images/rnd_mass_gainer_1789192555719.jpg"],
    price: 300 * 2.5,
    salePrice: 300 * 2.5,
    discountPercentage: 0,
    sku: "MG-1KG",
    barcode: "890005",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Chocolate",
    weightOrPackSize: "1 kg",
    servings: 10,
    variants: [
      { id: "v1", flavour: "Chocolate", size: "1 kg", price: 300 * 2.5, salePrice: 300 * 2.5, sku: "MG-1KG-CHOC", stock: 100 },
      { id: "v2", flavour: "Vanilla", size: "1 kg", price: 300 * 2.5, salePrice: 300 * 2.5, sku: "MG-1KG-VAN", stock: 100 }
    ]
  },
  {
    id: "rnd-mass-gainer-3kg",
    name: "COLOSSUS Mega Mass Gainer (3 kg)",
    slug: "colossus-mega-mass-gainer-3kg",
    category: "Mass Gainer",
    brand: "RND",
    description: "COLOSSUS Mega Mass Gainer. 1:5 Anabolic Ratio, 54g Protein, 1050 Calories, 3g Micronized Creatine.",
    shortDescription: "High-calorie Mega Mass gainer.",
    images: ["./images/rnd_mass_tub_1789227882336.jpg"],
    price: 600 * 2.5,
    salePrice: 600 * 2.5,
    discountPercentage: 0,
    sku: "MG-3KG",
    barcode: "890006",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Chocolate",
    weightOrPackSize: "3 kg",
    servings: 30,
    variants: [
      { id: "v1", flavour: "Chocolate", size: "3 kg", price: 600 * 2.5, salePrice: 600 * 2.5, sku: "MG-3KG-CHOC", stock: 100 },
      { id: "v2", flavour: "Vanilla", size: "3 kg", price: 600 * 2.5, salePrice: 600 * 2.5, sku: "MG-3KG-VAN", stock: 100 }
    ]
  },
  {
    id: "rnd-creatine",
    name: "CRE AMP Micronised Creatine Monohydrate",
    slug: "cre-amp-creatine-monohydrate",
    category: "Creatine",
    brand: "RND",
    description: "CRE AMP Micronised Creatine Monohydrate for explosive strength and performance.",
    shortDescription: "Strength enhancer. Trustified Certified.",
    images: ["./images/rnd_creatine_jar_1789227844026.jpg"],
    price: 200 * 2.5,
    salePrice: 200 * 2.5,
    discountPercentage: 0,
    sku: "CR-100G",
    barcode: "890007",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Unflavoured",
    weightOrPackSize: "100 g",
    servings: 33,
    variants: [
      { id: "v1", flavour: "Unflavoured", size: "100 g", price: 200 * 2.5, salePrice: 200 * 2.5, sku: "CR-100G-UNF", stock: 100 }
    ]
  },
  {
    id: "rnd-preworkout",
    name: "IGNITION X Extreme Pre-Workout",
    slug: "ignition-x-extreme-pre-workout",
    category: "Pre-Workout",
    brand: "RND",
    description: "IGNITION X Extreme Pre-Workout. Advanced Formula: 6000mg Citrulline Malate, 3200mg Beta-Alanine, 300mg Caffeine.",
    shortDescription: "Explosive energy and focus.",
    images: ["./images/rnd_preworkout_tub_1789192179244.jpg"],
    price: 150 * 2.5,
    salePrice: 150 * 2.5,
    discountPercentage: 0,
    sku: "PW-100G",
    barcode: "890008",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Fruit Punch",
    weightOrPackSize: "100 g",
    servings: 20,
    variants: [
      { id: "v1", flavour: "Fruit Punch", size: "100 g", price: 150 * 2.5, salePrice: 150 * 2.5, sku: "PW-100G-FP", stock: 100 },
      { id: "v2", flavour: "Green Apple", size: "100 g", price: 150 * 2.5, salePrice: 150 * 2.5, sku: "PW-100G-GA", stock: 100 }
    ]
  },
  {
    id: "rnd-bcaa",
    name: "Branched-Chain Amino Acids (BCAA)",
    slug: "bcaa",
    category: "Amino Acids",
    brand: "RND",
    description: "Essential amino acids for recovery and endurance.",
    shortDescription: "Muscle recovery.",
    images: ["./images/rnd_preworkout_tub_1789192545387.jpg"],
    price: 250 * 2.5,
    salePrice: 250 * 2.5,
    discountPercentage: 0,
    sku: "BCAA-100G",
    barcode: "890009",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Watermelon",
    weightOrPackSize: "100 g",
    servings: 20,
    variants: [
      { id: "v1", flavour: "Watermelon", size: "100 g", price: 250 * 2.5, salePrice: 250 * 2.5, sku: "BCAA-100G-WM", stock: 100 },
      { id: "v2", flavour: "Lemon Lime", size: "100 g", price: 250 * 2.5, salePrice: 250 * 2.5, sku: "BCAA-100G-LL", stock: 100 }
    ]
  },
  {
    id: "rnd-glutamine",
    name: "L-Glutamine",
    slug: "l-glutamine",
    category: "Amino Acids",
    brand: "RND",
    description: "Pure L-Glutamine for immune support and recovery.",
    shortDescription: "Immune support.",
    images: ["./images/rnd_creatine_container_1789192533564.jpg"],
    price: 250 * 2.5,
    salePrice: 250 * 2.5,
    discountPercentage: 0,
    sku: "GLU-250G",
    barcode: "890010",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Unflavoured",
    weightOrPackSize: "250 g",
    servings: 50,
    variants: [
      { id: "v1", flavour: "Unflavoured", size: "250 g", price: 250 * 2.5, salePrice: 250 * 2.5, sku: "GLU-250G-UNF", stock: 100 }
    ]
  },
  {
    id: "rnd-multivitamin",
    name: "ALPHA SHIELD Athlete Multivitamin",
    slug: "alpha-shield-athlete-multivitamin",
    category: "Vitamins",
    brand: "RND",
    description: "ALPHA SHIELD Athlete Multivitamin. 45 Ingredients, KSM-66 Ashwagandha, Testosterone Support.",
    shortDescription: "Clinically formulated athlete multivitamin.",
    images: ["./images/rnd_multivit_bot_1789227901192.jpg"],
    price: 350 * 2.5,
    salePrice: 350 * 2.5,
    discountPercentage: 0,
    sku: "MV-60T",
    barcode: "890011",
    stockQuantity: 100,
    lowStockThreshold: 10,
    flavour: "Unflavoured",
    weightOrPackSize: "60 Tablets",
    servings: 60,
    variants: [
      { id: "v1", flavour: "Unflavoured", size: "60 Tablets", price: 350 * 2.5, salePrice: 350 * 2.5, sku: "MV-60T-UNF", stock: 100 }
    ]
  }
];

const storeData = {
  products: productsData
};

fs.writeFileSync('data/rnd_store.json', JSON.stringify(storeData, null, 2));
