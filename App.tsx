
import React, { useState, useEffect } from 'react';
import { CalculatorState, StepId, VehicleType } from './types';
import WizardLayout from './components/WizardLayout';
import StepHome from './components/StepHome';
import StepMaterials from './components/StepMaterials';
import StepLogistics from './components/StepLogistics';
import StepElectricity from './components/StepElectricity';
import StepWater from './components/StepWater';
import StepResults from './components/StepResults';

const initialState: CalculatorState = {
  meta: {
    scope: 'batch',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  },
  materials: {
    farmerCotton: { weight: 0, farmArea: 0 },
    scGrand: { weight: 0 },
    leftover: { weight: 0 },
  },
  logistics: {
    entries: [],
  },
  electricity: {
    entries: [],
  },
  water: {
    entries: [],
  },
  production: {
    itemQuantity: 0,
    sewingHours: 0,
  },
  delivery: {
    finalDistance: 0,
    vehicleType: '' as VehicleType,
  },
};

const STEP_ORDER: StepId[] = ['home', 'materials', 'logistics', 'electricity', 'water', 'results'];

function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('home');
  const [data, setData] = useState<CalculatorState>(initialState);

  useEffect(() => {
    const saved = localStorage.getItem('folkcharm_calc_state_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration logic for old fixed logistics structure
        if (parsed.logistics && !parsed.logistics.entries) {
           parsed.logistics = { entries: [] };
        }
        if (!parsed.electricity) parsed.electricity = { entries: [] };
        if (!parsed.water) parsed.water = { entries: [] };
        setData(parsed);
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('folkcharm_calc_state_v3', JSON.stringify(data));
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

  const handleRestart = () => {
    setData(initialState);
    setCurrentStep('home');
    window.scrollTo(0, 0);
  };

  const renderStep = () => {
    const props = { 
      data, 
      updateData, 
      onNext: handleNext, 
      onBack: handleBack,
      onRestart: handleRestart
    };
    
    switch (currentStep) {
      case 'home': return <StepHome {...props} />;
      case 'materials': return <StepMaterials {...props} />;
      case 'logistics': return <StepLogistics {...props} />;
      case 'electricity': return <StepElectricity {...props} />;
      case 'water': return <StepWater {...props} />;
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
