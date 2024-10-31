import React from 'react'
import { Button } from "@/components/ui/button"
import { Brain } from 'lucide-react'

interface InitialStateProps {
  onAnalyze: () => void
}

export default function InitialState({ onAnalyze }: InitialStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <Brain className="w-12 h-12 text-muted-foreground" />
      <p className="text-center text-muted-foreground">
        Get个性化讲解👇🏻
      </p>
      <Button onClick={onAnalyze}>
        GO
      </Button>
    </div>
  )
}