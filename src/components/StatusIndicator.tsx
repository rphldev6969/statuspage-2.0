import React from 'react';
import { cn } from '@/lib/utils';
import { StatusType } from '@/utils/mockData';

interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const StatusIndicator = ({ 
  status, 
  size = 'md', 
  showText = false,
  className 
}: StatusIndicatorProps) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'outage':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: StatusType) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'outage':
        return 'Major Outage';
      default:
        return 'Unknown';
    }
  };

  const getSizeClass = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'md':
        return 'w-3 h-3';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-3 h-3';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span 
        className={cn(
          "rounded-full",
          getStatusColor(status),
          getSizeClass(size),
          className
        )}
      />
      {showText && (
        <span className="text-sm font-medium">
          {getStatusText(status)}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
