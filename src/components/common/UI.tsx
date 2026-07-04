import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
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
  variant?: 'primary' | 'secondary' | 'danger',
  className?: string
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]}`}></div>
    </div>
  );
};

export const ErrorState = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex flex-col items-start gap-3">
    <p>{message}</p>
    {onRetry && (
      <Button variant="danger" onClick={onRetry} className="text-sm">Try Again</Button>
    )}
  </div>
);

export const EmptyState = ({ title, description }: { title: string, description: string }) => (
  <div className="text-center py-12">
    <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);
