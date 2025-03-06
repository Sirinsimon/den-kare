
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Loader, Upload, CheckCircle, ArrowRight } from "lucide-react";

const ScanAndDetect = ({ onComplete }: { onComplete: () => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const todoItems = [
    { id: 1, text: "Image successfully uploaded", completed: true },
    { id: 2, text: "Initial scan complete", completed: true },
    { id: 3, text: "Processing metadata", completed: true },
    { id: 4, text: "Running diagnosis algorithms", completed: false },
    { id: 5, text: "Preparing for review phase", completed: false },
  ];

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setIsUploaded(true);
      // Set a placeholder image or use the one from upload
      setUploadedImage("https://placehold.co/400x400/333/white?text=Patient+Scan");
    }, 1500);
  };

  return (
    <div className="workflow-container flex flex-col h-full p-6">
      <div className="text-center space-y-2 mb-6">
        <div className="progress-pill inline-block bg-progress-25/20 text-progress-25 mb-2">
          Phase 1 of 4
        </div>
        <h2 className="text-2xl font-light tracking-tight">Scan & Detect</h2>
        <p className="text-neutral-400 max-w-md mx-auto">
          Upload patient data or scan documents to begin the analysis process.
        </p>
      </div>

      {!isUploaded ? (
        <div className="glass-panel w-full max-w-2xl mx-auto p-6">
          <div className="flex items-center justify-center h-64 border border-dashed border-neutral-700 rounded-lg">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader className="animate-spin text-progress-25" size={28} />
                <p className="text-sm text-neutral-400">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <Upload className="text-neutral-500" size={28} />
                <p className="text-sm text-neutral-400">
                  Drag & drop files or <span className="text-progress-25">browse</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="bg-progress-25 hover:bg-progress-25/90 transition-all"
            >
              {isUploading ? "Uploading..." : "Upload Patient Data"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-5xl mx-auto gap-6">
          {/* Image panel */}
          <div className="glass-panel flex-1 p-4 rounded-lg">
            <div className="bg-black/30 rounded-lg overflow-hidden h-80 flex items-center justify-center">
              {uploadedImage && (
                <img 
                  src={uploadedImage} 
                  alt="Uploaded patient scan" 
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </div>
          
          {/* Todo list panel */}
          <div className="glass-panel w-80 p-4 rounded-lg flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-center">TO DO</h3>
            <div className="flex-1">
              <ul className="space-y-3">
                {todoItems.map(item => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center
                      ${item.completed ? "bg-progress-25/20 text-progress-25" : "bg-neutral-800 text-neutral-600"}`}>
                      {item.completed && <CheckCircle size={14} />}
                    </div>
                    <span className={item.completed ? "text-white" : "text-neutral-500"}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={onComplete}
                className="bg-progress-25 hover:bg-progress-25/90 transition-all"
              >
                Next <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanAndDetect;

