import { Card } from './common/UI';
import type { BudgetCheck } from '../types';
import { CheckCircle2, XCircle, TrendingDown } from 'lucide-react';

export const BudgetFeasibility = ({ 
  budgetCheck,
  budget
}: { 
  budgetCheck: BudgetCheck,
  budget: number
}) => {
  const isFeasible = budgetCheck.feasible;
  const colorScheme = isFeasible 
    ? 'bg-green-50 border-green-200 text-green-900' 
    : 'bg-red-50 border-red-200 text-red-900';

  const Icon = isFeasible ? CheckCircle2 : XCircle;

  return (
    <Card className={`${colorScheme}`}>
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <Icon size={32} className={isFeasible ? 'text-green-600' : 'text-red-600'} />
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-bold mb-1">Budget Analysis</h2>
          <div className="flex items-baseline gap-4 mb-3">
            <span className="text-2xl font-black">${budgetCheck.estimatedCost.toFixed(2)}</span>
            <span className="text-sm opacity-75">Estimated Cost</span>
            <span className="text-gray-400">|</span>
            <span className="text-lg font-semibold">${budget.toFixed(2)}</span>
            <span className="text-sm opacity-75">Daily Budget</span>
          </div>
          
          <p className="text-sm font-medium mb-4 opacity-90">{budgetCheck.summary}</p>
          
          {budgetCheck.alternatives && budgetCheck.alternatives.length > 0 && (
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="flex items-center text-sm font-bold mb-2">
                <TrendingDown size={16} className="mr-1" /> Cost-saving Alternatives
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {budgetCheck.alternatives.map((alt, idx) => (
                  <li key={idx}>{alt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
