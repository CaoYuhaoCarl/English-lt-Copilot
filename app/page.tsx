import dynamic from 'next/dynamic'

const StudentManagement = dynamic(() => import('@/components/StudentManagement'), { 
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
})

export default function Home() {
  return (
    <main className="flex h-screen bg-gray-100">
      <StudentManagement />
    </main>
  )
}