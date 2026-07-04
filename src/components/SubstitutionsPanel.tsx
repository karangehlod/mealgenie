import { Card } from './common/UI';
import type { Substitution } from '../types';
import { AlertCircle, ArrowRight } from 'lucide-react';

export const SubstitutionsPanel = ({ substitutions }: { substitutions: Substitution[] }) => {
  if (!substitutions || substitutions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-orange-50 border-orange-100">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="text-orange-600" size={24} />
        <h2 className="text-xl font-bold text-orange-900">Dietary & Allergy Substitutions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {substitutions.map((sub, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border border-orange-50">
            <div className="flex items-center gap-3 mb-2 font-medium">
              <span className="text-red-600 line-through decoration-red-400">{sub.ingredient}</span>
              <ArrowRight size={16} className="text-gray-400" />
              <span className="text-green-600">{sub.substitute}</span>
            </div>
            <p className="text-sm text-gray-600">{sub.reason}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
