import { useState, useEffect } from "react";
import ScanAndDetect from "@/components/ScanAndDetect";
import ReviewAndAnnotate from "@/components/ReviewAndAnnotate";
import DiagnoseAndPlan from "@/components/DiagnoseAndPlan";
import FinalizeAndShare from "@/components/FinalizeAndShare";
import { motion } from "framer-motion";

const Index = () => {
  const phases = [
    { id: "scan-detect", label: "Scan & Detect" },
    { id: "review-annotate", label: "Review & Annotate" },
    { id: "diagnose-plan", label: "Diagnose & Plan" },
    { id: "finalize-share", label: "Finalize & Share" }
  ];
  
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  const completeCurrentPhase = () => {
    if (!completedPhases.includes(currentPhase)) {
      setCompletedPhases([...completedPhases, currentPhase]);
    }
    setCurrentPhase(currentPhase + 1);
  };

  const goBack = () => {
    setCurrentPhase(currentPhase - 1);
  };

  const resetWorkflow = () => {
    setCurrentPhase(0);
    setCompletedPhases([]);
  };

  // Get color for the current phase
  const getPhaseColor = (index: number) => {
    switch(index) {
      case 0: return "text-progress-25";
      case 1: return "text-progress-50";
      case 2: return "text-progress-75";
      case 3: return "text-progress-100";
      default: return "text-white";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="w-full border border-neutral-800 rounded-lg overflow-hidden bg-black/60 backdrop-blur-sm">
          {/* Window control */}
          <div className="flex justify-between items-center p-4 border-b border-neutral-800">
            <h1 className="text-lg font-light tracking-wide">PATIENT PATHWAY ANALYZER</h1>
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-neutral-800"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-800"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-800"></div>
            </div>
          </div>

          {/* Progress Tabs */}
          <div className="p-6 pb-0">
            <div className="flex border border-neutral-800 rounded-lg overflow-hidden">
              {phases.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`
                    relative flex-1 py-3 px-1 text-center text-sm transition-all duration-300
                    ${index <= currentPhase ? getPhaseColor(index) : "text-neutral-600"}
                    ${index === currentPhase ? "bg-black/30" : ""}
                    ${completedPhases.includes(index) ? "progress-tab progress-tab-active" : ""}
                    ${index > 0 ? "border-l border-neutral-800" : ""}
                  `}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="block truncate"
                  >
                    {phase.label}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <motion.div 
            key={currentPhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {currentPhase === 0 && (
              <ScanAndDetect onComplete={completeCurrentPhase} />
            )}
            {currentPhase === 1 && (
              <ReviewAndAnnotate onComplete={completeCurrentPhase} onBack={goBack} />
            )}
            {currentPhase === 2 && (
              <DiagnoseAndPlan onComplete={completeCurrentPhase} onBack={goBack} />
            )}
            {currentPhase === 3 && (
              <FinalizeAndShare onBack={goBack} onReset={resetWorkflow} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
