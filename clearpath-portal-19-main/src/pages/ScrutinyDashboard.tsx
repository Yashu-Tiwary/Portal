import { useState } from "react";
import { Layout, FileSearch, AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import WorkflowTracker from "@/components/WorkflowTracker";
import { useWorkflow, Application } from "@/context/WorkflowContext";
import { toast } from "sonner";

const navItems = [
  { icon: Layout, label: "Dashboard", path: "/scrutiny" },
  { icon: FileSearch, label: "Review Queue", path: "/scrutiny" },
];

const ScrutinyDashboard = () => {
  const { applications, updateApplication } = useWorkflow();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [deficiencyNote, setDeficiencyNote] = useState("");
  const [showEdsDialog, setShowEdsDialog] = useState(false);

  const reviewableApps = applications.filter(a =>
    ["submitted", "under_scrutiny", "essential_document_sought"].includes(a.status)
  );

  const handleTakeUp = (app: Application) => {
    updateApplication(app.id, { status: "under_scrutiny" });
    setSelectedApp({ ...app, status: "under_scrutiny" });
    toast.success(`Application ${app.id} taken up for scrutiny`);
  };

  const handleRaiseEds = () => {
    if (!selectedApp || !deficiencyNote.trim()) return;
    updateApplication(selectedApp.id, {
      status: "essential_document_sought",
      deficiencies: [...selectedApp.deficiencies, deficiencyNote.trim()],
    });
    setSelectedApp(prev => prev ? {
      ...prev,
      status: "essential_document_sought",
      deficiencies: [...prev.deficiencies, deficiencyNote.trim()],
    } : null);
    setDeficiencyNote("");
    setShowEdsDialog(false);
    toast.warning("Essential Document Sought notice raised");
  };

  const handleRefer = (app: Application) => {
    updateApplication(app.id, { status: "referred" });
    setSelectedApp(prev => prev?.id === app.id ? { ...prev, status: "referred" } : prev);
    toast.success(`Application ${app.id} referred for meeting`);
  };

  const handleGenerateGist = (app: Application) => {
    const gist = `The Expert Appraisal Committee reviewed the ${app.projectName} proposed by ${app.organization} located at ${app.location}. The project involves ${app.projectDescription.slice(0, 200)}. After thorough examination of submitted documents and sector-specific parameters, the committee makes the following observations:\n\n1. Environmental Impact Assessment has been reviewed and found satisfactory.\n2. All required regulatory clearances are in order.\n3. The proposed mitigation measures are adequate.\n\nThe committee recommends the application for further deliberation in the formal meeting.`;
    updateApplication(app.id, { status: "mom_generated", meetingGist: gist });
    setSelectedApp(prev => prev?.id === app.id ? { ...prev, status: "mom_generated", meetingGist: gist } : prev);
    toast.success("Meeting gist auto-generated and forwarded to MoM Team");
  };

  return (
    <DashboardLayout title="Scrutiny Dashboard" roleLabel="Scrutiny Team" navItems={navItems}>
      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "Pending Review", value: applications.filter(a => a.status === "submitted").length },
          { label: "Under Scrutiny", value: applications.filter(a => a.status === "under_scrutiny").length },
          { label: "EDS Raised", value: applications.filter(a => a.status === "essential_document_sought").length },
        ].map(s => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="font-display text-3xl text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Queue */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-body text-lg font-semibold">Review Queue</CardTitle>
              <CardDescription>{reviewableApps.length} applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {reviewableApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedApp?.id === app.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium">{app.id}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="mt-1 text-sm text-foreground">{app.projectName}</p>
                  <p className="text-xs text-muted-foreground">{app.organization} · {app.sector}</p>
                </button>
              ))}
              {reviewableApps.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No applications pending review</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selectedApp ? (
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-body text-lg font-semibold">{selectedApp.projectName}</CardTitle>
                    <CardDescription>{selectedApp.id} · {selectedApp.organization}</CardDescription>
                  </div>
                  <StatusBadge status={selectedApp.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <WorkflowTracker currentStatus={selectedApp.status} />

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Proponent:</span> <span className="font-medium">{selectedApp.proponentName}</span></div>
                  <div><span className="text-muted-foreground">Sector:</span> <span className="font-medium">{selectedApp.sector}</span></div>
                  <div><span className="text-muted-foreground">Category:</span> <span className="font-medium">{selectedApp.category}</span></div>
                  <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{selectedApp.location}</span></div>
                  <div><span className="text-muted-foreground">Cost:</span> <span className="font-medium">{selectedApp.estimatedCost}</span></div>
                  <div><span className="text-muted-foreground">Fee:</span> <span className={`font-medium ${selectedApp.feePaid ? "text-success" : "text-destructive"}`}>{selectedApp.feePaid ? "Paid ✓" : "Unpaid"}</span></div>
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-foreground">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedApp.projectDescription}</p>
                </div>

                {/* Sector params */}
                {Object.keys(selectedApp.sectorParams).length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">Sector Parameters</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedApp.sectorParams).map(([k, v]) => (
                        <div key={k} className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                          <span className="text-muted-foreground">{k}:</span> <span className="font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Documents ({selectedApp.documents.length})</p>
                  <div className="space-y-1">
                    {selectedApp.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                        <span>{doc.name}</span>
                        <span className="text-xs text-muted-foreground">{(doc.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deficiencies */}
                {selectedApp.deficiencies.length > 0 && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
                      <AlertTriangle className="h-4 w-4" /> Deficiencies Raised
                    </p>
                    <ul className="space-y-1">
                      {selectedApp.deficiencies.map((d, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  {selectedApp.status === "submitted" && (
                    <Button onClick={() => handleTakeUp(selectedApp)} size="sm">Take Up for Scrutiny</Button>
                  )}
                  {selectedApp.status === "under_scrutiny" && (
                    <>
                      <Dialog open={showEdsDialog} onOpenChange={setShowEdsDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1 border-destructive/30 text-destructive hover:bg-destructive/10">
                            <AlertTriangle className="h-3 w-3" /> Raise EDS
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Raise Essential Document Sought</DialogTitle>
                            <DialogDescription>Specify the deficiency to return the application for correction.</DialogDescription>
                          </DialogHeader>
                          <Textarea value={deficiencyNote} onChange={e => setDeficiencyNote(e.target.value)} placeholder="Describe the missing document or deficiency..." rows={4} />
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowEdsDialog(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleRaiseEds}>Raise EDS</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" className="gap-1" onClick={() => handleRefer(selectedApp)}>
                        <Send className="h-3 w-3" /> Refer for Meeting
                      </Button>
                    </>
                  )}
                  {selectedApp.status === "referred" && (
                    <Button size="sm" onClick={() => handleGenerateGist(selectedApp)}>
                      Generate Meeting Gist
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex min-h-[400px] items-center justify-center shadow-card">
              <p className="text-muted-foreground">Select an application to review</p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScrutinyDashboard;
