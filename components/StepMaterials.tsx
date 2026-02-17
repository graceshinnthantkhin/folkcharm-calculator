
import React, { useState } from 'react';
import { StepProps } from '../types';
import { Input, Button, Card } from './ui/Components';
import { ArrowRight, Leaf, Sprout, Recycle } from 'lucide-react';

const StepMaterials: React.FC<StepProps> = ({ data, updateData, onNext }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Conversion Constants
  const HA_PER_ACRE = 0.404686;
  const ACRES_PER_HA = 2.47105;

  // Local state for acres input to ensure smooth typing and display
  // Initialize from the global HA value (if it exists) converted back to acres
  const [acresInput, setAcresInput] = useState<string>(() => {
    const ha = data.materials.farmerCotton.farmArea;
    if (!ha) return '';
    // Format to max 2 decimal places for display when loading back from state
    return parseFloat((ha * ACRES_PER_HA).toFixed(3)).toString();
  });

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

  const handleAcresChange = (val: string) => {
    setAcresInput(val);
    const acres = parseFloat(val);
    
    if (!isNaN(acres)) {
      // Convert Acres to Hectares for global state
      const ha = acres * HA_PER_ACRE;
      updateData({
        materials: {
          ...data.materials,
          farmerCotton: {
            ...data.materials.farmerCotton,
            farmArea: ha
          }
        }
      });
    } else {
      // Handle empty or invalid input
      updateData({
        materials: {
          ...data.materials,
          farmerCotton: {
            ...data.materials.farmerCotton,
            farmArea: 0
          }
        }
      });
    }
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
            suffix="acres"
            value={acresInput}
            onChange={(e) => handleAcresChange(e.target.value)}
            error={errors.farmArea}
            disabled={!data.materials.farmerCotton.weight}
            className={!data.materials.farmerCotton.weight ? 'opacity-50' : ''}
          />
        </div>
        <div className="flex justify-between items-start mt-2">
          <p className="text-xs text-gray-500 italic">
            * Farm Area is used to calculate SOC emissions.
          </p>
          {acresInput && !isNaN(parseFloat(acresInput)) && (
            <p className="text-xs text-emerald-600 font-medium">
              ≈ {(parseFloat(acresInput) * HA_PER_ACRE).toFixed(2)} ha
            </p>
          )}
        </div>
      </Card>

      {/* B. Recycle Yarn */}
      <Card className="border-l-4 border-l-blue-500">
         <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Leaf size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">B. Recycle Yarn</h3>
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
