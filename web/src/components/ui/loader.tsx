import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  fullPage?: boolean;
}

export function Loader({ 
  size = "md", 
  text, 
  className,
  fullPage = false 
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className={cn(
          "flex flex-col items-center justify-center space-y-3 p-6",
          className
        )}>
          <div className="relative">
            <div className={cn(
              "animate-spin-slow rounded-full border-t-2 border-b-2 border-progress-75",
              sizeClasses[size]
            )}></div>
            <div className={cn(
              "absolute inset-0 rounded-full border-2 border-gray-100 opacity-30",
              sizeClasses[size]
            )}></div>
          </div>
          {text && (
            <p className="text-sm font-light text-gray-500 animate-pulse-soft">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center space-x-2",
      className
    )}>
      <div className="relative">
        <div className={cn(
          "animate-spin-slow rounded-full border-t-2 border-b-2 border-progress-75",
          sizeClasses[size]
        )}></div>
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-gray-100 opacity-30",
          sizeClasses[size]
        )}></div>
      </div>
      {text && (
        <p className="text-sm font-light text-gray-500">{text}</p>
      )}
    </div>
  );
}

export function LoaderContent({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 w-4/6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

