import React from 'react';
import { StepProps, LogisticsEntry } from '../types';
import { Input, Button } from './ui/Components';
import { ArrowLeft, ArrowRight, Plus, Trash2, AlertTriangle } from 'lucide-react';

// Default 6 transport legs per v5 methodology
// Leg 5 (600km to Bangkok) is the only CONFIRMED distance — folkcharm.com/travels
// Legs 1 and 4 are data gaps — user must fill distance
const buildDefaultLegs = (
  loeiKg: number,
  greenNetKg: number,
  fabricKg: number
): LogisticsEntry[] => [
  {
    id: crypto.randomUUID(),
    description: 'Phuluang farms → gin site',
    weightKg: loeiKg,
    distanceKm: 0,
  },
  {
    id: crypto.randomUUID(),
    description: 'Gin → hand-spinners',
    weightKg: loeiKg,
    distanceKm: 20,
  },
  {
    id: crypto.randomUUID(),
    description: 'Weft yarn → weavers (Phuluang → Wangsaphung)',
    weightKg: loeiKg,
    distanceKm: 70,
  },
  {
    id: crypto.randomUUID(),
    description: 'Green Net mill → weavers',
    weightKg: greenNetKg,
    distanceKm: 0,
  },
  {
    id: crypto.randomUUID(),
    description: 'Weavers → Bangkok (Kerry Express) ✓ confirmed',
    weightKg: fabricKg,
    distanceKm: 600,
  },
  {
    id: crypto.randomUUID(),
    description: 'Studio → tailors / Bangkapi',
    weightKg: fabricKg,
    distanceKm: 15,
  },
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

  // Pre-populate 6 default legs on first visit
  React.useEffect(() => {
    if (entries.length === 0) {
      updateData({
        logistics: {
          entries: buildDefaultLegs(
            data.materials.loeiCottonKg,
            data.materials.greenNetYarnKg,
            data.materials.fabricKg
          ),
        },
      });
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

      {/* Data gap warning */}
      <div className="w-full flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mb-6">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
        <span>
          <strong>Legs 1 and 4 need input</strong> — Don't have the exact distances yet.
        </span>
      </div>

      <div className="w-full space-y-3 mb-8">
        {entries.map((entry, index) => {
          const isDataGap = entry.distanceKm === 0 && (index === 0 || index === 3);
          return (
            <div
              key={entry.id}
              className={`flex flex-col xl:flex-row items-end gap-3 bg-white p-4 rounded-xl border shadow-sm ${
                isDataGap ? 'border-amber-300 bg-amber-50/30' : 'border-gray-100'
              }`}
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
                  className={`mb-0 ${isDataGap ? 'border-amber-400' : ''}`}
                  value={entry.distanceKm || ''}
                  onChange={(e) => handleChange(entry.id, 'distanceKm', e.target.value)}
                />
                {isDataGap && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} /> Data gap — fill in
                  </p>
                )}
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
          );
        })}

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
