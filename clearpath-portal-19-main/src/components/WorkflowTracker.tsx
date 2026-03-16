import { WORKFLOW_STAGES, WorkflowStatus } from "@/context/WorkflowContext";
import { CheckCircle } from "lucide-react";

interface WorkflowTrackerProps {
  currentStatus: WorkflowStatus;
}

const WorkflowTracker = ({ currentStatus }: WorkflowTrackerProps) => {
  const currentIdx = WORKFLOW_STAGES.findIndex(s => s.key === currentStatus);

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {WORKFLOW_STAGES.map((stage, i) => {
        const isDone = i < currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={stage.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                  isDone
                    ? "border-success bg-success text-success-foreground"
                    : isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`mt-1 max-w-[80px] text-center text-[10px] leading-tight ${
                  isCurrent ? "font-semibold text-primary" : isDone ? "text-success" : "text-muted-foreground"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {i < WORKFLOW_STAGES.length - 1 && (
              <div className={`mx-1 h-0.5 w-6 ${isDone ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowTracker;
