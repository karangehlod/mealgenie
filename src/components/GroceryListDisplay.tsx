import { Card } from './common/UI';
import type { GroceryList } from '../types';

export const GroceryListDisplay = ({ groceryList }: { groceryList: GroceryList }) => {
  const categories = [
    { key: 'produce', label: 'Produce', color: 'bg-green-100 text-green-800' },
    { key: 'proteins', label: 'Proteins', color: 'bg-red-100 text-red-800' },
    { key: 'dairy', label: 'Dairy & Alternatives', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'pantry', label: 'Pantry', color: 'bg-orange-100 text-orange-800' },
    { key: 'spices', label: 'Spices & Seasonings', color: 'bg-purple-100 text-purple-800' },
    { key: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">Grocery List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(({ key, label, color }) => {
          const items = groceryList[key as keyof GroceryList];
          if (!items || items.length === 0) return null;
          
          return (
            <div key={key}>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${color}`}>
                {label}
              </div>
              <ul className="space-y-2">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <span className="mr-2 text-gray-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
