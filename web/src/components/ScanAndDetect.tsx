import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const saveDetectionToDB = async (appointment_id: string, clinicId: string, detected: string[], past_history?: string) => {

    const payload = { appointment_id, clinicId, detected, past_history: past_history || '' };
    try {
        const response = await fetch("http://127.0.0.1:8000/analyze/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Failed to save detection");
        }
        return await response.json();
    } catch (error) {
        console.error("Error saving detection:", error);
        throw error;
    }
};


const ScanAndDetect = ({ onComplete }: { onComplete: () => void }) => {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const appointmentId = queryParams.get("appointmentId");

    const clinicId = queryParams.get("clinicId");
    const [image, setImage] = useState<File | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [imageSize, setImageSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
    const [boxes, setBoxes] = useState<[number, number, number, number, string, number][]>([]);

    const handleBrowseClick = () => {
        document.getElementById("fileInput")?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);

            setTimeout(() => {
                setIsUploading(false);
                setIsUploaded(true);
                handleUpload(event);
            }, 1500);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImage(file);
        const data = new FormData();
        data.append("image_file", file, "image_file");
        data.append("appointmentId", appointmentId); // Send appointmentId in FormData

        try {
            const response = await fetch("http://127.0.0.1:5000/detect", {
                method: "POST",
                body: data,
            });
            const result = await response.json();
            setBoxes(result.boxes || []);

            if (result.boxes.length > 0) {
                await saveDetectionToDB(appointmentId, clinicId, result.boxes.map(box => box[4]));
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = URL.createObjectURL(image);

        img.onload = () => {
            // Calculate optimal display size - aim for larger display while maintaining aspect ratio
            const containerWidth = window.innerWidth > 1200 ? 900 : window.innerWidth * 0.8;
            const containerHeight = window.innerHeight * 0.7;

            const scale = Math.min(
                containerWidth / img.width,
                containerHeight / img.height
            );

            // Don't upscale small images beyond their original size
            const finalScale = scale > 1 ? 1 : scale;

            const width = Math.floor(img.width * finalScale);
            const height = Math.floor(img.height * finalScale);

            // Store image size for responsive adjustments if needed
            setImageSize({ width, height });

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Clear canvas with black background
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, width, height);

            // Draw the image
            ctx.drawImage(img, 0, 0, width, height);

            // Style for annotations
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = Math.max(2, width / 200); // Responsive line width
            ctx.font = `${Math.max(14, width / 40)}px sans-serif`; // Responsive font size

            // Draw detection boxes
            boxes.forEach(([x1, y1, x2, y2, label, confidence]) => {
                // Scale coordinates to match canvas size
                const scaledX1 = (x1 / img.width) * width;
                const scaledY1 = (y1 / img.height) * height;
                const scaledX2 = (x2 / img.width) * width;
                const scaledY2 = (y2 / img.height) * height;

                // Calculate box dimensions
                const boxWidth = scaledX2 - scaledX1;
                const boxHeight = scaledY2 - scaledY1;

                // Draw box
                ctx.strokeRect(scaledX1, scaledY1, boxWidth, boxHeight);

                // Create label
                const text = `${label} (${confidence})`
                const textWidth = ctx.measureText(text).width;
                const padding = 5;
                const textHeight = parseInt(ctx.font, 10) + padding * 2;

                // Draw label background
                ctx.fillStyle = "#00FF00";
                ctx.fillRect(
                    scaledX1,
                    scaledY1 - textHeight,
                    textWidth + padding * 2,
                    textHeight
                );

                // Draw label text
                ctx.fillStyle = "#000000";
                ctx.fillText(
                    text,
                    scaledX1 + padding,
                    scaledY1 - padding
                );
            });
        };
    }, [image, boxes]);

    useEffect(() => {
        const handleResize = () => {
            if (image && canvasRef.current) {
                const img = new Image();
                img.src = URL.createObjectURL(image);
                img.onload = () => {
                    setImage(prevImage => {
                        if (prevImage) {
                            return new File([prevImage], prevImage.name, { type: prevImage.type });
                        }
                        return prevImage;
                    });
                };
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [image]);

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

            <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

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
                                    Drag & drop files or <span
                                        className="text-progress-25 cursor-pointer hover:underline"
                                        onClick={handleBrowseClick}
                                    >
                                        browse
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button
                            onClick={handleBrowseClick}
                            disabled={isUploading}
                            className="bg-progress-25 hover:bg-progress-25/90 transition-all"
                        >
                            {isUploading ? "Uploading..." : "Upload Patient Data"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex w-full max-w-5xl mx-auto gap-6">
                    {/* Canvas panel with detection boxes */}
                    <div className="glass-panel flex-1 p-4 rounded-lg">
                        <div className="bg-black/30 rounded-lg overflow-hidden h-80 flex items-center justify-center">
                            {isUploading ? (
                                <div className="flex flex-col items-center space-y-2">
                                    <Loader className="animate-spin text-progress-25" size={28} />
                                    <p className="text-sm text-neutral-400">Processing image...</p>
                                </div>
                            ) : (
                                <canvas
                                    ref={canvasRef}
                                    className="rounded-lg max-w-full object-contain"
                                    style={{
                                        maxHeight: `calc(80vh - 200px)`,
                                        width: imageSize.width > 0 ? `${imageSize.width}px` : 'auto',
                                        height: imageSize.height > 0 ? `${imageSize.height}px` : 'auto'
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Todo list panel */}
                    <div className="glass-panel w-80 p-4 rounded-lg flex flex-col">
                        <h3 className="text-lg font-medium mb-4 text-center">Findings</h3>
                        <div className="flex-1">
                            <ul className="space-y-3">
                                {boxes.map(([x1, y1, x2, y2, label, confidence, completed], index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center bg-neutral-800 text-neutral-600
                                            ${!completed ? "bg-progress-25/20 text-progress-25" : "bg-neutral-800 text-neutral-600"}`}>
                                            {!completed && <CheckCircle size={14} />}
                                        </div>
                                        <span className="text-white">
                                            {label} - {confidence}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 flex justify-end">
                        <Button
                            onClick={onComplete}
                            className="bg-progress-25 hover:bg-progress-25/90 transition-all"
                        >
                            Next <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScanAndDetect;
