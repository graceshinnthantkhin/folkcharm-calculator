import React from 'react';
import { StepProps, LogisticsEntry } from '../types';
import { Input, Button } from './ui/Components';
import { ArrowLeft, ArrowRight, Plus, Trash2, AlertTriangle } from 'lucide-react';

// Default 6 transport legs — weight and distance both 0; user enters all values (no pre-fill from Materials)
const buildDefaultLegs = (): LogisticsEntry[] => [
  { id: crypto.randomUUID(), description: 'Farms → gin site', weightKg: 0, distanceKm: 0 },
  { id: crypto.randomUUID(), description: 'Gin → hand-spinners', weightKg: 0, distanceKm: 0 },
  { id: crypto.randomUUID(), description: 'Weft yarn → weavers', weightKg: 0, distanceKm: 0 },
  { id: crypto.randomUUID(), description: 'Warp mill → weavers', weightKg: 0, distanceKm: 0 },
  { id: crypto.randomUUID(), description: 'Weavers → studio', weightKg: 0, distanceKm: 0 },
  { id: crypto.randomUUID(), description: 'Studio → tailors / scrap reuse', weightKg: 0, distanceKm: 0 },
];

const StepLogistics: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const entries = data.logistics.entries;

  const handleAdd = () => {
    const newEntry: LogisticsEntry = {
      id: crypto.randomUUID(),
      description: '',
      weightKg: 0,
      distanceKm: 0,
    };
    updateData({ logistics: { entries: [...entries, newEntry] } });
  };

  const handleRemove = (id: string) => {
    updateData({ logistics: { entries: entries.filter((e) => e.id !== id) } });
  };

  const handleChange = (id: string, field: keyof LogisticsEntry, value: string) => {
    updateData({
      logistics: {
        entries: entries.map((e) =>
          e.id === id
            ? { ...e, [field]: field === 'weightKg' || field === 'distanceKm' ? parseFloat(value) || 0 : value }
            : e
        ),
      },
    });
  };

  // Pre-populate 6 empty legs on first visit (user enters weight and distance for each)
  React.useEffect(() => {
    if (entries.length === 0) {
      updateData({ logistics: { entries: buildDefaultLegs() } });
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto min-h-[60vh] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Transportation Logistics</h2>
        <p className="text-gray-500">
          All 6 supply chain legs. Emissions = weight (kg) ÷ 1000 × distance (km) × 0.2452 kg CO₂e/t·km.
        </p>
      </div>

      <div className="w-full flex items-start gap-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-3 mb-6">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-slate-500" />
        <span>
          <strong>Add the transportation used for this batch.</strong> For each leg (trip) in your supply chain, enter a description, weight carried (kg), and distance (km). You can add or remove legs to match your business.
        </span>
      </div>

      <div className="w-full space-y-3 mb-8">
        {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex flex-col xl:flex-row items-end gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
            >
              {/* Leg number badge */}
              <div className="hidden xl:flex w-7 h-7 shrink-0 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold items-center justify-center mb-2">
                {index + 1}
              </div>

              {/* Description */}
              <div className="flex-[3] w-full">
                <Input
                  label={index === 0 ? 'Description (Leg)' : ''}
                  placeholder="e.g., Farm to Spinner"
                  className="mb-0"
                  value={entry.description}
                  onChange={(e) => handleChange(entry.id, 'description', e.target.value)}
                />
              </div>

              {/* Weight */}
              <div className="flex-1 w-full min-w-[120px]">
                <Input
                  label={index === 0 ? 'Weight' : ''}
                  type="number"
                  min="0"
                  placeholder="0"
                  suffix="kg"
                  className="mb-0"
                  value={entry.weightKg || ''}
                  onChange={(e) => handleChange(entry.id, 'weightKg', e.target.value)}
                />
              </div>

              {/* Distance */}
              <div className="flex-1 w-full min-w-[130px]">
                <Input
                  label={index === 0 ? 'Distance' : ''}
                  type="number"
                  min="0"
                  placeholder="0"
                  suffix="km"
                  className="mb-0"
                  value={entry.distanceKm || ''}
                  onChange={(e) => handleChange(entry.id, 'distanceKm', e.target.value)}
                />
              </div>

              {/* Remove button */}
              <div className="pb-1">
                <button
                  onClick={() => handleRemove(entry.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  disabled={entries.length <= 1}
                  title="Remove leg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

        <div className="flex justify-center pt-4">
          <button
            onClick={handleAdd}
            className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-all shadow-md hover:scale-110 active:scale-95"
            title="Add another transport leg"
          >
            <Plus size={28} />
          </button>
        </div>
      </div>

      <div className="mt-auto w-full flex justify-between items-center pt-8">
        <Button variant="secondary" onClick={onBack} className="px-8 h-12">
          <ArrowLeft className="mr-2" size={20} /> Back
        </Button>
        <Button onClick={onNext} className="px-12 h-12 bg-emerald-600 text-white shadow-lg">
          Electricity Usage <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default StepLogistics;
