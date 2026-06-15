export interface ComparisonItem {
  brandId: string;
  brandName: string;
  sellingPoint: number;
  visual: number;
  serviceExperience: number;
  priceRange: string;
}

export interface Conclusion {
  id: string;
  title: string;
  content: string;
  brandIds: string[];
  comparisonData: ComparisonItem[];
  createdAt: string;
  sharedWith: string[];
  viewedCount: number;
  shareNote?: string;
  lastSharedAt?: string;
}
