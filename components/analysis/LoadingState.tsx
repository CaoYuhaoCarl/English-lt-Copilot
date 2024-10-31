import React from 'react'
import { Loader2 } from 'lucide-react'

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-center text-muted-foreground">
        准备中...
      </p>
    </div>
  )
}