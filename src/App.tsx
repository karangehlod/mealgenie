import { useEffect, useState } from 'react';
import { Layout, HeroSection } from './components/layout/Layout';
import { DayContextForm } from './components/DayContextForm';
import { DashboardWidgets } from './components/DashboardWidgets';
import { MealPlanDisplay } from './components/MealPlanDisplay';
import { GroceryListDisplay } from './components/GroceryListDisplay';
import { SubstitutionsPanel } from './components/SubstitutionsPanel';
import { BudgetFeasibility } from './components/BudgetFeasibility';
import { Spinner, ErrorState, Button, Card } from './components/common/UI';
import { FadeIn } from './components/common/Animations';
import { usePlannerStore } from './store/usePlannerStore';
import { agent } from './services/agent';
import { RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const {
    dayContext,
    mealPlan,
    groceryList,
    substitutions,
    budgetCheck,
    loading,
    error,
    setMealPlan,
    setGroceryList,
    setSubstitutions,
    setBudgetCheck,
    setLoading,
    setError,
    reset
  } = usePlannerStore();

  const [currentStep, setCurrentStep] = useState<string>('');

  useEffect(() => {
    if (dayContext && !mealPlan && !loading && !error) {
      const generate = async () => {
        setLoading(true);
        setCurrentStep('🧑‍🍳 Generating personalized meal plan...');
        try {
          const plan = await agent.generateMealPlan(dayContext);
          setMealPlan(plan);
        } catch (err: any) {
          setError(err.message || "Failed to generate meal plan.");
        } finally {
          setLoading(false);
          setCurrentStep('');
        }
      };
      generate();
    }
  }, [dayContext, mealPlan, loading, error, setMealPlan, setLoading, setError]);

  useEffect(() => {
    if (mealPlan && !groceryList && !loading && !error) {
      const generate = async () => {
        setLoading(true);
        setCurrentStep('🛒 Compiling smart grocery list...');
        try {
          const list = await agent.generateGroceryList(mealPlan);
          setGroceryList(list);
        } catch (err: any) {
          setError(err.message || "Failed to extract grocery list.");
        } finally {
          setLoading(false);
          setCurrentStep('');
        }
      };
      generate();
    }
  }, [mealPlan, groceryList, loading, error, setGroceryList, setLoading, setError]);

  useEffect(() => {
    if (mealPlan && groceryList && !substitutions && !loading && !error) {
      const generate = async () => {
        setLoading(true);
        setCurrentStep('🥦 Analyzing dietary substitutions...');
        try {
          const subs = await agent.getSubstitutions(mealPlan);
          setSubstitutions(subs);
        } catch (err: any) {
          setError(err.message || "Failed to get substitutions.");
        } finally {
          setLoading(false);
          setCurrentStep('');
        }
      };
      generate();
    }
  }, [mealPlan, groceryList, substitutions, loading, error, setSubstitutions, setLoading, setError]);

  useEffect(() => {
    if (groceryList && substitutions && dayContext && !budgetCheck && !loading && !error) {
      const generate = async () => {
        setLoading(true);
        setCurrentStep('💰 Calculating budget feasibility...');
        try {
          const check = await agent.checkBudget(groceryList, dayContext.budget);
          setBudgetCheck(check);
        } catch (err: any) {
          setError(err.message || "Failed to check budget.");
        } finally {
          setLoading(false);
          setCurrentStep('');
        }
      };
      generate();
    }
  }, [groceryList, substitutions, dayContext, budgetCheck, loading, error, setBudgetCheck, setLoading, setError]);

  const handleRetry = () => setError(null);

  return (
    <Layout>
      {!dayContext ? (
        <FadeIn>
          <HeroSection />
          <DayContextForm />
        </FadeIn>
      ) : (
        <FadeIn className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-850 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-950/40 p-2 rounded-xl text-blue-600 dark:text-blue-400">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Plan Generated</p>
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Based on your custom profile</p>
            </div>
          </div>
          <Button variant="outline" onClick={reset} className="!py-2">
            <RotateCcw size={16} className="mr-2" /> Start Over
          </Button>
        </FadeIn>
      )}

      {dayContext && <DashboardWidgets />}

      {dayContext && (
        <div className="space-y-12 pb-16">
          {mealPlan && <MealPlanDisplay mealPlan={mealPlan} />}
          {groceryList && <GroceryListDisplay groceryList={groceryList} />}
          {substitutions && substitutions.length > 0 && <SubstitutionsPanel substitutions={substitutions} />}
          {budgetCheck && dayContext && <BudgetFeasibility budgetCheck={budgetCheck} budget={dayContext.budget} />}

          {loading && (
            <FadeIn>
              <Card className="flex flex-col items-center justify-center py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-dashed">
                <Spinner size="lg" />
                <p className="mt-6 text-lg font-bold text-gray-700 dark:text-slate-200 animate-pulse">{currentStep}</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-2 font-medium">Gemini AI is thinking...</p>
              </Card>
            </FadeIn>
          )}

          {error && (
            <FadeIn>
              <ErrorState message={error} onRetry={handleRetry} />
            </FadeIn>
          )}
        </div>
      )}
    </Layout>
  );
}
