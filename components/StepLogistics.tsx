
import React, { useState } from 'react';
import { StepProps, VehicleType, TransportLeg } from '../types';
import { Input, Select, Button, Card } from './ui/Components';
import { ArrowLeft, ArrowRight, Truck } from 'lucide-react';

const StepLogistics: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const vehicleOptions = [
    { label: 'Select Vehicle...', value: '' },
    { label: 'Light Vehicle', value: VehicleType.LIGHT },
    { label: 'Heavy Vehicle', value: VehicleType.HEAVY },
  ];

  const updateLeg = (section: keyof typeof data.logistics, field: keyof TransportLeg, value: string) => {
    updateData({
      logistics: {
        ...data.logistics,
        [section]: {
          ...data.logistics[section],
          [field]: field === 'distance' ? (value === '' ? NaN : parseFloat(value)) : value
        }
      }
    });
  };

  const validate = () => {
    // Basic validation: Check if distances are >= 0.
    // For active routes (where material weight > 0), check if vehicle type is selected if distance > 0.
    const newErrors: Record<string, string> = {};
    // Not stricly enforced by PDF "Distance >= 0", "Vehicle type must be selected".
    // I will enforce vehicle type ONLY if distance > 0.

    const checkLeg = (legKey: keyof typeof data.logistics, weight: number) => {
      if (weight > 0) {
        const leg = data.logistics[legKey];
        if (leg.distance >= 0 && !leg.vehicleType) {
          newErrors[`${String(legKey)}Type`] = "Required";
        }
      }
    };

    checkLeg('farmToSpinner', data.materials.farmerCotton.weight);
    checkLeg('spinnerToWeaver', data.materials.farmerCotton.weight);
    checkLeg('weaverToFolkcharm', data.materials.farmerCotton.weight);
    checkLeg('scGrandToFolkcharm', data.materials.scGrand.weight);
    // Removed leftoverToFolkcharm validation check as the route card is removed.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const renderLegInput = (
    key: keyof typeof data.logistics,
    title: string,
    active: boolean
  ) => {
    if (!active) return null;
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Truck size={16} /> {title}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Distance"
            type="number"
            min="0"
            suffix="km"
            value={isNaN(data.logistics[key].distance) ? '' : data.logistics[key].distance}
            onChange={(e) => updateLeg(key, 'distance', e.target.value)}
          />
          <Select
            label="Vehicle Type"
            options={vehicleOptions}
            value={data.logistics[key].vehicleType}
            onChange={(e) => updateLeg(key, 'vehicleType', e.target.value)}
            error={errors[`${String(key)}Type`]}
          />
        </div>
      </div>
    );
  };

  const hasFarmer = data.materials.farmerCotton.weight > 0;
  const hasSC = data.materials.scGrand.weight > 0;
  
  // Even if hasLeftover is true, we don't show the card.
  // We check if at least one visible route is needed to show the "No materials" message correctly?
  // If only leftover is selected, user still needs to click Next.
  // The original "No materials selected" message was a guard.
  // If user ONLY selected Leftover, then `hasFarmer` and `hasSC` are false.
  // The UI would be empty. 
  // I should probably show a message saying "No logistics required for Leftover Only" or just allow them to proceed.
  
  const showEmptyMessage = !hasFarmer && !hasSC && data.materials.leftover.weight <= 0;
  const showOnlyLeftoverMessage = !hasFarmer && !hasSC && data.materials.leftover.weight > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Logistics Input</h2>
        <p className="text-gray-500 mt-2">Enter transport details for your active material routes.</p>
      </div>

      {hasFarmer && (
        <Card title="A. Farmer Cotton Route" className="border-t-4 border-t-emerald-500">
          {renderLegInput('farmToSpinner', 'Farm → Spinner', true)}
          {renderLegInput('spinnerToWeaver', 'Spinner → Weaver', true)}
          {renderLegInput('weaverToFolkcharm', 'Weaver → Folkcharm Studio', true)}
        </Card>
      )}

      {hasSC && (
        <Card title="B. SC Grand Route" className="border-t-4 border-t-blue-500">
          {renderLegInput('scGrandToFolkcharm', 'Factory → Folkcharm Studio', true)}
        </Card>
      )}

      
      {showOnlyLeftoverMessage && (
         <div className="text-center p-8 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-amber-800 font-medium">Leftover Cotton (Deadstock) Selected</p>
            <p className="text-sm text-amber-600 mt-1">No transport logistics required for this material.</p>
         </div>
      )}

      {showEmptyMessage && (
        <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No materials selected. Please go back.</p>
        </div>
      )}

      <div className="flex gap-4 pt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 w-5 h-5" /> Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Production <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default StepLogistics;
