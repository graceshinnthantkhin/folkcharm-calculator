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
  POWER_LOOM_KWH_PER_KG,
} from '../constants';

// ── OUTPUT INTERFACES ─────────────────────────────────────────────────────────

export interface CalculationResults {
  emissions: {
    chainA: number;
    ginWarp: number;
    spinWarp: number;
    tailoring: number;
    logistics: number;
    electricity: number;
    water: number;
    scraps: number;
    total: number;
    perKgFabric: number;
  };
  social: {
    artisansSupported: number;      // SI1 — from user input
    artisanIncomePerBatch: number;  // SI1b — payment to artisans (THB)
    revenueSharePercent: number;    // SI2 — (payment / revenue) × 100
    fteJobs: number;                // SI3 — totalArtisanHours ÷ 160
    artisanWorkHours: number;       // SI4 — from user input
    womenArtisansPercent: number;   // SI5 — from user input
    skillDaysPreserved: number;     // SI7 — loeiCottonKg × daysPerKgWeft
    emissionsAvoided: number;       // vs power loom (display only)
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
  // Absolute batch emissions (kg CO2e); per-kg = total / W below
  const seedCottonKg = materials.greenNetYarnKg * SEED_COTTON_RATIO;
  const CF_GinWarp = seedCottonKg * EF_GIN_WARP;

  // ── EQ4: Green Net warp spinning ─────────────────────────────────────────
  // EF = 1.167 kg CO2e/kg — 2.456 kWh/kg × TGO 0.4750
  // Absolute batch emissions (kg CO2e)
  const CF_SpinWarp = materials.greenNetYarnKg * EF_SPIN_WARP;

  // ── EQ6: Bangkok tailoring ────────────────────────────────────────────────
  // EF = 0.84 kg CO2e/kg — Bhalla 2018 Fig.8 (conservative, Indian grid proxy)
  // Thai-corrected = 0.44 but 0.84 kept as conservative upper bound
  const CF_Tailor = tailoring.fabricKg * EF_TAILOR;

  // ── EQ8: Transport — all 6 legs ───────────────────────────────────────────
  // Leg 1: Phuluang farms → gin site         (data gap — user fills distance)
  // Leg 2: Gin → hand-spinners               (~20 km estimate)
  // Leg 3: Weft yarn → weavers               (~70 km, Phuluang → Wangsaphung)
  // Leg 4: Green Net mill → weavers          (data gap — mill location unknown)
  // Leg 5: Weavers → Bangkok (Kerry Express)
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

  // ── SOCIAL IMPACT (all from user input — no hardcoding) ───────────────────
  const socialInput = data.social ?? {
    artisanCount: 0,
    totalArtisanHours: 0,
    paymentToArtisansBaht: 0,
    totalBatchRevenueBaht: 0,
    womenArtisansCount: 0,
    daysPerKgWeft: 0,
  };

  // No default: use only user input for days per kg weft (SI7)
  const daysPerKg = socialInput.daysPerKgWeft > 0 ? socialInput.daysPerKgWeft : 0;

  const artisansSupported = socialInput.artisanCount;
  const artisanIncomePerBatch = socialInput.paymentToArtisansBaht;
  const revenueSharePercent =
    socialInput.totalBatchRevenueBaht > 0
      ? (socialInput.paymentToArtisansBaht / socialInput.totalBatchRevenueBaht) * 100
      : 0;
  const HOURS_PER_FTE_MONTH = 160;
  const fteJobs = socialInput.totalArtisanHours / HOURS_PER_FTE_MONTH;
  const artisanWorkHours = socialInput.totalArtisanHours;
  // SI5: derive % from number of women (support old state with womenArtisansPercent)
  const womenArtisansPercent =
    'womenArtisansCount' in socialInput && socialInput.artisanCount > 0
      ? ((socialInput.womenArtisansCount ?? 0) / socialInput.artisanCount) * 100
      : ((socialInput as any).womenArtisansPercent ?? 0);
  const skillDaysPreserved = materials.loeiCottonKg * daysPerKg;
  // Emissions avoided: compare vs factory power loom using Thai grid (TGO) only
  const emissionsAvoided = W * POWER_LOOM_KWH_PER_KG * EF_THAI_GRID;

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
      artisanIncomePerBatch,
      revenueSharePercent,
      fteJobs,
      artisanWorkHours,
      womenArtisansPercent,
      skillDaysPreserved,
      emissionsAvoided,
    },
  };
};
