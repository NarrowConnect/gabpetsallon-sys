
import React from 'react';
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveContainer = ({ children, className }: ResponsiveContainerProps) => {
  return (
    <div className={cn(
      "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveGrid = ({ children, className }: ResponsiveContainerProps) => {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveCard = ({ children, className }: ResponsiveContainerProps) => {
  return (
    <div className={cn(
      "bg-white/70 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-sm",
      className
    )}>
      {children}
    </div>
  );
};
