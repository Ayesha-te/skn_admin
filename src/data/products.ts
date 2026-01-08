export interface Product {
  id: string;
  name: string;
  category: string | number;
  category_name?: string;
  price: number;
  description: string;
  details: string;
  image: string;
  images: string[];
  video?: string;
  deliveryCharges?: number;
  featured?: boolean;
  bestseller?: boolean;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  shipping: number;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  };
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  products: string[]; // IDs of products in this collection
}

export const products: Product[] = [
  // Hair Toppers
  {
    id: "topper-silk-base",
    name: "Silk Base Topper",
    category: "Hair Toppers",
    price: 599,
    description: "Our signature 100% virgin unprocessed human hair topper with an invisible silk base for the most natural scalp appearance.",
    details: "5.5\" x 5.5\" base size. Available in 14\", 16\", 18\" lengths. Density: 130%. Can be colored, cut, and styled.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    featured: true,
    bestseller: true,
  },
  {
    id: "topper-lace-front",
    name: "Lace Front Topper",
    category: "Hair Toppers",
    price: 549,
    description: "Premium virgin hair topper with delicate lace front for a seamless, undetectable hairline.",
    details: "6\" x 6\" base size. Available in 12\", 14\", 16\" lengths. Density: 120%. Heat-friendly up to 400°F.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    featured: true,
  },
  {
    id: "topper-mono-base",
    name: "Mono Base Topper",
    category: "Hair Toppers",
    price: 479,
    description: "Breathable monofilament base topper crafted from 100% virgin human hair for all-day comfort.",
    details: "5\" x 5\" base size. Available in 10\", 12\", 14\" lengths. Density: 110%. Lightweight construction.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  // Closures
  {
    id: "closure-4x4",
    name: "4x4 Lace Closure",
    category: "Closures",
    price: 189,
    description: "Premium 4x4 lace closure with pre-plucked hairline and baby hairs for natural styling versatility.",
    details: "4\" x 4\" size. Free, middle, or three-part available. Virgin unprocessed hair. Bleached knots.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    bestseller: true,
  },
  {
    id: "closure-5x5",
    name: "5x5 HD Lace Closure",
    category: "Closures",
    price: 229,
    description: "Invisible HD lace closure that melts seamlessly into any skin tone. 100% virgin hair.",
    details: "5\" x 5\" size. Pre-plucked with baby hairs. Swiss HD lace. Can be dyed and bleached.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  // Extensions
  {
    id: "extensions-clip-in",
    name: "Clip-In Extensions Set",
    category: "Extensions",
    price: 349,
    description: "Full head clip-in extension set featuring 100% virgin unprocessed human hair. Instant length and volume.",
    details: "7-piece set. 120g total weight. Available in 16\", 18\", 20\", 22\" lengths. Seamless wefts.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    featured: true,
  },
  {
    id: "extensions-tape-in",
    name: "Tape-In Extensions",
    category: "Extensions",
    price: 299,
    description: "Professional-grade tape-in extensions with medical-grade adhesive. Virgin human hair.",
    details: "20 pieces per pack. 50g total weight. 4cm tape width. Reusable up to 3 applications.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: "extensions-sew-in",
    name: "Sew-In Weft Bundle",
    category: "Extensions",
    price: 179,
    description: "Premium virgin hair weft bundle for sew-in installations. Thick from top to bottom.",
    details: "100g per bundle. Double-drawn wefts. No shedding, no tangling. Raw virgin hair.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  // Ponytails
  {
    id: "ponytail-wrap",
    name: "Wrap-Around Ponytail",
    category: "Ponytails",
    price: 199,
    description: "Luxurious wrap-around ponytail extension in 100% virgin human hair. Effortless elegance.",
    details: "22\" length. 120g weight. Velcro + wrap attachment. Heat-safe styling.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    bestseller: true,
  },
  {
    id: "ponytail-drawstring",
    name: "Drawstring Ponytail",
    category: "Ponytails",
    price: 179,
    description: "Quick-apply drawstring ponytail with adjustable comb clips. Virgin unprocessed hair.",
    details: "20\" length. 100g weight. Drawstring + comb attachment. Natural wave texture.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  // Hair Care Products
  {
    id: "shampoo-hydrating",
    name: "Hydrating Shampoo",
    category: "Hair Care",
    price: 38,
    description: "Gentle sulfate-free shampoo formulated specifically for virgin and processed human hair extensions.",
    details: "300ml / 10.1 fl oz. pH balanced. Sulfate-free, paraben-free. Extends hair longevity.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: "conditioner-repair",
    name: "Repair Conditioner",
    category: "Hair Care",
    price: 42,
    description: "Deep conditioning treatment that restores moisture and shine to human hair extensions.",
    details: "300ml / 10.1 fl oz. Keratin-infused formula. Prevents dryness and tangling.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: "shine-spray",
    name: "Hair Shine Spray",
    category: "Hair Care",
    price: 28,
    description: "Lightweight finishing spray that adds brilliant shine without weighing hair down.",
    details: "150ml / 5 fl oz. Non-greasy formula. UV protection. Heat protection up to 450°F.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    featured: true,
  },
  {
    id: "leave-in-treatment",
    name: "Leave-In Treatment",
    category: "Hair Care",
    price: 45,
    description: "Nourishing leave-in treatment that detangles, protects, and revitalizes hair extensions.",
    details: "200ml / 6.7 fl oz. Argan oil enriched. Heat protection. Anti-frizz formula.",
    image: "/placeholder.svg",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
];

export const categories = [
  "All",
  "Hair Toppers",
  "Closures",
  "Extensions",
  "Ponytails",
  "Hair Care",
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "All") return products;
  return products.filter((product) => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getBestsellers = (): Product[] => {
  return products.filter((product) => product.bestseller);
};
