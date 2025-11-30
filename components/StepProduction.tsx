import React, { useState } from 'react';
import { StepProps } from '../types';
import { Input, Button, Card } from './ui/Components';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const StepProduction: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.production.sewingHours || data.production.sewingHours <= 0) {
      newErrors.sewingHours = "Sewing hours are required and must be > 0";
    }
    if (!data.production.itemQuantity || data.production.itemQuantity <= 0) {
      newErrors.itemQuantity = "Item quantity is required and must be > 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Production Input</h2>
        <p className="text-gray-500 mt-2">Energy use and wage calculation.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-6">
           <Input
            label="Total Sewing Hours"
            type="number"
            min="0"
            suffix="hrs"
            placeholder="e.g., 24"
            value={data.production.sewingHours || ''}
            onChange={(e) => updateData({ production: { ...data.production, sewingHours: parseFloat(e.target.value) } })}
            error={errors.sewingHours}
          />
          <Input
            label="Total Items Produced"
            type="number"
            min="0"
            placeholder="e.g., 50"
            value={data.production.itemQuantity || ''}
            onChange={(e) => updateData({ production: { ...data.production, itemQuantity: parseFloat(e.target.value) } })}
            error={errors.itemQuantity}
          />
        </div>
      </Card>

      <div className="flex gap-4 pt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 w-5 h-5" /> Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Delivery <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default StepProduction;