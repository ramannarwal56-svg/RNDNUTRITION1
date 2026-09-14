const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/rnd_store.json', 'utf8'));

const imageUpdates = {
  "rnd-whey-concentrate": "./images/rnd_whey_iso_1789227825582.jpg",
  "rnd-whey-blend": "./images/rnd_whey_iso_1789227825582.jpg",
  "rnd-yeast-protein": "./images/rnd_whey_iso_1789227825582.jpg",
  "rnd-mass-gainer-1kg": "./images/rnd_mass_tub_1789227882336.jpg"
};

data.products.forEach(p => {
  if (imageUpdates[p.id]) {
    p.images = [imageUpdates[p.id]];
  }
});

fs.writeFileSync('data/rnd_store.json', JSON.stringify(data, null, 2));
console.log("Images updated.");
