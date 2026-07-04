import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', noPadding = false }: { children: React.ReactNode, className?: string, noPadding?: boolean }) => (
  <div className={cn(
    "bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-850 overflow-hidden transition-all duration-300",
    !noPadding && "p-6",
    className
  )}>
    {children}
  </div>
);

export const Button = ({ 
  children, 
  onClick, 
  disabled, 
  type = 'button',
  variant = 'primary',
  className = ''
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  disabled?: boolean,
  type?: 'button' | 'submit',
  variant?: 'primary' | 'secondary' | 'danger' | 'outline',
  className?: string
}) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus:ring-blue-500",
    secondary: "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 focus:ring-gray-500",
    danger: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 focus:ring-red-500",
    outline: "border-2 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-850 focus:ring-gray-500"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyle, variants[variant], className)}
    >
      {children}
    </button>
  );
};

export const Spinner = ({ size = 'md', label }: { size?: 'sm' | 'md' | 'lg', label?: string }) => {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-3', lg: 'h-12 w-12 border-4' };
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div className={cn(
        "animate-spin rounded-full border-gray-200 border-t-blue-600",
        sizes[size]
      )} />
      {label && <p className="text-gray-500 font-medium animate-pulse">{label}</p>}
    </div>
  );
};

export const ErrorState = ({ message, onRetry }: { message: string, onRetry?: () => void }) => {
  const isApiError = message.includes("API key");
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-red-50 border border-red-200 p-6 rounded-2xl flex flex-col items-center text-center gap-4 max-w-lg mx-auto"
    >
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="w-full">
        <h3 className="text-lg font-bold text-red-900 mb-3">Oops, something went wrong</h3>
        <div className="text-sm text-red-800 whitespace-pre-line text-left bg-red-100/50 p-4 rounded-xl border border-red-100 w-full">
          {message}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        {onRetry && (
          <Button variant="danger" onClick={onRetry}>Try Again</Button>
        )}
        {isApiError && (
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 border-2 border-red-200 text-red-700 hover:border-red-300 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform active:scale-95"
          >
            Check API Configuration
          </a>
        )}
      </div>
    </motion.div>
  );
};

export const EmptyState = ({ title, description, icon: Icon }: { title: string, description: string, icon?: any }) => (
  <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-850 border-dashed">
    {Icon && (
      <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} />
      </div>
    )}
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">{description}</p>
  </div>
);
