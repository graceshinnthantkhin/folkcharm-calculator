import React, { useState } from 'react';
import { StepProps } from '../types';
import { Input, Button, Card } from './ui/Components';
import { ArrowRight, Leaf, Sprout, Recycle, Info } from 'lucide-react';

const StepMaterials: React.FC<StepProps> = ({ data, updateData, onNext }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const { fabricKg, loeiCottonKg, greenNetYarnKg, leftoverKg } = data.materials;

    if (!fabricKg || fabricKg <= 0) {
      newErrors.fabricKg = 'Finished fabric weight is required — this is the functional unit for all calculations.';
    }
    const totalInput = loeiCottonKg + greenNetYarnKg + leftoverKg;
    if (totalInput <= 0) {
      newErrors.general = 'At least one material source must have a weight greater than 0.';
    }
    if (loeiCottonKg < 0) newErrors.loeiCotton = 'Cannot be negative';
    if (greenNetYarnKg < 0) newErrors.greenNet = 'Cannot be negative';
    if (leftoverKg < 0) newErrors.leftover = 'Cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof typeof data.materials, value: string) => {
    updateData({
      materials: {
        ...data.materials,
        [field]: parseFloat(value) || 0,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Materials Input</h2>
        <p className="text-gray-500 mt-2">Enter the weight of each cotton source and your finished fabric output.</p>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm text-center">
          {errors.general}
        </div>
      )}

      {/* Functional Unit */}
      <Card className="border-l-4 border-l-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
            <Leaf size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Finished Fabric Weight</h3>
            <p className="text-xs text-gray-500">ISO 14040 EQ1 — functional unit denominator for all equations</p>
          </div>
        </div>
        <Input
          label="W_fabric_kg — Total finished fabric this batch"
          type="number"
          min="0"
          step="0.1"
          placeholder="0.0"
          suffix="kg"
          value={data.materials.fabricKg || ''}
          onChange={(e) => updateField('fabricKg', e.target.value)}
          error={errors.fabricKg}
        />
      </Card>

      {/* Chain A — Loei Weft Cotton */}
      <Card className="border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
              <Sprout size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Chain A — Loei Weft Cotton</h3>
              <p className="text-xs text-gray-500">Hand-picked · Hand-ginned · Khen-Mue hand-spun · Hand-woven</p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
            Zero emission ✓
          </span>
        </div>
        <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-4 text-xs text-emerald-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>
            Every step is done by hand — no electricity, no machines.
          </span>
        </div>
        <Input
          label="Loei cotton weight"
          type="number"
          min="0"
          step="0.1"
          placeholder="0.0"
          suffix="kg"
          value={data.materials.loeiCottonKg || ''}
          onChange={(e) => updateField('loeiCottonKg', e.target.value)}
          error={errors.loeiCotton}
        />
      </Card>

      {/* Chain B — Green Net Warp Cotton */}
      <Card className="border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Leaf size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Chain B — Green Net Warp Yarn</h3>
              <p className="text-xs text-gray-500">~84 Fai Noi farmers, Ubon Ratchathani · Machine-ginned · Machine-spun</p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
            Has emissions
          </span>
        </div>
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4 text-xs text-blue-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>
          This cotton is machine-ginned and machine-spun, so it uses electricity and produces emissions.
          </span>
        </div>
        <Input
          label="Green Net warp yarn weight"
          type="number"
          min="0"
          step="0.1"
          placeholder="0.0"
          suffix="kg"
          value={data.materials.greenNetYarnKg || ''}
          onChange={(e) => updateField('greenNetYarnKg', e.target.value)}
          error={errors.greenNet}
        />
      </Card>

      {/* Leftover / Deadstock */}
      <Card className="border-l-4 border-l-amber-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Recycle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Leftover / Deadstock</h3>
            <p className="text-xs text-gray-500">ISO 14044 s.4.3.4 — zero emission allocation for reuse</p>
          </div>
        </div>
        <Input
          label="Leftover / deadstock weight"
          type="number"
          min="0"
          step="0.1"
          placeholder="0.0"
          suffix="kg"
          value={data.materials.leftoverKg || ''}
          onChange={(e) => updateField('leftoverKg', e.target.value)}
          error={errors.leftover}
        />
      </Card>

      <div className="pt-6">
        <Button onClick={() => { if (validate()) onNext(); }} fullWidth className="text-lg h-12">
          Proceed to Logistics <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default StepMaterials;
