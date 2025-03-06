
import { useState } from "react"
import Detection from "../components/detection"

export default function PatientDataAnalyzer() {
  const [activeTab, setActiveTab] = useState<"detection" | "report-analyzer" | "finalize">("detection")

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full h-screen border border-neutral-700 rounded-lg overflow-hidden">
        {/* Window control */}
        <div className="flex justify-end p-2 border-b border-neutral-700">
          <div className="w-5 h-5 rounded-full border border-neutral-700"></div>
        </div>

        {/* Header */}
        <div className="p-6 pb-4">
          <h1 className="text-lg font-medium text-neutral-200">ANALYZE PATIENT DATA</h1>
        </div>

        {/* Tabs */}
        <div className="mx-6 mb-4">
          <div className="flex border border-neutral-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("detection")}
              className={`flex-1 py-3 px-4 text-sm ${activeTab === "detection" ? "text-white" : "text-neutral-400"}`}
            >
              Detection
            </button>
            <div className="w-px bg-neutral-700"></div>
            <button
              onClick={() => setActiveTab("report-analyzer")}
              className={`flex-1 py-3 px-4 text-sm ${
                activeTab === "report-analyzer" ? "text-white" : "text-neutral-400"
              }`}
            >
              Report Analyzer
            </button>
            <div className="w-px bg-neutral-700"></div>
            <button
              onClick={() => setActiveTab("finalize")}
              className={`flex-1 py-3 px-4 text-sm ${activeTab === "finalize" ? "text-white" : "text-neutral-400"}`}
            >
              Finalize
            </button>
          </div>
        </div>

        {/* Content Area - Empty for now */}
        <div className="mx-6 mb-6 min-h-[400px] border border-neutral-800 rounded-lg p-4">
          {activeTab === "detection" && <Detection/> }
          {activeTab === "report-analyzer" && (
            <div className="text-neutral-400">Report Analyzer tab content will go here</div>
          )}
          {activeTab === "finalize" && <div className="text-neutral-400">Finalize tab content will go here</div>}
        </div>
      </div>
    </div>
  )
}


