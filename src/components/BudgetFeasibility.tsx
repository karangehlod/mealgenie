import { Card } from './common/UI';
import type { BudgetCheck } from '../types';
import { CheckCircle2, XCircle, TrendingDown, PiggyBank } from 'lucide-react';
import { FadeIn } from './common/Animations';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export const BudgetFeasibility = ({ 
  budgetCheck,
  budget
}: { 
  budgetCheck: BudgetCheck,
  budget: number
}) => {
  const isFeasible = budgetCheck.feasible;
  const colorScheme = isFeasible 
    ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100' 
    : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100';

  const Icon = isFeasible ? CheckCircle2 : XCircle;
  const percentage = Math.min(100, Math.max(0, (budgetCheck.estimatedCost / budget) * 100));

  return (
    <FadeIn className="space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-850 pb-4">
        <PiggyBank className="text-emerald-600 dark:text-emerald-400" size={28} />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Budget Analysis</h2>
      </div>

      <Card className={cn(colorScheme, "overflow-hidden relative")}>
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Icon size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", 
                isFeasible ? "bg-emerald-200 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300" : "bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300"
              )}>
                {isFeasible ? 'Within Budget' : 'Over Budget'}
              </div>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">${budgetCheck.estimatedCost.toFixed(2)}</span>
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Estimated Cost</span>
              <span className="text-gray-300 dark:text-slate-700 hidden sm:inline">|</span>
              <span className="text-xl font-bold text-gray-700 dark:text-slate-350 hidden sm:inline">${budget.toFixed(2)}</span>
              <span className="text-sm font-medium text-gray-500 dark:text-slate-400 hidden sm:inline">Limit</span>
            </div>
            
            <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-8 leading-relaxed max-w-lg">
              {budgetCheck.summary}
            </p>

            {/* Progress Bar */}
            <div className="max-w-md">
              <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-slate-400 mb-2">
                <span>$0</span>
                <span>${budget.toFixed(2)} Limit</span>
              </div>
              <div className="h-3 w-full bg-white/60 dark:bg-slate-950/60 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    percentage > 100 ? "bg-red-500" : (percentage > 85 ? "bg-orange-400" : "bg-emerald-500")
                  )}
                />
              </div>
            </div>
          </div>

          {budgetCheck.alternatives && budgetCheck.alternatives.length > 0 && (
            <div className="md:w-72 bg-white/60 dark:bg-slate-900/60 rounded-2xl p-5 border border-white dark:border-slate-800 shadow-sm flex flex-col">
              <h4 className="flex items-center text-sm font-black mb-4 text-gray-900 dark:text-white uppercase tracking-wider">
                <TrendingDown size={16} className="mr-2 text-emerald-600 dark:text-emerald-400" /> Savings Ideas
              </h4>
              <ul className="space-y-3 flex-grow">
                {budgetCheck.alternatives.map((alt, idx) => (
                  <li key={idx} className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-500 dark:text-emerald-400 mt-0.5">•</span>
                    <span>{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </FadeIn>
  );
};
