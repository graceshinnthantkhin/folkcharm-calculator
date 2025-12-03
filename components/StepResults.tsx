
import React, { useMemo, useState } from 'react';
import { StepProps } from '../types';
import { Button, Card } from './ui/Components';
import { calculateResults } from '../utils/calculator';
import { RefreshCcw, Download, CheckCircle, Leaf, Truck, Factory, Scale, Calendar, FileText, Tag, Calculator, Package } from 'lucide-react';
import { BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Bar } from 'recharts';

const StepResults: React.FC<StepProps> = ({ data, onBack, onRestart }) => {
  const results = useMemo(() => calculateResults(data), [data]);
  const [productWeightInput, setProductWeightInput] = useState<string>('');

  const chartData = [
    { name: 'Materials', value: results.emissions.materials, color: '#47634d' }, 
    { name: 'Logistics', value: results.emissions.logistics, color: '#587c5f' }, 
    { name: 'Production', value: results.emissions.production, color: '#729979' }, 
  ];

  const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Calculate specific product emission based on input
  const singleProductEmission = useMemo(() => {
    const weight = parseFloat(productWeightInput);
    if (isNaN(weight) || weight <= 0) return 0;
    return weight * results.productionStats.emissionPerKg;
  }, [productWeightInput, results.productionStats.emissionPerKg]);

  // Format date based on scope and range
  const formattedDate = useMemo(() => {
    const { startDate, endDate, scope } = data.meta;
    if (!startDate || !endDate) return 'N/A';

    const formatDate = (dateStr: string) => {
      const parts = dateStr.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      
      if (isNaN(year) || isNaN(month)) return dateStr;

      if (scope === 'monthly') {
        // Create date for the 1st of the month. Note: Month is 0-indexed in JS Date
        const dateObj = new Date(year, month - 1);
        return dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
      
      const day = parseInt(parts[2]);
      if (isNaN(day)) return dateStr;
      
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString('en-US', { dateStyle: 'medium' });
    };

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    if (start === end) return start;
    return `${start} — ${end}`;
  }, [data.meta]);

  const reportTitle = data.meta.scope === 'monthly' ? 'Monthly Production Report' : 'Production Batch Report';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">
      
      {/* Print Header - Visible only when printing */}
      <div className="hidden print:block text-center mb-8 border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Folkcharm Supply Chain - {reportTitle}</h1>
        <div className="flex justify-center gap-6 text-sm text-gray-600 mt-2">
            <span><strong>Period:</strong> {formattedDate}</span>
            <span><strong>Generated:</strong> {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Screen Header - Hidden when printing */}
      <div className="print:hidden text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full text-emerald-700 mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Calculation Complete</h2>
        <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
            <Calendar size={16} /> 
            <span>{formattedDate}</span>
            <span className="mx-1">•</span>
            <FileText size={16} />
            <span className="capitalize">{data.meta.scope} Report</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Card A: Environmental Impact */}
        <Card className="border-t-4 border-t-emerald-700 break-inside-avoid">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Leaf className="text-emerald-600" size={20}/> Environmental Impact
                </h3>
                <p className="text-sm text-gray-500">Scope 3 Carbon Footprint Analysis</p>
              </div>
              
              <div className="flex gap-6 w-full md:w-auto bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-right flex-1 md:flex-initial">
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(results.emissions.total)}</p>
                  <p className="text-xs text-gray-500 uppercase font-semibold">kg CO₂e Total</p>
                </div>
                <div className="w-px bg-gray-300 self-stretch"></div>
                <div className="text-right flex-1 md:flex-initial">
                   <p className="text-3xl font-bold text-emerald-600">{formatNumber(results.productionStats.emissionPerKg)}</p>
                   <p className="text-xs text-emerald-600 uppercase font-semibold">kg CO₂e / kg Product</p>
                </div>
              </div>
           </div>

           {/* Chart */}
           <div className="h-40 mb-6 print:h-48">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} interval={0} />
                 <Tooltip 
                    formatter={(value: number) => [`${formatNumber(value)} kg CO₂e`, 'Emissions']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>

           {/* List Breakdown */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
             <div className="flex justify-between items-center p-3 bg-gray-50 rounded print:border print:border-gray-100">
               <span className="flex items-center gap-2 text-gray-700"><SproutIcon className="w-4 h-4 text-emerald-700"/> Materials</span>
               <span className="font-semibold text-gray-900">{formatNumber(results.emissions.materials)} kg</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-gray-50 rounded print:border print:border-gray-100">
               <span className="flex items-center gap-2 text-gray-700"><Truck className="w-4 h-4 text-emerald-600"/> Logistics</span>
               <span className="font-semibold text-gray-900">{formatNumber(results.emissions.logistics)} kg</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-gray-50 rounded print:border print:border-gray-100">
               <span className="flex items-center gap-2 text-gray-700"><Factory className="w-4 h-4 text-emerald-500"/> Production</span>
               <span className="font-semibold text-gray-900">{formatNumber(results.emissions.production)} kg</span>
             </div>
           </div>
           
           <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center gap-1"><Scale size={14}/> Total Weight</span>
              <span className="font-mono">{formatNumber(results.productionStats.totalWeight)} kg</span>
           </div>
        </Card>

        {/* Product Calculator - Print Hidden, Interactive Tool */}
        <div className="print:hidden">
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/30">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 hidden sm:block">
                        <Calculator size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Product Impact Calculator</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Estimate the carbon footprint of a specific item (e.g., one shirt) based on the emission intensity of this batch.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-end gap-4">
                             <div className="w-full sm:w-48">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    Item Weight
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={productWeightInput}
                                        onChange={(e) => setProductWeightInput(e.target.value)}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">kg</span>
                                </div>
                             </div>

                             <div className="flex-1 bg-white p-3 rounded-lg border border-blue-100 flex items-center justify-between shadow-sm w-full">
                                <span className="text-sm text-gray-600 flex items-center gap-2">
                                    <Tag size={16} /> Est. Footprint:
                                </span>
                                <span className="text-xl font-bold text-blue-700">
                                    {formatNumber(singleProductEmission)} <span className="text-xs font-normal text-blue-500">kg CO₂e</span>
                                </span>
                             </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8 print:hidden">
        <Button variant="outline" onClick={onBack}>
          Back to Edit
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          <Download className="mr-2 w-4 h-4" /> Export PDF
        </Button>
        <Button onClick={onRestart}>
          <RefreshCcw className="mr-2 w-4 h-4" /> Start New Calculation
        </Button>
      </div>
    </div>
  );
};

// Helper Icon for visual variety
const SproutIcon = ({ className }: {className?: string}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.2.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1.7-1.3 2.9-3.8 3-6-2.9.3-4.7 1.5-6.2 3.4z" />
  </svg>
)

export default StepResults;
