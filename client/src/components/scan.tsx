"use client"

import { useState } from "react"
import detctionImg from "/detection.png"

export default function Scan() {
    const [image, setImage] = useState<File | null>(null)

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setImage(file)
        const data = new FormData()
        data.append("image_file", file, "image_file")

       try {
            const response = await fetch("http://127.0.0.1:5000/scan", {
                method : "POST",
                body: data,
            })
        } catch (error) {
            console.error("Error uploading image:", error)
        }
    }


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
            {!image && (
                <div className="mt-8 p-8 border-2 border-dashed border-neutral-700 rounded-lg w-full max-w-3xl">
                    <p className="text-neutral-400 text-center">
                        No image selected. Upload an image to begin analysis.
                    </p>
                </div>
            )}
            
        </div>
    )
}