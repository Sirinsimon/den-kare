"use client"
import { cn } from "../lib/utils"

interface DutyToggleProps {
  value: boolean
  onValueChange: (value: boolean) => void
}

export default function DutyToggle({ value, onValueChange }: DutyToggleProps) {
  return (
    <div
      className="relative w-64 h-10 border border-white/20 rounded-full cursor-pointer overflow-hidden bg-[#0A0A0A]"
      onClick={() => onValueChange(!value)}
    >
      <div className="absolute inset-0 flex">
        <div
          className={cn(
            "flex-1 flex items-center justify-center transition-colors",
            value ? "bg-white/10" : "bg-transparent",
          )}
        >
          ON
        </div>
        <div className="w-px bg-white/20" />
        <div
          className={cn(
            "flex-1 flex items-center justify-center transition-colors",
            !value ? "bg-white/10" : "bg-transparent",
          )}
        >
          OFF
        </div>
      </div>
    </div>
  )
}


