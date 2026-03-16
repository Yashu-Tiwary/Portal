import { useNavigate } from "react-router-dom";
import { FileText, PlusCircle, Layout, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import WorkflowTracker from "@/components/WorkflowTracker";
import { useWorkflow } from "@/context/WorkflowContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Application } from "@/context/WorkflowContext";

const navItems = [
  { icon: Layout, label: "Dashboard", path: "/proponent" },
  { icon: FileText, label: "My Applications", path: "/proponent" },
  { icon: PlusCircle, label: "New Application", path: "/proponent/apply" },
];

const ProponentDashboard = () => {
  const navigate = useNavigate();
  const { applications } = useWorkflow();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Filter to show a reasonable set for the demo proponent
  const myApps = applications;

  return (
    <DashboardLayout
      title="Proponent Dashboard"
      roleLabel="Project Proponent"
      navItems={navItems}
      headerActions={
        <Button size="sm" onClick={() => navigate("/proponent/apply")} className="gap-2">
          <PlusCircle className="h-4 w-4" /> New Application
        </Button>
      }
    >
      {/* Summary */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Total", value: myApps.length, icon: FileText },
          { label: "Under Review", value: myApps.filter(a => ["submitted", "under_scrutiny"].includes(a.status)).length, icon: Clock },
          { label: "Action Needed", value: myApps.filter(a => a.status === "essential_document_sought").length, icon: FileText },
          { label: "Approved", value: myApps.filter(a => a.status === "finalized").length, icon: CheckCircle },
        ].map(card => (
          <Card key={card.label} className="shadow-card">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <card.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="font-display text-2xl text-foreground">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-body text-lg font-semibold">My Applications</CardTitle>
          <CardDescription>Click on an application to view details and workflow status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Filed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myApps.map(app => (
                <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedApp(app)}>
                  <TableCell className="font-mono text-sm font-medium">{app.id}</TableCell>
                  <TableCell>{app.projectName}</TableCell>
                  <TableCell className="text-muted-foreground">{app.sector}</TableCell>
                  <TableCell className="text-muted-foreground">{app.category}</TableCell>
                  <TableCell><StatusBadge status={app.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{app.filedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-body">{selectedApp?.projectName}</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <WorkflowTracker currentStatus={selectedApp.status} />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono font-medium">{selectedApp.id}</span></div>
                <div><span className="text-muted-foreground">Organization:</span> <span className="font-medium">{selectedApp.organization}</span></div>
                <div><span className="text-muted-foreground">Sector:</span> <span className="font-medium">{selectedApp.sector}</span></div>
                <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{selectedApp.location}</span></div>
                <div><span className="text-muted-foreground">Fee:</span> <span className={selectedApp.feePaid ? "text-success" : "text-destructive"}>{selectedApp.feePaid ? "Paid ✓" : "Unpaid"}</span></div>
                <div><span className="text-muted-foreground">Filed:</span> <span className="font-medium">{selectedApp.filedDate}</span></div>
              </div>
              <p className="text-sm text-muted-foreground">{selectedApp.projectDescription}</p>
              {selectedApp.deficiencies.length > 0 && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <p className="mb-1 text-sm font-medium text-destructive">Action Required — Deficiencies:</p>
                  <ul className="space-y-1">
                    {selectedApp.deficiencies.map((d, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {d}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="mb-1 text-sm font-medium">Documents ({selectedApp.documents.length})</p>
                <div className="space-y-1">
                  {selectedApp.documents.map((d, i) => (
                    <div key={i} className="rounded border border-border bg-muted/30 px-3 py-1.5 text-sm">
                      {d.name} <span className="text-xs text-muted-foreground">({(d.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProponentDashboard;
