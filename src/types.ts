export type ProductCategory = 
  | 'Whey Protein'
  | 'Creatine'
  | 'Pre-Workout'
  | 'Mass Gainer'
  | 'Fat Burner'
  | 'Protein Bars'
  | 'Multivitamins';

export type DietaryPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Gluten-Free';
export type FitnessGoal = 'Muscle Building' | 'Fat Loss' | 'Energy & Focus' | 'Mass Gain' | 'Daily Wellness' | 'Endurance';

export interface ProductVariant {
  id: string;
  flavour: string;
  size: string; // e.g. "1 kg (2.2 lbs)", "2 kg (4.4 lbs)", "250 g", "60 Tablets"
  price: number;
  salePrice: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  brand: string;
  description: string;
  shortDescription: string;
  images: string[];
  videoUrl?: string;
  price: number;
  salePrice: number;
  discountPercentage: number;
  sku: string;
  barcode: string;
  stockQuantity: number;
  lowStockThreshold: number;
  flavour: string;
  weightOrPackSize: string;
  servings: number;
  variants: ProductVariant[];
  ingredients: string;
  nutritionalInfo: Record<string, string>; // e.g. { "Protein": "25g", "Calories": "120 kcal", "BCAAs": "5.5g" }
  proteinPerServing: string;
  caloriesPerServing: string;
  recommendedUsage: string;
  preparationInstructions: string;
  productBenefits: string[];
  fitnessGoal: FitnessGoal;
  suitableFor: string;
  dietaryPreference: DietaryPreference;
  allergenInformation: string;
  precautions: string;
  sideEffectsWarning: string;
  storageInstructions: string;
  manufacturingDate: string;
  expiryDate: string;
  batchNumber: string;
  countryOfOrigin: string;
  importerOrMfgDetails: string;
  fssaiLicence: string;
  authenticityInfo: string;
  returnEligibility: string;
  shippingDimensions: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  badge?: string;
  regularPrice?: number;
  nutritionInfo?: Record<string, any>;
  usageInstructions?: string;
  benefits?: string[];
  goal?: string;
}

export type OrderStatus =
  | 'Payment pending'
  | 'Payment verification pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return requested'
  | 'Returned'
  | 'Refund pending'
  | 'Refunded';

export type PaymentMethod = 'UPI QR' | 'Net banking / Card' | 'Cash on delivery';

export interface Address {
  fullName?: string;
  phone?: string;
  email?: string;
  houseBuilding: string;
  streetLocality?: string;
  streetArea?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  deliveryNotes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  flavour: string;
  size: string;
  price: number;
  quantity: number;
  subtotal: number;
  sku: string;
}

export interface Order {
  id: string; // e.g. "RND-2026-8812"
  userId?: string;
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCharge: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Verification Pending' | 'Verified / Paid' | 'Failed' | 'Refunded';
  orderStatus: OrderStatus;
  upiUtr?: string;
  upiPayerName?: string;
  courierName?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  returnReason?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedFlavour: string;
  selectedSize: string;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  date: string;
  helpfulVotes: number;
  isApproved: boolean;
  isDemo?: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  timesUsed: number;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  isFeatured: boolean;
  metaDescription: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface StoreSettings {
  brandName?: string;
  storeName?: string;
  location?: string;
  businessLocation?: string;
  phone: string;
  whatsapp: string;
  email: string;
  upiId: string;
  upiPayeeName: string;
  announcementText?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  freeShippingThreshold: number;
  shippingFee?: number;
  flatShippingRate?: number;
  codEnabled?: boolean;
  gstRate?: number; // e.g. 18%
  fssaiNumberPlaceholder?: string;
  [key: string]: any;
}

export type AppSettings = StoreSettings;

export interface AuthenticityRecord {
  batchNumber: string;
  productName: string;
  mfgDate: string;
  expiryDate: string;
  labTestReportUrl: string;
  proteinContentVerified: string;
  heavyMetalsStatus: 'Passed (Undetected / Within Safe FSSAI Limits)' | 'Passed';
  status: 'Genuine Authentic Product' | 'Counterfeit / Unverified';
}

export interface UserProfile {
  email: string;
  phone?: string;
  fullName: string;
  savedAddresses: Address[];
  wishlist: string[]; // product IDs
}
