import type { Doctor } from "../pages/dashboard"

interface DoctorsCardProps {
  doctors: Doctor[]
}

export default function DoctorsCard({ doctors }: DoctorsCardProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-medium mb-4">ACTIVE DOCTORS</h2>
      <div className="border border-white/20 rounded-2xl flex-1 bg-[#0D0D0D] overflow-hidden">
        <div className="divide-y divide-white/10">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="p-4">
              <div className="flex justify-between items-center">
                <span>{doctor.name}</span>
                <span className={`text-sm ${doctor.status === "Available" ? "text-green-400" : "text-white/70"}`}>
                  {doctor.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


