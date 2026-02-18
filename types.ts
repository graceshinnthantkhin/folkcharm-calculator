
export enum VehicleType {
  LIGHT = 'Light Vehicle',
  HEAVY = 'Heavy Vehicle',
}

export interface TransportLeg {
  distance: number;
  vehicleType: VehicleType;
}

export interface LogisticsEntry {
  id: string;
  description: string;
  weightKg: number;
  distance: number;
  vehicleType: VehicleType | '';
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
  type: 'tap' | 'soft';
}

export interface DeliveryData {
  finalDistance: number;
  vehicleType: VehicleType | '';
}

export type CalculationScope = 'batch' | 'monthly';

export interface CalculatorState {
  meta: {
    scope: CalculationScope;
    startDate: string;
    endDate: string;
  };

  materials: {
    farmerCotton: {
      weight: number;
      farmArea: number; // in ha
    };
    scGrand: {
      weight: number;
    };
    leftover: {
      weight: number;
    };
  };

  logistics: LogisticsData;

  electricity: {
    entries: ElectricityEntry[];
  };

  water: {
    entries: WaterEntry[];
  };

  production: {
    itemQuantity: number;
    sewingHours: number;
  };

  delivery: DeliveryData;
}

export type StepId = 'home' | 'materials' | 'logistics' | 'electricity' | 'water' | 'results';

export interface StepProps {
  data: CalculatorState;
  updateData: (updates: Partial<CalculatorState>) => void;
  onNext: () => void;
  onBack: () => void;
  onRestart?: () => void;
}
