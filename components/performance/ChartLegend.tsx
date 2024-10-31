import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ChartLegendProps {
  items: {
    name: string;
    color: string;
    unit: string;
  }[];
}

export default function ChartLegend({ items }: ChartLegendProps) {
  return (
    <div className="flex gap-6 justify-center">
      {items.map((item, index) => (
        <div 
          key={index}
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm transition-transform hover:scale-105"
        >
          <div 
            className="w-3 h-3 rounded-full shadow-inner"
            style={{ 
              backgroundColor: item.color,
              boxShadow: `0 0 0 2px ${item.color}20`
            }}
          />
          <span className="font-medium">{item.name}</span>
          <span className="text-sm text-muted-foreground">({item.unit})</span>
        </div>
      ))}
    </div>
  );
}