
import React, { useState, useEffect } from 'react';
import { CalculatorState, StepId } from './types';
import WizardLayout from './components/WizardLayout';
import StepHome from './components/StepHome';
import StepMaterials from './components/StepMaterials';
import StepLogistics from './components/StepLogistics';
import StepElectricity from './components/StepElectricity';
import StepWater from './components/StepWater';
import StepTailoring from './components/StepTailoring';
import StepSocial from './components/StepSocial';
import StepResults from './components/StepResults';

const defaultSocial = {
  artisanCount: 0,
  totalArtisanHours: 0,
  paymentToArtisansBaht: 0,
  totalBatchRevenueBaht: 0,
  womenArtisansCount: 0,
  daysPerKgWeft: 0,
};

const initialState: CalculatorState = {
  meta: {
    scope: 'batch',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  },
  materials: {
    fabricKg: 0,
    loeiCottonKg: 0,
    greenNetYarnKg: 0,
    leftoverKg: 0,
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
  tailoring: {
    fabricKg: 0,
    scrapsKg: 0,
    scrapsDistKm: 0,
  },
  social: defaultSocial,
};

const STEP_ORDER: StepId[] = [
  'home',
  'materials',
  'logistics',
  'electricity',
  'water',
  'tailoring',
  'social',
  'results',
];

function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('home');
  const [data, setData] = useState<CalculatorState>(initialState);

  useEffect(() => {
    const saved = localStorage.getItem('folkcharm_calc_state_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // ── Migration: old materials shape (v3) → new flat shape (v5) ──
        if (parsed.materials && parsed.materials.farmerCotton !== undefined) {
          parsed.materials = {
            fabricKg: 0,
            loeiCottonKg: parsed.materials.farmerCotton?.weight || 0,
            greenNetYarnKg: parsed.materials.scGrand?.weight || 0,
            leftoverKg: parsed.materials.leftover?.weight || 0,
          };
        }

        // ── Migration: ensure tailoring block exists ──
        if (!parsed.tailoring) {
          parsed.tailoring = { fabricKg: 0, scrapsKg: 0, scrapsDistKm: 0 };
        }

        // ── Migration: logistics entries rename distance → distanceKm ──
        if (parsed.logistics?.entries) {
          parsed.logistics.entries = parsed.logistics.entries.map((e: any) => ({
            ...e,
            distanceKm: e.distanceKm ?? e.distance ?? 0,
          }));
        }

        // ── Migration: remove soft water type from water entries ──
        if (parsed.water?.entries) {
          parsed.water.entries = parsed.water.entries.map((e: any) => {
            const { type, ...rest } = e;
            return rest;
          });
        }

        // ── Ensure required blocks exist ──
        if (!parsed.electricity) parsed.electricity = { entries: [] };
        if (!parsed.water) parsed.water = { entries: [] };
        if (!parsed.social) parsed.social = defaultSocial;
        // Migrate old social: womenArtisansPercent → womenArtisansCount
        if (parsed.social && 'womenArtisansPercent' in parsed.social && !('womenArtisansCount' in parsed.social)) {
          const n = parsed.social.artisanCount || 0;
          const pct = parsed.social.womenArtisansPercent ?? 0;
          parsed.social.womenArtisansCount = Math.round((n * pct) / 100);
          delete (parsed.social as any).womenArtisansPercent;
        }

        setData(parsed);
      } catch (e) {
        console.error('Failed to load saved state', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('folkcharm_calc_state_v5', JSON.stringify(data));
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
      onRestart: handleRestart,
    };

    switch (currentStep) {
      case 'home':        return <StepHome {...props} />;
      case 'materials':   return <StepMaterials {...props} />;
      case 'logistics':   return <StepLogistics {...props} />;
      case 'electricity': return <StepElectricity {...props} />;
      case 'water':       return <StepWater {...props} />;
      case 'tailoring':   return <StepTailoring {...props} />;
      case 'social':      return <StepSocial {...props} />;
      case 'results':     return <StepResults {...props} />;
      default:            return <StepHome {...props} />;
    }
  };

  return (
    <WizardLayout currentStep={currentStep}>
      {renderStep()}
    </WizardLayout>
  );
}

export default App;
