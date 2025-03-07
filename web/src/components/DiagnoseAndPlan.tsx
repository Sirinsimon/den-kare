import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import DiagnosisEditor from "@/components/DiagnosisEditor";
import { Loader } from "@/components/ui/loader";

const DiagnoseAndPlan = ({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const appointmentId = queryParams.get("appointmentId");
    const clinicId = queryParams.get("clinicId");
    const [loading, setLoading] = useState(true);
    const [resultText, setResultText] = useState<string | null>(null); 
    const [activeView, setActiveView] = useState("diagnosis");
    const [generatingReport, setGeneratingReport] = useState(false);

    const getDetectionResults = async () => {
        try {
            let data = await fetch(`http://localhost:8000/analyze?appointment_id=${appointmentId}`);
            let res = await data.json();
            return {
                past_history: res.past_history,
                detected: res.detected
            };
        } catch (error) {
            console.error("Error fetching detection results:", error);
            toast.error("Failed to get detection results", {
                description: "Please try again or contact support"
            });
            throw error;
        }
    };

    const generateReport = async () => {
        try {
            setLoading(true);
            setGeneratingReport(true);
            let result = await getDetectionResults();
            
            let data = await fetch(`http://localhost:5000/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...result,
                    appointmentId: appointmentId
                }),
            });
            
            let res = await data.json();
            setResultText(res.result);
            
            toast.success("Report generated successfully", {
                description: "You can now review and edit the diagnosis"
            });
        } catch (error) {
            console.error("Error generating report:", error);
            toast.error("Failed to generate report", {
                description: "Please try again or contact support"
            });
        } finally {
            setLoading(false);
            setGeneratingReport(false);
        }
    };

    useEffect(() => {
        generateReport();
    }, []);

    const handleSaveReport = () => {
        toast.success("Diagnosis report saved", {
            description: "Your changes have been applied"
        });
    };

    const handleRegenerateReport = () => {
        generateReport();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <motion.div 
            className="workflow-container space-y-6 max-w-4xl mx-auto px-4 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="text-center space-y-2" variants={itemVariants}>
                <div className="progress-pill inline-block bg-progress-75/10 text-progress-75 mb-2">
                    Phase 3 of 4
                </div>
                <h2 className="text-2xl font-light tracking-tight">Diagnose & Plan</h2>
                <p className="text-neutral-500 max-w-md mx-auto">
                    Review and edit the diagnosis report and treatment plan.
                </p>
            </motion.div>

            {generatingReport && (
                <Loader 
                    fullPage 
                    size="lg" 
                    text="Generating intelligent diagnosis..." 
                />
            )}

            <motion.div
                variants={itemVariants}
                className="glass-panel rounded-xl p-6 min-h-[400px] max-w-3xl mx-auto shadow-lg"
                style={{
                    boxShadow: "0 4px 24px -8px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1)"
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeView === "diagnosis" && (
                            <DiagnosisEditor
                                title="Diagnosis Report"
                                content={resultText}
                                onChange={setResultText}
                                onSave={handleSaveReport}
                                loading={loading}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <motion.div 
                className="flex justify-between items-center" 
                variants={itemVariants}
            >
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBack}
                        className="text-neutral-500 border-neutral-200 hover:bg-neutral-50 transition-all duration-300"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    
                    {!loading && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRegenerateReport}
                            disabled={generatingReport}
                            className="text-neutral-500 hover:text-progress-75 transition-all duration-300"
                        >
                            Regenerate
                        </Button>
                    )}
                </div>

                <Button
                    onClick={onComplete}
                    disabled={loading || generatingReport}
                    className="bg-progress-75 hover:bg-progress-100 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default DiagnoseAndPlan;

