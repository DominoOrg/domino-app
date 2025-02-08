import HomeForm from '@/components/custom/homeForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/4 flex flex-col items-center gap-8">
        {/* Image */}
        <img src="/logo-sm.png" alt="" className="w-64 h-128" />
        <HomeForm />
      </div>
    </div>
  )
}
