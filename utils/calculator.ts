// ─────────────────────────────────────────────────────────────────────────────
// FOLKCHARM CARBON CALCULATOR — Core Calculation Engine
// Methodology: ISO 14040/14044 + GHG Protocol Product Standard
// Version: v5 — 14 equations (10 environmental + 4 social)
// ─────────────────────────────────────────────────────────────────────────────

import { CalculatorState } from '../types';
import {
  EF_TRANSPORT,
  EF_THAI_GRID,
  EF_WATER_TAP,
  EF_GIN_WARP,
  EF_SPIN_WARP,
  SEED_COTTON_RATIO,
  EF_TAILOR,
  EF_POWERLOOM,
  ARTISANS_TOTAL,
  DAYS_PER_KG_WEFT,
} from '../constants';

// ── OUTPUT INTERFACES ─────────────────────────────────────────────────────────

export interface CalculationResults {
  emissions: {
    // Chain A — Loei weft cotton (all confirmed zero, shown for transparency)
    chainA: number;
    // Chain B — Green Net warp cotton
    ginWarp: number;      // EQ3b: machine ginning
    spinWarp: number;     // EQ4:  machine spinning
    // Shared stages
    tailoring: number;    // EQ6:  Bangkok tailoring
    logistics: number;    // EQ8:  all 6 transport legs
    electricity: number;  // EQ9:  Bangkok studio
    water: number;        // EQ7:  natural dye tap water
    scraps: number;       // EQ10: scrap reuse transport only
    // Totals
    total: number;
    perKgFabric: number;
  };
  social: {
    artisansSupported: number;   // SI1
    skillDaysPreserved: number;  // SI2
    emissionsAvoided: number;    // SI3
  };
}

// ── HELPER ────────────────────────────────────────────────────────────────────

// EQ8 transport helper
// EF_TRANSPORT unit = kg CO2e per tonne·km
// CRITICAL: divide weightKg by 1000 to convert kg → tonnes
const calcTransportLeg = (weightKg: number, distanceKm: number): number => {
  if (!weightKg || weightKg <= 0 || !distanceKm || distanceKm <= 0) return 0;
  return (weightKg / 1000) * distanceKm * EF_TRANSPORT;
};

// ── MAIN FUNCTION ─────────────────────────────────────────────────────────────

export const calculateResults = (data: CalculatorState): CalculationResults => {
  const { materials, logistics, electricity, water, tailoring } = data;

  // Functional unit denominator — all per-kg results divide by this
  const W = materials.fabricKg;

  // ── EQ2 + EQ3a + EQ5: Chain A — Loei weft cotton ────────────────────────
  // ALL ZERO — confirmed by Folkcharm 2016 primary video (Ta Ord's Home, Loei)
  // Hand picking → hand ginning → hand spinning → hand weaving = zero electricity
  // ISO 14040 primary data — highest evidence quality
  const CF_ChainA = 0;

  // ── EQ3b: Green Net machine ginning ──────────────────────────────────────
  // Seed cotton needed = warp yarn × 1.25 (80% lint-to-seed ratio)
  // EF = 0.131 kg CO2e/kg — Nigam et al. 2016 (proxy: US gin data)
  const seedCottonKg = materials.greenNetYarnKg * SEED_COTTON_RATIO;
  const CF_GinWarp = W > 0 ? (seedCottonKg * EF_GIN_WARP) / W : 0;

  // ── EQ4: Green Net warp spinning ─────────────────────────────────────────
  // EF = 1.167 kg CO2e/kg — 2.456 kWh/kg × TGO 0.4750
  // Thai grid confirmed (greennet.or.th). Previous value 1.357 used wrong Indian grid.
  const CF_SpinWarp = W > 0 ? (materials.greenNetYarnKg * EF_SPIN_WARP) / W : 0;

  // ── EQ6: Bangkok tailoring ────────────────────────────────────────────────
  // EF = 0.84 kg CO2e/kg — Bhalla 2018 Fig.8 (conservative, Indian grid proxy)
  // Thai-corrected = 0.44 but 0.84 kept as conservative upper bound
  const CF_Tailor = tailoring.fabricKg * EF_TAILOR;

  // ── EQ8: Transport — all 6 legs ───────────────────────────────────────────
  // Leg 1: Phuluang farms → gin site         (data gap — user fills distance)
  // Leg 2: Gin → hand-spinners               (~20 km estimate)
  // Leg 3: Weft yarn → weavers               (~70 km, Phuluang → Wangsaphung)
  // Leg 4: Green Net mill → weavers          (data gap — mill location unknown)
  // Leg 5: Weavers → Bangkok (Kerry Express) (600 km CONFIRMED folkcharm.com/travels)
  // Leg 6: Studio → tailors / Bangkapi       (~15 km Bangkok estimate)
  const CF_Transport = logistics.entries.reduce((acc, entry) => {
    return acc + calcTransportLeg(entry.weightKg, entry.distanceKm);
  }, 0);

  // ── EQ9: Studio electricity ───────────────────────────────────────────────
  // Bangkok studio only — do NOT include hand looms (zero electricity)
  // EF = 0.4750 kg CO2e/kWh — TGO Jan 2026
  const CF_Electricity = electricity.entries.reduce((acc, entry) => {
    return acc + (entry.usageKwh * EF_THAI_GRID);
  }, 0);

  // ── EQ7: Natural dye tap water ────────────────────────────────────────────
  // Convert m³ → litres (× 1000) then × EF_WATER_TAP
  // Plant dyes: buak indigo, wild ebony, beetle nuts, anatto, barks
  const CF_Water = water.entries.reduce((acc, entry) => {
    return acc + (entry.usageM3 * 1000 * EF_WATER_TAP);
  }, 0);

  // ── EQ10: Scrap reuse — transport only ────────────────────────────────────
  // ISO 14044 s.4.3.4 — manual cutting and sewing by Bangkapi students
  // No industrial machinery → no industrial emission factor
  // Only emission = transport of scraps from Bangkok tailors to Bangkapi center
  const CF_Scraps = calcTransportLeg(tailoring.scrapsKg, tailoring.scrapsDistKm);

  // ── GRAND TOTAL ───────────────────────────────────────────────────────────
  const total =
    CF_ChainA +
    CF_GinWarp +
    CF_SpinWarp +
    CF_Tailor +
    CF_Transport +
    CF_Electricity +
    CF_Water +
    CF_Scraps;

  const perKgFabric = W > 0 ? total / W : 0;

  // ── SOCIAL IMPACT ─────────────────────────────────────────────────────────

  // SI1: Artisans supported
  // 51 confirmed: 10 Loei farmers + 30 weavers + 5 tailors + 6 Bangkapi students
  // Per batch — fixed until Folkcharm provides per-batch artisan data
  const artisansSupported = ARTISANS_TOTAL;

  // SI2: Days of Khen-Mue hand-spinning preserved
  // 2–3 days per kg (folkcharm.com/philosophy). Midpoint = 2.5
  const skillDaysPreserved = materials.loeiCottonKg * DAYS_PER_KG_WEFT;

  // SI3: Emissions avoided vs factory power loom
  // Nigam 2016: 5.75 kWh/kg × TGO 0.4750 = 2.730 kg CO2e/kg
  // Shown as positive saving in UI — NOT subtracted from total
  const emissionsAvoided = W * EF_POWERLOOM;

  return {
    emissions: {
      chainA: CF_ChainA,
      ginWarp: CF_GinWarp,
      spinWarp: CF_SpinWarp,
      tailoring: CF_Tailor,
      logistics: CF_Transport,
      electricity: CF_Electricity,
      water: CF_Water,
      scraps: CF_Scraps,
      total,
      perKgFabric,
    },
    social: {
      artisansSupported,
      skillDaysPreserved,
      emissionsAvoided,
    },
  };
};
