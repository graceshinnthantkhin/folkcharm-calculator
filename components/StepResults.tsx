import React, { useMemo } from 'react';
import { StepProps } from '../types';
import { Button, Card } from './ui/Components';
import { calculateResults } from '../utils/calculator';
import { downloadCsv } from '../utils/exportCsv';
import {
  RefreshCcw, Download, CheckCircle, Leaf, Truck, Zap, Droplet,
  Calendar, FileText, Users, Wind, Scissors, Recycle, Factory, FileSpreadsheet,
} from 'lucide-react';
import { BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Bar } from 'recharts';

const StepResults: React.FC<StepProps> = ({ data, onBack, onRestart }) => {
  const results = useMemo(() => calculateResults(data), [data]);

  const fmt = (n: number, d = 2) =>
    n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

  const chartData = [
    { name: 'Ginning',   value: results.emissions.ginWarp,     color: '#047857' },
    { name: 'Spinning',  value: results.emissions.spinWarp,    color: '#059669' },
    { name: 'Tailoring', value: results.emissions.tailoring,   color: '#7c3aed' },
    { name: 'Logistics', value: results.emissions.logistics,   color: '#475569' },
    { name: 'Energy',    value: results.emissions.electricity, color: '#d97706' },
    { name: 'Water',     value: results.emissions.water,       color: '#2563eb' },
    { name: 'Scraps',    value: results.emissions.scraps,      color: '#0d9488' },
  ].filter((d) => d.value > 0);

  const formattedDate = useMemo(() => {
    const { startDate, endDate, scope } = data.meta;
    if (!startDate || !endDate) return 'N/A';
    const formatDate = (dateStr: string) => {
      const parts = dateStr.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      if (scope === 'monthly') {
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
      return new Date(year, month - 1, parseInt(parts[2])).toLocaleDateString('en-US', { dateStyle: 'medium' });
    };
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return start === end ? start : `${start} — ${end}`;
  }, [data.meta]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">

      {/* Header */}
      <div className="print:hidden text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full text-emerald-700 mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Calculation Complete</h2>
        <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
          <Calendar size={16} /> <span>{formattedDate}</span>
          <span className="mx-1">•</span>
          <FileText size={16} /> <span className="capitalize">{data.meta.scope} Report</span>
        </div>
      </div>

      {/* Chain A zero callout */}
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800">
        <Leaf className="shrink-0 mt-0.5 text-emerald-600" size={18} />
        <div>
          <strong>Chain A (Loei weft) = 0 kg CO₂e</strong> — Hand picking, hand ginning, Khen-Mue hand-spinning,
          and hand weaving all confirmed zero-emission. Source: Folkcharm 2016 primary video (ISO 14040 highest quality).
        </div>
      </div>

      {/* Carbon Results */}
      <Card className="border-t-4 border-t-emerald-700 break-inside-avoid">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Leaf className="text-emerald-600" size={20} /> Environmental Impact
            </h3>
            <p className="text-sm text-gray-500">ISO 14040/14044 + GHG Protocol — Cradle-to-Gate</p>
          </div>
          <div className="flex gap-6 w-full md:w-auto bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="text-right flex-1 md:flex-initial">
              <p className="text-3xl font-bold text-gray-900">{fmt(results.emissions.total)}</p>
              <p className="text-xs text-gray-500 uppercase font-semibold">kg CO₂e Total</p>
            </div>
            <div className="w-px bg-gray-300 self-stretch"></div>
            <div className="text-right flex-1 md:flex-initial">
              <p className="text-3xl font-bold text-emerald-600">{fmt(results.emissions.perKgFabric)}</p>
              <p className="text-xs text-emerald-600 uppercase font-semibold">kg CO₂e / kg Fabric</p>
            </div>
          </div>
        </div>

        {/* Bar chart */}
        {chartData.length > 0 ? (
          <div className="h-52 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={88} tick={{ fontSize: 12 }} interval={0} />
                <Tooltip
                  formatter={(value: number) => [`${fmt(value)} kg CO₂e`, 'Emissions']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-gray-400 text-sm mb-6">
            No non-zero emissions to display. All inputs may be zero.
          </div>
        )}

        {/* Breakdown grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="flex items-center gap-1.5 text-gray-500 mb-1 text-xs"><Leaf size={12} className="text-emerald-700" /> Chain A</span>
            <span className="font-bold text-emerald-700">0.00 kg ✓</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="flex items-center gap-1.5 text-gray-500 mb-1 text-xs"><Factory size={12} className="text-emerald-600" /> Ginning</span>
            <span className="font-bold text-gray-900">{fmt(results.emissions.ginWarp)} kg</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="flex items-center gap-1.5 text-gray-500 mb-1 text-xs"><Factory size={12} className="text-emerald-500" /> Spinning</span>
            <span className="font-bold text-gray-900">{fmt(results.emissions.spinWarp)} kg</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="flex items-center gap-1.5 text-gray-500 mb-1 text-xs"><Scissors size={12} className="text-purple-500" /> Tailoring</span>
            <span className="font-bold text-gray-900">{fmt(results.emissions.tailoring)} kg</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="flex items-center gap-1.5 text-gray-500 mb-1 text-xs"><Truck size={12} className="text-slate-500" /> Logistics</span>
            <span className="font-bold text-gray-900">{fmt(results.emissions.logistics)} kg</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="flex items-center gap-1.5 text-gray-500 mb-1 text-xs"><Zap size={12} className="text-yellow-600" /> Energy</span>
            <span className="font-bold text-gray-900">{fmt(results.emissions.electricity)} kg</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="flex items-center gap-1.5 text-gray-500 mb-1 text-xs"><Droplet size={12} className="text-blue-500" /> Water</span>
            <span className="font-bold text-gray-900">{fmt(results.emissions.water)} kg</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="flex items-center gap-1.5 text-gray-500 mb-1 text-xs"><Recycle size={12} className="text-teal-500" /> Scraps</span>
            <span className="font-bold text-gray-900">{fmt(results.emissions.scraps)} kg</span>
          </div>
        </div>
      </Card>

      {/* Social Impact Card — all from user input, no hardcoding */}
      <Card className="border-t-4 border-t-amber-400">
        <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Users className="text-amber-500" size={20} /> Social Impact
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Calculated from your Social step inputs (artisans, hours, income, revenue share, gender, craft days)
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* SI1 */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-amber-100 rounded-full">
                <Users size={22} className="text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-700">{results.social.artisansSupported}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">Artisans (SI1)</p>
          </div>

          {/* SI1b — Income */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700">
              {results.social.artisanIncomePerBatch.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs font-semibold text-gray-700 mt-1">THB to Artisans</p>
          </div>

          {/* SI2 */}
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-teal-700">{fmt(results.social.revenueSharePercent, 1)}%</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">Revenue to Makers (SI2)</p>
          </div>

          {/* SI3 — FTE */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-indigo-700">{fmt(results.social.fteJobs, 2)}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">FTE Jobs (SI3)</p>
            <p className="text-xs text-gray-500 mt-0.5">hours ÷ 160</p>
          </div>

          {/* SI4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-700">{fmt(results.social.artisanWorkHours, 1)}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">Artisan Hours (SI4)</p>
          </div>

          {/* SI5 */}
          <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-pink-700">{fmt(results.social.womenArtisansPercent, 1)}%</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">Women Artisans (SI5)</p>
          </div>

          {/* SI7 */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{fmt(results.social.skillDaysPreserved, 1)}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">Craft Days (SI7)</p>
            <p className="text-xs text-gray-500 mt-0.5">hand-spinning preserved</p>
          </div>

          {/* Emissions avoided — important: how much they reduced by using hand looms */}
          <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4 text-center ring-2 ring-blue-200/50">
            <div className="flex justify-center mb-1">
              <Wind size={24} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-700">{fmt(results.social.emissionsAvoided)}</p>
            <p className="text-sm font-bold text-gray-800 mt-1">kg CO₂e Avoided</p>
            <p className="text-xs font-medium text-gray-600 mt-0.5">vs factory power loom (Thai grid)</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3 mt-8 print:hidden">
        <Button variant="outline" onClick={onBack}>Back to Edit</Button>
        <Button variant="secondary" onClick={() => window.print()}>
          <Download className="mr-2 w-4 h-4" /> Export PDF
        </Button>
        <Button variant="secondary" onClick={() => downloadCsv(data, results)}>
          <FileSpreadsheet className="mr-2 w-4 h-4" /> Export CSV
        </Button>
        <Button onClick={onRestart}>
          <RefreshCcw className="mr-2 w-4 h-4" /> Start New
        </Button>
      </div>
    </div>
  );
};

export default StepResults;
