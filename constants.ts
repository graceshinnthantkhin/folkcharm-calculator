import { VehicleType } from './types';

// Emission Factors
// Transportation (kg CO2 / tkm) -> converted from grams in PDF
export const EF_TRANSPORT = {
  [VehicleType.LIGHT]: 0.245,
  [VehicleType.HEAVY]: 0.129,
};

// Materials (kg CO2e / kg)
export const EF_SC_GRAND_YARN = 0.35;
export const EF_LEFTOVER = 0.0;
// Note: Farmer cotton emissions depend on Farm Area (SOC). 
// The PDF mentions TVER formulas. Since the exact formula isn't provided in the prompt, 
// we assume a placeholder factor per Rai or per Kg if not strictly weight-based.
// For this MVP, we will assume the calculation is separate. 
// Let's assume a placeholder coefficient for "Cultivation Emission per Rai" if the user has data.
// If the goal is negative emissions (sequestration), this would be negative. 
// Assuming standard positive cultivation emissions for now unless specified.
// Updated to HA unit. 1 ha = 6.25 rai. Previous placeholder was 15.0 per rai.
export const PLACEHOLDER_SOC_EMISSIONS_PER_HA = 93.75; // Placeholder value (15 * 6.25)

// Energy (kg CO2 / kWh)
export const EF_THAI_GRID = 0.399;

// Accessories
// Formula: Item Quantity * 0.05 kg/item * 2.1 kg CO2e/kg
export const WEIGHT_ACCESSORY_PER_ITEM_KG = 0.05;
export const EF_ACCESSORY = 2.1;

// Machines
export const POWER_SEWING_MACHINE_KW = 0.25;

// Wages
export const WAGE_RATE_THB_PER_HOUR = 60;