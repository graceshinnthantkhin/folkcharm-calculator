import React, { useState } from 'react';
import { StepProps } from '../types';
import { Input, Button, Card } from './ui/Components';
import { ArrowLeft, Calculator, Users, DollarSign, Heart, Info } from 'lucide-react';

const StepSocial: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const social = data.social ?? {
    artisanCount: 0,
    totalArtisanHours: 0,
    paymentToArtisansBaht: 0,
    totalBatchRevenueBaht: 0,
    womenArtisansCount: 0,
    daysPerKgWeft: 0,
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (social.artisanCount < 0) newErrors.artisanCount = 'Cannot be negative';
    if (social.totalArtisanHours < 0) newErrors.totalArtisanHours = 'Cannot be negative';
    if (social.paymentToArtisansBaht < 0) newErrors.paymentToArtisansBaht = 'Cannot be negative';
    if (social.totalBatchRevenueBaht < 0) newErrors.totalBatchRevenueBaht = 'Cannot be negative';
    if (social.womenArtisansCount < 0) newErrors.womenArtisansCount = 'Cannot be negative';
    if (social.artisanCount > 0 && social.womenArtisansCount > social.artisanCount)
      newErrors.womenArtisansCount = 'Cannot exceed total number of artisans';
    if (social.daysPerKgWeft < 0) newErrors.daysPerKgWeft = 'Cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof typeof social, value: string) => {
    updateData({
      social: {
        ...social,
        [field]: parseFloat(value) || 0,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Social Impact</h2>
        <p className="text-gray-500 mt-2">
          Enter data for this batch. All social metrics are calculated from your inputs (no hardcoded values).
        </p>
      </div>

      {/* SI1 & SI4 — Artisans & hours */}
      <Card className="border-l-4 border-l-amber-500">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Artisans & Work Hours</h3>
            <p className="text-xs text-gray-500">SI1 — Artisans supported · SI4 — Total hours this batch</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4 text-xs text-amber-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>Number of artisans involved in this batch and total hours they worked.</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Number of artisans (this batch)"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 51"
            value={social.artisanCount || ''}
            onChange={(e) => updateField('artisanCount', e.target.value)}
            error={errors.artisanCount}
          />
          <Input
            label="Total artisan work hours (this batch)"
            type="number"
            min="0"
            step="0.5"
            placeholder="e.g. 320"
            value={social.totalArtisanHours || ''}
            onChange={(e) => updateField('totalArtisanHours', e.target.value)}
            error={errors.totalArtisanHours}
          />
        </div>
      </Card>

      {/* SI1b & SI2 — Income & revenue share */}
      <Card className="border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <DollarSign size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Income & Revenue Share</h3>
            <p className="text-xs text-gray-500">Artisan income per batch · SI2 — % revenue to makers</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-4 text-xs text-emerald-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>Total payment to artisans (THB) and total batch revenue so we can compute revenue share %.</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Payment to artisans (THB)"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 15000"
            value={social.paymentToArtisansBaht || ''}
            onChange={(e) => updateField('paymentToArtisansBaht', e.target.value)}
            error={errors.paymentToArtisansBaht}
          />
          <Input
            label="Total batch revenue (THB)"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 30000"
            value={social.totalBatchRevenueBaht || ''}
            onChange={(e) => updateField('totalBatchRevenueBaht', e.target.value)}
            error={errors.totalBatchRevenueBaht}
          />
        </div>
      </Card>

      {/* SI5 — Gender only */}
      <Card className="border-l-4 border-l-purple-500">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Gender Empowerment (SI5)</h3>
            <p className="text-xs text-gray-500">How many artisans in this batch are women?</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 mb-4 text-xs text-purple-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>Enter the number of women artisans in this batch. The share (%) is calculated automatically.</span>
        </div>
        <Input
          label="Number of women artisans"
          type="number"
          min="0"
          step="1"
          placeholder="e.g. 43"
          value={social.womenArtisansCount ?? ''}
          onChange={(e) => updateField('womenArtisansCount', e.target.value)}
          error={errors.womenArtisansCount}
        />
      </Card>

      {/* SI7 — Cultural (days per kg weft) */}
      <Card className="border-l-4 border-l-teal-500">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
            <Heart size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cultural Craft Preservation</h3>
            <p className="text-xs text-gray-500">SI7 — Days of hand-spinning per kg Loei weft</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2 mb-4 text-xs text-teal-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>How many days of hand-spinning (or equivalent craft time) are needed per kg of Loei weft yarn for this batch?</span>
        </div>
        <Input
          label="Days of hand-spinning per kg Loei weft"
          type="number"
          min="0"
          step="0.1"
          placeholder="e.g. 2.5"
          value={social.daysPerKgWeft || ''}
          onChange={(e) => updateField('daysPerKgWeft', e.target.value)}
          error={errors.daysPerKgWeft}
        />
      </Card>

      <div className="flex gap-4 pt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1 h-12">
          <ArrowLeft className="mr-2 w-5 h-5" /> Back
        </Button>
        <Button
          onClick={() => { if (validate()) onNext(); }}
          className="flex-1 h-12 bg-gray-900 hover:bg-black text-white shadow-lg"
        >
          Calculate Results <Calculator className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default StepSocial;
