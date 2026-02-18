
import React from 'react';
import { StepProps, VehicleType, LogisticsEntry } from '../types';
import { Input, Select, Button } from './ui/Components';
import { ArrowLeft, ArrowRight, Plus, Trash2, Truck } from 'lucide-react';

const StepLogistics: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const entries = data.logistics.entries;

  const vehicleOptions = [
    { label: 'Select Vehicle...', value: '' },
    { label: 'Light Vehicle', value: VehicleType.LIGHT },
    { label: 'Heavy Vehicle', value: VehicleType.HEAVY },
  ];

  const handleAdd = () => {
    const newEntry: LogisticsEntry = {
      id: crypto.randomUUID(),
      description: '',
      weightKg: 0,
      distance: 0,
      vehicleType: '',
    };
    updateData({
      logistics: {
        ...data.logistics,
        entries: [...entries, newEntry],
      },
    });
  };

  const handleRemove = (id: string) => {
    updateData({
      logistics: {
        ...data.logistics,
        entries: entries.filter((e) => e.id !== id),
      },
    });
  };

  const handleChange = (id: string, field: keyof LogisticsEntry, value: any) => {
    updateData({
      logistics: {
        ...data.logistics,
        entries: entries.map((e) =>
          e.id === id ? { 
            ...e, 
            [field]: (field === 'weightKg' || field === 'distance') ? (parseFloat(value) || 0) : value 
          } : e
        ),
      },
    });
  };

  // Ensure at least one row or pre-populate if empty
  React.useEffect(() => {
    if (entries.length === 0) {
      // Logic to pre-populate if they just came from materials
      const initial: LogisticsEntry[] = [];
      if (data.materials.farmerCotton.weight > 0) {
        initial.push({ id: crypto.randomUUID(), description: 'Farm to Spinner', weightKg: data.materials.farmerCotton.weight, distance: 0, vehicleType: '' });
      }
      if (data.materials.scGrand.weight > 0) {
        initial.push({ id: crypto.randomUUID(), description: 'Factory to Studio', weightKg: data.materials.scGrand.weight, distance: 0, vehicleType: '' });
      }
      
      if (initial.length === 0) {
        handleAdd();
      } else {
        updateData({ logistics: { entries: initial } });
      }
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto min-h-[60vh] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Transportation Logistics</h2>
        <p className="text-gray-500">Add transport legs for your materials. Emissions depend on weight, distance, and vehicle.</p>
      </div>

      <div className="w-full space-y-4 mb-8">
        {entries.map((entry, index) => (
          <div key={entry.id} className="flex flex-col xl:flex-row items-end gap-3 bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative group">
            <div className="flex-[2] w-full">
              <Input
                label={index === 0 ? "Description (Leg)" : ""}
                placeholder="e.g., Farm to Spinner"
                className="mb-0"
                value={entry.description}
                onChange={(e) => handleChange(entry.id, 'description', e.target.value)}
              />
            </div>
            {/* <div className="flex-1 w-full min-w-[120px]">
              <Input
                label={index === 0 ? "Weight" : ""}
                type="number"
                min="0"
                placeholder="0"
                suffix="kg"
                className="mb-0"
                value={entry.weightKg || ''}
                onChange={(e) => handleChange(entry.id, 'weightKg', e.target.value)}
              />
            </div> */}
            <div className="flex-1 w-full min-w-[120px]">
              <Input
                label={index === 0 ? "Distance" : ""}
                type="number"
                min="0"
                placeholder="0"
                suffix="km"
                className="mb-0"
                value={entry.distance || ''}
                onChange={(e) => handleChange(entry.id, 'distance', e.target.value)}
              />
            </div>
            <div className="flex-[1.5] w-full min-w-[180px]">
              <Select
                label={index === 0 ? "Vehicle Type" : ""}
                options={vehicleOptions}
                className="mb-0"
                value={entry.vehicleType}
                onChange={(e) => handleChange(entry.id, 'vehicleType', e.target.value)}
              />
            </div>
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

      <div className="mt-auto w-full flex justify-between items-center pt-12">
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