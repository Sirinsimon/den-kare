import type { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="border border-white/20 rounded-3xl p-8 bg-[#0A0A0A]">{children}</div>
    </main>
  )
}


