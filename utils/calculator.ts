import { CalculatorState, VehicleType } from '../types';
import {
  EF_TRANSPORT,
  EF_SC_GRAND_YARN,
  EF_LEFTOVER,
  EF_THAI_GRID,
  WEIGHT_ACCESSORY_PER_ITEM_KG,
  EF_ACCESSORY,
  POWER_SEWING_MACHINE_KW,
  PLACEHOLDER_SOC_EMISSIONS_PER_HA
} from '../constants';

export interface CalculationResults {
  emissions: {
    materials: number;
    logistics: number;
    production: number;
    delivery: number;
    total: number;
  };
  productionStats: {
    totalWeight: number;
    emissionPerKg: number;
  };
}

// Helper to calculate transport emission: Weight (tons) * Distance (km) * Factor
const calcTransport = (weightKg: number, distanceKm: number, type: VehicleType): number => {
  const weightTons = weightKg / 1000;
  const factor = EF_TRANSPORT[type];
  return weightTons * distanceKm * factor;
};

export const calculateResults = (data: CalculatorState): CalculationResults => {
  const { materials, logistics, production, delivery } = data;

  // 1. Materials Emissions
  // Farmer Cotton: Based on Area * SOC Factor (Placeholder used as formula not fully specified)
  const farmerCottonEmissions = materials.farmerCotton.farmArea * PLACEHOLDER_SOC_EMISSIONS_PER_HA; 
  
  // SC Grand: Weight * EF
  const scGrandEmissions = materials.scGrand.weight * EF_SC_GRAND_YARN;

  // Leftover: 0
  const leftoverEmissions = materials.leftover.weight * EF_LEFTOVER;

  const totalMaterialEmissions = farmerCottonEmissions + scGrandEmissions + leftoverEmissions;

  // 2. Logistics Emissions
  // Note: "All weights contribute to logistics load."
  // However, each route is specific to a material source.
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

  // 4. Delivery Emissions
  // Total Product Weight: Sum of all inputs + Accessories?
  // Usually, output weight ≈ input weight. Let's sum raw material weights.
  // We should conceptually add accessories weight, but the prompt implies "Total production weight" from Page 1 logic.
  // Page 5 says: Weight_total (tons) * Distance * Vehicle EF
  const totalWeightKg = 
    materials.farmerCotton.weight + 
    materials.scGrand.weight + 
    materials.leftover.weight +
    (production.itemQuantity * WEIGHT_ACCESSORY_PER_ITEM_KG); // Adding accessory weight for accuracy in transport

  const totalDeliveryEmissions = calcTransport(totalWeightKg, delivery.finalDistance, delivery.vehicleType);

  // 5. Total
  const grandTotalEmissions = totalMaterialEmissions + totalLogisticsEmissions + totalProductionEmissions + totalDeliveryEmissions;

  // 6. Intensity (Per Kg)
  const emissionPerKg = totalWeightKg > 0 ? grandTotalEmissions / totalWeightKg : 0;

  return {
    emissions: {
      materials: totalMaterialEmissions,
      logistics: totalLogisticsEmissions,
      production: totalProductionEmissions,
      delivery: totalDeliveryEmissions,
      total: grandTotalEmissions,
    },
    productionStats: {
      totalWeight: totalWeightKg,
      emissionPerKg: emissionPerKg,
    }
  };
};