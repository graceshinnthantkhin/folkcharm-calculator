import React, { useState, useEffect } from 'react';
import { CalculatorState, StepId, VehicleType } from './types';
import WizardLayout from './components/WizardLayout';
import StepHome from './components/StepHome';
import StepMaterials from './components/StepMaterials';
import StepLogistics from './components/StepLogistics';
import StepProduction from './components/StepProduction';
import StepDelivery from './components/StepDelivery';
import StepResults from './components/StepResults';

// Initial Empty State
const initialState: CalculatorState = {
  materials: {
    farmerCotton: { weight: 0, farmArea: 0 },
    scGrand: { weight: 0 },
    leftover: { weight: 0 },
  },
  logistics: {
    farmToSpinner: { distance: 0, vehicleType: '' as VehicleType },
    spinnerToWeaver: { distance: 0, vehicleType: '' as VehicleType },
    weaverToFolkcharm: { distance: 0, vehicleType: '' as VehicleType },
    scGrandToFolkcharm: { distance: 0, vehicleType: '' as VehicleType },
    leftoverToFolkcharm: { distance: 0, vehicleType: '' as VehicleType },
  },
  production: {
    sewingHours: 0,
    itemQuantity: 0,
    logbookFile: undefined,
  },
  delivery: {
    finalDistance: 0,
    vehicleType: '' as VehicleType,
  },
};

// Steps order
const STEP_ORDER: StepId[] = ['home', 'materials', 'logistics', 'production', 'delivery', 'results'];

function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('home');
  const [data, setData] = useState<CalculatorState>(initialState);

  // Load state from local storage on mount (optional persistence mentioned in PDF)
  useEffect(() => {
    const saved = localStorage.getItem('folkcharm_calc_state');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
  }, []);

  // Save state on change
  useEffect(() => {
    localStorage.setItem('folkcharm_calc_state', JSON.stringify(data));
  }, [data]);

  const updateData = (updates: Partial<CalculatorState>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[stepIndex]);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    goToStep(currentIndex + 1);
  };

  const handleBack = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    goToStep(currentIndex - 1);
  };

  const renderStep = () => {
    const props = { data, updateData, onNext: handleNext, onBack: handleBack };
    
    switch (currentStep) {
      case 'home': return <StepHome {...props} />;
      case 'materials': return <StepMaterials {...props} />;
      case 'logistics': return <StepLogistics {...props} />;
      case 'production': return <StepProduction {...props} />;
      case 'delivery': return <StepDelivery {...props} />;
      case 'results': return <StepResults {...props} />;
      default: return <StepHome {...props} />;
    }
  };

  return (
    <WizardLayout currentStep={currentStep}>
      {renderStep()}
    </WizardLayout>
  );
}

export default App;