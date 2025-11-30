import React from 'react';
import { StepProps } from '../types';
import { Button } from './ui/Components';
import { ArrowRight, Leaf, Users, ShieldCheck } from 'lucide-react';

const StepHome: React.FC<StepProps> = ({ onNext }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Supply Chain <span className="text-emerald-600">Impact Calculator</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A comprehensive tool designed for Folkcharm to measure Scope 3 carbon footprint, 
          verify fair wages, and track batch composition from farm to studio.
        </p>
        <div className="pt-4">
          <Button onClick={onNext} className="h-14 px-8 text-lg shadow-xl shadow-emerald-100">
            Start New Calculation <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
            <Leaf size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Carbon Footprint</h3>
          <p className="text-gray-500 leading-relaxed">
            Calculate emissions across materials, logistics, production, and delivery using specialized local emission factors.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Social Impact</h3>
          <p className="text-gray-500 leading-relaxed">
            Verify fair wages based on sewing hours and generate transparency reports for every production batch.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Client-Side Privacy</h3>
          <p className="text-gray-500 leading-relaxed">
            All calculations run locally in your browser. Data is persisted only on your device until you choose to export.
          </p>
        </div>
      </div>

      {/* Footer / Context */}
      <div className="text-center pt-10 border-t border-gray-200">
        <p className="text-sm text-gray-400">
          Built for internal use • Version 1.0.0 (MVP)
        </p>
      </div>
    </div>
  );
};

export default StepHome;