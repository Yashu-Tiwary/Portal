import { useState } from "react";
import { Layout, FileText, Lock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import WorkflowTracker from "@/components/WorkflowTracker";
import { useWorkflow, Application } from "@/context/WorkflowContext";
import { toast } from "sonner";

const navItems = [
  { icon: Layout, label: "Dashboard", path: "/mom" },
  { icon: FileText, label: "MoM Queue", path: "/mom" },
];

const MomDashboard = () => {
  const { applications, updateApplication } = useWorkflow();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editedGist, setEditedGist] = useState("");
  const [editedMom, setEditedMom] = useState("");
  const [showConvertDialog, setShowConvertDialog] = useState(false);

  const momApps = applications.filter(a =>
    ["mom_generated", "finalized"].includes(a.status)
  );

  const selectApp = (app: Application) => {
    setSelectedApp(app);
    setEditedGist(app.meetingGist);
    setEditedMom(app.minutesOfMeeting);
  };

  const handleSaveGist = () => {
    if (!selectedApp) return;
    updateApplication(selectedApp.id, { meetingGist: editedGist });
    setSelectedApp(prev => prev ? { ...prev, meetingGist: editedGist } : null);
    toast.success("Meeting gist updated");
  };

  const handleConvertToMom = () => {
    if (!selectedApp) return;
    const momContent = `MINUTES OF THE MEETING\n\nExpert Appraisal Committee Meeting\nDate: ${new Date().toISOString().split("T")[0]}\nVenue: MoEFCC Conference Hall, New Delhi\n\nAgenda Item: ${selectedApp.projectName} - ${selectedApp.organization}\nApplication No: ${selectedApp.id}\n\n---\n\n${editedGist}\n\n---\n\nDecision:\nThe committee recommends the above observations be recorded and the appropriate clearance action be taken as per the recommendations.\n\nThis document has been auto-generated from the approved meeting gist and is pending final review.`;

    updateApplication(selectedApp.id, { minutesOfMeeting: momContent });
    setSelectedApp(prev => prev ? { ...prev, minutesOfMeeting: momContent } : null);
    setEditedMom(momContent);
    setShowConvertDialog(false);
    toast.success("Meeting gist converted to formal Minutes of Meeting");
  };

  const handleSaveMom = () => {
    if (!selectedApp) return;
    updateApplication(selectedApp.id, { minutesOfMeeting: editedMom });
    setSelectedApp(prev => prev ? { ...prev, minutesOfMeeting: editedMom } : null);
    toast.success("Minutes of Meeting saved");
  };

  const handleLockMom = () => {
    if (!selectedApp) return;
    updateApplication(selectedApp.id, { status: "finalized", momLocked: true });
    setSelectedApp(prev => prev ? { ...prev, status: "finalized", momLocked: true } : null);
    toast.success("Minutes of Meeting finalized and locked");
  };

  const handleExport = (format: "pdf" | "docx") => {
    // Simulated export
    const content = selectedApp?.minutesOfMeeting || selectedApp?.meetingGist || "";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MoM_${selectedApp?.id}.${format === "pdf" ? "txt" : "txt"}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()} (simulated as text)`);
  };

  return (
    <DashboardLayout title="MoM Team Dashboard" roleLabel="MoM Team" navItems={navItems}>
      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "Pending MoM", value: applications.filter(a => a.status === "mom_generated").length },
          { label: "Finalized", value: applications.filter(a => a.status === "finalized").length },
          { label: "Total Processed", value: momApps.length },
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
              <CardTitle className="font-body text-lg font-semibold">MoM Queue</CardTitle>
              <CardDescription>{momApps.length} applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {momApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => selectApp(app)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedApp?.id === app.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium">{app.id}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="mt-1 text-sm text-foreground">{app.projectName}</p>
                  <p className="text-xs text-muted-foreground">{app.organization}</p>
                  {app.momLocked && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-success">
                      <Lock className="h-3 w-3" /> Locked
                    </div>
                  )}
                </button>
              ))}
              {momApps.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No MoM documents pending</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selectedApp ? (
            <div className="space-y-6">
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
                <CardContent>
                  <WorkflowTracker currentStatus={selectedApp.status} />
                </CardContent>
              </Card>

              {/* Meeting Gist */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-body text-base font-semibold">Meeting Gist</CardTitle>
                  <CardDescription>Auto-generated gist — edit and refine as needed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={editedGist}
                    onChange={e => setEditedGist(e.target.value)}
                    rows={8}
                    disabled={selectedApp.momLocked}
                    className="font-mono text-sm"
                  />
                  {!selectedApp.momLocked && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleSaveGist}>Save Gist</Button>
                      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm">Convert to MoM</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Convert to Minutes of Meeting</DialogTitle>
                            <DialogDescription>This will generate a formal MoM document from the gist. You can still edit it before locking.</DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowConvertDialog(false)}>Cancel</Button>
                            <Button onClick={handleConvertToMom}>Convert</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* MoM */}
              {editedMom && (
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-body text-base font-semibold">Minutes of Meeting</CardTitle>
                        <CardDescription>
                          {selectedApp.momLocked ? "This document is locked and cannot be edited." : "Review and finalize the MoM document."}
                        </CardDescription>
                      </div>
                      {selectedApp.momLocked && <Lock className="h-5 w-5 text-success" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={editedMom}
                      onChange={e => setEditedMom(e.target.value)}
                      rows={16}
                      disabled={selectedApp.momLocked}
                      className="font-mono text-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                      {!selectedApp.momLocked && (
                        <>
                          <Button size="sm" variant="outline" onClick={handleSaveMom}>Save MoM</Button>
                          <Button size="sm" variant="destructive" className="gap-1" onClick={handleLockMom}>
                            <Lock className="h-3 w-3" /> Finalize & Lock
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => handleExport("pdf")}>
                        <Download className="h-3 w-3" /> Export PDF
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => handleExport("docx")}>
                        <Download className="h-3 w-3" /> Export Word
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="flex min-h-[400px] items-center justify-center shadow-card">
              <p className="text-muted-foreground">Select an application to work on</p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MomDashboard;
