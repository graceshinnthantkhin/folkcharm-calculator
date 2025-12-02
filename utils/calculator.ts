
import { CalculatorState, VehicleType } from '../types';
import {
  EF_TRANSPORT,
  EF_SC_GRAND_YARN,
  EF_LEFTOVER,
  EF_THAI_GRID,
  WEIGHT_ACCESSORY_PER_ITEM_KG,
  EF_ACCESSORY,
  POWER_SEWING_MACHINE_KW,
  PLACEHOLDER_SOC_EMISSIONS_PER_HA,
  EF_VIRGIN_COTTON
} from '../constants';

export interface CalculationResults {
  emissions: {
    materials: number;
    logistics: number;
    production: number;
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

// Helper to calculate transport emission: Weight (tons) * Distance (km) * Factor
const calcTransport = (weightKg: number, distanceKm: number, type: VehicleType | ''): number => {
  if (isNaN(distanceKm) || distanceKm === 0 || !type) return 0;
  const weightTons = weightKg / 1000;
  const factor = EF_TRANSPORT[type as VehicleType] || 0;
  return weightTons * distanceKm * factor;
};

export const calculateResults = (data: CalculatorState): CalculationResults => {
  const { materials, logistics, production } = data;

  // 1. Materials Emissions
  // Farmer Cotton: Based on Area * SOC Factor
  const farmerCottonEmissions = materials.farmerCotton.farmArea * PLACEHOLDER_SOC_EMISSIONS_PER_HA; 
  
  // SC Grand: Weight * EF
  const scGrandEmissions = materials.scGrand.weight * EF_SC_GRAND_YARN;

  // Leftover: 0
  const leftoverEmissions = materials.leftover.weight * EF_LEFTOVER;

  const totalMaterialEmissions = farmerCottonEmissions + scGrandEmissions + leftoverEmissions;

  // SC Grand Savings (Avoided Emissions vs Virgin Cotton)
  // Savings = Weight * (Virgin EF - Recycled EF)
  const scGrandSavings = materials.scGrand.weight > 0 
    ? materials.scGrand.weight * (EF_VIRGIN_COTTON - EF_SC_GRAND_YARN)
    : 0;

  // 2. Logistics Emissions
  // Note: "All weights contribute to logistics load."
  // Each route is specific to a material source.
  let totalLogisticsEmissions = 0;

  // Route A: Farmer Cotton
  if (materials.farmerCotton.weight > 0) {
    totalLogisticsEmissions += calcTransport(materials.farmerCotton.weight, logistics.farmToSpinner.distance, logistics.farmToSpinner.vehicleType);
    totalLogisticsEmissions += calcTransport(materials.farmerCotton.weight, logistics.spinnerToWeaver.distance, logistics.spinnerToWeaver.vehicleType);
    totalLogisticsEmissions += calcTransport(materials.farmerCotton.weight, logistics.weaverToFolkcharm.distance, logistics.weaverToFolkcharm.vehicleType);
  }

  // Route B: SC Grand
  if (materials.scGrand.weight > 0) {
    totalLogisticsEmissions += calcTransport(materials.scGrand.weight, logistics.scGrandToFolkcharm.distance, logistics.scGrandToFolkcharm.vehicleType);
  }

  // Route C: Leftover
  if (materials.leftover.weight > 0) {
    totalLogisticsEmissions += calcTransport(materials.leftover.weight, logistics.leftoverToFolkcharm.distance, logistics.leftoverToFolkcharm.vehicleType);
  }

  // 3. Production Emissions
  // Electricity: Hours * kW * GridFactor
  const electricityEmissions = production.sewingHours * POWER_SEWING_MACHINE_KW * EF_THAI_GRID;
  
  // Accessories: Items * WeightPerItem * AccessoryFactor
  const accessoriesEmissions = production.itemQuantity * WEIGHT_ACCESSORY_PER_ITEM_KG * EF_ACCESSORY;

  const totalProductionEmissions = electricityEmissions + accessoriesEmissions;

  // Total Weight Calculation for Stats
  const totalWeightKg = 
    materials.farmerCotton.weight + 
    materials.scGrand.weight + 
    materials.leftover.weight +
    (production.itemQuantity * WEIGHT_ACCESSORY_PER_ITEM_KG);

  // 4. Total
  const grandTotalEmissions = totalMaterialEmissions + totalLogisticsEmissions + totalProductionEmissions;

  // 5. Intensity (Per Kg)
  const emissionPerKg = totalWeightKg > 0 ? grandTotalEmissions / totalWeightKg : 0;

  return {
    emissions: {
      materials: totalMaterialEmissions,
      logistics: totalLogisticsEmissions,
      production: totalProductionEmissions,
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
