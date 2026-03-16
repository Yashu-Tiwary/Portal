import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, PlusCircle, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { useWorkflow, Application } from "@/context/WorkflowContext";
import { toast } from "sonner";

const sectorParamConfig: Record<string, string[]> = {
  Mining: ["Area of Mining", "Mineral Type", "Expected Yield", "Rehabilitation Plan"],
  "Renewable Energy": ["Capacity (MW)", "Land Area", "Grid Connection", "Environmental Impact"],
  Manufacturing: ["Production Capacity", "Emission Levels", "Waste Management", "Water Usage"],
  "Water Treatment": ["Treatment Capacity", "Technology", "Discharge Standards"],
  Construction: ["Built-up Area", "Green Cover", "Water Recycling", "Energy"],
  Infrastructure: ["Project Length/Area", "Land Acquisition", "Resettlement Plan", "Biodiversity Impact"],
};

const navItems = [
  { icon: Layout, label: "Dashboard", path: "/proponent" },
  { icon: FileText, label: "My Applications", path: "/proponent" },
  { icon: PlusCircle, label: "New Application", path: "/proponent/apply" },
];

const steps = ["Basic Info", "Project Details", "Sector Parameters", "Documents", "Payment"];

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { addApplication, applications } = useWorkflow();
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentDone, setPaymentDone] = useState(false);

  const [form, setForm] = useState({
    proponentName: "",
    organization: "",
    email: "",
    sector: "",
    category: "",
    projectName: "",
    projectDescription: "",
    location: "",
    estimatedCost: "",
  });
  const [sectorParams, setSectorParams] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<{ name: string; size: number; type: string }[]>([]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === "sector") setSectorParams({});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newDocs = Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type }));
    setDocuments(prev => [...prev, ...newDocs]);
    toast.success(`${newDocs.length} document(s) added`);
  };

  const removeDoc = (idx: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePayment = () => {
    // Simulate payment
    setTimeout(() => {
      setPaymentDone(true);
      toast.success("Payment of ₹50,000 received successfully!");
    }, 1500);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return form.proponentName && form.organization && form.email && form.category && form.sector;
      case 1: return form.projectName && form.projectDescription && form.location && form.estimatedCost;
      case 2: return Object.keys(sectorParamConfig[form.sector] || {}).length === 0 || Object.values(sectorParams).some(v => v);
      case 3: return documents.length > 0;
      case 4: return paymentDone;
      default: return false;
    }
  };

  const handleSubmit = () => {
    const newApp: Application = {
      id: `EC-2026-${String(applications.length + 1).padStart(3, "0")}`,
      ...form,
      status: "submitted",
      filedDate: new Date().toISOString().split("T")[0],
      documents: documents.map(d => ({ ...d, uploadedAt: new Date().toISOString().split("T")[0] })),
      feePaid: true,
      feeAmount: 50000,
      deficiencies: [],
      meetingGist: "",
      minutesOfMeeting: "",
      momLocked: false,
      sectorParams,
    };
    addApplication(newApp);
    toast.success("Application submitted successfully!");
    navigate("/proponent");
  };

  return (
    <DashboardLayout title="New Application" roleLabel="Project Proponent" navItems={navItems}>
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all ${
                  i < currentStep
                    ? "border-success bg-success text-success-foreground"
                    : i === currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span className={`mt-1 text-xs ${i === currentStep ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-0.5 w-10 ${i < currentStep ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="mx-auto max-w-2xl shadow-card">
        <CardHeader>
          <CardTitle className="font-body text-lg font-semibold">{steps[currentStep]}</CardTitle>
          <CardDescription>Step {currentStep + 1} of {steps.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 0: Basic Info */}
          {currentStep === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={form.proponentName} onChange={e => handleChange("proponentName", e.target.value)} placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label>Organization *</Label>
                  <Input value={form.organization} onChange={e => handleChange("organization", e.target.value)} placeholder="Organization name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Application Category *</Label>
                  <Select value={form.category} onValueChange={v => handleChange("category", v)}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Category A">Category A</SelectItem>
                      <SelectItem value="Category B">Category B</SelectItem>
                      <SelectItem value="Category B1">Category B1</SelectItem>
                      <SelectItem value="Category B2">Category B2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Industry Sector *</Label>
                  <Select value={form.sector} onValueChange={v => handleChange("sector", v)}>
                    <SelectTrigger><SelectValue placeholder="Select sector" /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(sectorParamConfig).map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Step 1: Project Details */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input value={form.projectName} onChange={e => handleChange("projectName", e.target.value)} placeholder="Name of the project" />
              </div>
              <div className="space-y-2">
                <Label>Project Description *</Label>
                <Textarea value={form.projectDescription} onChange={e => handleChange("projectDescription", e.target.value)} placeholder="Detailed description of the project" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input value={form.location} onChange={e => handleChange("location", e.target.value)} placeholder="City, State" />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Cost *</Label>
                  <Input value={form.estimatedCost} onChange={e => handleChange("estimatedCost", e.target.value)} placeholder="₹ Amount" />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Sector Parameters */}
          {currentStep === 2 && (
            <>
              <p className="text-sm text-muted-foreground">
                Fill in sector-specific parameters for <span className="font-semibold text-foreground">{form.sector}</span>
              </p>
              {(sectorParamConfig[form.sector] || []).map(param => (
                <div key={param} className="space-y-2">
                  <Label>{param}</Label>
                  <Input
                    value={sectorParams[param] || ""}
                    onChange={e => setSectorParams(prev => ({ ...prev, [param]: e.target.value }))}
                    placeholder={`Enter ${param.toLowerCase()}`}
                  />
                </div>
              ))}
            </>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <>
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">Upload EIA reports, land documents, NOCs, and other required files</p>
                <label className="cursor-pointer">
                  <input type="file" multiple className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.xls,.xlsx" />
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>Choose Files</span>
                  </Button>
                </label>
              </div>
              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm">{doc.name}</span>
                        <span className="text-xs text-muted-foreground">({(doc.size / 1024 / 1024).toFixed(1)} MB)</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeDoc(i)} className="text-destructive hover:text-destructive">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/30 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Application Fee</span>
                  <span className="font-display text-2xl text-foreground">₹50,000</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between"><span>Category: {form.category}</span><span>Sector: {form.sector}</span></div>
                </div>
              </div>

              {!paymentDone ? (
                <div className="space-y-4">
                  <div className="mx-auto flex max-w-xs flex-col items-center rounded-xl border border-border bg-card p-6 shadow-card">
                    <p className="mb-4 text-sm font-semibold text-foreground">Scan QR Code to Pay via UPI</p>
                    {/* QR Code placeholder */}
                    <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
                      <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div key={i} className={`h-6 w-6 rounded-sm ${Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="mb-1 text-xs text-muted-foreground">UPI ID: parivesh@gov.upi</p>
                    <p className="text-xs text-muted-foreground">Or pay directly:</p>
                  </div>
                  <div className="flex justify-center">
                    <Button onClick={handlePayment} className="gap-2">
                      Simulate Payment ₹50,000
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-success/30 bg-success/10 p-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success">
                    <span className="text-xl text-success-foreground">✓</span>
                  </div>
                  <p className="font-semibold text-success">Payment Received</p>
                  <p className="text-sm text-muted-foreground">Transaction ID: TXN{Date.now().toString().slice(-10)}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={() => setCurrentStep(prev => prev + 1)} disabled={!canProceed()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!paymentDone}>
                Submit Application
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ApplicationForm;
