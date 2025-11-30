import React, { useState } from 'react';
import { StepProps, VehicleType } from '../types';
import { Input, Select, Button, Card } from './ui/Components';
import { ArrowLeft, Calculator } from 'lucide-react';

const StepDelivery: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const vehicleOptions = [
    { label: 'Select Vehicle...', value: '' },
    { label: 'Light Vehicle', value: VehicleType.LIGHT },
    { label: 'Heavy Vehicle', value: VehicleType.HEAVY },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (data.delivery.finalDistance < 0) newErrors.distance = "Cannot be negative";
    // Assuming distance is required if we want to calculate it, but technically 0 is valid (pickup).
    if (data.delivery.finalDistance > 0 && !data.delivery.vehicleType) {
      newErrors.vehicleType = "Required when distance > 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Delivery Input</h2>
        <p className="text-gray-500 mt-2">Final transport to customer or retail location.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Input
            label="Final Delivery Distance"
            type="number"
            min="0"
            suffix="km"
            placeholder="0"
            value={data.delivery.finalDistance || ''}
            onChange={(e) => updateData({ delivery: { ...data.delivery, finalDistance: parseFloat(e.target.value) } })}
            error={errors.distance}
          />
          <Select
            label="Vehicle Type"
            options={vehicleOptions}
            value={data.delivery.vehicleType}
            onChange={(e) => updateData({ delivery: { ...data.delivery, vehicleType: e.target.value as VehicleType } })}
            error={errors.vehicleType}
          />
        </div>
      </Card>

      <div className="flex gap-4 pt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 w-5 h-5" /> Back
        </Button>
        <Button onClick={handleCalculate} className="flex-1 bg-gray-900 hover:bg-black text-white shadow-lg">
          Calculate Results <Calculator className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default StepDelivery;
