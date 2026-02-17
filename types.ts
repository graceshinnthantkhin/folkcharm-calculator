
export enum VehicleType {
  LIGHT = 'Light Vehicle',
  HEAVY = 'Heavy Vehicle',
}

export interface TransportLeg {
  distance: number;
  vehicleType: VehicleType;
}

export interface LogisticsData {
  farmToSpinner: TransportLeg;
  spinnerToWeaver: TransportLeg;
  weaverToFolkcharm: TransportLeg;
  scGrandToFolkcharm: TransportLeg;
  leftoverToFolkcharm: TransportLeg;
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

// Added DeliveryData to track final transport
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
    // Added sewingHours for production tracking
    sewingHours: number;
  };

  // Added delivery tracking
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
