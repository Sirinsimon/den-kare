"use client"

import { useState } from "react"
import DutyToggle from "./DutyToggle"
import type { DutyStatus } from "../pages/dashboard"

interface DutyCardProps {
  dutyStatus: DutyStatus
}

export default function DutyCard({ dutyStatus }: DutyCardProps) {
  const [isOnDuty, setIsOnDuty] = useState(dutyStatus.initialStatus)
  const [activeSince, setActiveSince] = useState(dutyStatus.activeSince)

  const handleToggle = (value: boolean) => {
    setIsOnDuty(value)
    if (value) {
      setActiveSince("0Hrs")
    } else {
      setActiveSince("--")
    }
  }

  return (
    <div className="w-full md:w-1/2">
      <h2 className="text-lg font-medium mb-4">DUTY</h2>
      <div className="border border-white/20 rounded-2xl p-8 bg-[#0D0D0D]">
        <div className="flex flex-col items-center md:items-start gap-6">
          <DutyToggle value={isOnDuty} onValueChange={handleToggle} />
          <div className="space-y-1">
            <p className="text-white/80">
              status:{" "}
              <span className={isOnDuty ? "text-green-400" : "text-red-400"}>{isOnDuty ? "online" : "offline"}</span>,
            </p>
            <p className="text-white/80">active_since: {activeSince},</p>
          </div>
        </div>
      </div>
    </div>
  )
}


