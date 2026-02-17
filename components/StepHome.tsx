import React, { useRef, useState } from 'react';
import { StepProps, CalculationScope } from '../types';
import { Button, Card, Select } from './ui/Components';
import { ArrowRight, Calendar as CalendarIcon, Package, Layers, Sprout, Truck, Scissors, Store, ArrowLeft } from 'lucide-react';

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

type HomeView = 'landing' | 'setup';

const StepHome: React.FC<StepProps> = ({ data, updateData, onNext }) => {
  const [view, setView] = useState<HomeView>('landing');
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  
  // Generate year options: Current year - 2 to Current year + 2
  const currentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 5 }, (_, i) => {
    const y = currentYear - 2 + i;
    return { value: y.toString(), label: y.toString() };
  });

  const handleScopeChange = (scope: CalculationScope) => {
    const now = new Date();
    const defaultMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const defaultYear = now.getFullYear().toString();
    const defaultMonthlyStr = `${defaultYear}-${defaultMonth}`;
    const defaultDateStr = now.toISOString().split('T')[0];

    updateData({ 
      meta: { 
        scope, 
        startDate: scope === 'monthly' ? defaultMonthlyStr : defaultDateStr,
        endDate: scope === 'monthly' ? defaultMonthlyStr : defaultDateStr
      } 
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    updateData({ meta: { ...data.meta, [field]: value } });
  };

  const handleMonthYearChange = (field: 'startDate' | 'endDate', type: 'month' | 'year', value: string) => {
    const currentVal = data.meta[field] || `${currentYear}-01`;
    const [y, m] = currentVal.split('-');
    
    let newVal = '';
    if (type === 'month') {
      newVal = `${y}-${value}`;
    } else {
      newVal = `${value}-${m}`;
    }
    handleDateChange(field, newVal);
  };

  const openPicker = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current && 'showPicker' in ref.current) {
      try {
        (ref.current as any).showPicker();
      } catch (e) {
        // Fallback
      }
    } else {
       ref.current?.focus();
    }
  };

  const validateDates = () => {
    if (!data.meta.startDate || !data.meta.endDate) return false;
    if (data.meta.startDate > data.meta.endDate) return false;
    return true;
  };

  const isFormValid = validateDates();

  const getDropdownValue = (dateStr: string, part: 0 | 1) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return parts[part] || '';
  };

  // --- Views ---

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="space-y-4 pt-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Supply Chain <span className="text-emerald-600">Impact Calculator</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Measure Scope-3 Cradle to Gate carbon footprint and track production composition.
        </p>
      </div>

      {/* Journey Visualization (Merged into Landing) */}
      <div className="max-w-5xl mx-auto w-full mb-12">
        <div className="relative py-8">
          {/* Connector Line */}
          <div className="absolute top-10 left-0 w-full h-1 bg-gray-200 hidden md:block z-0"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative z-10">
            {[
              { icon: Sprout, title: "Cotton Farm", desc: "Farmers" },
              { icon: Truck, title: "Spinner", desc: "Factory" },
              { icon: Scissors, title: "Weaver", desc: "Weavers" },
              { icon: Store, title: "Folkcharm", desc: "Studio" },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 md:bg-transparent md:border-none md:shadow-none hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-emerald-50 text-emerald-600 mb-4 shadow-sm relative z-20">
                  <step.icon size={28} />
                  {idx < 3 && (
                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-gray-300 md:hidden z-10">
                      <ArrowRight size={20}/>
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 text-lg">{step.title}</h4>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Simple Legend */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500 text-center max-w-3xl mx-auto">
            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
              <span className="font-bold block text-emerald-800 mb-0.5">Transport</span>
              Light & Heavy Vehicles
            </div>
            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
              <span className="font-bold block text-emerald-800 mb-0.5">Production</span>
              Home-based craftwomen
            </div>
            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
               <span className="font-bold block text-emerald-800 mb-0.5">Inputs</span>
               Leftover cotton & Recycle Yarn
            </div>
        </div>
      </div>

      {/* Main Action */}
      <div className="pt-4">
        <Button onClick={() => setView('setup')} className="h-14 px-8 text-lg shadow-xl shadow-emerald-500/20">
          Start Calculation <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
      <Card className="max-w-xl w-full mx-auto border-emerald-100 shadow-xl ring-1 ring-emerald-500/10">
        <div className="space-y-6">
          <div className="text-center border-b border-gray-100 pb-4 relative">
             <button 
                onClick={() => setView('landing')} 
                className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
                title="Back to Home"
             >
                <ArrowLeft size={20} />
             </button>
            <h2 className="text-xl font-bold text-gray-900">Calculation Setup</h2>
            <p className="text-sm text-gray-500">Choose your reporting scope</p>
          </div>

          {/* Scope Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleScopeChange('batch')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                data.meta.scope === 'batch'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
              }`}
            >
              <Package className={data.meta.scope === 'batch' ? 'text-emerald-600' : 'text-gray-400'} size={28} />
              <span className="font-semibold">Per Batch</span>
            </button>

            <button
              onClick={() => handleScopeChange('monthly')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                data.meta.scope === 'monthly'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
              }`}
            >
              <Layers className={data.meta.scope === 'monthly' ? 'text-emerald-600' : 'text-gray-400'} size={28} />
              <span className="font-semibold">Monthly Range</span>
            </button>
          </div>

          {/* Date Range Inputs */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-5">
            
            {data.meta.scope === 'batch' ? (
              // BATCH MODE: DATE PICKERS
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Start Date
                  </label>
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => openPicker(startInputRef)}
                  >
                    <input
                      ref={startInputRef}
                      type="date"
                      value={data.meta.startDate}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                    <CalendarIcon 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-emerald-600 transition-colors pointer-events-none" 
                      size={18} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    End Date
                  </label>
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => openPicker(endInputRef)}
                  >
                    <input
                      ref={endInputRef}
                      type="date"
                      value={data.meta.endDate}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                    <CalendarIcon 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-emerald-600 transition-colors pointer-events-none" 
                      size={18} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              // MONTHLY MODE: DROPDOWNS
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      From Month
                    </label>
                    <div className="flex gap-2">
                      <Select 
                        label="" 
                        className="mb-0 flex-1"
                        options={MONTHS} 
                        value={getDropdownValue(data.meta.startDate, 1)}
                        onChange={(e) => handleMonthYearChange('startDate', 'month', e.target.value)}
                      />
                      <Select 
                        label=""
                        className="mb-0 w-24"
                        options={YEARS} 
                        value={getDropdownValue(data.meta.startDate, 0)}
                        onChange={(e) => handleMonthYearChange('startDate', 'year', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      To Month
                    </label>
                    <div className="flex gap-2">
                      <Select 
                        label="" 
                        className="mb-0 flex-1"
                        options={MONTHS} 
                        value={getDropdownValue(data.meta.endDate, 1)}
                        onChange={(e) => handleMonthYearChange('endDate', 'month', e.target.value)}
                      />
                      <Select 
                        label=""
                        className="mb-0 w-24"
                        options={YEARS} 
                        value={getDropdownValue(data.meta.endDate, 0)}
                        onChange={(e) => handleMonthYearChange('endDate', 'year', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-400 text-center">
              {data.meta.scope === 'batch' 
                ? "Define the production window for this batch." 
                : "Aggregates data for the selected range of months."}
            </p>
            
            {data.meta.startDate && data.meta.endDate && data.meta.startDate > data.meta.endDate && (
              <p className="text-xs text-red-500 text-center font-medium bg-red-50 p-2 rounded">
                End date cannot be before start date.
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button 
              onClick={onNext} 
              fullWidth 
              className="h-12 text-lg"
              disabled={!isFormValid}
            >
              Start <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      {view === 'landing' && renderLanding()}
      {view === 'setup' && renderSetup()}
    </div>
  );
};

export default StepHome;