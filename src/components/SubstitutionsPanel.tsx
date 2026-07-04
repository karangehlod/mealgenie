import { Card } from './common/UI';
import type { Substitution } from '../types';
import { ArrowRight, Leaf, AlertTriangle } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from './common/Animations';
import { cn } from '../utils/cn';

export const SubstitutionsPanel = ({ substitutions }: { substitutions: Substitution[] }) => {
  if (!substitutions || substitutions.length === 0) {
    return null;
  }

  return (
    <FadeIn className="space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-850 pb-4">
        <Leaf className="text-green-600 dark:text-green-400" size={28} />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Smart Substitutions</h2>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {substitutions.map((sub, idx) => (
          <StaggerItem key={idx}>
            <Card className="flex items-start gap-4 p-5 hover:border-green-200 dark:hover:border-green-900 transition-colors bg-white dark:bg-slate-900">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                sub.isAllergySafe ? "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400" : "bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
              )}>
                {sub.isAllergySafe ? <Leaf size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-sm font-bold text-gray-400 dark:text-slate-500 line-through decoration-red-300 dark:decoration-red-900 decoration-2">{sub.ingredient}</span>
                  <ArrowRight size={16} className="text-gray-300 dark:text-slate-700" />
                  <span className={cn(
                    "text-sm font-black px-2 py-0.5 rounded-md",
                    sub.isAllergySafe ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                  )}>
                    {sub.substitute}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-350 leading-snug">{sub.reason}</p>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </FadeIn>
  );
};
