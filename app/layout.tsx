import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Carl英语智学系统',
  description: '个性化学习应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}