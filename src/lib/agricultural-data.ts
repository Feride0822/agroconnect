export interface Region {
  id: string;
  name: string;
  coordinates: [number, number];
  population: number;
  agriculturalArea: number; // in hectares
}

export interface Product {
  id: string;
  name: string;
  category: "grains" | "fruits" | "vegetables" | "cotton" | "livestock";
  unit: string;
  currentPrice: number; // USD per unit
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
}

export interface ProductVolume {
  regionId: string;
  productId: string;
  volume: number;
  month: string;
  year: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "farmer" | "exporter" | "analyst";
  region: string;
  verified: boolean;
}

// Uzbekistan regions data
export const regions: Region[] = [
  {
    id: "tashkent",
    name: "Tashkent",
    coordinates: [69.2401, 41.2995],
    population: 2700000,
    agriculturalArea: 450000,
  },
  {
    id: "samarkand",
    name: "Samarkand",
    coordinates: [66.9597, 39.627],
    population: 3800000,
    agriculturalArea: 680000,
  },
  {
    id: "bukhara",
    name: "Bukhara",
    coordinates: [64.4207, 39.7675],
    population: 1900000,
    agriculturalArea: 520000,
  },
  {
    id: "andijan",
    name: "Andijan",
    coordinates: [72.3442, 40.7821],
    population: 3100000,
    agriculturalArea: 420000,
  },
  {
    id: "fergana",
    name: "Fergana",
    coordinates: [71.7864, 40.3842],
    population: 3700000,
    agriculturalArea: 580000,
  },
  {
    id: "namangan",
    name: "Namangan",
    coordinates: [71.6726, 41.0015],
    population: 2900000,
    agriculturalArea: 380000,
  },
  {
    id: "kashkadarya",
    name: "Kashkadarya",
    coordinates: [65.7894, 38.8597],
    population: 3200000,
    agriculturalArea: 780000,
  },
  {
    id: "surkhandarya",
    name: "Surkhandarya",
    coordinates: [67.5563, 37.9403],
    population: 2600000,
    agriculturalArea: 620000,
  },
];

// Agricultural products data
export const products: Product[] = [
  {
    id: "wheat",
    name: "Wheat",
    category: "grains",
    unit: "ton",
    currentPrice: 280,
    priceHistory: [
      { date: "2024-01", price: 250 },
      { date: "2024-02", price: 265 },
      { date: "2024-03", price: 275 },
      { date: "2024-04", price: 280 },
    ],
  },
  {
    id: "cotton",
    name: "Cotton",
    category: "cotton",
    unit: "ton",
    currentPrice: 1850,
    priceHistory: [
      { date: "2024-01", price: 1800 },
      { date: "2024-02", price: 1820 },
      { date: "2024-03", price: 1840 },
      { date: "2024-04", price: 1850 },
    ],
  },
  {
    id: "apple",
    name: "Apples",
    category: "fruits",
    unit: "ton",
    currentPrice: 650,
    priceHistory: [
      { date: "2024-01", price: 600 },
      { date: "2024-02", price: 620 },
      { date: "2024-03", price: 640 },
      { date: "2024-04", price: 650 },
    ],
  },
  {
    id: "tomato",
    name: "Tomatoes",
    category: "vegetables",
    unit: "ton",
    currentPrice: 420,
    priceHistory: [
      { date: "2024-01", price: 380 },
      { date: "2024-02", price: 400 },
      { date: "2024-03", price: 410 },
      { date: "2024-04", price: 420 },
    ],
  },
  {
    id: "grapes",
    name: "Grapes",
    category: "fruits",
    unit: "ton",
    currentPrice: 750,
    priceHistory: [
      { date: "2024-01", price: 700 },
      { date: "2024-02", price: 720 },
      { date: "2024-03", price: 735 },
      { date: "2024-04", price: 750 },
    ],
  },
];

// Sample volume data
export const generateVolumeData = (): ProductVolume[] => {
  const data: ProductVolume[] = [];
  const months = ["January", "February", "March", "April"];

  regions.forEach((region) => {
    products.forEach((product) => {
      months.forEach((month, index) => {
        data.push({
          regionId: region.id,
          productId: product.id,
          volume: Math.floor(Math.random() * 5000) + 1000,
          month,
          year: 2024,
        });
      });
    });
  });

  return data;
};

export const volumeData = generateVolumeData();

// Helper functions
export const getRegionById = (id: string): Region | undefined =>
  regions.find((region) => region.id === id);

export const getProductById = (id: string): Product | undefined =>
  products.find((product) => product.id === id);

export const getVolumeByRegion = (regionId: string): ProductVolume[] =>
  volumeData.filter((volume) => volume.regionId === regionId);

export const getVolumeByProduct = (productId: string): ProductVolume[] =>
  volumeData.filter((volume) => volume.productId === productId);

export const getTotalVolumeByRegion = (regionId: string): number =>
  getVolumeByRegion(regionId).reduce((sum, volume) => sum + volume.volume, 0);

export const getPriceStability = (productId: string): number => {
  const product = getProductById(productId);
  if (!product || product.priceHistory.length < 2) return 0;

  const prices = product.priceHistory.map((p) => p.price);
  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const variance =
    prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) /
    prices.length;
  const stability = Math.max(0, 100 - (Math.sqrt(variance) / avg) * 100);

  return Math.round(stability);
};
