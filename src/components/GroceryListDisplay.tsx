import { useState } from 'react';
import { Card } from './common/UI';
import type { GroceryList } from '../types';
import { ShoppingBasket, CheckCircle2, Circle } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from './common/Animations';
import { cn } from '../utils/cn';

export const GroceryListDisplay = ({ groceryList }: { groceryList: GroceryList }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const categories = [
    { key: 'produce', label: 'Produce', color: 'bg-green-100 text-green-800 border-green-200' },
    { key: 'proteins', label: 'Proteins', color: 'bg-red-100 text-red-800 border-red-200' },
    { key: 'dairy', label: 'Dairy & Alts', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { key: 'pantry', label: 'Pantry', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { key: 'spices', label: 'Spices', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { key: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  ];

  const toggleCheck = (item: string) => {
    const newSet = new Set(checkedItems);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    setCheckedItems(newSet);
  };

  return (
    <FadeIn className="space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-850 pb-4">
        <ShoppingBasket className="text-purple-600 dark:text-purple-400" size={28} />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Smart Grocery List</h2>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(({ key, label, color }) => {
          const items = groceryList[key as keyof GroceryList];
          if (!items || items.length === 0) return null;
          
          return (
            <StaggerItem key={key}>
              <Card className="h-full bg-gray-50/50 dark:bg-slate-900/50">
                <div className={cn("inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 border", color)}>
                  {label}
                </div>
                <ul className="space-y-3">
                  {items.map((item, idx) => {
                    const isChecked = checkedItems.has(item);
                    return (
                      <li 
                        key={idx} 
                        onClick={() => toggleCheck(item)}
                        className={cn(
                          "flex items-start gap-3 text-sm cursor-pointer transition-all duration-200 group",
                          isChecked ? "text-gray-400 line-through dark:text-slate-500" : "text-gray-700 dark:text-slate-350"
                        )}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isChecked ? (
                            <CheckCircle2 size={18} className="text-purple-500 dark:text-purple-400" />
                          ) : (
                            <Circle size={18} className="text-gray-300 dark:text-slate-700 group-hover:text-purple-300 dark:group-hover:text-purple-400" />
                          )}
                        </div>
                        <span className="leading-snug select-none">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </FadeIn>
  );
};
