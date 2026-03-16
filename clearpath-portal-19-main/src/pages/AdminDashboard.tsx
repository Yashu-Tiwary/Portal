import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileText, Settings, Layout, UserCog, ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { useWorkflow } from "@/context/WorkflowContext";
import { toast } from "sonner";

const navItems = [
  { icon: Layout, label: "Dashboard", path: "/admin" },
  { icon: UserCog, label: "Role Management", path: "/admin" },
  { icon: FileText, label: "Applications", path: "/admin" },
  { icon: Settings, label: "Templates & Sectors", path: "/admin" },
];

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const initialUsers: TeamMember[] = [
  { id: 1, name: "Priya Sharma", email: "priya@gov.in", role: "scrutiny", status: "active" },
  { id: 2, name: "Rajesh Kumar", email: "rajesh@gov.in", role: "mom", status: "active" },
  { id: 3, name: "Anita Gupta", email: "anita@gov.in", role: "scrutiny", status: "active" },
  { id: 4, name: "Vikram Singh", email: "vikram@gov.in", role: "mom", status: "inactive" },
  { id: 5, name: "Deepa Nair", email: "deepa@gov.in", role: "scrutiny", status: "active" },
];

const sectorParameters = [
  { sector: "Mining", params: ["Area of Mining", "Mineral Type", "Expected Yield", "Rehabilitation Plan"] },
  { sector: "Renewable Energy", params: ["Capacity (MW)", "Land Area", "Grid Connection", "Environmental Impact"] },
  { sector: "Manufacturing", params: ["Production Capacity", "Emission Levels", "Waste Management", "Water Usage"] },
  { sector: "Water Treatment", params: ["Treatment Capacity", "Technology", "Discharge Standards"] },
  { sector: "Construction", params: ["Built-up Area", "Green Cover", "Water Recycling", "Energy"] },
  { sector: "Infrastructure", params: ["Project Length/Area", "Land Acquisition", "Resettlement Plan", "Biodiversity Impact"] },
];

const masterTemplates = [
  { name: "Standard EAC Meeting Gist Template", sector: "General", lastUpdated: "2026-02-01" },
  { name: "Mining Sector Meeting Template", sector: "Mining", lastUpdated: "2026-01-15" },
  { name: "Renewable Energy Assessment Template", sector: "Renewable Energy", lastUpdated: "2026-02-10" },
];

const AdminDashboard = () => {
  const { applications } = useWorkflow();
  const [users, setUsers] = useState<TeamMember[]>(initialUsers);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "scrutiny" });

  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast.success("Role updated successfully");
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) return;
    setUsers(prev => [...prev, { ...newMember, id: prev.length + 1, status: "active" }]);
    setNewMember({ name: "", email: "", role: "scrutiny" });
    setShowAddMember(false);
    toast.success("Team member added");
  };

  return (
    <DashboardLayout title="Admin Dashboard" roleLabel="Administrator" navItems={navItems}>
      {/* Summary */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Applications", value: applications.length },
          { label: "Pending Review", value: applications.filter(a => ["submitted", "under_scrutiny"].includes(a.status)).length },
          { label: "Team Members", value: users.filter(u => u.status === "active").length },
          { label: "Finalized", value: applications.filter(a => a.status === "finalized").length },
        ].map(card => (
          <Card key={card.label} className="shadow-card">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-1 font-display text-3xl text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="applications">All Applications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="sectors">Sector Parameters</TabsTrigger>
        </TabsList>

        {/* Role Management */}
        <TabsContent value="roles">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-body text-lg font-semibold">Team Members & Roles</CardTitle>
                <CardDescription>Dynamically assign roles between Scrutiny Team and MoM Team</CardDescription>
              </div>
              <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1"><PlusCircle className="h-3 w-3" /> Add Member</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>Add a new member and assign their role.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={newMember.name} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={newMember.email} onChange={e => setNewMember(p => ({ ...p, email: e.target.value }))} placeholder="email@gov.in" />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={newMember.role} onValueChange={v => setNewMember(p => ({ ...p, role: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scrutiny">Scrutiny Team</SelectItem>
                          <SelectItem value="mom">MoM Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddMember(false)}>Cancel</Button>
                    <Button onClick={handleAddMember}>Add Member</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Select value={user.role} onValueChange={(v) => handleRoleChange(user.id, v)}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scrutiny">Scrutiny Team</SelectItem>
                            <SelectItem value="mom">MoM Team</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={user.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications */}
        <TabsContent value="applications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-body text-lg font-semibold">All Applications</CardTitle>
              <CardDescription>Complete overview of environmental clearance applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Proponent</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Filed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell className="font-mono text-sm font-medium">{app.id}</TableCell>
                      <TableCell>{app.organization}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{app.projectName}</TableCell>
                      <TableCell className="text-muted-foreground">{app.sector}</TableCell>
                      <TableCell><StatusBadge status={app.status} /></TableCell>
                      <TableCell className="text-muted-foreground">{app.filedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-body text-lg font-semibold">Master Templates</CardTitle>
              <CardDescription>Meeting gist document templates for auto-generation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterTemplates.map(t => (
                    <TableRow key={t.name}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="text-muted-foreground">{t.sector}</TableCell>
                      <TableCell className="text-muted-foreground">{t.lastUpdated}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sectors */}
        <TabsContent value="sectors">
          <div className="grid gap-4 md:grid-cols-3">
            {sectorParameters.map(s => (
              <Card key={s.sector} className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-body text-base font-semibold">{s.sector}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {s.params.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="h-3 w-3 text-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
