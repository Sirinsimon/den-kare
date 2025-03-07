import { Menu, User } from "lucide-react"

interface NavbarProps {
  user: {
    name: string
    avatar: string
  }
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="border-b border-white/10 py-4 bg-[#0A0A0A]">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Menu className="h-5 w-5" />
          <span className="font-semibold">Den-Kare</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden md:inline-block">{user.name}</span>
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </nav>
  )
}


