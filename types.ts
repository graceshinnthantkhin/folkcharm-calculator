
export enum VehicleType {
  LIGHT = 'Light Vehicle',
  HEAVY = 'Heavy Vehicle',
}

export interface TransportLeg {
  distance: number;
  vehicleType: VehicleType;
}

export interface LogisticsData {
  // A. Farmer Cotton Route (3 legs)
  farmToSpinner: TransportLeg;
  spinnerToWeaver: TransportLeg;
  weaverToFolkcharm: TransportLeg;

  // B. SC Grand Route (1 leg)
  scGrandToFolkcharm: TransportLeg;

  // C. Leftover Route (1 leg)
  leftoverToFolkcharm: TransportLeg;
}

export type CalculationScope = 'batch' | 'monthly';

export interface CalculatorState {
  // Meta: Scope and Date Range
  meta: {
    scope: CalculationScope;
    startDate: string;
    endDate: string;
  };

  // Step 1: Materials
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

  // Step 2: Logistics
  logistics: LogisticsData;

  // Step 3: Production
  production: {
    sewingHours: number;
    itemQuantity: number;
    logbookFile?: string;
  };
}

export type StepId = 'home' | 'materials' | 'logistics' | 'production' | 'results';

export interface StepProps {
  data: CalculatorState;
  updateData: (updates: Partial<CalculatorState>) => void;
  onNext: () => void;
  onBack: () => void;
  onRestart?: () => void;
}
