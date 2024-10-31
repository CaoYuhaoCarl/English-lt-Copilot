'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { Student } from '@/lib/types';
import { usePerformanceData } from '@/hooks/usePerformanceData';
import ChartTooltip from './performance/ChartTooltip';
import EmptyState from './performance/EmptyState';

interface PerformanceChartProps {
  student: Student;
  allStudents: Student[];
}

const COLORS = {
  primary: 'rgb(199,126,89)',
  secondary: 'rgb(165,144,127)',
  accent: 'rgb(147,51,234)'
};

export default function PerformanceChart({ student, allStudents }: PerformanceChartProps) {
  const { chartData, typeAccuracyData, abilityData, keyPointData, hasData } = usePerformanceData(student, allStudents);

  if (!hasData) {
    return (
      <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">
            {student.name}学生训练趋势统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          {student.name}学生训练趋势统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trend" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trend">成绩趋势</TabsTrigger>
            <TabsTrigger value="accuracy">题型分析</TabsTrigger>
            <TabsTrigger value="keypoint">知识点</TabsTrigger>
            <TabsTrigger value="ability">能力分析</TabsTrigger>
          </TabsList>

          <TabsContent value="trend" className="space-y-4">
            <div className="rounded-xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 shadow-inner">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: '#6B7280' }}
                    domain={[0, 100]}
                  />
                  <ChartTooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="个人得分"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{ stroke: COLORS.primary, strokeWidth: 2, r: 4, fill: '#fff' }}
                    activeDot={{ r: 6, stroke: COLORS.primary, strokeWidth: 2, fill: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="classAverage"
                    name="班级平均"
                    stroke={COLORS.secondary}
                    strokeWidth={3}
                    dot={{ stroke: COLORS.secondary, strokeWidth: 2, r: 4, fill: '#fff' }}
                    activeDot={{ r: 6, stroke: COLORS.secondary, strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="accuracy">
            <div className="rounded-xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 shadow-inner">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeAccuracyData} barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" vertical={false} />
                  <XAxis 
                    dataKey="type" 
                    className="text-xs"
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: '#6B7280' }}
                    domain={[0, 100]}
                  />
                  <ChartTooltip />
                  <Legend />
                  <Bar 
                    dataKey="personalAccuracy" 
                    name="个人准确率" 
                    fill={COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="classAverage" 
                    name="班级平均" 
                    fill={COLORS.secondary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="keypoint">
            <div className="rounded-xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 shadow-inner">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={keyPointData} className="mx-auto">
                  <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
                  <PolarAngleAxis 
                    dataKey="keyPoint" 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Radar
                    name="个人掌握度"
                    dataKey="score"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="班级平均"
                    dataKey="average"
                    stroke={COLORS.secondary}
                    fill={COLORS.secondary}
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="ability">
            <div className="rounded-xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 shadow-inner">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={abilityData} className="mx-auto">
                  <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
                  <PolarAngleAxis 
                    dataKey="ability" 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Radar
                    name="个人能力"
                    dataKey="score"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="班级平均"
                    dataKey="average"
                    stroke={COLORS.secondary}
                    fill={COLORS.secondary}
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}