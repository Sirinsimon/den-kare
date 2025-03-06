"use client"

import { useState, useRef, useEffect } from "react"
import detctionImg from "/detection.png"

export default function Detection() {
    const [image, setImage] = useState<File | null>(null)
    const [boxes, setBoxes] = useState<[number, number, number, number, string, number][]>([])
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setImage(file)
        const data = new FormData()
        data.append("image_file", file, "image_file")

        try {
            const response = await fetch("http://127.0.0.1:5000/detect", {
                method: "POST",
                body: data,
            })
            const result = await response.json()
            setBoxes(result.boxes || [])
        } catch (error) {
            console.error("Error uploading image:", error)
        }
    }

   
    useEffect(() => {
        if (!image || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = URL.createObjectURL(image)
        
        img.onload = () => {
            // Calculate optimal display size - aim for larger display while maintaining aspect ratio
            const containerWidth = window.innerWidth > 1200 ? 900 : window.innerWidth * 0.8
            const containerHeight = window.innerHeight * 0.7
            
            const scale = Math.min(
                containerWidth / img.width,
                containerHeight / img.height
            )
            
            // Don't upscale small images beyond their original size
            const finalScale = scale > 1 ? 1 : scale
            
            const width = Math.floor(img.width * finalScale)
            const height = Math.floor(img.height * finalScale)
            
            // Store image size for responsive adjustments if needed
            setImageSize({ width, height })
            
            // Set canvas dimensions
            canvas.width = width
            canvas.height = height

            // Clear canvas with black background
            ctx.fillStyle = "#000000"
            ctx.fillRect(0, 0, width, height)
            
            // Draw the image
            ctx.drawImage(img, 0, 0, width, height)
            
            // Style for annotations
            ctx.strokeStyle = "#00FF00"
            ctx.lineWidth = Math.max(2, width / 200) // Responsive line width
            ctx.font = `${Math.max(14, width / 40)}px sans-serif` // Responsive font size

            // Draw detection boxes
            boxes.forEach(([x1, y1, x2, y2, label, confidence]) => {
                // Scale coordinates to match canvas size
                const scaledX1 = (x1 / img.width) * width
                const scaledY1 = (y1 / img.height) * height
                const scaledX2 = (x2 / img.width) * width
                const scaledY2 = (y2 / img.height) * height
                
                // Calculate box dimensions
                const boxWidth = scaledX2 - scaledX1
                const boxHeight = scaledY2 - scaledY1
                
                // Draw box
                ctx.strokeRect(scaledX1, scaledY1, boxWidth, boxHeight)
                
                // Create label
                const text = `${label} (${confidence})`
                const textWidth = ctx.measureText(text).width
                const padding = 5
                const textHeight = parseInt(ctx.font) + padding * 2
                
                // Draw label background
                ctx.fillStyle = "#00FF00"
                ctx.fillRect(
                    scaledX1, 
                    scaledY1 - textHeight,
                    textWidth + padding * 2,
                    textHeight
                )
                
                // Draw label text
                ctx.fillStyle = "#000000"
                ctx.fillText(
                    text,
                    scaledX1 + padding,
                    scaledY1 - padding
                )
            })
        }
    }, [image, boxes])

    // Handle window resize to adjust canvas if needed
    useEffect(() => {
        const handleResize = () => {
            if (image && canvasRef.current) {
                // Force redraw on resize
                const img = new Image()
                img.src = URL.createObjectURL(image)
                img.onload = () => {
                    // This will trigger the other useEffect
                    setImage(image)
                }
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [image])

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-black rounded-lg border border-neutral-800 p-4 md:p-8">
            {!image && (
                <img
                    className="w-52 mb-8 invert"
                    src={detctionImg}
                    alt="X-Ray Deep Learning Analysis Logo"
                />
            )}

            <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg cursor-pointer transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload Image
            </label>
            <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleUpload}
                accept="image/*"
            />

            {image && (
                <div className="mt-8 bg-black rounded-lg p-1 shadow-lg flex justify-center w-full">
                    <canvas
                        ref={canvasRef}
                        className="rounded-lg max-w-full object-contain"
                        style={{
                            maxHeight: `calc(80vh - 120px)`,
                            width: imageSize.width > 0 ? `${imageSize.width}px` : 'auto',
                            height: imageSize.height > 0 ? `${imageSize.height}px` : 'auto'
                        }}
                    />
                </div>
            )}

            {!image && (
                <div className="mt-8 p-8 border-2 border-dashed border-neutral-700 rounded-lg w-full max-w-3xl">
                    <p className="text-neutral-400 text-center">
                        No image selected. Upload an image to begin analysis.
                    </p>
                </div>
            )}
            
            {boxes.length > 0 && (
                <div className="mt-4 w-full max-w-3xl">
                    <h3 className="text-neutral-200 text-lg mb-2">Detection Results ({boxes.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {boxes.map((box, index) => (
                            <div key={index} className="p-2 bg-neutral-800 rounded text-neutral-200 text-sm">
                                {box[4]}: {box[5]}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}