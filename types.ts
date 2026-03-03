export interface LogisticsEntry {
  id: string;
  description: string;
  weightKg: number;
  distanceKm: number;
}

export interface LogisticsData {
  entries: LogisticsEntry[];
}

export interface ElectricityEntry {
  id: string;
  description: string;
  usageKwh: number;
}

export interface WaterEntry {
  id: string;
  description: string;
  usageM3: number;
}

export type CalculationScope = 'batch' | 'monthly';

export interface CalculatorState {
  meta: {
    scope: CalculationScope;
    startDate: string;
    endDate: string;
  };

  materials: {
    fabricKg: number;
    loeiCottonKg: number;
    greenNetYarnKg: number;
    leftoverKg: number;
  };

  logistics: LogisticsData;

  electricity: {
    entries: ElectricityEntry[];
  };

  water: {
    entries: WaterEntry[];
  };

  tailoring: {
    fabricKg: number;
    scrapsKg: number;
    scrapsDistKm: number;
  }
}

export type StepId = 'home' | 'materials' | 'logistics' | 'electricity' | 'water' | 'tailoring' | 'results';

export interface StepProps {
  data: CalculatorState;
  updateData: (updates: Partial<CalculatorState>) => void;
  onNext: () => void;
  onBack: () => void;
  onRestart?: () => void;
}
