
import React from 'react';
import { StepId } from '../types';

interface WizardLayoutProps {
  currentStep: StepId;
  children: React.ReactNode;
}

const steps: { id: StepId; label: string }[] = [
  { id: 'materials', label: 'Materials' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'water', label: 'Water' },
  { id: 'results', label: 'Results' },
];

const WizardLayout: React.FC<WizardLayoutProps> = ({ currentStep, children }) => {
  const isHome = currentStep === 'home';
  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50 font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-emerald-800">
              Folkcharm <span className="text-gray-400 font-normal">Calculator</span>
            </h1>
          </div>
          {!isHome && (
            <div className="text-sm text-gray-500 hidden sm:block font-medium">
              {steps[currentIndex]?.label} — Step {currentIndex + 1} of {steps.length}
            </div>
          )}
        </div>
        {!isHome && (
          <div className="h-1 w-full bg-gray-100">
            <div 
              className="h-full bg-emerald-600 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12 relative z-0">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Folkcharm Supply Chain Calculator. Internal Sustainability Tool.</p>
        </div>
      </footer>
    </div>
  );
};

export default WizardLayout;
