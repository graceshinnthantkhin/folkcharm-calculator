import React, { useRef } from 'react';
import { StepProps, CalculationScope } from '../types';
import { Button, Card, Select } from './ui/Components';
import { ArrowRight, Calendar as CalendarIcon, Package, Layers } from 'lucide-react';

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

const StepHome: React.FC<StepProps> = ({ data, updateData, onNext }) => {
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  
  // Generate year options: Current year - 2 to Current year + 2
  const currentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 5 }, (_, i) => {
    const y = currentYear - 2 + i;
    return { value: y.toString(), label: y.toString() };
  });

  const handleScopeChange = (scope: CalculationScope) => {
    // Reset dates when switching scope to avoid format conflicts
    // Default to current month/year for monthly
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
    updateData({ 
      meta: { 
        ...data.meta, 
        [field]: value 
      } 
    });
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
        // Fallback or ignore
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

  // Helper to extract dropdown values from state string "YYYY-MM"
  const getDropdownValue = (dateStr: string, part: 0 | 1) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return parts[part] || '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Supply Chain <span className="text-emerald-600">Impact Calculator</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Measure Scope 3 carbon footprint and track production composition.
        </p>
      </div>

      {/* Configuration Section */}
      <Card className="max-w-xl mx-auto border-emerald-100 shadow-md">
        <div className="space-y-6">
          <div className="text-center border-b border-gray-100 pb-4">
            <h2 className="text-lg font-semibold text-gray-800">New Calculation Setup</h2>
            <p className="text-sm text-gray-500">Choose your reporting scope and period</p>
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
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white cursor-pointer"
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
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white cursor-pointer"
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
              Start Calculation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Feature Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white/50">
           <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700"><Layers size={20}/></div>
           <div>
             <h4 className="font-semibold text-gray-900">Flexible Reporting</h4>
             <p className="text-sm text-gray-500">Track single batches or aggregate monthly data for broader analysis.</p>
           </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white/50">
           <div className="p-2 bg-blue-100 rounded-lg text-blue-700"><Package size={20}/></div>
           <div>
             <h4 className="font-semibold text-gray-900">Client-Side Privacy</h4>
             <p className="text-sm text-gray-500">Data stays on your device. Securely export reports as PDF when needed.</p>
           </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-sm text-gray-400">
          Built for internal use • Version 1.1.0
        </p>
      </div>
    </div>
  );
};

export default StepHome;