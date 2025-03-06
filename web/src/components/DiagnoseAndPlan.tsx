
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { motion } from "framer-motion";

const DiagnoseAndPlan = ({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) => {
  // Sample report text - in a real application, this would come from previous phases
  const [report, setReport] = useState(`
    Patient Diagnosis Report

    Based on the analyzed data and annotations from previous phases, the following diagnosis has been determined:

    Condition: Early-stage macular degeneration
    Severity: Mild to moderate
    Affected areas: Central macula, with minimal peripheral involvement
    
    Key observations:
    - Small drusen deposits present in the macula
    - Minor pigmentary changes in the retinal pigment epithelium
    - Visual acuity slightly reduced (20/40)
    - No evidence of choroidal neovascularization
    
    This diagnosis is consistent with Age-related Macular Degeneration (AMD) in its early stage. 
    The patient is experiencing mild symptoms that may include slight blurriness in central vision 
    and minor difficulty recognizing faces or reading fine print.

    Recommended treatment plan will be provided in the final phase.
  `);

  return (
    <div className="workflow-container animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <div className="progress-pill inline-block bg-progress-75/20 text-progress-75 mb-2">
          Phase 3 of 4
        </div>
        <h2 className="text-2xl font-light tracking-tight">Diagnose & Plan</h2>
        <p className="text-neutral-400 max-w-md mx-auto">
          Review the detailed diagnosis report based on the analyzed data.
        </p>
      </div>

      {/* Report Display Area */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-lg p-6 min-h-[350px] max-w-3xl mx-auto"
      >
        <div className="flex items-center mb-4">
          <FileText className="h-5 w-5 mr-2 text-progress-75" />
          <h3 className="text-md font-medium">Diagnosis Report</h3>
        </div>
        
        <div className="whitespace-pre-line text-neutral-300 leading-relaxed">
          {report}
        </div>
      </motion.div>

      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack} 
          className="text-neutral-400 border-neutral-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <Button 
          onClick={onComplete} 
          className="bg-progress-75 hover:bg-progress-75/90 transition-all"
        >
          Next <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DiagnoseAndPlan;
