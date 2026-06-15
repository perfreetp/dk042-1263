import { create } from 'zustand';
import Taro from '@tarojs/taro';
import { Brand } from '@/types/brand';
import { Observation, ObservationScores } from '@/types/observation';
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
      const parsed = JSON.parse(data) as T;
      if (key === STORAGE_KEY.CONCLUSIONS) {
        (parsed as unknown as Conclusion[]).forEach((c) => {
          if (!c.shareHistory) (c as any).shareHistory = [];
          if (!c.sharedWith) (c as any).sharedWith = [];
        });
      }
      return parsed;
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
  updateConclusionShared: (id: string, sharedWith: string[], viewedCount: number, shareNote?: string, lastSharedAt?: string) => void;
  updatePhotoTag: (observationId: string, photoUrl: string, newTag: string) => void;
  updateObservation: (id: string, patch: Partial<Pick<Observation, 'interviewSummary' | 'userQuotes' | 'notes' | 'scores' | 'photos' | 'storeName' | 'region'>>) => void;
  batchUpdatePhotoTags: (updates: Array<{ observationId: string; photoUrl: string; newTag: string }>) => void;
  getBrandById: (id: string) => Brand | undefined;
  getObservationsByBrandId: (brandId: string) => Observation[];
  getObservationsByRegion: (region: string) => Observation[];
  getObservationById: (id: string) => Observation | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
  brands: loadFromStorage<Brand[]>(STORAGE_KEY.BRANDS, mockBrands),
  observations: loadFromStorage<Observation[]>(STORAGE_KEY.OBSERVATIONS, mockObservations),
  conclusions: loadFromStorage<Conclusion[]>(STORAGE_KEY.CONCLUSIONS, mockConclusions),
  addBrand: (brand) => set((state) => ({ brands: [...state.brands, brand] })),
  addObservation: (observation) => set((state) => ({ observations: [...state.observations, observation] })),
  addConclusion: (conclusion) => set((state) => ({ conclusions: [...state.conclusions, conclusion] })),
  updateConclusionShared: (id, sharedWith, viewedCount, shareNote, lastSharedAt) => {
    set((state) => ({
      conclusions: state.conclusions.map((c) => {
        if (c.id !== id) return c;
        const history = c.shareHistory ?? [];
        const newRecord = lastSharedAt
          ? [{ sharedWith, shareNote, sharedAt: lastSharedAt }, ...history]
          : history;
        return {
          ...c,
          sharedWith,
          viewedCount,
          shareHistory: newRecord,
          ...(shareNote !== undefined ? { shareNote } : {}),
          ...(lastSharedAt !== undefined ? { lastSharedAt } : {}),
        };
      }),
    }));
  },
  updatePhotoTag: (observationId, photoUrl, newTag) => {
    set((state) => ({
      observations: state.observations.map((o) =>
        o.id === observationId
          ? {
              ...o,
              photos: o.photos.map((p) => (p.url === photoUrl ? { ...p, tag: newTag } : p)),
            }
          : o
      ),
    }));
  },
  updateObservation: (id, patch) => {
    set((state) => ({
      observations: state.observations.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  },
  batchUpdatePhotoTags: (updates) => {
    set((state) => {
      const updateMap = new Map<string, Map<string, string>>();
      updates.forEach((u) => {
        if (!updateMap.has(u.observationId)) updateMap.set(u.observationId, new Map());
        updateMap.get(u.observationId)!.set(u.photoUrl, u.newTag);
      });
      return {
        observations: state.observations.map((o) => {
          const photoTagMap = updateMap.get(o.id);
          if (!photoTagMap) return o;
          return {
            ...o,
            photos: o.photos.map((p) =>
              photoTagMap.has(p.url) ? { ...p, tag: photoTagMap.get(p.url)! } : p
            ),
          };
        }),
      };
    });
  },
  getBrandById: (id) => get().brands.find((b) => b.id === id),
  getObservationsByBrandId: (brandId) => get().observations.filter((o) => o.brandId === brandId),
  getObservationsByRegion: (region) => get().observations.filter((o) => o.region === region),
  getObservationById: (id) => get().observations.find((o) => o.id === id),
}));
