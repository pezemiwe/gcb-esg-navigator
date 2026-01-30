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
    location: string[];
    portfolioType: string;
    assetType: string[];
  };
  segmentedAssets: Asset[];
  savedSegments: Array<{
    id: string;
    name: string;
    description: string;
    filters: SegmentationState["filters"];
    createdAt: string;
    assetCount: number;
    totalExposure: number;
  }>;
  drillDownContext: {
    active: boolean;
    type: string;
    value: string;
    filters: Partial<SegmentationState["filters"]>;
  } | null;
  groupingMode: "none" | "location" | "borrower" | "maturity" | "sector";
  setFilters: (filters: Partial<SegmentationState["filters"]>) => void;
  resetFilters: () => void;
  setSegmentedAssets: (assets: Asset[]) => void;
  saveSegment: (name: string, description: string, assets: Asset[]) => void;
  loadSegment: (segmentId: string) => void;
  deleteSegment: (segmentId: string) => void;
  setDrillDownContext: (context: SegmentationState["drillDownContext"]) => void;
  clearDrillDown: () => void;
  setGroupingMode: (mode: SegmentationState["groupingMode"]) => void;
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

export const useSegmentationStore = create<SegmentationState>()(
  persist(
    (set, get) => ({
      filters: {
        sector: [],
        region: [],
        location: [],
        portfolioType: "All",
        assetType: [],
      },
      segmentedAssets: [],
      savedSegments: [],
      drillDownContext: null,
      groupingMode: "none",
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
            location: [],
            portfolioType: "All",
            assetType: [],
          },
        });
      },
      setSegmentedAssets: (assets) => {
        set({ segmentedAssets: assets });
      },
      saveSegment: (name, description, assets) => {
        const { filters } = get();
        const newSegment = {
          id: `segment-${Date.now()}`,
          name,
          description,
          filters: { ...filters },
          createdAt: new Date().toISOString(),
          assetCount: assets.length,
          totalExposure: assets.reduce(
            (sum, a) => sum + (Number(a.outstandingBalance) || 0),
            0,
          ),
        };
        set((state) => ({
          savedSegments: [...state.savedSegments, newSegment],
        }));
      },
      loadSegment: (segmentId) => {
        const segment = get().savedSegments.find((s) => s.id === segmentId);
        if (segment) {
          set({ filters: { ...segment.filters } });
        }
      },
      deleteSegment: (segmentId) => {
        set((state) => ({
          savedSegments: state.savedSegments.filter((s) => s.id !== segmentId),
        }));
      },
      setDrillDownContext: (context) => {
        set({ drillDownContext: context });
      },
      clearDrillDown: () => {
        set({ drillDownContext: null });
      },
      setGroupingMode: (mode) => {
        set({ groupingMode: mode });
      },
    }),
    {
      name: "cra-segmentation-storage",
    },
  ),
);

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
