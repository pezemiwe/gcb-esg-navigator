import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Asset {
  id: string;
  facilityId?: string;
  borrowerName?: string;
  sector: string;
  region: string;
  outstandingBalance?: number;
  currency?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  [key: string]: unknown;
}

export interface AssetTypeData {
  type: string;
  data: Asset[];
  uploadedAt: string | null;
  fileName: string | null;
  rowCount: number;
  columnCount: number;
  validationStatus: "pending" | "validated" | "error";
  validationErrors: string[];
}

interface CRADataState {
  assets: Record<string, AssetTypeData>;
  uploadStatus: {
    loading: boolean;
    errors: string[];
    lastUploadAt: string | null;
  };
  setAssetData: (assetType: string, data: AssetTypeData) => void;
  clearAssetData: (assetType: string) => void;
  getAssetData: (assetType: string) => AssetTypeData | null;
}

interface CRAStatusState {
  dataUploaded: boolean;
  segmentationReady: boolean;
  praReady: boolean;
  traReady: boolean;
  updateStatus: (
    key: keyof Omit<
      CRAStatusState,
      "updateStatus" | "setPRAReady" | "setTRAReady"
    >,
    value: boolean,
  ) => void;
  setPRAReady: (value: boolean) => void;
  setTRAReady: (value: boolean) => void;
}

interface SegmentationState {
  filters: {
    sector: string[];
    region: string[];
  };
  segmentedAssets: Asset[];
  setFilters: (filters: Partial<SegmentationState["filters"]>) => void;
  resetFilters: () => void;
  setSegmentedAssets: (assets: Asset[]) => void;
}

interface PRARiskState {
  selectedRisks: string[];
  mappingMethod: string;
  mappingMethods: Record<string, "location" | "region" | "sector" | "product">;
  riskResults: Record<string, unknown>;
  setSelectedRisks: (risks: string[]) => void;
  setMappingMethod: (method: string) => void;
  setRiskResults: (results: Record<string, unknown>) => void;
}

interface TRARiskState {
  sectorRiskScores: Record<string, number>;
  productRiskScores: Record<string, number>;
  results: Record<string, unknown>;
  setSectorRiskScores: (scores: Record<string, number>) => void;
  setProductRiskScores: (scores: Record<string, number>) => void;
  setResults: (results: Record<string, unknown>) => void;
}

export const useCRADataStore = create<CRADataState>()(
  persist(
    (set, get) => ({
      assets: {},
      uploadStatus: {
        loading: false,
        errors: [],
        lastUploadAt: null,
      },
      setAssetData: (assetType: string, data: AssetTypeData) => {
        set((state) => ({
          assets: {
            ...state.assets,
            [assetType]: data,
          },
          uploadStatus: {
            ...state.uploadStatus,
            lastUploadAt: new Date().toISOString(),
          },
        }));
      },
      clearAssetData: (assetType: string) => {
        set((state) => {
          const newAssets = { ...state.assets };
          delete newAssets[assetType];
          return { assets: newAssets };
        });
      },
      getAssetData: (assetType: string) => {
        return get().assets[assetType] || null;
      },
    }),
    {
      name: "cra-data-storage",
    },
  ),
);

export const useCRAStatusStore = create<CRAStatusState>()(
  persist(
    (set) => ({
      dataUploaded: false,
      segmentationReady: false,
      praReady: false,
      traReady: false,
      updateStatus: (key, value) => {
        set({ [key]: value });
      },
      setPRAReady: (value: boolean) => {
        set({ praReady: value });
      },
      setTRAReady: (value: boolean) => {
        set({ traReady: value });
      },
    }),
    {
      name: "cra-status-storage",
    },
  ),
);

export const useSegmentationStore = create<SegmentationState>()((set) => ({
  filters: {
    sector: [],
    region: [],
  },
  segmentedAssets: [],
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },
  resetFilters: () => {
    set({
      filters: {
        sector: [],
        region: [],
      },
    });
  },
  setSegmentedAssets: (assets) => {
    set({ segmentedAssets: assets });
  },
}));

export const usePRARiskStore = create<PRARiskState>()((set) => ({
  selectedRisks: [],
  mappingMethod: "",
  mappingMethods: {},
  riskResults: {},
  setSelectedRisks: (risks) => set({ selectedRisks: risks }),
  setMappingMethod: (method) => set({ mappingMethod: method }),
  setRiskResults: (results) => set({ riskResults: results }),
}));

export const useTRARiskStore = create<TRARiskState>()((set) => ({
  sectorRiskScores: {},
  productRiskScores: {},
  results: {},
  setSectorRiskScores: (scores) => set({ sectorRiskScores: scores }),
  setProductRiskScores: (scores) => set({ productRiskScores: scores }),
  setResults: (results) => set({ results: results }),
}));
