
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, ArrowLeft, CheckCircle, Share2, Download, 
  Mail, Users, Lock, Printer, Copy
} from "lucide-react";
import { toast } from "sonner";

const FinalizeAndShare = ({ onBack, onReset }: { onBack: () => void; onReset: () => void }) => {
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  const handleFinalize = () => {
    setIsFinalizing(true);
    // Simulate finalization process
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
              <FileText className="h-4 w-4 mr-2" /> Report Preview
            </h3>
            
            <div className="bg-neutral-900/50 rounded-md p-4 space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Patient Analysis Report</h4>
                <p className="text-xs text-neutral-500">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="space-y-2">
                <div className="p-2 bg-black/30 rounded border border-neutral-800">
                  <h5 className="text-xs text-neutral-400">Diagnosis</h5>
                  <p className="text-sm">Primary diagnosis details will appear here</p>
                </div>
                
                <div className="p-2 bg-black/30 rounded border border-neutral-800">
                  <h5 className="text-xs text-neutral-400">Treatment Plan</h5>
                  <p className="text-sm">Treatment plan details will appear here</p>
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
                className="w-full bg-progress-100 hover:bg-progress-100/90 transition-all"
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
                onClick={() => {}}
                className="w-full border-progress-100/30 text-progress-100 hover:bg-progress-100/10"
              >
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
            )}
          </div>

          {/* Sharing Options */}
          <div className="glass-panel p-4 space-y-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizeAndShare;
