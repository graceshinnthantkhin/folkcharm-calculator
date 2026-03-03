import React, { useState } from 'react';
import { StepProps } from '../types';
import { Input, Button, Card } from './ui/Components';
import { ArrowLeft, Calculator, Scissors, Recycle, Info } from 'lucide-react';

const StepTailoring: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (data.tailoring.fabricKg < 0) newErrors.fabricKg = 'Cannot be negative';
    if (data.tailoring.scrapsKg < 0) newErrors.scrapsKg = 'Cannot be negative';
    if (data.tailoring.scrapsDistKm < 0) newErrors.scrapsDistKm = 'Cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof typeof data.tailoring, value: string) => {
    updateData({
      tailoring: {
        ...data.tailoring,
        [field]: parseFloat(value) || 0,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Tailoring & Scrap Reuse</h2>
        <p className="text-gray-500 mt-2">
          Bangkok tailoring (EQ6) and Bangkapi scrap reuse transport (EQ10).
        </p>
      </div>

      {/* EQ6 — Bangkok Tailoring */}
      <Card className="border-l-4 border-l-purple-500">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <Scissors size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bangkok Tailoring</h3>
            <p className="text-xs text-gray-500">5 home-based tailors · Bangkok · EQ6</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 mb-4 text-xs text-purple-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>
            Enter the total weight of fabric sent to the Bangkok tailors.
          </span>
        </div>
        <Input
          label="Fabric sent to Bangkok tailors"
          type="number"
          min="0"
          step="0.1"
          placeholder="0.0"
          suffix="kg"
          value={data.tailoring.fabricKg || ''}
          onChange={(e) => updateField('fabricKg', e.target.value)}
          error={errors.fabricKg}
        />
      </Card>

      {/* EQ10 — Scrap Reuse */}
      <Card className="border-l-4 border-l-teal-500">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
            <Recycle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Scrap Reuse — Bangkapi Students</h3>
            <p className="text-xs text-gray-500">6 vocational students · Bangkapi Vocational Training Center · EQ10</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2 mb-4 text-xs text-teal-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>
            Since no machines are used, the only carbon counted here is the transport to deliver the scraps.
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Scraps sent to Bangkapi students"
            type="number"
            min="0"
            step="0.1"
            placeholder="0.0"
            suffix="kg"
            value={data.tailoring.scrapsKg || ''}
            onChange={(e) => updateField('scrapsKg', e.target.value)}
            error={errors.scrapsKg}
          />
          <Input
            label="Distance tailors → Bangkapi"
            type="number"
            min="0"
            step="1"
            placeholder="15"
            suffix="km"
            value={data.tailoring.scrapsDistKm || ''}
            onChange={(e) => updateField('scrapsDistKm', e.target.value)}
            error={errors.scrapsDistKm}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Default 15 km — update if you know the exact Bangkok route distance.</p>
      </Card>

      <div className="flex gap-4 pt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1 h-12">
          <ArrowLeft className="mr-2 w-5 h-5" /> Back
        </Button>
        <Button
          onClick={() => { if (validate()) onNext(); }}
          className="flex-1 h-12 bg-gray-900 hover:bg-black text-white shadow-lg"
        >
          Calculate Results <Calculator className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default StepTailoring;
