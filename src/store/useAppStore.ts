import { create } from 'zustand';
import Taro from '@tarojs/taro';
import { Brand } from '@/types/brand';
import { Observation } from '@/types/observation';
import { Conclusion } from '@/types/conclusion';
import { mockBrands } from '@/data/brands';
import { mockObservations } from '@/data/observations';
import { mockConclusions } from '@/data/conclusions';

const STORAGE_KEY = {
  BRANDS: 'brand_research_brands',
  OBSERVATIONS: 'brand_research_observations',
  CONCLUSIONS: 'brand_research_conclusions',
};

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const data = Taro.getStorageSync(key);
    if (data) {
      return JSON.parse(data) as T;
    }
  } catch (e) {
    console.error('[Store] Failed to load from storage', key, e);
  }
  return fallback;
};

interface AppState {
  brands: Brand[];
  observations: Observation[];
  conclusions: Conclusion[];
  addBrand: (brand: Brand) => void;
  addObservation: (observation: Observation) => void;
  addConclusion: (conclusion: Conclusion) => void;
  updateConclusionShared: (id: string, sharedWith: string[], viewedCount: number) => void;
  getBrandById: (id: string) => Brand | undefined;
  getObservationsByBrandId: (brandId: string) => Observation[];
  getObservationsByRegion: (region: string) => Observation[];
}

export const useAppStore = create<AppState>((set, get) => ({
  brands: loadFromStorage<Brand[]>(STORAGE_KEY.BRANDS, mockBrands),
  observations: loadFromStorage<Observation[]>(STORAGE_KEY.OBSERVATIONS, mockObservations),
  conclusions: loadFromStorage<Conclusion[]>(STORAGE_KEY.CONCLUSIONS, mockConclusions),
  addBrand: (brand) => set((state) => ({ brands: [...state.brands, brand] })),
  addObservation: (observation) => set((state) => ({ observations: [...state.observations, observation] })),
  addConclusion: (conclusion) => set((state) => ({ conclusions: [...state.conclusions, conclusion] })),
  updateConclusionShared: (id, sharedWith, viewedCount) => {
    set((state) => ({
      conclusions: state.conclusions.map((c) =>
        c.id === id ? { ...c, sharedWith, viewedCount } : c
      ),
    }));
  },
  getBrandById: (id) => get().brands.find((b) => b.id === id),
  getObservationsByBrandId: (brandId) => get().observations.filter((o) => o.brandId === brandId),
  getObservationsByRegion: (region) => get().observations.filter((o) => o.region === region),
}));
