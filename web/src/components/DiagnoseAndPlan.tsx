import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import DiagnosisEditor from "@/components/DiagnosisEditor";

const DiagnoseAndPlan = ({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const appointmentId = queryParams.get("appointmentId");
    const clinicId = queryParams.get("clinicId");

    const getDetectionResults = async () => {
        let data = await fetch(`http://localhost:8000/analyze?appointment_id=${appointmentId}`)
        let res = await data.json()
        console.log(res)
        return {
            past_history:res.past_history,
            detected:res.detected
        }
    }

    const generateReport = async () => {
        let result = await getDetectionResults()
        console.log("manu")
        console.log(result)
        let data = await fetch(`http://localhost:5000/scan`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                ...result,
                appointmentId:appointmentId
            }),
        })
        console.log(data)
        let res = await data.json()
        console.log(res.result)
    }

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

    const [treatmentPlan, setTreatmentPlan] = useState(`
    Treatment Plan
    
    For the diagnosed early-stage macular degeneration, the following treatment plan is recommended:
    
    1. AREDS2 formula supplements (daily)
    2. Smoking cessation (if applicable)
    3. Dietary modifications:
       - Increase intake of leafy green vegetables
       - Include fish high in omega-3 fatty acids twice weekly
       - Limit processed foods high in saturated fats
    
    4. UV protection with quality sunglasses when outdoors
    5. Regular monitoring:
       - OCT imaging every 6 months
       - Visual acuity testing every 3 months
    
    6. Amsler grid home monitoring (daily)
    
    Early intervention with these measures has been shown to slow progression 
    and maintain visual function longer in patients with early AMD.
  `);

    const [activeView, setActiveView] = useState("diagnosis");

    useEffect(()=>{
            generateReport()
    },[])

    const handleSaveReport = () => {
        toast.success("Diagnosis report saved", {
            description: "Your changes have been applied"
        });
    };

    const handleSaveTreatmentPlan = () => {
        toast.success("Treatment plan saved", {
            description: "Your changes have been applied"
        });
    };

    return (
        <div className="workflow-container animate-fade-in space-y-6">
            <div className="text-center space-y-2">
                <div className="progress-pill inline-block bg-progress-75/20 text-progress-75 mb-2">
                    Phase 3 of 4
                </div>
                <h2 className="text-2xl font-light tracking-tight">Diagnose & Plan</h2>
                <p className="text-neutral-400 max-w-md mx-auto">
                    Review and edit the diagnosis report and treatment plan.
                </p>
            </div>

            {/* Report Display Area */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-lg p-6 min-h-[350px] max-w-3xl mx-auto"
            >
                {activeView === "diagnosis" &&
                    <DiagnosisEditor
                        title="Diagnosis Report"
                        content={report}
                        onChange={setReport}
                        onSave={handleSaveReport}
                    />
                }
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

