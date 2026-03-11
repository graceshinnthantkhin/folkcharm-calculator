/**
 * Export calculator state + results to CSV (opens in Excel).
 * One header row, one data row — flat summary for this batch.
 */

import { CalculatorState } from '../types';
import { CalculationResults } from './calculator';

function escapeCsv(value: string | number): string {
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function buildCsv(data: CalculatorState, results: CalculationResults): string {
  const { meta, materials, logistics, electricity, water, tailoring, social } = data;
  const { emissions, social: socialResults } = results;

  const rows: string[][] = [];

  // Section 1: Meta
  rows.push(['Scope', 'Start date', 'End date']);
  rows.push([meta.scope, meta.startDate ?? '', meta.endDate ?? '']);

  rows.push([]);

  // Section 2: Materials (inputs)
  rows.push(['Materials', 'Value', 'Unit']);
  rows.push(['Finished fabric', materials.fabricKg, 'kg']);
  rows.push(['Loei weft cotton', materials.loeiCottonKg, 'kg']);
  rows.push(['GreenNet warp yarn', materials.greenNetYarnKg, 'kg']);
  rows.push(['Leftover / deadstock', materials.leftoverKg, 'kg']);

  rows.push([]);

  // Section 3: Carbon results
  rows.push(['Carbon (emissions)', 'Value', 'Unit']);
  rows.push(['Total', emissions.total.toFixed(4), 'kg CO2e']);
  rows.push(['Per kg fabric', emissions.perKgFabric.toFixed(4), 'kg CO2e/kg']);
  rows.push(['Chain A (Loei weft)', emissions.chainA, 'kg CO2e']);
  rows.push(['Ginning (warp)', emissions.ginWarp.toFixed(4), 'kg CO2e']);
  rows.push(['Spinning (warp)', emissions.spinWarp.toFixed(4), 'kg CO2e']);
  rows.push(['Tailoring', emissions.tailoring.toFixed(4), 'kg CO2e']);
  rows.push(['Logistics', emissions.logistics.toFixed(4), 'kg CO2e']);
  rows.push(['Electricity', emissions.electricity.toFixed(4), 'kg CO2e']);
  rows.push(['Water', emissions.water.toFixed(4), 'kg CO2e']);
  rows.push(['Scrap transport', emissions.scraps.toFixed(4), 'kg CO2e']);

  rows.push([]);

  // Section 4: Social results
  rows.push(['Social', 'Value', 'Unit']);
  rows.push(['Artisans supported', socialResults.artisansSupported, '']);
  rows.push(['Payment to artisans', socialResults.artisanIncomePerBatch.toFixed(2), 'THB']);
  rows.push(['Revenue share to makers', socialResults.revenueSharePercent.toFixed(2), '%']);
  rows.push(['FTE jobs', socialResults.fteJobs.toFixed(2), '']);
  rows.push(['Artisan work hours', socialResults.artisanWorkHours.toFixed(2), '']);
  rows.push(['Women artisans', socialResults.womenArtisansPercent.toFixed(2), '%']);
  rows.push(['Craft days preserved', socialResults.skillDaysPreserved.toFixed(2), '']);
  rows.push(['Emissions avoided (vs power loom)', socialResults.emissionsAvoided.toFixed(4), 'kg CO2e']);

  rows.push([]);

  // Section 5: Other inputs (tailoring, transport count)
  rows.push(['Other inputs', 'Value', 'Unit']);
  rows.push(['Fabric to tailors', tailoring.fabricKg, 'kg']);
  rows.push(['Scraps to reuse', tailoring.scrapsKg, 'kg']);
  rows.push(['Scrap transport distance', tailoring.scrapsDistKm, 'km']);
  rows.push(['Transport legs', logistics.entries.length, '']);
  rows.push(['Electricity entries', electricity.entries.length, '']);
  rows.push(['Water entries', water.entries.length, '']);

  return rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
}

export function downloadCsv(data: CalculatorState, results: CalculationResults, filename?: string): void {
  const csv = buildCsv(data, results);
  const name = filename || `folkcharm-batch-${data.meta.startDate || 'report'}.csv`;
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
