
import React from 'react';
import { cn } from '@/lib/utils';
import { StatusType, getStatusColor, getStatusText } from '@/utils/mockData';

interface StatusIndicatorProps {
  status: StatusType;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  showText = false,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'status-indicator',
          getStatusColor(status),
          sizeClasses[size]
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
