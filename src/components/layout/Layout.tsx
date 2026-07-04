import React, { useState, useEffect } from 'react';
import { ChefHat, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-900 sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-sm">
            <ChefHat size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none">MealGenie</h1>
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">AI Cooking Planner</span>
          </div>
        </div>
        <button 
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-900 rounded-full transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export const HeroSection = () => (
  <div className="py-16 text-center max-w-3xl mx-auto px-4">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
      Powered by Gemini 3.1 Flash-Lite
    </motion.div>
    <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
      Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">AI Sous-Chef</span>
    </h2>
    <p className="text-lg text-gray-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
      Tell us your preferences, and we'll generate a complete daily meal plan, 
      smart grocery list, allergy substitutions, and a budget feasibility analysis in seconds.
    </p>
  </div>
);

export const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
    {children}
  </main>
);

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen pb-20">
    <Header />
    <PageContainer>
      {children}
    </PageContainer>
  </div>
);
