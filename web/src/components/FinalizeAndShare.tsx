import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, CheckCircle, Share2, Download, Mail, Users, Lock, Printer, Copy } from 'lucide-react';
import { toast } from "sonner";
import DiagnosisEditor from "@/components/DiagnosisEditor";
import ReportsModal from "./ReportsModal";
import AppointmentsCard from "./AppointmentsCard";


const diagnosesData = [
    {
        id: "diag-1",
        title: "Primary diagnosis",
        content: "Type 2 Diabetes Mellitus (T2DM) with early signs of peripheral neuropathy. Patient shows elevated blood glucose levels consistently above 180 mg/dL during fasting tests. HbA1c levels at 7.8% indicate suboptimal glycemic control over the past 3 months."
    },
    {
        id: "diag-2",
        title: "Secondary diagnosis",
        content: "Mild hypertension (140/90 mmHg) with indications of early stage renal involvement. Microalbuminuria detected in urine samples suggests beginnings of diabetic nephropathy. Regular monitoring of kidney function is advised."
    }
];

// Mock data for treatment plans
const treatmentPlansData = [
    {
        id: "plan-1",
        title: "Primary treatment plan",
        content: "Implement basal insulin therapy with 10 units of long-acting insulin at bedtime. Continue metformin 1000mg twice daily with meals. Monitor blood glucose levels before meals and at bedtime. Target range: 80-130 mg/dL before meals, <180 mg/dL post-prandial."
    },
    {
        id: "plan-2",
        title: "Lifestyle modifications",
        content: "Implement Mediterranean-style diet with emphasis on low glycemic index foods. Begin graduated exercise program starting with 15 minutes walking daily, increasing to 30 minutes 5 times weekly. Reduce sodium intake to <2300mg daily to address hypertension."
    }
];

const FinalizeAndShare = ({ onBack, onReset }: { onBack: () => void; onReset: () => void }) => {
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [isFinalized, setIsFinalized] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string, title: string, content: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editedContent, setEditedContent] = useState("");
    const [treatmentPlans, setTreatmentPlans] = useState([])

    const fetchTreatmentPlans = async () => {
        const data = await fetch("http://localhost:5000/treatments")
        let res = await data.json()
        setTreatmentPlans(res.result)
    }

    const reports = [
        { name: "Diagnosis report", type: "report.pdf" },
        { name: "Prescription report", type: "report.pdf" },
    ]

    const handleFinalize = async () => {
        setIsFinalizing(true);
        let data = await fetch(`http://localhost:5000/final_report?title=${selectedItem.title}`)
        let res = await data.json()

        console.log(res)
        setIsModalOpen(true)
        setTimeout(() => {
            setIsFinalizing(false);
            setIsFinalized(true);
            toast.success("Report successfully finalized", {
                description: "Your patient analysis is ready to share",
            });
        }, 2000);
    };

    const handleShare = (method: string) => {
        toast.success(`Shared via ${method}`, {
            description: "Recipients will receive secure access",
        });
    };

    const handleItemClick = (item: { id: string, title: string, content: string }) => {
        setSelectedItem(item);
        setEditedContent(item.content);
    };

    return (
        <div className="workflow-container animate-fade-in space-y-6 p-6">
            <div className="text-center space-y-2">
                <div className="progress-pill inline-block bg-progress-100/20 text-progress-100 mb-2">
                    Phase 4 of 4
                </div>
                <h2 className="text-2xl font-light tracking-tight">Finalize & Share</h2>
                <p className="text-neutral-400 max-w-md mx-auto">
                    Finalize the report and share it with healthcare team or patient.
                </p>
            </div>
            <ReportsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reports={reports} />

            <div className="glass-panel p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" onClick={onBack} className="text-neutral-400 border-neutral-800">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Report Preview */}
                    <div className="glass-panel p-4 space-y-4">
                        <h3 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-2" /> Treatment Plans
                        </h3>

                        <div className="bg-neutral-900/50 rounded-md p-4 space-y-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium">Treatment Plans</h4>
                            </div>

                            <div className="space-y-2">
                                <div
                                    className="p-2 bg-black/30 rounded border border-neutral-800 cursor-pointer hover:border-neutral-600 transition-all"
                                    onClick={() => handleItemClick(diagnosesData[0])}
                                >
                                    <h5 className="text-xs text-neutral-400">Diagnosis</h5>
                                    <p className="text-sm">{diagnosesData[0].title}</p>
                                </div>

                                <div
                                    className="p-2 bg-black/30 rounded border border-neutral-800 cursor-pointer hover:border-neutral-600 transition-all"
                                    onClick={() => handleItemClick(diagnosesData[1])}
                                >
                                    <h5 className="text-xs text-neutral-400">Secondary Diagnosis</h5>
                                    <p className="text-sm">{diagnosesData[1].title}</p>
                                </div>

                                <div
                                    className="p-2 bg-black/30 rounded border border-neutral-800 cursor-pointer hover:border-neutral-600 transition-all"
                                    onClick={() => handleItemClick(treatmentPlansData[0])}
                                >
                                    <h5 className="text-xs text-neutral-400">Treatment Plan</h5>
                                    <p className="text-sm">{treatmentPlansData[0].title}</p>
                                </div>

                                <div
                                    className="p-2 bg-black/30 rounded border border-neutral-800 cursor-pointer hover:border-neutral-600 transition-all"
                                    onClick={() => handleItemClick(treatmentPlansData[1])}
                                >
                                    <h5 className="text-xs text-neutral-400">Additional Recommendations</h5>
                                    <p className="text-sm">{treatmentPlansData[1].title}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-neutral-500">
                                <span>Page 1 of 3</span>
                                <span className="flex items-center">
                                    <Lock className="h-3 w-3 mr-1" /> Encrypted
                                </span>
                            </div>
                        </div>

                        {!isFinalized ? (
                            <Button
                                onClick={handleFinalize}
                                disabled={isFinalizing}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
                            >
                                {isFinalizing ? (
                                    <>Finalizing Report...</>
                                ) : (
                                    <>Finalize Report <CheckCircle className="h-4 w-4 ml-2" /></>
                                )}
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => { }}
                                className="w-full border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                            >
                                <Download className="h-4 w-4 mr-2" /> Download Report
                            </Button>
                        )}
                    </div>

                    {/* Diagnosis Editor */}
                    <div className="glass-panel p-4 space-y-4">
                        {selectedItem ? (
                            <DiagnosisEditor
                                title={selectedItem.title}
                                content={editedContent}
                                onChange={setEditedContent}
                                onSave={() => {
                                    toast.success("Changes saved", {
                                        description: "Your edits have been applied to the report",
                                    });
                                }}
                            />
                        ) : (
                            <>
                                <h3 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                                    <Share2 className="h-4 w-4 mr-2" /> Share Report
                                </h3>

                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        disabled={!isFinalized}
                                        onClick={() => handleShare("Email")}
                                        className="w-full justify-start border-neutral-800 hover:bg-neutral-800/30 transition-all"
                                    >
                                        <Mail className="h-4 w-4 mr-3" /> Share via Email
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={!isFinalized}
                                        onClick={() => handleShare("Healthcare Team")}
                                        className="w-full justify-start border-neutral-800 hover:bg-neutral-800/30 transition-all"
                                    >
                                        <Users className="h-4 w-4 mr-3" /> Share with Healthcare Team
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={!isFinalized}
                                        onClick={() => handleShare("Print")}
                                        className="w-full justify-start border-neutral-800 hover:bg-neutral-800/30 transition-all"
                                    >
                                        <Printer className="h-4 w-4 mr-3" /> Print Report
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={!isFinalized}
                                        onClick={() => {
                                            toast.success("Link copied to clipboard", {
                                                description: "Share securely with authorized personnel",
                                            });
                                        }}
                                        className="w-full justify-start border-neutral-800 hover:bg-neutral-800/30 transition-all"
                                    >
                                        <Copy className="h-4 w-4 mr-3" /> Copy Secure Link
                                    </Button>
                                </div>

                                <div className="pt-4">
                                    <p className="text-xs text-neutral-500 mb-3">Analysis Complete</p>
                                    <Button
                                        onClick={onReset}
                                        className="w-full bg-neutral-800 hover:bg-neutral-700 transition-all"
                                    >
                                        Start New Analysis
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalizeAndShare;

