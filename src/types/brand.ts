export interface Brand {
  id: string;
  name: string;
  logo: string;
  positioning: string;
  priceRange: string;
  mainProducts: string[];
  packagingFeatures: string;
  channels: string[];
  promotionSlogans: string[];
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandFormData {
  name: string;
  positioning: string;
  priceRange: string;
  mainProducts: string[];
  packagingFeatures: string;
  channels: string[];
  promotionSlogans: string[];
  category: string;
}
