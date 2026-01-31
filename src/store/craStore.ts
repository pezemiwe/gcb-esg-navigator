import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Asset, AssetTypeData } from "@/types/craTypes";

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

interface RiskConfig {
  riskId: string;
  mappingMethod: string | string[];
  selectedAssets: string[];
  justification: string;
}

interface PRARiskState {
  selectedRisks: string[];
  riskConfigurations: Record<string, RiskConfig>;
  riskResults: Record<string, unknown>;
  setSelectedRisks: (risks: string[]) => void;
  updateRiskConfig: (riskId: string, config: Partial<RiskConfig>) => void;
  setRiskResults: (results: Record<string, unknown>) => void;
  resetPRA: () => void;
}

interface TRARiskState {
  sectorRiskScores: Record<string, number>;
  productRiskScores: Record<string, number>;
  results: Record<string, unknown>;
  setSectorRiskScores: (scores: Record<string, number>) => void;
  setProductRiskScores: (scores: Record<string, number>) => void;
  setResults: (results: Record<string, unknown>) => void;
}

// --- Store Implementations ---

export const useCRADataStore = create<CRADataState>()(
  persist(
    (set, get) => ({
      assets: {
        "commercial-loans": {
          type: "Commercial Loans",
          data: [],
          uploadedAt: null,
          fileName: null,
          rowCount: 0,
          columnCount: 0,
          validationStatus: "pending",
          validationErrors: [],
        },
        "sme-loans": {
          type: "SME Loans",
          data: [],
          uploadedAt: null,
          fileName: null,
          rowCount: 0,
          columnCount: 0,
          validationStatus: "pending",
          validationErrors: [],
        },
        mortgages: {
          type: "Mortgages",
          data: [],
          uploadedAt: null,
          fileName: null,
          rowCount: 0,
          columnCount: 0,
          validationStatus: "pending",
          validationErrors: [],
        },
        agriculture: {
          type: "Agriculture",
          data: [],
          uploadedAt: null,
          fileName: null,
          rowCount: 0,
          columnCount: 0,
          validationStatus: "pending",
          validationErrors: [],
        },
        "project-finance": {
          type: "Project Finance",
          data: [],
          uploadedAt: null,
          fileName: null,
          rowCount: 0,
          columnCount: 0,
          validationStatus: "pending",
          validationErrors: [],
        },
      },
      uploadStatus: {
        loading: false,
        errors: [],
        lastUploadAt: null,
      },
      setAssetData: (assetType, data) =>
        set((state) => ({
          assets: { ...state.assets, [assetType]: data },
        })),
      clearAssetData: (assetType) =>
        set((state) => {
          const currentAsset = state.assets[assetType];
          if (!currentAsset) return state;

          return {
            assets: {
              ...state.assets,
              [assetType]: {
                type: currentAsset.type,
                data: [],
                uploadedAt: null,
                fileName: null,
                rowCount: 0,
                columnCount: 0,
                validationStatus: "pending",
                validationErrors: [],
              },
            },
          };
        }),
      getAssetData: (assetType) => get().assets[assetType] || null,
    }),
    {
      name: "cra-data-store",
    },
  ),
);

export const useCRAStatusStore = create<CRAStatusState>()((set) => ({
  dataUploaded: false,
  segmentationReady: false,
  praReady: false,
  traReady: false,
  updateStatus: (key, value) => set({ [key]: value }),
  setPRAReady: (value) => set({ praReady: value }),
  setTRAReady: (value) => set({ traReady: value }),
}));

export const useSegmentationStore = create<SegmentationState>()((set) => ({
  filters: {
    sector: [],
    region: [],
    location: [],
    portfolioType: "all",
    assetType: [],
  },
  segmentedAssets: [],
  savedSegments: [],
  drillDownContext: null,
  groupingMode: "none",
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () =>
    set({
      filters: {
        sector: [],
        region: [],
        location: [],
        portfolioType: "all",
        assetType: [],
      },
    }),
  setSegmentedAssets: (assets) => set({ segmentedAssets: assets }),
  saveSegment: (name, description, assets) =>
    set((state) => ({
      savedSegments: [
        ...state.savedSegments,
        {
          id: crypto.randomUUID(),
          name,
          description,
          filters: state.filters,
          createdAt: new Date().toISOString(),
          assetCount: assets.length,
          totalExposure: 0, // Calculate this in real app
        },
      ],
    })),
  loadSegment: (_segmentId) => {
    void _segmentId;
    // Logic to load would go here, usually strictly by setting filters
    // For now we just place holder
  },
  deleteSegment: (segmentId) =>
    set((state) => ({
      savedSegments: state.savedSegments.filter((s) => s.id !== segmentId),
    })),
  setDrillDownContext: (context) => set({ drillDownContext: context }),
  clearDrillDown: () => set({ drillDownContext: null }),
  setGroupingMode: (mode) => set({ groupingMode: mode }),
}));

export const useTRARiskStore = create<TRARiskState>()((set) => ({
  sectorRiskScores: {},
  productRiskScores: {},
  results: {},
  setSectorRiskScores: (scores) => set({ sectorRiskScores: scores }),
  setProductRiskScores: (scores) => set({ productRiskScores: scores }),
  setResults: (results) => set({ results: results }),
}));

export const usePRARiskStore = create<PRARiskState>()((set) => ({
  selectedRisks: [],
  riskConfigurations: {},
  riskResults: {},
  setSelectedRisks: (risks) => set({ selectedRisks: risks }),
  updateRiskConfig: (riskId, config) =>
    set((state) => {
      const currentConfig = state.riskConfigurations[riskId] || {
        riskId,
        mappingMethod: "",
        selectedAssets: [],
        justification: "",
      };
      return {
        riskConfigurations: {
          ...state.riskConfigurations,
          [riskId]: { ...currentConfig, ...config },
        },
      };
    }),
  setRiskResults: (results) => set({ riskResults: results }),
  resetPRA: () =>
    set({
      selectedRisks: [],
      riskConfigurations: {},
      riskResults: {},
    }),
}));
