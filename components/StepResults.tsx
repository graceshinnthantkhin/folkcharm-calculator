import React, { useMemo } from 'react';
import { StepProps } from '../types';
import { Button, Card } from './ui/Components';
import { calculateResults } from '../utils/calculator';
import { RefreshCcw, Download, CheckCircle, Leaf, Users, Shirt, Truck, Factory, FileCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StepResults: React.FC<StepProps> = ({ data, onBack }) => {
  const results = useMemo(() => calculateResults(data), [data]);

  const chartData = [
    { name: 'Materials', value: results.emissions.materials, color: '#47634d' }, 
    { name: 'Logistics', value: results.emissions.logistics, color: '#587c5f' }, 
    { name: 'Production', value: results.emissions.production, color: '#729979' }, 
    { name: 'Delivery', value: results.emissions.delivery, color: '#94b69a' }, 
  ];

  const handleRestart = () => {
    // Clear the persisted state so the app reloads with initial state
    localStorage.removeItem('folkcharm_calc_state');
    window.location.reload();
  };

  const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full text-emerald-700 mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Calculation Complete</h2>
        <p className="text-gray-500 mt-2">Here is the comprehensive breakdown of your batch.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card A: Environmental Impact */}
        <Card className="border-t-4 border-t-emerald-700">
           <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Leaf className="text-emerald-600" size={20}/> Environmental Impact
                </h3>
                <p className="text-sm text-gray-500">Scope 3 Carbon Footprint</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{formatNumber(results.emissions.total)}</p>
                <p className="text-xs text-gray-500 uppercase font-semibold">kg CO₂e Total</p>
              </div>
           </div>

           {/* Chart */}
           <div className="h-48 mb-6">
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
           <div className="space-y-3 text-sm">
             <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
               <span className="flex items-center gap-2 text-gray-700"><SproutIcon className="w-4 h-4 text-emerald-700"/> Materials</span>
               <span className="font-semibold text-gray-900">{formatNumber(results.emissions.materials)} kg</span>
             </div>
             <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
               <span className="flex items-center gap-2 text-gray-700"><Truck className="w-4 h-4 text-emerald-600"/> Logistics</span>
               <span className="font-semibold text-gray-900">{formatNumber(results.emissions.logistics)} kg</span>
             </div>
             <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
               <span className="flex items-center gap-2 text-gray-700"><Factory className="w-4 h-4 text-emerald-500"/> Production</span>
               <span className="font-semibold text-gray-900">{formatNumber(results.emissions.production)} kg</span>
             </div>
             <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
               <span className="flex items-center gap-2 text-gray-700"><Truck className="w-4 h-4 text-emerald-400"/> Delivery</span>
               <span className="font-semibold text-gray-900">{formatNumber(results.emissions.delivery)} kg</span>
             </div>
           </div>
        </Card>

        {/* Card B: Social Impact */}
        <Card className="border-t-4 border-t-amber-500">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-amber-500" size={20}/> Social Impact
            </h3>
            <p className="text-sm text-gray-500">Fair Wages</p>
          </div>

          <div className="space-y-6">
            <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-100">
               <p className="text-sm text-amber-800 font-medium mb-1">Total Fair Wages Paid</p>
               <p className="text-4xl font-bold text-amber-900">฿{formatNumber(results.social.wages)}</p>
               <p className="text-xs text-amber-700 mt-2">Based on {results.social.hoursVerified} sewing hours</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <Shirt className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-xl font-bold text-gray-800">{results.social.itemCount}</p>
                <p className="text-xs text-gray-500">Items Produced</p>
              </div>
              <div className={`p-4 rounded-lg text-center border ${data.production.logbookFile ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-transparent'}`}>
                {data.production.logbookFile ? (
                   <>
                     <FileCheck className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                     <p className="text-sm font-bold text-emerald-800">Verified</p>
                     <p className="text-xs text-emerald-600 truncate max-w-full px-1">{data.production.logbookFile}</p>
                   </>
                ) : (
                   <>
                     <FileCheck className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                     <p className="text-sm font-bold text-gray-400">Not Verified</p>
                     <p className="text-xs text-gray-400">No Logbook</p>
                   </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Edit
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          <Download className="mr-2 w-4 h-4" /> Export PDF
        </Button>
        <Button onClick={handleRestart}>
          <RefreshCcw className="mr-2 w-4 h-4" /> Start New Batch
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