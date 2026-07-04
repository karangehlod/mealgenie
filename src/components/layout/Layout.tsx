import React from 'react';
import { Utensils } from 'lucide-react';

export const Header = () => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
      <div className="bg-blue-600 p-2 rounded-lg text-white">
        <Utensils size={20} />
      </div>
      <h1 className="text-xl font-bold text-gray-900">AI Cooking Planner</h1>
    </div>
  </header>
);

export const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    {children}
  </main>
);

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <PageContainer>
      {children}
    </PageContainer>
  </div>
);
