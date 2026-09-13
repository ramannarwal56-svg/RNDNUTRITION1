import { GoogleGenAI } from "@google/genai";
import { db } from "./db";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export interface FitGuideRequest {
  goal: string;
  experienceLevel: string;
  budget: string;
  dietaryRestrictions: string;
  preferredFlavours?: string;
  currentSupplements?: string;
  userMessage?: string;
}

export async function generateFitGuideRecommendation(params: FitGuideRequest): Promise<{
  recommendation: string;
  recommendedProductIds: string[];
  disclaimer: string;
  source: 'gemini' | 'rule-based-fallback';
}> {
  const disclaimer = "Food supplements are not medicines. Follow the product label and recommended usage. Consult a qualified healthcare professional before use if you have a medical condition, take medication, are pregnant, or are breastfeeding.";
  
  const catalog = db.getProducts();
  const simplifiedCatalog = catalog.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.salePrice,
    goal: p.fitnessGoal,
    diet: p.dietaryPreference,
    shortDesc: p.shortDescription
  }));

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `
You are "RND Fit Guide", the expert sports nutrition assistant for RND, an authentic gym supplements brand in Gohana, Sonipat, Haryana, India.

User Profile:
- Primary Fitness Goal: ${params.goal || 'General Fitness / Lean Muscle'}
- Experience Level: ${params.experienceLevel || 'Intermediate Gym-Goer'}
- Monthly Budget: ${params.budget || 'Flexible'}
- Dietary Preference / Restrictions: ${params.dietaryRestrictions || 'None'}
- Preferred Flavours: ${params.preferredFlavours || 'Any good flavour'}
- Currently Used Supplements: ${params.currentSupplements || 'None'}
${params.userMessage ? `User Additional Query: "${params.userMessage}"` : ''}

Available RND Product Catalog:
${JSON.stringify(simplifiedCatalog, null, 2)}

Instructions:
1. Provide a friendly, motivating, and science-backed supplement protocol tailored to the user.
2. Select 1 to 3 best matching products from the catalog above.
3. For each recommended product, specify the exact Product ID from the list, why it fits their goal, and when during the day they should consume it (e.g. post-workout, pre-workout, with breakfast).
4. Strictly avoid diagnosing illnesses, prescribing medical treatments, or promising guaranteed magical transformations.
5. Emphasize progressive overload, sound nutrition, and proper hydration (especially if recommending Creatine).
6. Return a structured JSON response matching this format:
{
  "recommendationText": "Detailed explanation with sections: Daily Protocol, Timing & Stacking, Hydration & Diet Tips",
  "recommendedProductIds": ["id1", "id2"]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are RND Fit Guide, a certified sports nutrition consultant for RND supplements. Provide clear, direct, and actionable supplement stacking advice based exclusively on the provided catalog. Never make unsupported medical claims.",
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "";
      const parsed = JSON.parse(responseText.trim());

      return {
        recommendation: parsed.recommendationText || responseText,
        recommendedProductIds: Array.isArray(parsed.recommendedProductIds) ? parsed.recommendedProductIds : ["rnd-whey-isolate", "rnd-creatine-micronized"],
        disclaimer,
        source: 'gemini' as const
      };
    } catch (err) {
      console.warn("Gemini Fit Guide request failed, falling back to expert rule engine:", err);
    }
  }

  // Domain-specific rule-based fallback
  return getFallbackRecommendation(params, catalog, disclaimer);
}

function getFallbackRecommendation(params: FitGuideRequest, catalog: any[], disclaimer: string) {
  const goalLower = (params.goal || '').toLowerCase();
  let recommendedIds: string[] = [];
  let advice = "";

  if (goalLower.includes('fat') || goalLower.includes('weight loss')) {
    recommendedIds = ["rnd-whey-isolate", "rnd-shred-thermo-cut", "rnd-alpha-shield-multivitamin"];
    advice = `### Recommended Fat-Loss & Muscle Preservation Protocol
1. **RND Titanium 100% Whey Isolate:** Take 1 scoop (28g protein) post-workout or in mid-morning smoothies. When in a caloric deficit, high protein intake prevents lean muscle breakdown while keeping satiety high.
2. **RND Shred-X Thermogenic:** Take 1 capsule 30 minutes before your morning cardio or gym workout to ignite caloric expenditure and mobilize stubborn fatty acids without nervous energy.
3. **RND Alpha Shield Multivitamin:** Intense cardio and sweating flush essential electrolytes and micronutrients. 1 tablet after lunch keeps metabolic enzymes firing optimally.

**Nutrition & Hydration Tip:** Maintain a 300-500 calorie deficit and drink at least 3.5 litres of water daily.`;
  } else if (goalLower.includes('mass') || goalLower.includes('gain weight')) {
    recommendedIds = ["rnd-colossus-mass-gainer", "rnd-creatine-micronized", "rnd-alpha-shield-multivitamin"];
    advice = `### Recommended Hardgainer Heavy Bulk Protocol
1. **RND Colossus Mega Mass Gainer:** Consume 1 scoop in the morning and 1 scoop post-workout in 500ml whole milk. Provides clean complex carbohydrates and multi-phase proteins to break through weight plateaus.
2. **RND Micronized Creatine Monohydrate:** Take 3g daily with fruit juice or your gainer shake. Creatine replenishes cellular phosphocreatine for heavier lifting and fuller muscle bellies.
3. **RND Alpha Shield Multivitamin:** Supports metabolic assimilation of surplus calories and bolsters immune defenses.

**Workout Tip:** Focus on compound lifts (squats, deadlifts, presses) with progressive overload.`;
  } else if (goalLower.includes('energy') || goalLower.includes('focus') || goalLower.includes('endurance')) {
    recommendedIds = ["rnd-ignition-preworkout", "rnd-bcaa-amino-recovery", "rnd-creatine-micronized"];
    advice = `### Recommended Peak Performance & Endurance Stack
1. **RND Ignition X Pre-Workout:** Take 1 scoop in cold water 20-30 minutes before heavy lifting for skin-splitting blood flow from 6g L-Citrulline and 300mg clean caffeine drive.
2. **RND Amino Recharge BCAA + Electrolytes:** Sip throughout your workout to prevent intra-set muscle fatigue and replenish sodium-potassium balance.
3. **RND Micronized Creatine:** 3g daily to maximize explosive ATP replenishment between sets.`;
  } else {
    // Default Lean Muscle & Strength
    recommendedIds = ["rnd-whey-isolate", "rnd-creatine-micronized", "rnd-ignition-preworkout"];
    advice = `### Recommended Lean Muscle & Power Foundation Stack
1. **RND Titanium 100% Whey Isolate:** 1 scoop immediately post-workout with chilled water for rapid amino acid delivery to repairing muscle fibres.
2. **RND Micronized Creatine Monohydrate (200 Mesh):** 3g every day (training and non-training days) to saturate muscle cells and increase lift strength by 10-15%.
3. **RND Ignition X Pre-Workout:** 1 scoop 25 minutes prior to training on high-intensity workout days for peak focus and vascularity.

**Consistency Tip:** Take your protein and creatine consistently every single day. Ensure at least 7-8 hours of quality sleep.`;
  }

  return {
    recommendation: advice,
    recommendedProductIds: recommendedIds.filter(id => catalog.some(p => p.id === id)),
    disclaimer,
    source: 'rule-based-fallback' as const
  };
}
