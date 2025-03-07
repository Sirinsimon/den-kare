
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageSquare, ClipboardList, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const ReviewAndAnnotate = ({ onComplete, onBack, }: { onComplete: () => void; onBack: () => void }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const appointmentId = queryParams.get("appointmentId");

    console.log(appointmentId)
    const [chatMessages, setChatMessages] = useState<{ text: string, sender: 'user' | 'system' }[]>([
        { text: "Welcome! Let's review and annotate the documents. What do you notice about the images?", sender: "system" }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [notes, setNotes] = useState<string[]>([]);
    const [newNote, setNewNote] = useState("");

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const userMessage = newMessage;
            setChatMessages([...chatMessages, { text: userMessage, sender: "user" }]);
            setNewMessage("");

            try {
                const response = await fetch("http://127.0.0.1:5000/medical_report", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ query: userMessage }),
                });
                console.log(response)
                const data = await response.json();
                console.log(data)
                setChatMessages(prev => [...prev, { text: data.result, sender: "system" }]);
            } catch (error) {
                console.error("Error fetching response:", error);
            }
        }
    };
    const savePastHistory = async () => {
        let data = await fetch("http://localhost:8000/analyze/past_history", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                past_history: newNote,
                appointment_id: appointmentId,
            })
        })
        let res = await data.json()
        console.log(res)
    }

    const handleAddNote = async() => {
        if (newNote.trim()) {
            await savePastHistory()
            setNotes([...notes, newNote]);
            setNewNote("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            action();
        }
    };

    return (
        <div className="workflow-container animate-fade-in space-y-6">
            <div className="text-center space-y-2">
                <div className="progress-pill inline-block bg-progress-50/20 text-progress-50 mb-2">
                    Phase 2 of 4
                </div>
                <h2 className="text-2xl font-light tracking-tight">Review & Annotate</h2>
                <p className="text-neutral-400 max-w-md mx-auto">
                    Review the detected documents and add important annotations.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Left side - Chat section */}
                <div className="glass-panel rounded-lg p-6 flex flex-col h-[500px]">
                    <div className="flex items-center mb-4">
                        <MessageSquare className="h-5 w-5 mr-2 text-progress-50" />
                        <h3 className="text-md font-medium">Chat Section</h3>
                    </div>

                    <div className="flex-grow overflow-y-auto mb-4 space-y-4">
                        {chatMessages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg ${msg.sender === 'user'
                                    ? 'bg-progress-50/20 text-white ml-8'
                                    : 'bg-black/40 text-neutral-300 mr-8 border border-neutral-800'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="flex">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, handleSendMessage)}
                            placeholder="Type your message here..."
                            className="flex-grow bg-black/40 border border-neutral-800 rounded-lg p-3 text-white resize-none"
                            rows={2}
                        />
                        <Button
                            onClick={handleSendMessage}
                            className="ml-2 p-3 bg-progress-50 hover:bg-progress-50/90 h-auto rounded-full"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Right side - Notes and Remarks */}
                <div className="glass-panel rounded-lg p-6 flex flex-col h-[500px]">
                    <div className="flex items-center mb-4">
                        <ClipboardList className="h-5 w-5 mr-2 text-progress-50" />
                        <h3 className="text-md font-medium">Notes & Remarks</h3>
                    </div>

                    <div className="flex-grow overflow-y-auto mb-4 space-y-3">
                        {notes.length > 0 ? (
                            notes.map((note, idx) => (
                                <div key={idx} className="p-3 bg-black/30 border border-neutral-800 rounded-lg">
                                    {note}
                                </div>
                            ))
                        ) : (
                            <p className="text-neutral-500 italic">Add notes and remarks about the documents here.</p>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, handleAddNote)}
                            placeholder="Add a new note..."
                            className="w-full bg-black/40 border border-neutral-800 rounded-lg p-3 text-white resize-none"
                            rows={2}
                        />
                        <Button
                            onClick={handleAddNote}
                            variant="outline"
                            className="bg-black/30 border-neutral-800 text-neutral-300 hover:bg-black/50"
                        >
                            Add Note
                        </Button>
                    </div>
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
                    className="bg-progress-50 hover:bg-progress-50/90 transition-all"
                >
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default ReviewAndAnnotate;
