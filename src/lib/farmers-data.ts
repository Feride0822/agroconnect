import { regions } from "./agricultural-data";

export interface FarmerProduct {
  id: string;
  name: string;
  category: "grains" | "fruits" | "vegetables" | "cotton" | "livestock";
  amount: number; // in tons
  unit: string;
  area: number; // in hectares
  pricePerUnit: number; // USD per unit
  totalValue: number; // USD
  harvestDate: string;
  qualityGrade: "A" | "B" | "C";
  organic: boolean;
  available: boolean;
}

export interface Farmer {
  id: string;
  name: string;
  profileImage?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  telegram?: string;
  address: string;
  regionId: string;
  farmName: string;
  farmSize: number; // in hectares
  experience: number; // years
  specialization: string[];
  verified: boolean;
  rating: number;
  totalTransactions: number;
  joinDate: string;
  languages: string[];
  products: FarmerProduct[];
  description: string;
  certifications: string[];
}

// Sample farmers data
export const farmers: Farmer[] = [
  {
    id: "farmer-001",
    name: "Akmal Karimov",
    email: "akmal.karimov@agroconnect.uz",
    phone: "+998 90 123 45 67",
    whatsapp: "+998 90 123 45 67",
    telegram: "@akmal_farmer",
    address: "Qibray District, Tashkent Region",
    regionId: "tashkent",
    farmName: "Karimov Organic Farm",
    farmSize: 85,
    experience: 12,
    specialization: [
      "Organic Farming",
      "Grain Production",
      "Sustainable Agriculture",
    ],
    verified: true,
    rating: 4.8,
    totalTransactions: 45,
    joinDate: "2022-03-15",
    languages: ["Uzbek", "Russian", "English"],
    description:
      "Experienced organic farmer specializing in wheat and barley production. Committed to sustainable farming practices and high-quality organic produce.",
    certifications: [
      "Organic Certification",
      "ISO 9001",
      "Good Agricultural Practices",
    ],
    products: [
      {
        id: "prod-001",
        name: "Organic Wheat",
        category: "grains",
        amount: 250,
        unit: "tons",
        area: 35,
        pricePerUnit: 320,
        totalValue: 80000,
        harvestDate: "2024-04-10",
        qualityGrade: "A",
        organic: true,
        available: true,
      },
      {
        id: "prod-002",
        name: "Premium Barley",
        category: "grains",
        amount: 180,
        unit: "tons",
        area: 28,
        pricePerUnit: 280,
        totalValue: 50400,
        harvestDate: "2024-04-05",
        qualityGrade: "A",
        organic: true,
        available: true,
      },
    ],
  },
  {
    id: "farmer-002",
    name: "Dilnoza Rashidova",
    email: "dilnoza.rashidova@agroconnect.uz",
    phone: "+998 91 234 56 78",
    whatsapp: "+998 91 234 56 78",
    address: "Oltiariq District, Fergana Region",
    regionId: "fergana",
    farmName: "Sunny Valley Cotton Farm",
    farmSize: 120,
    experience: 8,
    specialization: [
      "Cotton Production",
      "Modern Irrigation",
      "Precision Agriculture",
    ],
    verified: true,
    rating: 4.9,
    totalTransactions: 32,
    joinDate: "2023-01-20",
    languages: ["Uzbek", "Russian"],
    description:
      "Modern cotton farmer using advanced irrigation techniques and precision agriculture to maximize yield and quality.",
    certifications: [
      "Cotton Quality Certification",
      "Water Management Certification",
    ],
    products: [
      {
        id: "prod-003",
        name: "High-Grade Cotton",
        category: "cotton",
        amount: 95,
        unit: "tons",
        area: 42,
        pricePerUnit: 1950,
        totalValue: 185250,
        harvestDate: "2024-03-25",
        qualityGrade: "A",
        organic: false,
        available: true,
      },
    ],
  },
  {
    id: "farmer-003",
    name: "Bobur Yusupov",
    email: "bobur.yusupov@agroconnect.uz",
    phone: "+998 93 345 67 89",
    telegram: "@bobur_fruits",
    address: "Payariq District, Samarkand Region",
    regionId: "samarkand",
    farmName: "Golden Orchard",
    farmSize: 45,
    experience: 15,
    specialization: [
      "Fruit Production",
      "Apple Varieties",
      "Post-Harvest Processing",
    ],
    verified: true,
    rating: 4.7,
    totalTransactions: 67,
    joinDate: "2021-09-10",
    languages: ["Uzbek", "English"],
    description:
      "Third-generation fruit farmer specializing in premium apple varieties. Expert in post-harvest processing and packaging.",
    certifications: ["Fruit Quality Standards", "Export Certification"],
    products: [
      {
        id: "prod-004",
        name: "Red Delicious Apples",
        category: "fruits",
        amount: 75,
        unit: "tons",
        area: 18,
        pricePerUnit: 680,
        totalValue: 51000,
        harvestDate: "2024-04-01",
        qualityGrade: "A",
        organic: false,
        available: true,
      },
      {
        id: "prod-005",
        name: "Golden Apples",
        category: "fruits",
        amount: 60,
        unit: "tons",
        area: 15,
        pricePerUnit: 720,
        totalValue: 43200,
        harvestDate: "2024-03-28",
        qualityGrade: "A",
        organic: false,
        available: true,
      },
    ],
  },
  {
    id: "farmer-004",
    name: "Madina Azimova",
    email: "madina.azimova@agroconnect.uz",
    phone: "+998 94 456 78 90",
    whatsapp: "+998 94 456 78 90",
    address: "Gurlan District, Khorezm Region",
    regionId: "kashkadarya",
    farmName: "Fresh Garden Vegetables",
    farmSize: 25,
    experience: 6,
    specialization: [
      "Vegetable Production",
      "Greenhouse Farming",
      "Year-round Cultivation",
    ],
    verified: true,
    rating: 4.6,
    totalTransactions: 28,
    joinDate: "2023-05-12",
    languages: ["Uzbek", "Russian"],
    description:
      "Young innovative farmer focusing on vegetable production using modern greenhouse techniques for year-round cultivation.",
    certifications: ["Greenhouse Management", "Vegetable Quality Standards"],
    products: [
      {
        id: "prod-006",
        name: "Fresh Tomatoes",
        category: "vegetables",
        amount: 40,
        unit: "tons",
        area: 8,
        pricePerUnit: 450,
        totalValue: 18000,
        harvestDate: "2024-04-12",
        qualityGrade: "A",
        organic: true,
        available: true,
      },
      {
        id: "prod-007",
        name: "Bell Peppers",
        category: "vegetables",
        amount: 25,
        unit: "tons",
        area: 6,
        pricePerUnit: 520,
        totalValue: 13000,
        harvestDate: "2024-04-08",
        qualityGrade: "B",
        organic: true,
        available: true,
      },
    ],
  },
  {
    id: "farmer-005",
    name: "Rustam Nazarov",
    email: "rustam.nazarov@agroconnect.uz",
    phone: "+998 95 567 89 01",
    telegram: "@rustam_grapes",
    address: "Zaamin District, Jizzakh Region",
    regionId: "fergana",
    farmName: "Vineyard Paradise",
    farmSize: 35,
    experience: 20,
    specialization: ["Grape Production", "Wine Making", "Dried Fruits"],
    verified: true,
    rating: 4.9,
    totalTransactions: 55,
    joinDate: "2020-11-08",
    languages: ["Uzbek", "Russian", "Turkish"],
    description:
      "Veteran grape farmer with two decades of experience. Specializes in table grapes and wine production with traditional methods.",
    certifications: [
      "Wine Production License",
      "Grape Quality Certification",
      "Export Standards",
    ],
    products: [
      {
        id: "prod-008",
        name: "Premium Table Grapes",
        category: "fruits",
        amount: 85,
        unit: "tons",
        area: 22,
        pricePerUnit: 800,
        totalValue: 68000,
        harvestDate: "2024-03-20",
        qualityGrade: "A",
        organic: false,
        available: true,
      },
      {
        id: "prod-009",
        name: "Wine Grapes",
        category: "fruits",
        amount: 45,
        unit: "tons",
        area: 13,
        pricePerUnit: 650,
        totalValue: 29250,
        harvestDate: "2024-03-15",
        qualityGrade: "A",
        organic: false,
        available: false,
      },
    ],
  },
  {
    id: "farmer-006",
    name: "Nargiza Sultanova",
    email: "nargiza.sultanova@agroconnect.uz",
    phone: "+998 96 678 90 12",
    whatsapp: "+998 96 678 90 12",
    address: "Denau District, Surkhandarya Region",
    regionId: "surkhandarya",
    farmName: "Organic Cotton Fields",
    farmSize: 200,
    experience: 10,
    specialization: [
      "Organic Cotton",
      "Sustainable Farming",
      "Soil Management",
    ],
    verified: true,
    rating: 4.8,
    totalTransactions: 38,
    joinDate: "2022-07-22",
    languages: ["Uzbek", "English"],
    description:
      "Large-scale organic cotton producer committed to sustainable farming practices and environmental conservation.",
    certifications: [
      "Organic Cotton Certification",
      "GOTS Certification",
      "Fair Trade",
    ],
    products: [
      {
        id: "prod-010",
        name: "Organic Cotton",
        category: "cotton",
        amount: 150,
        unit: "tons",
        area: 85,
        pricePerUnit: 2100,
        totalValue: 315000,
        harvestDate: "2024-03-30",
        qualityGrade: "A",
        organic: true,
        available: true,
      },
    ],
  },
];

// Helper functions
export const getFarmerById = (id: string): Farmer | undefined =>
  farmers.find((farmer) => farmer.id === id);

export const getFarmersByRegion = (regionId: string): Farmer[] =>
  farmers.filter((farmer) => farmer.regionId === regionId);

export const getFarmersBySpecialization = (specialization: string): Farmer[] =>
  farmers.filter((farmer) =>
    farmer.specialization.some((spec) =>
      spec.toLowerCase().includes(specialization.toLowerCase()),
    ),
  );

export const getFarmersByProduct = (productCategory: string): Farmer[] =>
  farmers.filter((farmer) =>
    farmer.products.some((product) => product.category === productCategory),
  );

export const getAvailableProducts = (): FarmerProduct[] => {
  return farmers.flatMap((farmer) =>
    farmer.products
      .filter((product) => product.available)
      .map((product) => ({
        ...product,
        farmerId: farmer.id,
        farmerName: farmer.name,
      })),
  );
};

export const getTotalFarmValue = (farmer: Farmer): number =>
  farmer.products.reduce((sum, product) => sum + product.totalValue, 0);

export const getTotalProductArea = (farmer: Farmer): number =>
  farmer.products.reduce((sum, product) => sum + product.area, 0);

export const getAverageYieldPerHectare = (farmer: Farmer): number => {
  const totalArea = getTotalProductArea(farmer);
  const totalProduction = farmer.products.reduce(
    (sum, product) => sum + product.amount,
    0,
  );
  return totalArea > 0 ? totalProduction / totalArea : 0;
};

export const getRegionName = (regionId: string): string => {
  const region = regions.find((r) => r.id === regionId);
  return region?.name || "Unknown Region";
};
