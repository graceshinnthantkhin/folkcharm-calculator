import React from 'react';
import { StepProps, WaterEntry } from '../types';
import { Input, Button } from './ui/Components';
import { ArrowLeft, ArrowRight, Plus, Trash2, Droplets } from 'lucide-react';

const StepWater: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const entries = data.water.entries;

  const handleAdd = () => {
    const newEntry: WaterEntry = {
      id: crypto.randomUUID(),
      description: '',
      usageM3: 0,
    };
    updateData({ water: { entries: [...entries, newEntry] } });
  };

  const handleRemove = (id: string) => {
    updateData({ water: { entries: entries.filter((e) => e.id !== id) } });
  };

  const handleChange = (id: string, field: keyof WaterEntry, value: string) => {
    updateData({
      water: {
        entries: entries.map((e) =>
          e.id === id
            ? { ...e, [field]: field === 'usageM3' ? parseFloat(value) || 0 : value }
            : e
        ),
      },
    });
  };

  React.useEffect(() => {
    if (entries.length === 0) handleAdd();
  }, []);

  return (
    <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Water Usage</h2>

      {/* Info banner */}
      <div className="w-full flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg px-4 py-3 mb-8">
        <Droplets size={16} className="mt-0.5 shrink-0" />
        <span>
          <strong>For natural dyeing only.</strong> Enter the tap water used when dyeing yarn with plant-based dyes such as indigo, wild ebony, and anatto. Enter the amount in m³ and we'll handle the conversion.
        </span>
      </div>

      <div className="w-full space-y-4 mb-8">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="flex flex-col md:flex-row items-end gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="flex-1 w-full">
              <Input
                label={index === 0 ? 'Description' : ''}
                placeholder="e.g., Indigo dyeing batch"
                className="mb-0"
                value={entry.description}
                onChange={(e) => handleChange(entry.id, 'description', e.target.value)}
              />
            </div>
            <div className="w-full md:w-44">
              <Input
                label={index === 0 ? 'Usage' : ''}
                type="number"
                min="0"
                step="0.001"
                placeholder="0.000"
                suffix="m³"
                className="mb-0"
                value={entry.usageM3 || ''}
                onChange={(e) => handleChange(entry.id, 'usageM3', e.target.value)}
              />
            </div>
            {entries.length > 1 && (
              <button
                onClick={() => handleRemove(entry.id)}
                className="mb-2 p-2 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-center pt-2">
          <button
            onClick={handleAdd}
            className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-all shadow-sm hover:scale-110"
            title="Add another water source"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="mt-auto w-full flex justify-between items-center pt-8">
        <Button variant="secondary" onClick={onBack} className="px-8 h-12">
          <ArrowLeft className="mr-2" size={20} /> Back
        </Button>
        <Button onClick={onNext} className="px-12 h-12 bg-gray-900 text-white shadow-lg">
          Tailoring & Scraps <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default StepWater;
