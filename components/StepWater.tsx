
import React from 'react';
import { StepProps, WaterEntry } from '../types';
import { Input, Select, Button } from './ui/Components';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';

const StepWater: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const entries = data.water.entries;

  const handleAdd = () => {
    const newEntry: WaterEntry = {
      id: crypto.randomUUID(),
      description: '',
      usageM3: 0,
      type: 'tap',
    };
    updateData({
      water: {
        ...data.water,
        entries: [...entries, newEntry],
      },
    });
  };

  const handleRemove = (id: string) => {
    updateData({
      water: {
        ...data.water,
        entries: entries.filter((e) => e.id !== id),
      },
    });
  };

  const handleChange = (id: string, field: keyof WaterEntry, value: string) => {
    updateData({
      water: {
        ...data.water,
        entries: entries.map((e) =>
          e.id === id ? { ...e, [field]: field === 'usageM3' ? (parseFloat(value) || 0) : value } : e
        ),
      },
    });
  };

  React.useEffect(() => {
    if (entries.length === 0) handleAdd();
  }, []);

  const waterTypes = [
    { label: 'Tap Water', value: 'tap' },
    { label: 'Soft Water', value: 'soft' },
  ];

  return (
    <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Water Usage</h2>

      <div className="w-full space-y-4 mb-8">
        {entries.map((entry, index) => (
          <div key={entry.id} className="flex flex-col md:flex-row items-end gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
            <div className="flex-1 w-full">
              <Input
                label={index === 0 ? "Description" : ""}
                placeholder="e.g., Washing Unit"
                className="mb-0"
                value={entry.description}
                onChange={(e) => handleChange(entry.id, 'description', e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                label={index === 0 ? "Type" : ""}
                options={waterTypes}
                className="mb-0"
                value={entry.type}
                onChange={(e) => handleChange(entry.id, 'type', e.target.value)}
              />
            </div>
            <div className="w-full md:w-40">
              <Input
                label={index === 0 ? "Usage" : ""}
                type="number"
                min="0"
                placeholder="0"
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
                title="Remove row"
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
            title="Add another source"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="mt-auto w-full flex justify-between items-center pt-12">
        <Button variant="secondary" onClick={onBack} className="px-8 h-12">
          <ArrowLeft className="mr-2" size={20} /> Back
        </Button>
        <Button onClick={onNext} className="px-12 h-12 bg-gray-900 text-white shadow-lg">
          Final Results <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default StepWater;
