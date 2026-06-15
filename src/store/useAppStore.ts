import { create } from 'zustand';
import { Brand } from '@/types/brand';
import { Observation } from '@/types/observation';
import { Conclusion } from '@/types/conclusion';
import { mockBrands } from '@/data/brands';
import { mockObservations } from '@/data/observations';
import { mockConclusions } from '@/data/conclusions';

interface AppState {
  brands: Brand[];
  observations: Observation[];
  conclusions: Conclusion[];
  addBrand: (brand: Brand) => void;
  addObservation: (observation: Observation) => void;
  addConclusion: (conclusion: Conclusion) => void;
  getBrandById: (id: string) => Brand | undefined;
  getObservationsByBrandId: (brandId: string) => Observation[];
  getObservationsByRegion: (region: string) => Observation[];
}

export const useAppStore = create<AppState>((set, get) => ({
  brands: mockBrands,
  observations: mockObservations,
  conclusions: mockConclusions,
  addBrand: (brand) => set((state) => ({ brands: [...state.brands, brand] })),
  addObservation: (observation) => set((state) => ({ observations: [...state.observations, observation] })),
  addConclusion: (conclusion) => set((state) => ({ conclusions: [...state.conclusions, conclusion] })),
  getBrandById: (id) => get().brands.find((b) => b.id === id),
  getObservationsByBrandId: (brandId) => get().observations.filter((o) => o.brandId === brandId),
  getObservationsByRegion: (region) => get().observations.filter((o) => o.region === region),
}));
