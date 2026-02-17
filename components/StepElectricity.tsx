
import React from 'react';
import { StepProps, ElectricityEntry } from '../types';
import { Input, Button } from './ui/Components';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';

const StepElectricity: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const entries = data.electricity.entries;

  const handleAdd = () => {
    const newEntry: ElectricityEntry = {
      id: crypto.randomUUID(),
      description: '',
      usageKwh: 0,
    };
    updateData({
      electricity: {
        ...data.electricity,
        entries: [...entries, newEntry],
      },
    });
  };

  const handleRemove = (id: string) => {
    updateData({
      electricity: {
        ...data.electricity,
        entries: entries.filter((e) => e.id !== id),
      },
    });
  };

  const handleChange = (id: string, field: keyof ElectricityEntry, value: string) => {
    updateData({
      electricity: {
        ...data.electricity,
        entries: entries.map((e) =>
          e.id === id ? { ...e, [field]: field === 'usageKwh' ? (parseFloat(value) || 0) : value } : e
        ),
      },
    });
  };

  // Ensure at least one row
  React.useEffect(() => {
    if (entries.length === 0) handleAdd();
  }, []);

  return (
    <div className="max-w-3xl mx-auto min-h-[60vh] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Electricity Usage</h2>

      <div className="w-full space-y-4 mb-8">
        {entries.map((entry, index) => (
          <div key={entry.id} className="flex flex-col md:flex-row items-end gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
            <div className="flex-1 w-full">
              <Input
                label={index === 0 ? "Meter Description" : ""}
                placeholder="e.g., Workshop Meter A"
                className="mb-0"
                value={entry.description}
                onChange={(e) => handleChange(entry.id, 'description', e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Input
                label={index === 0 ? "Usage (kWh)" : ""}
                type="number"
                min="0"
                placeholder="0"
                suffix="kWh"
                className="mb-0"
                value={entry.usageKwh || ''}
                onChange={(e) => handleChange(entry.id, 'usageKwh', e.target.value)}
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
            className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-all shadow-sm hover:scale-110"
            title="Add another meter"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="mt-auto w-full flex justify-between items-center pt-12">
        <Button variant="secondary" onClick={onBack} className="px-8 h-12">
          <ArrowLeft className="mr-2" size={20} /> Back
        </Button>
        <Button onClick={onNext} className="px-12 h-12 bg-emerald-600 text-white shadow-lg">
          Water Usage <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default StepElectricity;
