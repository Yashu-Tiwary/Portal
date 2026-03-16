import { WorkflowStatus } from "@/context/WorkflowContext";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<WorkflowStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  submitted: "bg-info/10 text-info border-info/20",
  under_scrutiny: "bg-warning/10 text-warning border-warning/20",
  essential_document_sought: "bg-destructive/10 text-destructive border-destructive/20",
  referred: "bg-accent/20 text-accent-foreground border-accent/30",
  mom_generated: "bg-primary/10 text-primary border-primary/20",
  finalized: "bg-success/10 text-success border-success/20",
};

const statusLabels: Record<WorkflowStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_scrutiny: "Under Scrutiny",
  essential_document_sought: "EDS Raised",
  referred: "Referred",
  mom_generated: "MoM Generated",
  finalized: "Finalized",
};

const StatusBadge = ({ status }: { status: WorkflowStatus }) => (
  <Badge variant="outline" className={statusStyles[status]}>
    {statusLabels[status]}
  </Badge>
);

export default StatusBadge;
