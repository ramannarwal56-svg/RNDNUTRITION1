const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/rnd_store.json', 'utf8'));

const nameMap = {
  "rnd-whey-concentrate": "RND Titanium Whey Protein Concentrate",
  "rnd-whey-isolate": "RND Titanium 100% Whey Isolate",
  "rnd-whey-blend": "RND Titanium Whey Protein Blend",
  "rnd-yeast-protein": "RND Titanium Yeast Protein",
  "rnd-mass-gainer-1kg": "RND COLOSSUS Mass Gainer (1 kg)",
  "rnd-mass-gainer-3kg": "RND COLOSSUS Mega Mass Gainer (3 kg)",
  "rnd-creatine": "RND CRE AMP Micronised Creatine",
  "rnd-preworkout": "RND IGNITION X Extreme Pre-Workout",
  "rnd-bcaa": "RND Amino X BCAA",
  "rnd-glutamine": "RND Pure L-Glutamine",
  "rnd-multivitamin": "RND ALPHA SHIELD Athlete Multivitamin"
};

data.products.forEach(p => {
  if (nameMap[p.id]) {
    p.name = nameMap[p.id];
  }
});

fs.writeFileSync('data/rnd_store.json', JSON.stringify(data, null, 2));
console.log("Branding updated.");
