import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-primary/30 border-t-primary",
        sizeClasses[size]
      )} />
    </div>
  );
}

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingDots({ size = "md", className }: LoadingDotsProps) {
  const sizeClasses = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3"
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className={cn(
        "bg-primary rounded-full animate-bounce",
        sizeClasses[size]
      )} style={{ animationDelay: "0ms" }} />
      <div className={cn(
        "bg-primary rounded-full animate-bounce",
        sizeClasses[size]
      )} style={{ animationDelay: "150ms" }} />
      <div className={cn(
        "bg-primary rounded-full animate-bounce",
        sizeClasses[size]
      )} style={{ animationDelay: "300ms" }} />
    </div>
  );
}

interface LoadingPulseProps {
  className?: string;
  children?: React.ReactNode;
}

export function LoadingPulse({ className, children }: LoadingPulseProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
      <LoadingDots size="sm" />
    </div>
  );
}

interface StreamingSkeletonProps {
  lines?: number;
  className?: string;
}

export function StreamingSkeleton({ lines = 3, className }: StreamingSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className="h-4 bg-muted rounded animate-pulse flex-1" />
          <div className="h-4 bg-muted rounded animate-pulse w-20" />
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <div className="h-4 bg-muted rounded animate-pulse w-32" />
        <div className="h-4 w-0.5 bg-primary animate-pulse" />
      </div>
    </div>
  );
}

interface TransformingAnimationProps {
  type: "markdown" | "brief" | "gdocs";
  className?: string;
}

export function TransformingAnimation({ type, className }: TransformingAnimationProps) {
  const getTypeIcon = () => {
    switch (type) {
      case "markdown":
        return "📝";
      case "brief":
        return "📊";
      case "gdocs":
        return "📄";
      default:
        return "⚡";
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "markdown":
        return "Converting to Markdown";
      case "brief":
        return "Creating Corporate Brief";
      case "gdocs":
        return "Formatting for Google Docs";
      default:
        return "Transforming";
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-3 p-6", className)}>
      <div className="text-4xl animate-bounce">
        {getTypeIcon()}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{getTypeLabel()}</span>
        <LoadingDots size="sm" />
      </div>
      <div className="w-full max-w-48 h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-primary/70 animate-pulse" />
      </div>
    </div>
  );
}