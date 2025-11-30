import React, { useState } from 'react';
import { StepProps } from '../types';
import { Input, Button, Card } from './ui/Components';
import { ArrowRight, Leaf, Sprout, Recycle } from 'lucide-react';

const StepMaterials: React.FC<StepProps> = ({ data, updateData, onNext }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const { farmerCotton } = data.materials;
    
    // Check if at least one weight is > 0
    const totalWeight = 
      data.materials.farmerCotton.weight + 
      data.materials.scGrand.weight + 
      data.materials.leftover.weight;

    if (totalWeight <= 0) {
      newErrors.general = "At least one material source must have a weight greater than 0.";
    }

    // Farmer cotton validation
    if (farmerCotton.weight > 0 && farmerCotton.farmArea <= 0) {
      newErrors.farmArea = "Farm Area is required when Farmer Cotton is used.";
    }

    // Negative check
    if (data.materials.farmerCotton.weight < 0) newErrors.farmerWeight = "Cannot be negative";
    if (data.materials.scGrand.weight < 0) newErrors.scWeight = "Cannot be negative";
    if (data.materials.leftover.weight < 0) newErrors.leftoverWeight = "Cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const updateMaterial = (category: 'farmerCotton' | 'scGrand' | 'leftover', field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateData({
      materials: {
        ...data.materials,
        [category]: {
          ...data.materials[category],
          [field]: numValue
        }
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Materials Input</h2>
        <p className="text-gray-500 mt-2">Enter the weights and details for your cotton sources.</p>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm text-center">
          {errors.general}
        </div>
      )}

      {/* A. Farmer Cotton */}
      <Card className="border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
            <Sprout size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">A. Farmer Cotton</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Weight"
            type="number"
            min="0"
            placeholder="0"
            suffix="kg"
            value={data.materials.farmerCotton.weight || ''}
            onChange={(e) => updateMaterial('farmerCotton', 'weight', e.target.value)}
            error={errors.farmerWeight}
          />
          <Input
            label="Farm Area"
            type="number"
            min="0"
            placeholder="0"
            suffix="ha"
            value={data.materials.farmerCotton.farmArea || ''}
            onChange={(e) => updateMaterial('farmerCotton', 'farmArea', e.target.value)}
            error={errors.farmArea}
            disabled={!data.materials.farmerCotton.weight}
            className={!data.materials.farmerCotton.weight ? 'opacity-50' : ''}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          * Farm Area is used to calculate SOC emissions.
        </p>
      </Card>

      {/* B. SC Grand Yarn */}
      <Card className="border-l-4 border-l-blue-500">
         <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Leaf size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">B. SC Grand Yarn</h3>
        </div>
        <Input
          label="Weight"
          type="number"
          min="0"
          placeholder="0"
          suffix="kg"
          value={data.materials.scGrand.weight || ''}
          onChange={(e) => updateMaterial('scGrand', 'weight', e.target.value)}
          error={errors.scWeight}
        />
        <p className="text-xs text-gray-500 italic">
          Uses fixed emission factor: 0.35 kg CO₂e/kg
        </p>
      </Card>

      {/* C. Leftover */}
      <Card className="border-l-4 border-l-amber-500">
         <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Recycle size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">C. Leftover (Deadstock)</h3>
        </div>
        <Input
          label="Weight"
          type="number"
          min="0"
          placeholder="0"
          suffix="kg"
          value={data.materials.leftover.weight || ''}
          onChange={(e) => updateMaterial('leftover', 'weight', e.target.value)}
          error={errors.leftoverWeight}
        />
        <p className="text-xs text-gray-500 italic">
          Zero emission allocation.
        </p>
      </Card>

      <div className="pt-6">
        <Button onClick={handleNext} fullWidth className="text-lg h-12">
          Proceed to Logistics <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default StepMaterials;