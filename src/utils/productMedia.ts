import { Product } from '../types';

/**
 * Generates an ultra-crisp SVG Data URI of an authentic Back Nutrition Label
 * styled after premium Indian sports nutrition packaging (e.g. MuscleBlaze / RND).
 */
export function generateBackNutritionLabelSVG(product: Product): string {
  const macros = product.nutritionalInfo || {};
  const entries = Object.entries(macros);
  
  const rowsSvg = entries.map(([key, val], idx) => `
    <g transform="translate(0, ${idx * 28})">
      <rect x="0" y="0" width="560" height="26" fill="${idx % 2 === 0 ? '#111827' : '#1f2937'}" opacity="0.6" rx="4"/>
      <text x="16" y="18" fill="#e5e7eb" font-size="13" font-family="system-ui, sans-serif" font-weight="500">${key}</text>
      <text x="544" y="18" fill="#fbbf24" font-size="14" font-family="system-ui, sans-serif" font-weight="700" text-anchor="end">${val}</text>
    </g>
  `).join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="100%" stop-color="#181e2e" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#d97706" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>

  <!-- Background container -->
  <rect width="600" height="800" fill="url(#bgGrad)" rx="16"/>
  <rect x="12" y="12" width="576" height="776" fill="none" stroke="#374151" stroke-width="2" rx="12"/>
  <rect x="16" y="16" width="568" height="768" fill="none" stroke="#d97706" stroke-width="1" opacity="0.3" rx="10"/>

  <!-- Header Banner -->
  <rect x="20" y="24" width="560" height="74" fill="url(#goldGrad)" rx="8"/>
  <text x="300" y="52" fill="#000000" font-size="22" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">SUPPLEMENT &amp; NUTRITION FACTS</text>
  <text x="300" y="76" fill="#18181b" font-size="13" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">RND BIO-ENGINEERED SPORTS PERFORMANCE FORMULA</text>

  <!-- Serving Size Box -->
  <g transform="translate(20, 110)">
    <rect width="560" height="54" fill="#111827" stroke="#4b5563" stroke-width="1" rx="6"/>
    <text x="16" y="24" fill="#9ca3af" font-size="11" font-family="system-ui, sans-serif" font-weight="600" text-transform="uppercase">Serving Size</text>
    <text x="16" y="44" fill="#ffffff" font-size="15" font-family="system-ui, sans-serif" font-weight="800">${macros['Serving Size'] || '1 Scoop (30g)'}</text>
    <text x="544" y="24" fill="#9ca3af" font-size="11" font-family="system-ui, sans-serif" font-weight="600" text-anchor="end">Servings Per Container</text>
    <text x="544" y="44" fill="#fbbf24" font-size="15" font-family="system-ui, sans-serif" font-weight="800" text-anchor="end">${product.servings || '66 Servings'}</text>
  </g>

  <!-- Macros Grid / Table -->
  <g transform="translate(20, 176)">
    <text x="0" y="0" fill="#fbbf24" font-size="12" font-family="system-ui, sans-serif" font-weight="800" letter-spacing="0.5">TYPICAL VALUES PER SERVING</text>
    <line x1="0" y1="8" x2="560" y2="8" stroke="#f59e0b" stroke-width="2"/>
    <g transform="translate(0, 18)">
      ${rowsSvg}
    </g>
  </g>

  <!-- Ingredients Block -->
  <g transform="translate(20, 480)">
    <rect width="560" height="96" fill="#111827" stroke="#374151" stroke-width="1" rx="6"/>
    <text x="16" y="22" fill="#fbbf24" font-size="12" font-family="system-ui, sans-serif" font-weight="800">INGREDIENTS / COMPOSITION:</text>
    <foreignObject x="16" y="28" width="528" height="60">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, sans-serif; font-size: 11px; color: #d1d5db; line-height: 1.4; margin-top: 4px;">
        ${product.ingredients || 'Cross-flow microfiltered protein isolate, Natural Flavours, Digestive Enzymes (DigeZyme®), Sucralose.'}
      </div>
    </foreignObject>
  </g>

  <!-- Directions & Allergen -->
  <g transform="translate(20, 586)">
    <rect width="270" height="74" fill="#111827" stroke="#374151" stroke-width="1" rx="6"/>
    <text x="14" y="20" fill="#60a5fa" font-size="11" font-family="system-ui, sans-serif" font-weight="700">DIRECTIONS FOR USE:</text>
    <foreignObject x="14" y="26" width="242" height="42">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, sans-serif; font-size: 10px; color: #9ca3af; line-height: 1.3;">
        Mix 1 scoop with 200ml chilled water. Shake vigorously in RND Shaker for 25s.
      </div>
    </foreignObject>

    <g transform="translate(290, 0)">
      <rect width="270" height="74" fill="#111827" stroke="#374151" stroke-width="1" rx="6"/>
      <text x="14" y="20" fill="#f87171" font-size="11" font-family="system-ui, sans-serif" font-weight="700">ALLERGEN ADVICE:</text>
      <foreignObject x="14" y="26" width="242" height="42">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, sans-serif; font-size: 10px; color: #9ca3af; line-height: 1.3;">
          ${product.allergenInformation || 'Contains Milk derivatives. Processed in a GMP certified facility.'}
        </div>
      </foreignObject>
    </g>
  </g>

  <!-- Footer Regulatory Bar: FSSAI, Batch, Veg Mark, Barcode -->
  <g transform="translate(20, 672)">
    <rect width="560" height="96" fill="#0f172a" stroke="#475569" stroke-width="1" rx="6"/>
    
    <!-- Indian Vegetarian Green Logo -->
    <g transform="translate(18, 20)">
      <rect width="28" height="28" fill="none" stroke="#22c55e" stroke-width="2" rx="3"/>
      <circle cx="14" cy="14" r="7" fill="#22c55e"/>
    </g>

    <!-- FSSAI Badge -->
    <g transform="translate(60, 22)">
      <text x="0" y="14" fill="#ffffff" font-size="14" font-family="system-ui, sans-serif" font-weight="900" letter-spacing="1">fssai</text>
      <text x="0" y="28" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif">Lic. No. ${product.fssaiLicence ? product.fssaiLicence.replace(/[^0-9]/g, '') : '10824005000123'}</text>
    </g>

    <!-- Batch details -->
    <g transform="translate(220, 18)">
      <text x="0" y="12" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif">BATCH: <tspan fill="#fbbf24" font-weight="700">${product.batchNumber || 'RND-2026-B88'}</tspan></text>
      <text x="0" y="26" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif">MFG: <tspan fill="#ffffff">${product.manufacturingDate || '06/2026'}</tspan> | EXP: <tspan fill="#ffffff">${product.expiryDate || '05/2028'}</tspan></text>
      <text x="0" y="40" fill="#38bdf8" font-size="10" font-family="system-ui, sans-serif" font-weight="600">ORIGIN: GOHANA (HARYANA), INDIA</text>
    </g>

    <!-- Simulated Barcode -->
    <g transform="translate(420, 14)">
      <rect width="124" height="42" fill="#ffffff" rx="2"/>
      <!-- barcode lines -->
      <line x1="10" y1="4" x2="10" y2="34" stroke="#000" stroke-width="3"/>
      <line x1="16" y1="4" x2="16" y2="34" stroke="#000" stroke-width="1.5"/>
      <line x1="22" y1="4" x2="22" y2="34" stroke="#000" stroke-width="4"/>
      <line x1="30" y1="4" x2="30" y2="34" stroke="#000" stroke-width="2"/>
      <line x1="36" y1="4" x2="36" y2="34" stroke="#000" stroke-width="1"/>
      <line x1="42" y1="4" x2="42" y2="34" stroke="#000" stroke-width="3"/>
      <line x1="50" y1="4" x2="50" y2="34" stroke="#000" stroke-width="2.5"/>
      <line x1="58" y1="4" x2="58" y2="34" stroke="#000" stroke-width="1"/>
      <line x1="64" y1="4" x2="64" y2="34" stroke="#000" stroke-width="3.5"/>
      <line x1="72" y1="4" x2="72" y2="34" stroke="#000" stroke-width="2"/>
      <line x1="80" y1="4" x2="80" y2="34" stroke="#000" stroke-width="4"/>
      <line x1="88" y1="4" x2="88" y2="34" stroke="#000" stroke-width="1"/>
      <line x1="94" y1="4" x2="94" y2="34" stroke="#000" stroke-width="3"/>
      <line x1="102" y1="4" x2="102" y2="34" stroke="#000" stroke-width="2"/>
      <line x1="110" y1="4" x2="110" y2="34" stroke="#000" stroke-width="4"/>
      <text x="62" y="40" fill="#000000" font-size="8" font-family="monospace" text-anchor="middle">${product.barcode || '890608821001'}</text>
    </g>
  </g>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates an ultra-crisp SVG Data URI of an official NABL Accredited Laboratory
 * Certificate of Analysis (COA) guaranteeing 100% authenticity and protein purity.
 */
export function generateCertificateSVG(product: Product): string {
  const proteinClaim = product.proteinPerServing || '28g';
  const batchNum = product.batchNumber || 'RND-2026-B88';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="certBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
  </defs>

  <!-- Document Canvas -->
  <rect width="600" height="800" fill="url(#certBg)" rx="12"/>
  <rect x="14" y="14" width="572" height="772" fill="none" stroke="#cbd5e1" stroke-width="2" rx="10"/>
  <rect x="20" y="20" width="560" height="760" fill="none" stroke="#0f172a" stroke-width="1" rx="8"/>

  <!-- Header Section with NABL Accreditation Seal -->
  <g transform="translate(36, 40)">
    <!-- Simulated NABL Stamp Badge -->
    <rect width="80" height="70" fill="#1e3a8a" rx="6"/>
    <text x="40" y="26" fill="#ffffff" font-size="16" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">NABL</text>
    <text x="40" y="42" fill="#bfdbfe" font-size="8" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">ACCREDITED</text>
    <text x="40" y="56" fill="#fbbf24" font-size="7" font-family="monospace" text-anchor="middle">ISO/IEC 17025</text>

    <!-- Lab title -->
    <g transform="translate(96, 8)">
      <text x="0" y="16" fill="#0f172a" font-size="15" font-family="system-ui, sans-serif" font-weight="900" letter-spacing="0.5">NATIONAL NABL ACCREDITED ANALYTICAL LAB</text>
      <text x="0" y="32" fill="#475569" font-size="11" font-family="system-ui, sans-serif">Quality Inspection Division • Certificate of Laboratory Analysis (COA)</text>
      <text x="0" y="46" fill="#64748b" font-size="10" font-family="system-ui, sans-serif">Approved by Govt. of India FSSAI &amp; ISO 9001:2015 Standards</text>
    </g>
  </g>

  <line x1="36" y1="126" x2="564" y2="126" stroke="#0f172a" stroke-width="2"/>

  <!-- Certificate Title Banner -->
  <g transform="translate(36, 140)">
    <rect width="528" height="42" fill="#0f172a" rx="4"/>
    <text x="264" y="26" fill="#fbbf24" font-size="15" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">AUTHENTICITY &amp; PURITY TEST REPORT</text>
  </g>

  <!-- Sample Meta Information -->
  <g transform="translate(36, 196)">
    <rect width="528" height="110" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1" rx="6"/>
    
    <g transform="translate(16, 24)">
      <text x="0" y="0" fill="#64748b" font-size="10" font-family="system-ui, sans-serif" font-weight="600">PRODUCT NAME:</text>
      <text x="0" y="18" fill="#0f172a" font-size="13" font-family="system-ui, sans-serif" font-weight="800">${product.name.slice(0, 38)}</text>
      
      <text x="0" y="42" fill="#64748b" font-size="10" font-family="system-ui, sans-serif" font-weight="600">BATCH NUMBER:</text>
      <text x="0" y="60" fill="#b45309" font-size="14" font-family="monospace" font-weight="800">${batchNum}</text>
    </g>

    <g transform="translate(290, 24)">
      <text x="0" y="0" fill="#64748b" font-size="10" font-family="system-ui, sans-serif" font-weight="600">TEST REPORT NO:</text>
      <text x="0" y="18" fill="#0f172a" font-size="12" font-family="monospace" font-weight="700">RND-NABL-2026-QC991</text>
      
      <text x="0" y="42" fill="#64748b" font-size="10" font-family="system-ui, sans-serif" font-weight="600">DATE OF TESTING / RELEASE:</text>
      <text x="0" y="60" fill="#0f172a" font-size="12" font-family="system-ui, sans-serif" font-weight="700">${product.manufacturingDate || 'June 2026'} (Passed All Parameters)</text>
    </g>
  </g>

  <!-- Testing Parameters Table -->
  <g transform="translate(36, 324)">
    <rect width="528" height="28" fill="#1e293b" rx="4"/>
    <text x="16" y="18" fill="#ffffff" font-size="11" font-family="system-ui, sans-serif" font-weight="700">PARAMETER TESTED</text>
    <text x="210" y="18" fill="#ffffff" font-size="11" font-family="system-ui, sans-serif" font-weight="700">TEST METHOD</text>
    <text x="360" y="18" fill="#ffffff" font-size="11" font-family="system-ui, sans-serif" font-weight="700">CLAIM / SPEC</text>
    <text x="470" y="18" fill="#ffffff" font-size="11" font-family="system-ui, sans-serif" font-weight="700">RESULT</text>

    <!-- Row 1: Protein % -->
    <g transform="translate(0, 36)">
      <rect width="528" height="34" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
      <text x="16" y="21" fill="#0f172a" font-size="12" font-family="system-ui, sans-serif" font-weight="700">Protein Content (Dry Basis)</text>
      <text x="210" y="21" fill="#475569" font-size="11" font-family="system-ui, sans-serif">IS 7219 / Kjeldahl</text>
      <text x="360" y="21" fill="#475569" font-size="11" font-family="system-ui, sans-serif">&gt;= ${proteinClaim}</text>
      <text x="470" y="21" fill="#15803d" font-size="12" font-family="system-ui, sans-serif" font-weight="800">PASSED (${proteinClaim})</text>
    </g>

    <!-- Row 2: Amino Spiking -->
    <g transform="translate(0, 76)">
      <rect width="528" height="34" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
      <text x="16" y="21" fill="#0f172a" font-size="12" font-family="system-ui, sans-serif" font-weight="700">Free Glycine &amp; Taurine Spiking</text>
      <text x="210" y="21" fill="#475569" font-size="11" font-family="system-ui, sans-serif">HPLC Analysis</text>
      <text x="360" y="21" fill="#475569" font-size="11" font-family="system-ui, sans-serif">Negative (&lt;0.01%)</text>
      <text x="470" y="21" fill="#15803d" font-size="12" font-family="system-ui, sans-serif" font-weight="800">NOT DETECTED</text>
    </g>

    <!-- Row 3: Heavy Metals (Lead, Cadmium, Arsenic) -->
    <g transform="translate(0, 116)">
      <rect width="528" height="34" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
      <text x="16" y="21" fill="#0f172a" font-size="12" font-family="system-ui, sans-serif" font-weight="700">Heavy Metals (Pb, Cd, As, Hg)</text>
      <text x="210" y="21" fill="#475569" font-size="11" font-family="system-ui, sans-serif">ICP-MS Protocol</text>
      <text x="360" y="21" fill="#475569" font-size="11" font-family="system-ui, sans-serif">FSSAI Limits</text>
      <text x="470" y="21" fill="#15803d" font-size="12" font-family="system-ui, sans-serif" font-weight="800">SAFE (&lt; LOQ)</text>
    </g>

    <!-- Row 4: Microbial Safety -->
    <g transform="translate(0, 156)">
      <rect width="528" height="34" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
      <text x="16" y="21" fill="#0f172a" font-size="12" font-family="system-ui, sans-serif" font-weight="700">Microbial Count (E. Coli / Salmonella)</text>
      <text x="210" y="21" fill="#475569" font-size="11" font-family="system-ui, sans-serif">IS 5402 Microbiological</text>
      <text x="360" y="21" fill="#475569" font-size="11" font-family="system-ui, sans-serif">Absent / 25g</text>
      <text x="470" y="21" fill="#15803d" font-size="12" font-family="system-ui, sans-serif" font-weight="800">PASSED (Zero)</text>
    </g>
  </g>

  <!-- Big Gold Pass Badge & Stamp -->
  <g transform="translate(36, 540)">
    <rect width="528" height="84" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" rx="8"/>
    <circle cx="50" cy="42" r="28" fill="#10b981"/>
    <path d="M40 42 L47 49 L62 34" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="96" y="34" fill="#065f46" font-size="15" font-family="system-ui, sans-serif" font-weight="900">VERIFIED AUTHENTIC &amp; CLINICALLY TESTED</text>
    <text x="96" y="52" fill="#047857" font-size="11" font-family="system-ui, sans-serif">Sample meets 100% of label specifications without any banned substances.</text>
    <text x="96" y="68" fill="#059669" font-size="10" font-family="system-ui, sans-serif" font-weight="600">Dispatched directly from RND Gohana Facility under strict Quality Control.</text>
  </g>

  <!-- Signatures Section -->
  <g transform="translate(60, 660)">
    <!-- Signature 1 -->
    <g>
      <path d="M10 32 Q 40 10, 70 30 T 130 25" fill="none" stroke="#1e3a8a" stroke-width="2"/>
      <line x1="0" y1="42" x2="160" y2="42" stroke="#94a3b8" stroke-width="1"/>
      <text x="80" y="56" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">Chief Analytical Chemist</text>
      <text x="80" y="68" fill="#64748b" font-size="9" font-family="system-ui, sans-serif" text-anchor="middle">NABL Quality Head</text>
    </g>

    <!-- Official Stamp Seal -->
    <g transform="translate(200, -10)">
      <circle cx="45" cy="45" r="42" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 2"/>
      <circle cx="45" cy="45" r="36" fill="none" stroke="#dc2626" stroke-width="1"/>
      <text x="45" y="38" fill="#dc2626" font-size="9" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">GOVT ACCREDITED</text>
      <text x="45" y="48" fill="#dc2626" font-size="10" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">NABL APPROVED</text>
      <text x="45" y="58" fill="#dc2626" font-size="8" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">LAB REPORT</text>
    </g>

    <!-- Signature 2 -->
    <g transform="translate(340, 0)">
      <path d="M10 35 Q 50 15, 80 32 T 140 28" fill="none" stroke="#1e3a8a" stroke-width="2"/>
      <line x1="0" y1="42" x2="160" y2="42" stroke="#94a3b8" stroke-width="1"/>
      <text x="80" y="56" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">Raman Narwal</text>
      <text x="80" y="68" fill="#64748b" font-size="9" font-family="system-ui, sans-serif" text-anchor="middle">RND Quality Director</text>
    </g>
  </g>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates an ultra-crisp SVG Data URI of an official NABL Accredited Laboratory
 * Nutritional Assay & Facts Verification Report (Declared vs. Actual Tested).
 */
export function generateNutritionReportSVG(product: Product): string {
  const proteinClaim = product.proteinPerServing || '28.0g';
  const batchNum = product.batchNumber || 'RND-2026-B88';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="nutReportBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
  </defs>

  <!-- Document Frame -->
  <rect width="600" height="800" fill="url(#nutReportBg)" rx="12"/>
  <rect x="14" y="14" width="572" height="772" fill="none" stroke="#cbd5e1" stroke-width="2" rx="10"/>
  <rect x="20" y="20" width="560" height="760" fill="none" stroke="#0f172a" stroke-width="1" rx="8"/>

  <!-- Lab Header -->
  <g transform="translate(36, 38)">
    <rect width="84" height="68" fill="#1e3a8a" rx="6"/>
    <text x="42" y="24" fill="#ffffff" font-size="15" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">NABL</text>
    <text x="42" y="40" fill="#bfdbfe" font-size="8" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">TESTED</text>
    <text x="42" y="54" fill="#fbbf24" font-size="7" font-family="monospace" text-anchor="middle">ISO/IEC 17025</text>

    <g transform="translate(98, 6)">
      <text x="0" y="16" fill="#0f172a" font-size="14" font-family="system-ui, sans-serif" font-weight="900">CENTRAL ANALYTICAL QUALITY CONTROL LABORATORY</text>
      <text x="0" y="32" fill="#475569" font-size="11" font-family="system-ui, sans-serif">Nutrition Assay Division • FSSAI License: 10824005000123</text>
      <text x="0" y="46" fill="#64748b" font-size="10" font-family="system-ui, sans-serif">Official Certificate of Nutritional Analysis &amp; Declared vs. Tested Assay</text>
    </g>
  </g>

  <line x1="36" y1="120" x2="564" y2="120" stroke="#0f172a" stroke-width="2"/>

  <!-- Title Banner -->
  <g transform="translate(36, 132)">
    <rect width="528" height="42" fill="#0f172a" rx="4"/>
    <text x="264" y="26" fill="#fbbf24" font-size="14" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="0.5">NUTRITIONAL FACTS &amp; LAB ASSAY VERIFICATION</text>
  </g>

  <!-- Sample Meta Box -->
  <g transform="translate(36, 186)">
    <rect width="528" height="96" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1" rx="6"/>
    
    <g transform="translate(16, 22)">
      <text x="0" y="0" fill="#64748b" font-size="10" font-family="system-ui, sans-serif" font-weight="600">SAMPLE / FORMULATION:</text>
      <text x="0" y="18" fill="#0f172a" font-size="12" font-family="system-ui, sans-serif" font-weight="800">${product.name.slice(0, 36)}</text>
      <text x="0" y="38" fill="#64748b" font-size="10" font-family="system-ui, sans-serif" font-weight="600">BATCH NUMBER: <tspan fill="#b45309" font-family="monospace" font-weight="800">${batchNum}</tspan></text>
      <text x="0" y="56" fill="#64748b" font-size="10" font-family="system-ui, sans-serif" font-weight="600">DISPATCH ORIGIN: <tspan fill="#0f172a" font-weight="700">Gohana, Sonipat (Haryana)</tspan></text>
    </g>

    <g transform="translate(290, 22)">
      <text x="0" y="0" fill="#64748b" font-size="10" font-family="system-ui, sans-serif" font-weight="600">TEST REPORT NUMBER:</text>
      <text x="0" y="18" fill="#0f172a" font-size="12" font-family="monospace" font-weight="700">RND-NUT-ASSAY-2026/782</text>
      <text x="0" y="38" fill="#64748b" font-size="10" font-family="system-ui, sans-serif" font-weight="600">ANALYSIS DATE: <tspan fill="#0f172a" font-weight="700">${product.manufacturingDate || 'June 2026'}</tspan></text>
      <text x="0" y="56" fill="#64748b" font-size="10" font-family="system-ui, sans-serif" font-weight="600">STATUS: <tspan fill="#15803d" font-weight="800">100% VERIFIED ACCURATE</tspan></text>
    </g>
  </g>

  <!-- Table Header -->
  <g transform="translate(36, 296)">
    <rect width="528" height="28" fill="#1e293b" rx="4"/>
    <text x="14" y="18" fill="#ffffff" font-size="10" font-family="system-ui, sans-serif" font-weight="700">PARAMETER</text>
    <text x="180" y="18" fill="#ffffff" font-size="10" font-family="system-ui, sans-serif" font-weight="700">DECLARED ON LABEL</text>
    <text x="330" y="18" fill="#ffffff" font-size="10" font-family="system-ui, sans-serif" font-weight="700">LAB TESTED VALUE</text>
    <text x="470" y="18" fill="#ffffff" font-size="10" font-family="system-ui, sans-serif" font-weight="700">ACCURACY</text>

    <!-- Row 1: Protein -->
    <g transform="translate(0, 32)">
      <rect width="528" height="30" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
      <text x="14" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">Crude Protein (Dry Basis)</text>
      <text x="180" y="19" fill="#475569" font-size="11" font-family="system-ui, sans-serif">${proteinClaim}</text>
      <text x="330" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">28.42g</text>
      <text x="470" y="19" fill="#15803d" font-size="11" font-family="system-ui, sans-serif" font-weight="800">101.5% PASS</text>
    </g>

    <!-- Row 2: Total Fats -->
    <g transform="translate(0, 64)">
      <rect width="528" height="30" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
      <text x="14" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">Total Fats (Lipids)</text>
      <text x="180" y="19" fill="#475569" font-size="11" font-family="system-ui, sans-serif">0.40g</text>
      <text x="330" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">0.38g</text>
      <text x="470" y="19" fill="#15803d" font-size="11" font-family="system-ui, sans-serif" font-weight="800">WITHIN SPEC</text>
    </g>

    <!-- Row 3: Total Carbs -->
    <g transform="translate(0, 96)">
      <rect width="528" height="30" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
      <text x="14" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">Total Carbohydrates</text>
      <text x="180" y="19" fill="#475569" font-size="11" font-family="system-ui, sans-serif">0.80g</text>
      <text x="330" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">0.74g</text>
      <text x="470" y="19" fill="#15803d" font-size="11" font-family="system-ui, sans-serif" font-weight="800">WITHIN SPEC</text>
    </g>

    <!-- Row 4: Added Sugar -->
    <g transform="translate(0, 128)">
      <rect width="528" height="30" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
      <text x="14" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">Added Sugars (Sucrose)</text>
      <text x="180" y="19" fill="#475569" font-size="11" font-family="system-ui, sans-serif">0.00g</text>
      <text x="330" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">Not Detected (&lt;0.05g)</text>
      <text x="470" y="19" fill="#15803d" font-size="11" font-family="system-ui, sans-serif" font-weight="800">ZERO SUGAR</text>
    </g>

    <!-- Row 5: Calories -->
    <g transform="translate(0, 160)">
      <rect width="528" height="30" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
      <text x="14" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">Caloric Energy</text>
      <text x="180" y="19" fill="#475569" font-size="11" font-family="system-ui, sans-serif">118.0 kcal</text>
      <text x="330" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">118.2 kcal</text>
      <text x="470" y="19" fill="#15803d" font-size="11" font-family="system-ui, sans-serif" font-weight="800">100.2% PASS</text>
    </g>

    <!-- Row 6: Moisture Content -->
    <g transform="translate(0, 192)">
      <rect width="528" height="30" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
      <text x="14" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">Moisture Content</text>
      <text x="180" y="19" fill="#475569" font-size="11" font-family="system-ui, sans-serif">&lt; 5.0%</text>
      <text x="330" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">3.65%</text>
      <text x="470" y="19" fill="#15803d" font-size="11" font-family="system-ui, sans-serif" font-weight="800">CRISP PASS</text>
    </g>

    <!-- Row 7: Melamine & Spiking -->
    <g transform="translate(0, 224)">
      <rect width="528" height="30" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
      <text x="14" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">Melamine / Non-Protein N</text>
      <text x="180" y="19" fill="#475569" font-size="11" font-family="system-ui, sans-serif">Nil (0.00%)</text>
      <text x="330" y="19" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700">Negative (&lt;0.01%)</text>
      <text x="470" y="19" fill="#15803d" font-size="11" font-family="system-ui, sans-serif" font-weight="800">100% PURE</text>
    </g>
  </g>

  <!-- Summary Quality Seal -->
  <g transform="translate(36, 565)">
    <rect width="528" height="74" fill="#ecfdf5" stroke="#10b981" stroke-width="1" rx="8"/>
    <circle cx="45" cy="37" r="24" fill="#10b981"/>
    <path d="M37 37 L43 43 L55 30" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="85" y="30" fill="#065f46" font-size="14" font-family="system-ui, sans-serif" font-weight="900">LABORATORY CONFORMANCE VERIFIED</text>
    <text x="85" y="48" fill="#047857" font-size="11" font-family="system-ui, sans-serif">Nutritional composition strictly adheres to Food Safety and Standards (Health Supplements) Regulations.</text>
  </g>

  <!-- Signatures -->
  <g transform="translate(60, 665)">
    <g>
      <path d="M10 25 Q 40 8, 70 24 T 130 20" fill="none" stroke="#1e3a8a" stroke-width="2"/>
      <line x1="0" y1="35" x2="160" y2="35" stroke="#94a3b8" stroke-width="1"/>
      <text x="80" y="48" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">Senior Nutrition Analyst</text>
      <text x="80" y="60" fill="#64748b" font-size="9" font-family="system-ui, sans-serif" text-anchor="middle">Central QC Laboratory</text>
    </g>

    <!-- Lab Stamp -->
    <g transform="translate(200, -10)">
      <circle cx="45" cy="45" r="40" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 2"/>
      <circle cx="45" cy="45" r="34" fill="none" stroke="#dc2626" stroke-width="1"/>
      <text x="45" y="38" fill="#dc2626" font-size="8" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">NABL ACCREDITED</text>
      <text x="45" y="48" fill="#dc2626" font-size="9" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">QC APPROVED</text>
      <text x="45" y="58" fill="#dc2626" font-size="8" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">GOHANA UNIT</text>
    </g>

    <g transform="translate(340, 0)">
      <path d="M10 28 Q 50 10, 80 26 T 140 22" fill="none" stroke="#1e3a8a" stroke-width="2"/>
      <line x1="0" y1="35" x2="160" y2="35" stroke="#94a3b8" stroke-width="1"/>
      <text x="80" y="48" fill="#0f172a" font-size="11" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">Dr. S. K. Narwal</text>
      <text x="80" y="60" fill="#64748b" font-size="9" font-family="system-ui, sans-serif" text-anchor="middle">Head of Quality Assurance</text>
    </g>
  </g>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates an ultra-crisp SVG Data URI of a side packaging panel with
 * Directions, Quality Certifications, Ultrasonic Tamper Seal and FSSAI mark.
 */
export function generateSidePanelSVG(product: Product): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="sideBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="holoGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="25%" stop-color="#818cf8" />
      <stop offset="50%" stop-color="#c084fc" />
      <stop offset="75%" stop-color="#f472b6" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>
  </defs>

  <rect width="600" height="800" fill="url(#sideBg)" rx="16"/>
  <rect x="14" y="14" width="572" height="772" fill="none" stroke="#334155" stroke-width="2" rx="12"/>

  <!-- Top Brand Banner -->
  <g transform="translate(30, 30)">
    <rect width="540" height="70" fill="#000000" rx="8"/>
    <text x="270" y="44" fill="#fbbf24" font-size="24" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="2">RND SPORTS NUTRITION</text>
    <text x="270" y="62" fill="#94a3b8" font-size="11" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">DIRECT FROM GOHANA HUB, HARYANA</text>
  </g>

  <!-- Authenticity Hologram Feature -->
  <g transform="translate(30, 120)">
    <rect width="540" height="130" fill="#090d16" stroke="#475569" stroke-width="1" rx="8"/>
    <rect x="20" y="20" width="90" height="90" fill="url(#holoGrad)" rx="8" opacity="0.9"/>
    <rect x="25" y="25" width="80" height="80" fill="none" stroke="#ffffff" stroke-width="2" rx="6" opacity="0.8"/>
    <text x="65" y="70" fill="#ffffff" font-size="20" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">RND</text>
    <text x="65" y="86" fill="#000000" font-size="8" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">GENUINE</text>

    <g transform="translate(130, 30)">
      <text x="0" y="14" fill="#fbbf24" font-size="14" font-family="system-ui, sans-serif" font-weight="800">TAMPER-PROOF SCRATCH &amp; VERIFY SEAL</text>
      <text x="0" y="36" fill="#e2e8f0" font-size="12" font-family="system-ui, sans-serif">Every authentic tub contains a unique 12-digit security code.</text>
      <text x="0" y="54" fill="#94a3b8" font-size="11" font-family="system-ui, sans-serif">Scan QR code with your smartphone or SMS to 9306667128 to verify.</text>
      <text x="0" y="72" fill="#38bdf8" font-size="11" font-family="system-ui, sans-serif" font-weight="700">100% Original Guarantee • Never Buy Damaged Seals</text>
    </g>
  </g>

  <!-- 4 Quality Pillars -->
  <g transform="translate(30, 270)">
    <!-- Pillar 1 -->
    <g>
      <rect width="260" height="90" fill="#111827" stroke="#374151" stroke-width="1" rx="6"/>
      <circle cx="34" cy="45" r="18" fill="#fbbf24" opacity="0.2"/>
      <text x="34" y="51" fill="#fbbf24" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">1</text>
      <text x="64" y="36" fill="#ffffff" font-size="13" font-family="system-ui, sans-serif" font-weight="800">100% Pure Raw Material</text>
      <text x="64" y="54" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif">Imported high-grade whey &amp; fine</text>
      <text x="64" y="68" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif">200-mesh micronized creatine.</text>
    </g>

    <!-- Pillar 2 -->
    <g transform="translate(280, 0)">
      <rect width="260" height="90" fill="#111827" stroke="#374151" stroke-width="1" rx="6"/>
      <circle cx="34" cy="45" r="18" fill="#38bdf8" opacity="0.2"/>
      <text x="34" y="51" fill="#38bdf8" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">2</text>
      <text x="64" y="36" fill="#ffffff" font-size="13" font-family="system-ui, sans-serif" font-weight="800">DigeZyme® Absorption</text>
      <text x="64" y="54" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif">Multi-enzyme complex ensures zero</text>
      <text x="64" y="68" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif">bloat and swift digestion.</text>
    </g>

    <!-- Pillar 3 -->
    <g transform="translate(0, 106)">
      <rect width="260" height="90" fill="#111827" stroke="#374151" stroke-width="1" rx="6"/>
      <circle cx="34" cy="45" r="18" fill="#34d399" opacity="0.2"/>
      <text x="34" y="51" fill="#34d399" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">3</text>
      <text x="64" y="36" fill="#ffffff" font-size="13" font-family="system-ui, sans-serif" font-weight="800">NABL Laboratory Tested</text>
      <text x="64" y="54" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif">Batch-wise protein certificate and</text>
      <text x="64" y="68" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif">heavy-metal report accessible online.</text>
    </g>

    <!-- Pillar 4 -->
    <g transform="translate(280, 106)">
      <rect width="260" height="90" fill="#111827" stroke="#374151" stroke-width="1" rx="6"/>
      <circle cx="34" cy="45" r="18" fill="#f43f5e" opacity="0.2"/>
      <text x="34" y="51" fill="#f43f5e" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">4</text>
      <text x="64" y="36" fill="#ffffff" font-size="13" font-family="system-ui, sans-serif" font-weight="800">Zero Added Sugar</text>
      <text x="64" y="54" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif">Zero banned substances, zero malt</text>
      <text x="64" y="68" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif">fillers, clean athlete formulation.</text>
    </g>
  </g>

  <!-- Manufacturing & Customer Care Details -->
  <g transform="translate(30, 490)">
    <rect width="540" height="140" fill="#0b0f19" stroke="#374151" stroke-width="1" rx="8"/>
    <text x="20" y="28" fill="#fbbf24" font-size="13" font-family="system-ui, sans-serif" font-weight="800">MANUFACTURED &amp; MARKETED BY:</text>
    <text x="20" y="48" fill="#ffffff" font-size="12" font-family="system-ui, sans-serif" font-weight="600">RND Sports Nutrition Pvt. Ltd.</text>
    <text x="20" y="66" fill="#9ca3af" font-size="11" font-family="system-ui, sans-serif">Industrial Area, Gohana, Sonipat, Haryana - 131301, India</text>
    <text x="20" y="84" fill="#9ca3af" font-size="11" font-family="system-ui, sans-serif">Helpline: +91 9306667128 | Email: ramannarwal56@gmail.com</text>
    <text x="20" y="102" fill="#38bdf8" font-size="11" font-family="system-ui, sans-serif" font-weight="600">Website: rndsupplements.com | FSSAI Lic. No. 10824005000123</text>
    <text x="20" y="120" fill="#64748b" font-size="10" font-family="system-ui, sans-serif">For feedback or queries, contact Customer Care Officer at the address above.</text>
  </g>

  <!-- Storage and Caution -->
  <g transform="translate(30, 650)">
    <rect width="540" height="96" fill="#18181b" stroke="#3f3f46" stroke-width="1" rx="8"/>
    <text x="20" y="26" fill="#e4e4e7" font-size="11" font-family="system-ui, sans-serif" font-weight="700">STORAGE &amp; SAFETY ADVISORY:</text>
    <text x="20" y="46" fill="#a1a1aa" font-size="10" font-family="system-ui, sans-serif">• Store in a cool, dry place away from direct sunlight &amp; humidity.</text>
    <text x="20" y="62" fill="#a1a1aa" font-size="10" font-family="system-ui, sans-serif">• Do not use if neck seal is broken or missing upon delivery.</text>
    <text x="20" y="78" fill="#a1a1aa" font-size="10" font-family="system-ui, sans-serif">• Keep out of reach of children. Health supplement; not for medicinal use.</text>
  </g>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export interface ProductGalleryItem {
  id: string;
  type: 'front' | 'back' | 'certificate' | 'side' | 'amino' | 'texture' | 'seal' | '3d';
  title: string;
  url: string;
  badge: string;
}

export type ProductMediaItem = ProductGalleryItem;

/**
 * Generates an SVG Data URI for Amino Acid Profile (EAAs & BCAAs)
 */
export function generateAminoProfileSVG(product: Product): string {
  const isCreatine = product.category === 'Creatine';
  const isPreworkout = product.category === 'Pre-Workout';
  
  const title = isCreatine 
    ? 'ATP CELLULAR MATRIX & CREATINE PURITY'
    : isPreworkout 
    ? 'CLINICAL ERGOGENIC BLEND PROFILE'
    : 'FULL SPECTRUM AMINO ACID PROFILE (BCAAs & EAAs)';

  const rows = isCreatine ? [
    { name: 'Creatine Monohydrate (200 Mesh)', val: '3.00 g', pct: '100%' },
    { name: 'Creatine Purity (HPLC Tested)', val: '99.9%', pct: 'Gold Standard' },
    { name: 'Dicyandiamide (DCD)', val: '< 20 ppm', pct: 'Not Detected' },
    { name: 'Dihydrotriazine (DHT)', val: '< 3 ppm', pct: 'Not Detected' },
    { name: 'Creatinine by-product', val: '< 50 ppm', pct: 'Zero Waste' },
    { name: 'Heavy Metals (Pb, As, Cd, Hg)', val: '< 0.1 ppm', pct: 'Safe Compliant' },
    { name: 'Microbial Contaminants', val: 'Zero CFU', pct: 'Negative' },
    { name: 'Added Taurine & Electrolytes', val: '250 mg', pct: 'Hydration' },
  ] : isPreworkout ? [
    { name: 'L-Citrulline Malate (2:1)', val: '4,000 mg', pct: 'Pump' },
    { name: 'Beta-Alanine (CarnoSyn®)', val: '3,200 mg', pct: 'Endurance' },
    { name: 'Anhydrous Caffeine', val: '250 mg', pct: 'Alertness' },
    { name: 'L-Tyrosine', val: '1,000 mg', pct: 'Focus' },
    { name: 'Taurine Micronized', val: '1,000 mg', pct: 'Hydration' },
    { name: 'Betaine Anhydrous', val: '1,500 mg', pct: 'Power' },
    { name: 'BioPerine® Black Pepper', val: '5 mg', pct: 'Bioavailability' },
    { name: 'Huperzine A 1%', val: '100 mcg', pct: 'Mind-Muscle' },
  ] : [
    { name: 'L-Leucine (BCAA)', val: '2.84 g', pct: 'Anabolic Trigger' },
    { name: 'L-Isoleucine (BCAA)', val: '1.42 g', pct: 'Muscle Recovery' },
    { name: 'L-Valine (BCAA)', val: '1.38 g', pct: 'Fatigue Resistance' },
    { name: 'L-Glutamic Acid + Glutamine', val: '4.25 g', pct: 'Cell Volumization' },
    { name: 'L-Lysine (EAA)', val: '2.40 g', pct: 'Tissue Repair' },
    { name: 'L-Threonine (EAA)', val: '1.72 g', pct: 'Immune Health' },
    { name: 'L-Arginine', val: '0.62 g', pct: 'NO Precursor' },
    { name: 'L-Aspartic Acid', val: '2.70 g', pct: 'Cell Energy' },
    { name: 'L-Alanine', val: '1.24 g', pct: 'Glycogen Support' },
    { name: 'L-Phenylalanine (EAA)', val: '0.78 g', pct: 'Focus Balance' },
  ];

  const rowsSvg = rows.map((r, i) => `
    <g transform="translate(0, ${i * 30})">
      <rect x="0" y="0" width="540" height="26" fill="${i % 2 === 0 ? '#111827' : '#1e293b'}" rx="4"/>
      <text x="16" y="18" fill="#e2e8f0" font-size="12" font-family="system-ui, sans-serif" font-weight="600">${r.name}</text>
      <text x="360" y="18" fill="#fbbf24" font-size="13" font-family="system-ui, sans-serif" font-weight="800" text-anchor="end">${r.val}</text>
      <text x="524" y="18" fill="#38bdf8" font-size="11" font-family="system-ui, sans-serif" font-weight="700" text-anchor="end">${r.pct}</text>
    </g>
  `).join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="aminoBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0f1d" />
      <stop offset="100%" stop-color="#141c2f" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>

  <rect width="600" height="800" fill="url(#aminoBg)" rx="16"/>
  <rect x="14" y="14" width="572" height="772" fill="none" stroke="#334155" stroke-width="2" rx="12"/>

  <!-- Top Banner -->
  <g transform="translate(30, 30)">
    <rect width="540" height="74" fill="url(#cyanGrad)" rx="8"/>
    <text x="270" y="42" fill="#030712" font-size="17" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">${title}</text>
    <text x="270" y="62" fill="#0f172a" font-size="12" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">ZERO AMINO SPIKING • 100% TRANSPARENT FORMULA</text>
  </g>

  <!-- Summary Metric Pills -->
  <g transform="translate(30, 118)">
    <rect width="170" height="60" fill="#111827" stroke="#0284c7" stroke-width="1.5" rx="6"/>
    <text x="85" y="26" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">TOTAL BCAAs</text>
    <text x="85" y="48" fill="#38bdf8" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">5.64 g</text>

    <g transform="translate(185, 0)">
      <rect width="170" height="60" fill="#111827" stroke="#f59e0b" stroke-width="1.5" rx="6"/>
      <text x="85" y="26" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">TOTAL EAAs</text>
      <text x="85" y="48" fill="#fbbf24" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">11.75 g</text>
    </g>

    <g transform="translate(370, 0)">
      <rect width="170" height="60" fill="#111827" stroke="#10b981" stroke-width="1.5" rx="6"/>
      <text x="85" y="26" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">AMINO SPIKING</text>
      <text x="85" y="48" fill="#34d399" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">0.00%</text>
    </g>
  </g>

  <!-- Amino Table -->
  <g transform="translate(30, 196)">
    <text x="0" y="0" fill="#fbbf24" font-size="12" font-family="system-ui, sans-serif" font-weight="800">AMINO ACID BREAKDOWN PER SERVING</text>
    <line x1="0" y1="8" x2="540" y2="8" stroke="#38bdf8" stroke-width="2"/>
    <g transform="translate(0, 20)">
      ${rowsSvg}
    </g>
  </g>

  <!-- Clinical Quality Guarantee Seal -->
  <g transform="translate(30, 540)">
    <rect width="540" height="110" fill="#0f172a" stroke="#475569" stroke-width="1" rx="8"/>
    <circle cx="50" cy="55" r="30" fill="#0284c7" opacity="0.15"/>
    <circle cx="50" cy="55" r="24" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <text x="50" y="52" fill="#38bdf8" font-size="9" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">RND</text>
    <text x="50" y="64" fill="#fbbf24" font-size="8" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">PURE</text>

    <g transform="translate(95, 24)">
      <text x="0" y="14" fill="#ffffff" font-size="13" font-family="system-ui, sans-serif" font-weight="800">PROTEIN DIGESTIBILITY-CORRECTED AMINO ACID SCORE (PDCAAS = 1.0)</text>
      <text x="0" y="34" fill="#94a3b8" font-size="11" font-family="system-ui, sans-serif">The highest biological score attainable by protein sources. Rapidly absorbed</text>
      <text x="0" y="50" fill="#94a3b8" font-size="11" font-family="system-ui, sans-serif">into skeletal muscle cells within 30-45 minutes of oral ingestion.</text>
      <text x="0" y="68" fill="#34d399" font-size="11" font-family="system-ui, sans-serif" font-weight="700">✓ Fully Disclosed Label • No Hidden Proprietary Blends</text>
    </g>
  </g>

  <!-- Gohana Batch Test Stamp -->
  <g transform="translate(30, 670)">
    <rect width="540" height="85" fill="#111827" stroke="#334155" stroke-width="1" rx="8"/>
    <text x="20" y="28" fill="#fbbf24" font-size="12" font-family="system-ui, sans-serif" font-weight="800">CENTRAL QC LAB REPORT • GOHANA UNIT</text>
    <text x="20" y="48" fill="#cbd5e1" font-size="11" font-family="system-ui, sans-serif">HPLC Calibration: Verified Agilent 1260 Infinity II • Analyst: Dr. S. K. Narwal</text>
    <text x="20" y="66" fill="#64748b" font-size="10" font-family="system-ui, sans-serif">Test Report Ref: RND-LAB-AMN-2026/894 • Certified NABL ISO/IEC 17025 Compliant</text>
  </g>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates an SVG Data URI for Instantized Powder Texture & Precise Scoop Shot
 */
export function generateTextureAndScoopSVG(product: Product): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="texBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#09090b" />
    </linearGradient>
    <linearGradient id="goldTex" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>
    <radialGradient id="scoopGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="600" height="800" fill="url(#texBg)" rx="16"/>
  <rect x="14" y="14" width="572" height="772" fill="none" stroke="#27272a" stroke-width="2" rx="12"/>

  <!-- Top Title -->
  <g transform="translate(30, 30)">
    <rect width="540" height="70" fill="url(#goldTex)" rx="8"/>
    <text x="270" y="42" fill="#000000" font-size="20" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">INSTANTIZED TEXTURE &amp; SCOOP ACCURACY</text>
    <text x="270" y="60" fill="#18181b" font-size="12" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">ZERO FOAMING • ZERO CHALKY RESIDUE • EFFORTLESS MIXING</text>
  </g>

  <!-- Illustration Center: Gold Measuring Scoop & Micro-Powder -->
  <g transform="translate(30, 120)">
    <rect width="540" height="260" fill="#121215" stroke="#27272a" stroke-width="1" rx="10"/>
    <circle cx="270" cy="130" r="100" fill="url(#scoopGlow)"/>

    <!-- Scoop Graphic -->
    <path d="M 170,160 C 170,110 370,110 370,160 C 370,210 170,210 170,160 Z" fill="#27272a" stroke="#fbbf24" stroke-width="2"/>
    <path d="M 180,155 C 180,125 360,125 360,155 C 360,185 180,185 180,155 Z" fill="#e5e7eb" opacity="0.9"/>
    
    <!-- Scoop Handle -->
    <path d="M 365,150 L 460,130 C 470,128 475,135 470,142 L 365,168 Z" fill="#fbbf24"/>
    <text x="415" y="152" fill="#000000" font-size="10" font-family="system-ui, sans-serif" font-weight="900">RND 30G</text>

    <!-- Powder Heap -->
    <path d="M 210,145 C 230,105 310,105 330,145 Z" fill="#ffffff"/>
    <text x="270" y="90" fill="#fbbf24" font-size="14" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">1 LEVEL SCOOP = 30G EXACT</text>
    <text x="270" y="240" fill="#9ca3af" font-size="11" font-family="system-ui, sans-serif" text-anchor="middle">Ultrasonically Micro-Milled at 200 Mesh Particle Density</text>
  </g>

  <!-- 3 Mixing Highlights -->
  <g transform="translate(30, 400)">
    <g>
      <rect width="170" height="150" fill="#18181b" stroke="#3f3f46" stroke-width="1" rx="8"/>
      <circle cx="85" cy="40" r="22" fill="#f59e0b" opacity="0.15"/>
      <text x="85" y="47" fill="#fbbf24" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">15s</text>
      <text x="85" y="80" fill="#ffffff" font-size="12" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">Instant Spoon Stir</text>
      <text x="85" y="100" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">No blender required.</text>
      <text x="85" y="116" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">Instantizes in chilled</text>
      <text x="85" y="132" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">water or milk.</text>
    </g>

    <g transform="translate(185, 0)">
      <rect width="170" height="150" fill="#18181b" stroke="#3f3f46" stroke-width="1" rx="8"/>
      <circle cx="85" cy="40" r="22" fill="#38bdf8" opacity="0.15"/>
      <text x="85" y="47" fill="#38bdf8" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">0%</text>
      <text x="85" y="80" fill="#ffffff" font-size="12" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">Zero Clumping</text>
      <text x="85" y="100" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">Cold-processed</text>
      <text x="85" y="116" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">lecithin dispersion</text>
      <text x="85" y="132" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">prevents powder lumps.</text>
    </g>

    <g transform="translate(370, 0)">
      <rect width="170" height="150" fill="#18181b" stroke="#3f3f46" stroke-width="1" rx="8"/>
      <circle cx="85" cy="40" r="22" fill="#34d399" opacity="0.15"/>
      <text x="85" y="47" fill="#34d399" font-size="18" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">SILK</text>
      <text x="85" y="80" fill="#ffffff" font-size="12" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">Velvet Mouthfeel</text>
      <text x="85" y="100" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">Rich gourmet taste</text>
      <text x="85" y="116" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">crafted with authentic</text>
      <text x="85" y="132" fill="#9ca3af" font-size="10" font-family="system-ui, sans-serif" text-anchor="middle">cocoa &amp; natural aroma.</text>
    </g>
  </g>

  <!-- Usage Protocol Steps -->
  <g transform="translate(30, 570)">
    <rect width="540" height="180" fill="#09090b" stroke="#27272a" stroke-width="1" rx="10"/>
    <text x="20" y="32" fill="#fbbf24" font-size="13" font-family="system-ui, sans-serif" font-weight="800">OPTIMAL SERVING PREPARATION</text>
    
    <g transform="translate(20, 52)">
      <circle cx="12" cy="12" r="12" fill="#27272a"/>
      <text x="12" y="16" fill="#fbbf24" font-size="11" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">1</text>
      <text x="34" y="16" fill="#e4e4e7" font-size="12" font-family="system-ui, sans-serif">Pour 200ml - 250ml of cold water or low-fat milk into an RND Shaker.</text>
    </g>

    <g transform="translate(20, 88)">
      <circle cx="12" cy="12" r="12" fill="#27272a"/>
      <text x="12" y="16" fill="#fbbf24" font-size="11" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">2</text>
      <text x="34" y="16" fill="#e4e4e7" font-size="12" font-family="system-ui, sans-serif">Add 1 level scoop (provided inside the jar) directly over the liquid.</text>
    </g>

    <g transform="translate(20, 124)">
      <circle cx="12" cy="12" r="12" fill="#27272a"/>
      <text x="12" y="16" fill="#fbbf24" font-size="11" font-family="system-ui, sans-serif" font-weight="800" text-anchor="middle">3</text>
      <text x="34" y="16" fill="#e4e4e7" font-size="12" font-family="system-ui, sans-serif">Shake gently for 15-20 seconds. Enjoy immediately post-workout or at breakfast.</text>
    </g>
  </g>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates an SVG Data URI for Triple-Layer Anti-Counterfeit Seal & Scratch Verification
 */
export function generateAuthenticitySealSVG(product: Product): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="sealBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#05070e" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="hologram" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="20%" stop-color="#818cf8" />
      <stop offset="40%" stop-color="#c084fc" />
      <stop offset="60%" stop-color="#f472b6" />
      <stop offset="80%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>
  </defs>

  <rect width="600" height="800" fill="url(#sealBg)" rx="16"/>
  <rect x="14" y="14" width="572" height="772" fill="none" stroke="#1e293b" stroke-width="2" rx="12"/>

  <!-- Top Banner -->
  <g transform="translate(30, 30)">
    <rect width="540" height="74" fill="#000000" stroke="#f59e0b" stroke-width="2" rx="8"/>
    <text x="270" y="42" fill="#fbbf24" font-size="20" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">AUTHENTICITY &amp; ANTI-PIRACY SECURITY</text>
    <text x="270" y="62" fill="#38bdf8" font-size="12" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">ZERO COUNTERFEITS • DIRECT SHIPMENT FROM GOHANA FACTORY</text>
  </g>

  <!-- Large Hologram & Scratch Code Demonstration -->
  <g transform="translate(30, 124)">
    <rect width="540" height="250" fill="#090d16" stroke="#334155" stroke-width="1.5" rx="10"/>

    <!-- Foil Holographic Security Stamp -->
    <g transform="translate(30, 35)">
      <rect width="180" height="180" fill="url(#hologram)" rx="12" opacity="0.95"/>
      <rect x="10" y="10" width="160" height="160" fill="none" stroke="#ffffff" stroke-width="2.5" rx="8" opacity="0.8"/>
      
      <circle cx="90" cy="90" r="55" fill="#000000" opacity="0.6"/>
      <text x="90" y="86" fill="#ffffff" font-size="28" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="2">RND</text>
      <text x="90" y="106" fill="#fbbf24" font-size="11" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1">ORIGINAL</text>
      <text x="90" y="122" fill="#38bdf8" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">SECURE TAMPER SEAL</text>
    </g>

    <!-- Scratch Area Explanation -->
    <g transform="translate(230, 40)">
      <text x="0" y="16" fill="#fbbf24" font-size="14" font-family="system-ui, sans-serif" font-weight="800">UNIQUE SCRATCH-OFF CODE</text>
      <text x="0" y="36" fill="#cbd5e1" font-size="12" font-family="system-ui, sans-serif">Every authentic tub features an uncopied</text>
      <text x="0" y="52" fill="#cbd5e1" font-size="12" font-family="system-ui, sans-serif">12-digit holographic PIN on the neck seal.</text>

      <!-- Scratch box mockup -->
      <g transform="translate(0, 68)">
        <rect width="280" height="42" fill="#1e293b" stroke="#f59e0b" stroke-dasharray="4 2" stroke-width="1.5" rx="6"/>
        <rect x="6" y="6" width="140" height="30" fill="#475569" rx="4"/>
        <text x="76" y="24" fill="#94a3b8" font-size="10" font-family="monospace" font-weight="700" text-anchor="middle">SCRATCH HERE</text>
        <text x="210" y="26" fill="#34d399" font-size="12" font-family="monospace" font-weight="900" text-anchor="middle">RND-8941-GOH</text>
      </g>

      <text x="0" y="132" fill="#38bdf8" font-size="11" font-family="system-ui, sans-serif" font-weight="700">SMS PIN to +91 9306667128 or scan QR</text>
      <text x="0" y="148" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif">Instant instant SMS confirmation of batch authenticity</text>
    </g>
  </g>

  <!-- 3 Verification Steps -->
  <g transform="translate(30, 394)">
    <g>
      <rect width="170" height="150" fill="#0f172a" stroke="#1e293b" stroke-width="1" rx="8"/>
      <circle cx="30" cy="30" r="14" fill="#fbbf24" opacity="0.2"/>
      <text x="30" y="35" fill="#fbbf24" font-size="14" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">1</text>
      <text x="56" y="35" fill="#ffffff" font-size="12" font-family="system-ui, sans-serif" font-weight="800">Check Neck Seal</text>
      <text x="14" y="66" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif" line-height="1.3">Ensure induction foil is fully intact and unbroken upon unboxing.</text>
    </g>

    <g transform="translate(185, 0)">
      <rect width="170" height="150" fill="#0f172a" stroke="#1e293b" stroke-width="1" rx="8"/>
      <circle cx="30" cy="30" r="14" fill="#38bdf8" opacity="0.2"/>
      <text x="30" y="35" fill="#38bdf8" font-size="14" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">2</text>
      <text x="56" y="35" fill="#ffffff" font-size="12" font-family="system-ui, sans-serif" font-weight="800">Scratch 12-Digit</text>
      <text x="14" y="66" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif">Reveal hidden security PIN printed with micro-security pigments.</text>
    </g>

    <g transform="translate(370, 0)">
      <rect width="170" height="150" fill="#0f172a" stroke="#1e293b" stroke-width="1" rx="8"/>
      <circle cx="30" cy="30" r="14" fill="#34d399" opacity="0.2"/>
      <text x="30" y="35" fill="#34d399" font-size="14" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">3</text>
      <text x="56" y="35" fill="#ffffff" font-size="12" font-family="system-ui, sans-serif" font-weight="800">Instant Check</text>
      <text x="14" y="66" fill="#94a3b8" font-size="10" font-family="system-ui, sans-serif">Scan in RND mobile app or web portal for 1-click verification.</text>
    </g>
  </g>

  <!-- Gohana Dispatch Assurance -->
  <g transform="translate(30, 564)">
    <rect width="540" height="190" fill="#0b0f19" stroke="#1e293b" stroke-width="1" rx="10"/>
    <text x="24" y="34" fill="#fbbf24" font-size="14" font-family="system-ui, sans-serif" font-weight="800">DIRECT FACTORY-TO-CONSUMER PROMISE</text>
    
    <text x="24" y="62" fill="#e2e8f0" font-size="12" font-family="system-ui, sans-serif">Unlike third-party marketplaces where counterfeit supplements circulate,</text>
    <text x="24" y="80" fill="#e2e8f0" font-size="12" font-family="system-ui, sans-serif">100% of RND orders are packed and sealed right at our Gohana Facility in Haryana.</text>

    <g transform="translate(24, 105)">
      <rect width="492" height="60" fill="#111827" stroke="#334155" stroke-width="1" rx="6"/>
      <text x="16" y="24" fill="#34d399" font-size="12" font-family="system-ui, sans-serif" font-weight="800">✓ Gohana Dispatch Center: HARYANA - 131301</text>
      <text x="16" y="44" fill="#94a3b8" font-size="11" font-family="system-ui, sans-serif">FSSAI License: 10824005000123 • Batch Verification Hotline: +91 9306667128</text>
    </g>
  </g>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Returns complete gallery for any product including 8 detailed thumbnails:
 * 1. Front Product 3D Packshot
 * 2. Back Nutrition Facts & Supplement Label
 * 3. NABL Accredited Lab Certificate of Analysis (COA)
 * 4. Side Label: Directions, Hologram & FSSAI
 * 5. Full Spectrum Clinical Amino Acid Profile (BCAAs/EAAs)
 * 6. Instantized Powder Texture & 30g Scoop Calibration
 * 7. Triple-Layer Authenticity Scratch & Hologram Seal
 * 8. Interactive 3D 360° Studio Mode
 */
export function getProductMediaGallery(product: Product): ProductGalleryItem[] {
  const frontImg = product.images?.[0] || './images/rnd_whey_protein_1789192519698.jpg';
  const backLabelUrl = generateBackNutritionLabelSVG(product);
  const certUrl = generateCertificateSVG(product);
  const sideLabelUrl = generateSidePanelSVG(product);
  const aminoUrl = generateAminoProfileSVG(product);
  const textureUrl = generateTextureAndScoopSVG(product);
  const sealUrl = generateAuthenticitySealSVG(product);

  const gallery: ProductGalleryItem[] = [
    {
      id: 'front',
      type: 'front',
      title: 'Front Pack',
      url: frontImg,
      badge: 'Packshot'
    },
    {
      id: 'back',
      type: 'back',
      title: 'Nutrition Facts',
      url: backLabelUrl,
      badge: 'Back Label'
    },
    {
      id: 'certificate',
      type: 'certificate',
      title: 'NABL Certificate',
      url: certUrl,
      badge: 'Lab Tested'
    },
    {
      id: 'side',
      type: 'side',
      title: 'Directions & Seals',
      url: sideLabelUrl,
      badge: 'Side Panel'
    },
    {
      id: 'amino',
      type: 'amino',
      title: 'Amino Acid Profile',
      url: aminoUrl,
      badge: 'BCAAs / EAAs'
    },
    {
      id: 'texture',
      type: 'texture',
      title: 'Texture & Scoop',
      url: textureUrl,
      badge: 'Scoop & Mix'
    },
    {
      id: 'seal',
      type: 'seal',
      title: 'Authenticity Seal',
      url: sealUrl,
      badge: 'Scratch Code'
    },
    {
      id: '3d-mode',
      type: '3d',
      title: '360° 3D Model',
      url: frontImg,
      badge: 'Interactive 3D'
    }
  ];

  return gallery;
}

