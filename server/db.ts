import fs from 'fs';
import path from 'path';
import { 
  Product, 
  Order, 
  Coupon, 
  BlogPost, 
  StoreSettings, 
  AuthenticityRecord, 
  Review, 
  UserProfile 
} from '../src/types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SETTINGS, 
  INITIAL_COUPONS, 
  INITIAL_BLOGS, 
  INITIAL_FAQS, 
  INITIAL_AUTHENTICITY_RECORDS, 
  INITIAL_DEMO_REVIEWS, 
  INITIAL_DEMO_ORDERS 
} from './data/initialData';

interface DbSchema {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  blogs: BlogPost[];
  faqs: typeof INITIAL_FAQS;
  settings: StoreSettings;
  authenticityRecords: AuthenticityRecord[];
  reviews: Review[];
  users: Record<string, UserProfile>;
}

// In-memory OTP session map
export interface OtpSession {
  email: string;
  otp: string;
  expiresAt: number; // timestamp
  lastSentAt: number;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'rnd_store.json');

let inMemoryDb: DbSchema | null = null;
const otpSessions = new Map<string, OtpSession>();

function ensureDbLoaded(): DbSchema {
  if (inMemoryDb) return inMemoryDb;

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(data) as DbSchema;

      // Sync commercial studio photography with consistent metallic gold RND logo
      const RND_STUDIO_IMAGES: Record<string, string[]> = {
        "rnd-whey-isolate": ["./images/rnd_whey_iso_1789227825582.jpg", "./images/rnd_hero_banner_1789192600800.jpg"],
        "rnd-gold-whey-blend": ["./images/rnd_whey_iso_1789227825582.jpg"],
        "rnd-raw-whey-80": ["./images/rnd_whey_iso_1789227825582.jpg"],
        "rnd-creatine-micronized": ["./images/rnd_creatine_jar_1789227844026.jpg"],
        "rnd-creatine-hcl": ["./images/rnd_creatine_jar_1789227844026.jpg"],
        "rnd-ignition-preworkout": ["./images/rnd_preworkout_mock_1789227867221.jpg"],
        "rnd-stim-free-pump": ["./images/rnd_preworkout_mock_1789227867221.jpg"],
        "rnd-colossus-mass-gainer": ["./images/rnd_mass_tub_1789227882336.jpg"],
        "rnd-mass-gainer-anabolic": ["./images/rnd_mass_tub_1789227882336.jpg", "./images/rnd_hero_banner_1789192600800.jpg"],
        "rnd-lean-gainer-matrix": ["./images/rnd_mass_tub_1789227882336.jpg"],
        "rnd-mass-lean-gainer": ["./images/rnd_mass_tub_1789227882336.jpg"],
        "rnd-shred-thermo-cut": ["./images/rnd_multivit_bot_1789227901192.jpg"],
        "rnd-fatburner-shred-thermo": ["./images/rnd_multivit_bot_1789227901192.jpg"],
        "rnd-pro-crunch-bar-box": ["./images/rnd_protein_bars_1789192576924.jpg"],
        "rnd-protein-bars-box": ["./images/rnd_protein_bars_1789192576924.jpg"],
        "rnd-multivitamin-elite": ["./images/rnd_multivit_bot_1789227901192.jpg"],
        "rnd-bcaa-amino-recovery": ["./images/rnd_preworkout_mock_1789227867221.jpg"]
      };

      const EXCLUDED_PRODUCT_IDS = new Set([
        "rnd-liquid-carnitine-3000",
        "rnd-keto-protein-bar",
        "rnd-omega-3-triple-strength"
      ]);

      if (inMemoryDb.products) {
        inMemoryDb.products = inMemoryDb.products.filter(p => !EXCLUDED_PRODUCT_IDS.has(p.id));
        for (const p of inMemoryDb.products) {
          p.isNewArrival = false;
          if (RND_STUDIO_IMAGES[p.id]) {
            p.images = RND_STUDIO_IMAGES[p.id];
          }
        }
      }

      // Merge initial authenticity records if missing
      if (!inMemoryDb.authenticityRecords) {
        inMemoryDb.authenticityRecords = [...INITIAL_AUTHENTICITY_RECORDS];
      } else {
        for (const rec of INITIAL_AUTHENTICITY_RECORDS) {
          if (!inMemoryDb.authenticityRecords.some(r => r.batchNumber.toUpperCase().trim() === rec.batchNumber.toUpperCase().trim())) {
            inMemoryDb.authenticityRecords.push(rec);
          }
        }
      }
      persistDb();
      return inMemoryDb;
    }
  } catch (err) {
    console.warn("Could not read db file from disk, using fallback initial data:", err);
  }

  // Fallback initial data
  inMemoryDb = {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_DEMO_ORDERS,
    coupons: INITIAL_COUPONS,
    blogs: INITIAL_BLOGS,
    faqs: INITIAL_FAQS,
    settings: INITIAL_SETTINGS,
    authenticityRecords: INITIAL_AUTHENTICITY_RECORDS,
    reviews: INITIAL_DEMO_REVIEWS,
    users: {
      "ramannarwal56@gmail.com": {
        email: "ramannarwal56@gmail.com",
        phone: "9306667128",
        fullName: "Raman Narwal",
        savedAddresses: [INITIAL_DEMO_ORDERS[0].shippingAddress],
        wishlist: ["rnd-whey-isolate", "rnd-creatine-micronized"]
      }
    }
  };

  persistDb();
  return inMemoryDb;
}

function persistDb() {
  if (!inMemoryDb) return;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to write db file:", err);
  }
}

export const db = {
  // Products
  getProducts(): Product[] {
    return ensureDbLoaded().products;
  },
  getProductById(id: string): Product | undefined {
    return ensureDbLoaded().products.find(p => p.id === id);
  },
  getProductBySlug(slug: string): Product | undefined {
    return ensureDbLoaded().products.find(p => p.slug === slug || p.id === slug);
  },
  saveProduct(product: Product): Product {
    const data = ensureDbLoaded();
    const idx = data.products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      data.products[idx] = product;
    } else {
      data.products.unshift(product);
    }
    persistDb();
    return product;
  },
  deleteProduct(id: string): boolean {
    const data = ensureDbLoaded();
    const initialLen = data.products.length;
    data.products = data.products.filter(p => p.id !== id);
    if (data.products.length !== initialLen) {
      persistDb();
      return true;
    }
    return false;
  },
  adjustStock(productId: string, newStock: number): Product | undefined {
    const data = ensureDbLoaded();
    const prod = data.products.find(p => p.id === productId);
    if (prod) {
      prod.stockQuantity = newStock;
      persistDb();
    }
    return prod;
  },

  // Orders
  getOrders(): Order[] {
    return ensureDbLoaded().orders;
  },
  getOrderById(id: string): Order | undefined {
    return ensureDbLoaded().orders.find(o => o.id.toUpperCase() === id.toUpperCase());
  },
  getOrdersByPhone(phone: string): Order[] {
    const clean = phone.replace(/\D/g, '').slice(-10);
    return ensureDbLoaded().orders.filter(o => o.phone.replace(/\D/g, '').slice(-10) === clean);
  },
  saveOrder(order: Order): Order {
    const data = ensureDbLoaded();
    const idx = data.orders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      data.orders[idx] = order;
    } else {
      data.orders.unshift(order);
    }
    persistDb();
    return order;
  },

  // Coupons
  getCoupons(): Coupon[] {
    return ensureDbLoaded().coupons;
  },
  getCouponByCode(code: string): Coupon | undefined {
    return ensureDbLoaded().coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
  },
  saveCoupon(coupon: Coupon): Coupon {
    const data = ensureDbLoaded();
    const idx = data.coupons.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (idx >= 0) {
      data.coupons[idx] = coupon;
    } else {
      data.coupons.push(coupon);
    }
    persistDb();
    return coupon;
  },

  // Settings
  getSettings(): StoreSettings {
    return ensureDbLoaded().settings;
  },
  updateSettings(newSettings: Partial<StoreSettings>): StoreSettings {
    const data = ensureDbLoaded();
    data.settings = { ...data.settings, ...newSettings };
    persistDb();
    return data.settings;
  },

  // Reviews
  getReviews(productId?: string): Review[] {
    const list = ensureDbLoaded().reviews;
    if (productId) {
      return list.filter(r => r.productId === productId);
    }
    return list;
  },
  addReview(review: Review): Review {
    const data = ensureDbLoaded();
    data.reviews.unshift(review);
    // update product rating average
    const productReviews = data.reviews.filter(r => r.productId === review.productId && r.isApproved);
    const prod = data.products.find(p => p.id === review.productId);
    if (prod && productReviews.length > 0) {
      const avg = productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = productReviews.length;
    }
    persistDb();
    return review;
  },
  updateReview(review: Review): Review {
    const data = ensureDbLoaded();
    const idx = data.reviews.findIndex(r => r.id === review.id);
    if (idx >= 0) {
      data.reviews[idx] = review;
      persistDb();
    }
    return review;
  },
  deleteReview(id: string): boolean {
    const data = ensureDbLoaded();
    data.reviews = data.reviews.filter(r => r.id !== id);
    persistDb();
    return true;
  },

  // Blogs
  getBlogs(): BlogPost[] {
    return ensureDbLoaded().blogs;
  },
  getBlogBySlug(slug: string): BlogPost | undefined {
    return ensureDbLoaded().blogs.find(b => b.slug === slug || b.id === slug);
  },
  saveBlog(blog: BlogPost): BlogPost {
    const data = ensureDbLoaded();
    const idx = data.blogs.findIndex(b => b.id === blog.id);
    if (idx >= 0) {
      data.blogs[idx] = blog;
    } else {
      data.blogs.unshift(blog);
    }
    persistDb();
    return blog;
  },

  // Authenticity
  verifyBatch(batchNumber: string): AuthenticityRecord | undefined {
    const clean = batchNumber.toUpperCase().trim();
    return ensureDbLoaded().authenticityRecords.find(b => b.batchNumber.toUpperCase().trim() === clean);
  },
  getAuthenticityRecords(): AuthenticityRecord[] {
    return ensureDbLoaded().authenticityRecords;
  },

  // Users
  getUserByEmail(email: string): UserProfile | undefined {
    const clean = email.toLowerCase().trim();
    return ensureDbLoaded().users[clean];
  },

  saveUser(user: UserProfile): UserProfile {
    const data = ensureDbLoaded();
    const clean = user.email.toLowerCase().trim();
    data.users[clean] = user;
    persistDb();
    return user;
  },

  // OTP Management
  generateOtp(email: string): { otp: string; cooldownRemaining: number; success: boolean; message: string } {
    const clean = email.toLowerCase().trim();
    const now = Date.now();
    const existing = otpSessions.get(clean);

    // Rate limiting: 60s cooldown
    if (existing && (now - existing.lastSentAt) < 60000) {
      const remaining = Math.ceil((60000 - (now - existing.lastSentAt)) / 1000);
      return {
        otp: existing.otp,
        cooldownRemaining: remaining,
        success: false,
        message: `Please wait ${remaining} seconds before requesting a new OTP.`
      };
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpSessions.set(clean, {
      email: clean,
      otp,
      expiresAt: now + 5 * 60 * 1000, // 5 minutes
      lastSentAt: now
    });

    return {
      otp,
      cooldownRemaining: 60,
      success: true,
      message: `OTP sent successfully to ${clean}.`
    };
  },

  verifyOtp(email: string, enteredOtp: string): { valid: boolean; message: string; user?: UserProfile } {
    const clean = email.toLowerCase().trim();
    const session = otpSessions.get(clean);

    // Development/demo bypass or test email convenience:
    // If entered OTP matches generated or master test OTP '123456' for demo speed
    const isMasterTest = enteredOtp.trim() === '123456';
    const isSessionMatch = session && session.otp === enteredOtp.trim() && Date.now() < session.expiresAt;

    if (!isMasterTest && !isSessionMatch) {
      if (session && Date.now() >= session.expiresAt) {
        return { valid: false, message: "OTP has expired. Please request a new one." };
      }
      return { valid: false, message: "Invalid OTP. Please check the code." };
    }

    // Clear session once used
    otpSessions.delete(clean);

    // Ensure user profile exists
    let user = this.getUserByEmail(clean);
    if (!user) {
      user = {
        email: clean,
        fullName: clean === 'ramannarwal56@gmail.com' ? 'Raman Narwal' : `Customer (${clean.split('@')[0]})`,
        savedAddresses: [],
        wishlist: []
      };
      this.saveUser(user);
    }

    return { valid: true, message: "Verification successful.", user };
  }
};
