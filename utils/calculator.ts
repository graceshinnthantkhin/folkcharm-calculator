
import { CalculatorState, VehicleType } from '../types';
import {
  EF_TRANSPORT,
  EF_SC_GRAND_YARN,
  EF_THAI_GRID,
  EF_WATER_TAP,
  EF_WATER_SOFT,
  WEIGHT_ACCESSORY_PER_ITEM_KG,
  PLACEHOLDER_SOC_EMISSIONS_PER_HA,
  EF_VIRGIN_COTTON
} from '../constants';

export interface CalculationResults {
  emissions: {
    materials: number;
    logistics: number;
    electricity: number;
    water: number;
    total: number;
  };
  productionStats: {
    totalWeight: number;
    emissionPerKg: number;
  };
  savings: {
    scGrand: number;
  };
}

const calcTransport = (weightKg: number, distanceKm: number, type: VehicleType | ''): number => {
  if (isNaN(distanceKm) || distanceKm <= 0 || isNaN(weightKg) || weightKg <= 0 || !type) return 0;
  const weightTons = weightKg / 1000;
  const factor = EF_TRANSPORT[type as VehicleType] || 0;
  return weightTons * distanceKm * factor;
};

export const calculateResults = (data: CalculatorState): CalculationResults => {
  const { materials, logistics, electricity, water, production } = data;

  // 1. Materials Emissions
  const farmerCottonEmissions = materials.farmerCotton.farmArea * PLACEHOLDER_SOC_EMISSIONS_PER_HA; 
  const scGrandEmissions = materials.scGrand.weight * EF_SC_GRAND_YARN;
  const totalMaterialEmissions = farmerCottonEmissions + scGrandEmissions;

  const scGrandSavings = materials.scGrand.weight > 0 
    ? materials.scGrand.weight * (EF_VIRGIN_COTTON - EF_SC_GRAND_YARN)
    : 0;

  // 2. Logistics Emissions (Dynamic)
  const totalLogisticsEmissions = logistics.entries.reduce((acc, entry) => {
    return acc + calcTransport(entry.weightKg, entry.distance, entry.vehicleType);
  }, 0);

  // 3. Electricity Emissions
  const totalElectricityEmissions = electricity.entries.reduce((acc, entry) => {
    return acc + (entry.usageKwh * EF_THAI_GRID);
  }, 0);

  // 4. Water Emissions (Convert m3 to Liters: 1 m3 = 1000L)
  const totalWaterEmissions = water.entries.reduce((acc, entry) => {
    const factor = entry.type === 'soft' ? EF_WATER_SOFT : EF_WATER_TAP;
    const liters = entry.usageM3 * 1000;
    return acc + (liters * factor);
  }, 0);

  // 5. Total
  const totalProductionEmissions = totalElectricityEmissions + totalWaterEmissions;
  const grandTotalEmissions = totalMaterialEmissions + totalLogisticsEmissions + totalProductionEmissions;

  // Total Weight
  const totalWeightKg = 
    materials.farmerCotton.weight + 
    materials.scGrand.weight + 
    materials.leftover.weight +
    (production.itemQuantity * WEIGHT_ACCESSORY_PER_ITEM_KG);

  const emissionPerKg = totalWeightKg > 0 ? grandTotalEmissions / totalWeightKg : 0;

  return {
    emissions: {
      materials: totalMaterialEmissions,
      logistics: totalLogisticsEmissions,
      electricity: totalElectricityEmissions,
      water: totalWaterEmissions,
      total: grandTotalEmissions,
    },
    productionStats: {
      totalWeight: totalWeightKg,
      emissionPerKg: emissionPerKg,
    },
    savings: {
      scGrand: scGrandSavings
    }
  };
};
