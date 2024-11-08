'use client'

import React, { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

interface PerfectScoreCelebrationProps {
  show: boolean
  onAnimationEnd: () => void
}

export default function PerfectScoreCelebration({ show, onAnimationEnd }: PerfectScoreCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setIsLeaving(false)
      
      // 2.5秒后开始退出动画（如果用户没有点击退出）
      const exitTimer = setTimeout(() => {
        setIsLeaving(true)
      }, 2500)
      
      // 3秒后完全结束动画并清理（如果用户没有点击退出）
      const cleanupTimer = setTimeout(() => {
        setIsVisible(false)
        onAnimationEnd()
      }, 3000)

      // 创建连续的烟花效果
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timer = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => {
        clearTimeout(exitTimer)
        clearTimeout(cleanupTimer)
        clearInterval(interval)
      }
    }
  }, [show, onAnimationEnd])

  const handleClick = () => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      onAnimationEnd()
    }, 500)
  }

  if (!show && !isVisible) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 flex items-center justify-center z-[100] transition-all duration-500 cursor-pointer",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        isLeaving ? "scale-110 opacity-0" : "scale-100"
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
      aria-label="关闭庆祝动画"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div 
        className={cn(
          "relative transform transition-all duration-500",
          isLeaving ? "scale-150 opacity-0" : "scale-100 opacity-100",
          "animate-[celebration_2.5s_ease-in-out]"
        )}
      >
        <Trophy className="w-32 h-32 text-yellow-400" />
        <div className="text-4xl font-bold text-white text-center mt-4 drop-shadow-lg">
          全对!
        </div>
        <div className="text-2xl text-yellow-200 text-center mt-2 drop-shadow-md">
          太棒了!
        </div>
        <div className="text-sm text-gray-300 text-center mt-4">
          点击任意位置继续
        </div>
      </div>
    </div>
  )
}