
import { CalculatorState } from "../types";
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

// OUTPUT INTERFACES
export interface CalculationResults {
  emissions: {
    // Chain A (Loei weft) - always zero, shown for transparency
    chainA: number;
    // Chain B (Green Net warp) - ginning + spinning
    ginWarp: number;
    spinWarp: number;
    // Shared stages
    tailoring: number;
    logistics: number;
    electricity: number;
    water: number;
    scraps: number;
    // Totals
    total: number;
    perKgFabric: number;
  };

  social: {
    // SI1: artisans supported (proportional to batch fabric weight)
    artisansSupported: number;
    // SI2: days of Khen-Mue skill preserved
    skillDaysPreserved: number;
    // SI3: emissions avoided vs factory power loom
    emissionAvoided: number;
  };
}

// HELPER
// EQ8: transport helper - EF_TRANSPORT is kg CO2e per tonne·km
// CRITICAL: divide weightKg by 1000 to convert to tonnes before multiplying
const calcTransportLeg = (weightKg: number, distanceKm: number): number => {
  if (!weightKg || weightKg <= 0 || !distanceKm || distanceKm <= 0) return 0;
  return (weightKg / 1000) * distanceKm * EF_TRANSPORT;
};

// MAIN FUNCTION
export const calculateResults = (data: CalculatorState): CalculationResults => {
  const { materials, logistics, electricity, water, tailoring } = data;
  const W = materials.fabricKg;   // functional unit denominator

  // EQ3b: Green Net machine grinning
  // Seed cotton needed = warp yarn × 1.25 (80% lint ratio)
  const seedCottonKg = materials.greenNetYarnKg * SEED_COTTON_RATIO;
  const CF_GinWarp = W > 0 ? (seedCottonKg * EF_GIN_WARP) / W : 0;

  // EQ4: Green Net warp spinning
  // 2.456 kWh/kg × TGO 0.4750 = 1.167 kg CO2e/kg yarn
  const CF_SpinWarp = W > 0 ? (materials.greenNetYarnKg * EF_SPIN_WARP) / W : 0;

  // EQ6: Bangkok tailoring
  // Bhalla 2018 Fig.8 - 0.84 kg CO2e/kg fabric (conservative, Indian grid proxy)
  const CF_Tailor = tailoring.fabricKg * EF_TAILOR;

  // EQ8: Transport - all 6 legs
  const CF_Transport = logistics.entries.reduce((acc, entry) => {
    return acc + calcTransportLeg(entry.weightKg, entry.distanceKm);
  }, 0);

  // EQ9: Studio electricity (Bangkok studio only, no looms)
  const CF_Electricity = electricity.entries.reduce((acc, entry) => {
    return acc + (entry.usageKwh * EF_THAI_GRID);
  }, 0);

  // EQ7: Natural dye tap water (m³ → litres × EF_tap)
  const CF_Water = water.entries.reduce((acc, entry) => {
    const litres = entry.usageM3 * 1000;
    return acc + (litres * EF_WATER_TAP);
  }, 0);

  // EQ10: Scrap reuse - transport only
  // ISO 14044 s.4.3.4 - manual cutting only, no industrial process
  const CF_Scraps = calcTransportLeg(tailoring.scrapsKg, tailoring.scrapsDistKm);

  // Chain A (EQ2, EQ3a, EQ5) - all confirmed zero
  // Folkcharm 2016 primary video: hand ginning, hand spinning, hand weaving
  const CF_ChainA = 0;

  // GRAND TOTAL
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

  // SOCIAL IMPACT (SI1-SI3)
  // SI1: artisans supported - proportional to batch size vs average batch
  // Using fabric weight as proxy; ARTISANS_TOTAL = 51 confirmed (folkcharm.com/artisans)
  const artisansSupported = W > 0 ? Math.round(ARTISANS_TOTAL * (W / W)) : ARTISANS_TOTAL;
  // Note: SI1 is a fixed display (51 artisans per batch) until Folkcharm provides
  // per-batch artisan data. Update formula once batch-level data is available.

  // SI2: days of Khen-Mue hand-spinning preserved
  // folkcharm.com/philosophy - "2-3 days per kg." Midpoint = 2.5
  const skillDaysPreserved = materials.loeiCottonKg * DAYS_PER_KG_WEFT;

  // SI3: emissions avoided vs factory power loom
  // Nigam 2016: 5.75 kWh/kg × TGO 0.4750 = 2.730 kg CO2e/kg
  const emissionAvoided = W * EF_POWERLOOM;

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
      emissionAvoided,
    }
  };
};