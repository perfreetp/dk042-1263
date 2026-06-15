export interface PhotoItem {
  url: string;
  tag: string;
}

export interface ObservationScores {
  sellingPoint: number;
  visual: number;
  serviceExperience: number;
}

export interface Observation {
  id: string;
  brandId: string;
  brandName: string;
  storeName: string;
  region: string;
  photos: PhotoItem[];
  interviewSummary: string;
  userQuotes: string[];
  scores: ObservationScores;
  notes: string;
  createdAt: string;
}
