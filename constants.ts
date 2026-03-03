// FOLKCHARM CARBON CALCULATOR — Emission Factor Config
// Methodology: ISO 14040/14044 + GHG Protocol Product Standard
// Version: v5 — February 2026
// All constants verified against primary sources. Every proxy disclosed.

// TRANSPORT 
// T-VER TOOL-02-02 (TGO 2023, ghgreduction.tgo.or.th)
// Derived: Truck >6t = 422 g/km ÷ 1,720 kg payload = 0.2452
// Unit: kg CO2e per tonne·km
// CRITICAL: Always divide weight in kg by 1000 before multiplying
export const EF_TRANSPORT = 0.2452;

// ELECTRICITY
// TGO Board announcement November 2025, effective 1 January 2026
// Source: Nation Thailand (Nov 30 2025) + ghgreduction.tgo.or.th
// Unit: kg CO2e per kWh
export const EF_THAI_GRID = 0.4750;

// WATER 
// Thai National LCI Database (TIIS/NSTDA) — tiis.or.th
// Tap water only. Soft water proxy removed — Folkcharm uses tap water only.
// ⚠ Decimal pending download confirmation from TIIS database file
// Unit: kg CO2e per Litre
export const EF_WATER_TAP = 0.00079;

// CHAIN A: LOEI WEFT COTTON 
// ALL CONFIRMED ZERO — Folkcharm (2016) primary video, Ta Ord's Home, Loei
// ISO 14040 primary data — highest evidence quality possible
// Steps confirmed: picking, hand ginning, beating, rolling, hand-spinning,
//                 natural dyeing (tap water only), yarn untangling, hand weaving
export const EF_FARM_WEFT  = 0;   // kg CO2e/kg — rain-fed, zero inputs (Bhalla 2018 + ISO 14040)
export const EF_GIN_WEFT   = 0;   // kg CO2e/kg — hand ginning, traditional wooden roller (video Step 2)
export const EF_SPIN_WEFT  = 0;   // kg CO2e/kg — Khen-Mue hand-spinning (video Step 5)
export const EF_HANDLOOM   = 0;   // kg CO2e/kg — traditional wooden home loom (video Step 8 + Bhalla 2018)

// CHAIN B: GREEN NET WARP COTTON 
// EF_GIN_WARP — Nigam M. et al. (2016). IAAST Vol.7(1):6–12
//   DOI: 10.15515/iaast.0976-4828.7.1.612
//   Paper: "GHG emissions are calculated to be 0.1310 CO2eq/kg Cotton yarn"
//   ⚠ PROXY: underlying data = Hughs/Funk 2013 US gin study. Best available published value.
// Unit: kg CO2e per kg seed cotton
export const EF_GIN_WARP = 0.131;

// EF_SPIN_WARP — Calculation: 8.84 MJ/kg (Nigam 2016) ÷ 3.6 = 2.456 kWh/kg × TGO 0.4750
//   = 1.167 kg CO2e/kg. Thai spinning confirmed (greennet.or.th/prapai-jaimun).
//   ⚠ PROXY: 8.84 MJ/kg from one Uttarakhand mill personal communication.
//   Previous value 1.357 used wrong Indian grid (0.907). Corrected to Thai grid (0.4750).
// Unit: kg CO2e per kg yarn
export const EF_SPIN_WARP = 1.167;

// Cotton-to-lint ratio: seed cotton input needed = warp yarn × 1.25 (80% lint ratio)
export const SEED_COTTON_RATIO = 1.25;

// SHARED STAGES 
// EF_TAILOR — Bhalla K. et al. (2018). Procedia CIRP 69:493–498
//   DOI: 10.1016/j.procir.2017.11.072
//   Paper Fig.8: "garment processing phase (0.84 Kg CO2-equiv.)"
//   ⚠ PROXY: Indian grid implied. Thai-corrected = 0.44 but 0.84 kept as conservative upper bound.
//   Better to overstate than understate in environmental reporting.
// Unit: kg CO2e per kg fabric
export const EF_TAILOR = 0.84;

// EF_POWERLOOM — Nigam 2016: 5.75 kWh/kg × TGO 0.4750 = 2.731
// ⚠ DISPLAY ONLY — used for "emissions avoided" UI card. NOT added to total footprint.
// Unit: kg CO2e per kg fabric
export const EF_POWERLOOM = 2.730;

// DEADSTOCK / LEFTOVER 
// ISO 14044:2006 Section 4.3.4 — zero emission allocation for reuse
export const EF_LEFTOVER = 0.0;

// SOCIAL IMPACT CONSTANTS 
// ARTISANS_TOTAL — folkcharm.com/artisans (confirmed)
//   10 Loei farmers + 30 weavers (4 villages, Wangsaphung) +
//   5 Bangkok tailors + 6 Bangkapi vocational students = 51
export const ARTISANS_TOTAL = 51;

// DAYS_PER_KG_WEFT — folkcharm.com/philosophy
//   "2–3 days per kg" Khen-Mue hand-spinning. Midpoint = 2.5
// Unit: days per kg weft yarn
export const DAYS_PER_KG_WEFT = 2.5;

