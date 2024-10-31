import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  MessageSquare,
  BookOpen,
  Target,
  Lightbulb,
  Loader2
} from 'lucide-react'
import { Question, TestDetail } from '@/lib/types'

interface AIAnalysisPanelProps {
  question: Question
  detail: TestDetail
  testId: number
  isLoading: boolean
  analysisResult?: {
    errorAnalysis: string
    guidance: string
    similarQuestions: string
    keyPointSummary: string
    abilityImprovement: string
  }
  onAnalyze: () => void
}

export default function AIAnalysisPanel({
  question,
  detail,
  testId,
  isLoading,
  analysisResult,
  onAnalyze
}: AIAnalysisPanelProps) {
  if (!analysisResult && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <Brain className="w-12 h-12 text-muted-foreground" />
        <p className="text-center text-muted-foreground">
          点击下方按钮开始AI分析
        </p>
        <Button onClick={onAnalyze}>
          开始分析
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-center text-muted-foreground">
          AI正在分析中...
        </p>
      </div>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">AI分析报告</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{question.keyPoint}</Badge>
            <Badge variant="outline">{question.ability}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">错误分析</span>
            </TabsTrigger>
            <TabsTrigger value="guidance" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">启发引导</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">练习题</span>
            </TabsTrigger>
            <TabsTrigger value="keypoint" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">知识点</span>
            </TabsTrigger>
            <TabsTrigger value="ability" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">能力提升</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="analysis" className="prose dark:prose-invert">
              <div className="whitespace-pre-wrap">{analysisResult?.errorAnalysis}</div>
            </TabsContent>

            <TabsContent value="guidance" className="prose dark:prose-invert">
              <div className="whitespace-pre-wrap">{analysisResult?.guidance}</div>
            </TabsContent>

            <TabsContent value="practice" className="prose dark:prose-invert">
              <div className="whitespace-pre-wrap">{analysisResult?.similarQuestions}</div>
            </TabsContent>

            <TabsContent value="keypoint" className="prose dark:prose-invert">
              <div className="whitespace-pre-wrap">{analysisResult?.keyPointSummary}</div>
            </TabsContent>

            <TabsContent value="ability" className="prose dark:prose-invert">
              <div className="whitespace-pre-wrap">{analysisResult?.abilityImprovement}</div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}