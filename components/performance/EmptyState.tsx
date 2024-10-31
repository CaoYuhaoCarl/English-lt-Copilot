import React from 'react';
import { LineChart } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="relative">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-violet-200 to-purple-200 dark:from-violet-900 dark:to-purple-900 rounded-full blur-xl opacity-50" />
        <LineChart className="w-16 h-16 text-violet-500 dark:text-violet-400 relative" />
      </div>
      <p className="mt-6 text-center text-gray-600 dark:text-gray-300 font-medium">
        暂无训练数据
      </p>
      <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
        完成第一次测试后即可查看训练趋势
      </p>
    </div>
  );
}