"use client"
import { FileText } from "lucide-react"

interface ReportFile {
  name: string
  type: string
}

interface ReportsModalProps {
  isOpen: boolean
  onClose: () => void
  reports: ReportFile[]
}

export default function ReportsModal({ isOpen, onClose, reports = [] }: ReportsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-full max-w-2xl bg-black border border-white/20 rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-white text-xl font-medium mb-10">REPORTS GENERATE SUCCESSFULLY</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
          {reports.map((report, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border border-white/20 rounded-lg p-4 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="border border-white/20 rounded p-2">
                <FileText className="text-white h-6 w-6" />
              </div>
              <div className="text-white">
                <p className="font-medium">{report.name}</p>
                <p className="text-sm text-white/70">{report.type}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="border border-white/20 rounded px-10 py-2 text-white hover:bg-white/10 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  )
}


