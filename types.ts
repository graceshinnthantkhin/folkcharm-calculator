// ─────────────────────────────────────────────────────────────────────────────
// FOLKCHARM CARBON CALCULATOR — Type Definitions
// Methodology: ISO 14040/14044 + GHG Protocol Product Standard v5
// ─────────────────────────────────────────────────────────────────────────────

// ── LOGISTICS ─────────────────────────────────────────────────────────────────
// Single EF_TRANSPORT factor used for all legs — no vehicle type distinction
export interface LogisticsEntry {
  id: string;
  description: string;
  weightKg: number;
  distanceKm: number;
}

export interface LogisticsData {
  entries: LogisticsEntry[];
}

// ── ELECTRICITY ───────────────────────────────────────────────────────────────
// Bangkok studio only — hand looms excluded (zero electricity)
export interface ElectricityEntry {
  id: string;
  description: string;
  usageKwh: number;
}

// ── WATER ─────────────────────────────────────────────────────────────────────
// Tap water only — used for natural plant dyeing
// Soft water proxy removed per v5 methodology
export interface WaterEntry {
  id: string;
  description: string;
  usageM3: number;
}

// ── SCOPE ─────────────────────────────────────────────────────────────────────
export type CalculationScope = 'batch' | 'monthly';

// ── CALCULATOR STATE ──────────────────────────────────────────────────────────
export interface CalculatorState {
  meta: {
    scope: CalculationScope;
    startDate: string;
    endDate: string;
  };

  // EQ1: Functional unit — 1 kg finished fabric
  // EQ2/EQ3a: Chain A Loei weft (zero emission — hand-processed)
  // EQ3b/EQ4: Chain B Green Net warp (machine-processed — has emissions)
  materials: {
    fabricKg: number;        // W_fabric_kg — finished fabric weight (functional unit denominator)
    loeiCottonKg: number;    // Chain A — Loei hand-spun weft cotton weight (EQ2, EQ3a)
    greenNetYarnKg: number;  // Chain B — Green Net machine-spun warp yarn weight (EQ3b, EQ4)
    leftoverKg: number;      // Deadstock/leftover — zero emission (ISO 14044 s.4.3.4)
  };

  logistics: LogisticsData;  // EQ8 — 6 transport legs

  electricity: {             // EQ9 — Bangkok studio only
    entries: ElectricityEntry[];
  };

  water: {                   // EQ7 — natural dye tap water
    entries: WaterEntry[];
  };

  // EQ6: Bangkok tailoring, EQ10: Scrap reuse transport
  tailoring: {
    fabricKg: number;        // Weight sent to Bangkok tailors (EQ6)
    scrapsKg: number;        // Weight of scraps sent to Bangkapi students (EQ10)
    scrapsDistKm: number;    // Distance tailors → Bangkapi Vocational Center (EQ10)
  };

  // Social impact — user inputs (no hardcoding); calculator derives SI1–SI5, SI7
  social: {
    artisanCount: number;           // SI1 — number of artisans in this batch
    totalArtisanHours: number;      // SI4 — total hours worked; SI3 FTE = hours ÷ 160
    paymentToArtisansBaht: number;  // Artisan income per batch (THB)
    totalBatchRevenueBaht: number;  // For revenue share % (SI2)
    womenArtisansCount: number;     // SI5 — number of women artisans (percentage derived in calculator)
    daysPerKgWeft: number;         // SI7 — days per kg hand-spun weft (user input only)
  };
}

// ── STEP NAVIGATION ───────────────────────────────────────────────────────────
export type StepId =
  | 'home'
  | 'materials'
  | 'logistics'
  | 'electricity'
  | 'water'
  | 'tailoring'
  | 'social'
  | 'results';

// ── STEP COMPONENT PROPS ──────────────────────────────────────────────────────
export interface StepProps {
  data: CalculatorState;
  updateData: (updates: Partial<CalculatorState>) => void;
  onNext: () => void;
  onBack: () => void;
  onRestart?: () => void;
}
