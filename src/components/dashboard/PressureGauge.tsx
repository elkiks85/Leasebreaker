'use client';

import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface PressureGaugeProps {
  score: number;
  level: {
    level: string;
    color: string;
    description: string;
  };
}

export function PressureGauge({ score, level }: PressureGaugeProps) {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'text-red-500';
      case 'orange':
        return 'text-orange-500';
      case 'yellow':
        return 'text-yellow-500';
      case 'blue':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getGradientClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'from-red-500 to-red-600';
      case 'orange':
        return 'from-orange-500 to-orange-600';
      case 'yellow':
        return 'from-yellow-500 to-yellow-600';
      case 'blue':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="url(#pressureGradient)"
            strokeWidth="10"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="pressureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                className={cn('stop-color-current', getColorClass(level.color))}
                style={{
                  stopColor:
                    level.color === 'red'
                      ? '#ef4444'
                      : level.color === 'orange'
                      ? '#f97316'
                      : level.color === 'yellow'
                      ? '#eab308'
                      : level.color === 'blue'
                      ? '#3b82f6'
                      : '#6b7280',
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor:
                    level.color === 'red'
                      ? '#dc2626'
                      : level.color === 'orange'
                      ? '#ea580c'
                      : level.color === 'yellow'
                      ? '#ca8a04'
                      : level.color === 'blue'
                      ? '#2563eb'
                      : '#4b5563',
                }}
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Flame className={cn('h-6 w-6 mb-1', getColorClass(level.color))} />
          <span className="text-3xl font-bold text-white">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span
          className={cn(
            'inline-block px-3 py-1 rounded-full text-sm font-semibold',
            level.color === 'red' && 'bg-red-500/20 text-red-400',
            level.color === 'orange' && 'bg-orange-500/20 text-orange-400',
            level.color === 'yellow' && 'bg-yellow-500/20 text-yellow-400',
            level.color === 'blue' && 'bg-blue-500/20 text-blue-400',
            level.color === 'gray' && 'bg-gray-500/20 text-gray-400'
          )}
        >
          Presión {level.level}
        </span>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">{level.description}</p>
      </div>
    </div>
  );
}
