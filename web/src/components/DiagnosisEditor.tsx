import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Edit, FileText } from "lucide-react";

interface DiagnosisEditorProps {
    title: string;
    content: string;
    onChange: (text: string) => void;
    onSave: () => void;
}

const DiagnosisEditor = ({ title, content, onChange, onSave }: DiagnosisEditorProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localContent, setLocalContent] = useState(content);

    useEffect(() => {
        setLocalContent(content);
    }, [content]);

    const handleSave = () => {
        onChange(localContent);
        setIsEditing(false);
        onSave();
    };

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-progress-75" />
                    {title}
                </h3>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                >
                    {isEditing ?
                        <ArrowLeft className="h-4 w-4" /> :
                        <Edit className="h-4 w-4" />
                    }
                </Button>
            </div>

            <div className="flex-grow">
                {isEditing ? (
                    <textarea
                        value={localContent}
                        onChange={(e) => setLocalContent(e.target.value)}
                        className="w-full h-[300px] bg-neutral-900/50 border border-neutral-800 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-neutral-700 focus:border-neutral-700"
                        placeholder="Enter detailed diagnosis information..."
                    />
                ) : (
                    <div
                        className="w-full h-[300px] bg-neutral-900/50 border border-neutral-800 rounded-md p-3 text-sm overflow-y-auto"
                        style={{ whiteSpace: 'pre-wrap' }}
                    >
                        {localContent}
                    </div>
                )}
            </div>

            {isEditing && (
                <Button
                    onClick={handleSave}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
                >
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
            )}
        </div>
    );
};

export default DiagnosisEditor;

