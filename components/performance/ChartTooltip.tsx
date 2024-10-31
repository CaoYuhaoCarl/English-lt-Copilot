import React from 'react';
import { TooltipProps } from 'recharts';
import { Card } from "@/components/ui/card";

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export default function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;

  return (
    <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-4 shadow-2xl border-0 rounded-xl">
      <p className="font-medium mb-2 text-sm text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <p 
            key={index} 
            className="flex items-center gap-2 font-medium"
            style={{ color: entry.color }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-700 dark:text-gray-200">{entry.name}:</span>
            <span className="ml-auto">
              {entry.value.toFixed(1)}
              {entry.name === '个人得分' ? '分' : '%'}
            </span>
          </p>
        ))}
      </div>
    </Card>
  );
}