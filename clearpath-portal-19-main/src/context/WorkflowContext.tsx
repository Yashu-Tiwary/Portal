import React, { createContext, useContext, useState, ReactNode } from "react";

export type WorkflowStatus =
  | "draft"
  | "submitted"
  | "under_scrutiny"
  | "essential_document_sought"
  | "referred"
  | "mom_generated"
  | "finalized";

export const WORKFLOW_STAGES: { key: WorkflowStatus; label: string }[] = [
  { key: "draft", label: "Draft" },
  { key: "submitted", label: "Submitted" },
  { key: "under_scrutiny", label: "Under Scrutiny" },
  { key: "essential_document_sought", label: "Essential Document Sought" },
  { key: "referred", label: "Referred" },
  { key: "mom_generated", label: "MoM Generated" },
  { key: "finalized", label: "Finalized" },
];

export interface UploadedDocument {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface Application {
  id: string;
  proponentName: string;
  organization: string;
  email: string;
  sector: string;
  category: string;
  projectName: string;
  projectDescription: string;
  location: string;
  estimatedCost: string;
  status: WorkflowStatus;
  filedDate: string;
  documents: UploadedDocument[];
  feePaid: boolean;
  feeAmount: number;
  deficiencies: string[];
  meetingGist: string;
  minutesOfMeeting: string;
  momLocked: boolean;
  sectorParams: Record<string, string>;
}

const defaultApplications: Application[] = [
  {
    id: "EC-2026-001",
    proponentName: "Rahul Mehta",
    organization: "GreenTech Industries",
    email: "rahul@greentech.in",
    sector: "Mining",
    category: "Category A",
    projectName: "Limestone Mining Project",
    projectDescription: "Open-cast limestone mining project in Rajasthan covering 150 hectares with annual production of 500,000 tonnes.",
    location: "Jodhpur, Rajasthan",
    estimatedCost: "₹45,00,00,000",
    status: "under_scrutiny",
    filedDate: "2026-02-15",
    documents: [
      { name: "EIA_Report.pdf", size: 4500000, type: "application/pdf", uploadedAt: "2026-02-15" },
      { name: "Land_Title.pdf", size: 1200000, type: "application/pdf", uploadedAt: "2026-02-15" },
      { name: "Environmental_Management_Plan.pdf", size: 3200000, type: "application/pdf", uploadedAt: "2026-02-15" },
    ],
    feePaid: true,
    feeAmount: 50000,
    deficiencies: [],
    meetingGist: "",
    minutesOfMeeting: "",
    momLocked: false,
    sectorParams: { "Area of Mining": "150 hectares", "Mineral Type": "Limestone", "Expected Yield": "500,000 tonnes/year", "Rehabilitation Plan": "Included in EMP" },
  },
  {
    id: "EC-2026-002",
    proponentName: "Sunita Patel",
    organization: "Solar Corp Ltd",
    email: "sunita@solarcorp.in",
    sector: "Renewable Energy",
    category: "Category B",
    projectName: "Solar Power Plant Phase II",
    projectDescription: "200 MW solar photovoltaic power plant expansion in Gujarat with battery storage system.",
    location: "Kutch, Gujarat",
    estimatedCost: "₹120,00,00,000",
    status: "submitted",
    filedDate: "2026-02-20",
    documents: [
      { name: "Project_Proposal.pdf", size: 2800000, type: "application/pdf", uploadedAt: "2026-02-20" },
      { name: "Grid_Study.pdf", size: 1500000, type: "application/pdf", uploadedAt: "2026-02-20" },
    ],
    feePaid: true,
    feeAmount: 75000,
    deficiencies: [],
    meetingGist: "",
    minutesOfMeeting: "",
    momLocked: false,
    sectorParams: { "Capacity (MW)": "200", "Land Area": "400 acres", "Grid Connection": "Approved", "Environmental Impact": "Low" },
  },
  {
    id: "EC-2026-003",
    proponentName: "Vikram Singh",
    organization: "AquaPure Systems",
    email: "vikram@aquapure.in",
    sector: "Water Treatment",
    category: "Category B",
    projectName: "Municipal Water Treatment Upgrade",
    projectDescription: "Upgrade of existing municipal water treatment facility to handle 100 MLD capacity with advanced filtration.",
    location: "Pune, Maharashtra",
    estimatedCost: "₹35,00,00,000",
    status: "referred",
    filedDate: "2026-01-10",
    documents: [
      { name: "Detailed_Project_Report.pdf", size: 5200000, type: "application/pdf", uploadedAt: "2026-01-10" },
      { name: "Water_Quality_Analysis.pdf", size: 800000, type: "application/pdf", uploadedAt: "2026-01-10" },
      { name: "NOC_Municipal_Corp.pdf", size: 450000, type: "application/pdf", uploadedAt: "2026-01-12" },
    ],
    feePaid: true,
    feeAmount: 35000,
    deficiencies: [],
    meetingGist: "The Expert Appraisal Committee reviewed the Municipal Water Treatment Upgrade project proposed by AquaPure Systems in Pune. The committee noted the comprehensive DPR and satisfactory water quality analysis. Key observations include adequate capacity planning for future growth, compliance with CPCB discharge standards, and proper sludge management protocol. The committee recommends conditional approval subject to quarterly effluent monitoring reports.",
    minutesOfMeeting: "",
    momLocked: false,
    sectorParams: { "Treatment Capacity": "100 MLD", "Technology": "Advanced Filtration", "Discharge Standards": "CPCB Compliant" },
  },
  {
    id: "EC-2026-004",
    proponentName: "Anita Desai",
    organization: "MetalWorks Inc",
    email: "anita@metalworks.in",
    sector: "Manufacturing",
    category: "Category A",
    projectName: "Steel Rolling Mill Expansion",
    projectDescription: "Expansion of existing steel rolling mill with additional hot rolling capacity and pollution control equipment.",
    location: "Jamshedpur, Jharkhand",
    estimatedCost: "₹280,00,00,000",
    status: "essential_document_sought",
    filedDate: "2026-03-01",
    documents: [
      { name: "Expansion_Plan.pdf", size: 3100000, type: "application/pdf", uploadedAt: "2026-03-01" },
    ],
    feePaid: false,
    feeAmount: 100000,
    deficiencies: ["Air quality impact assessment report missing", "Updated consent from State Pollution Control Board required"],
    meetingGist: "",
    minutesOfMeeting: "",
    momLocked: false,
    sectorParams: { "Production Capacity": "2 MTPA", "Emission Levels": "Pending assessment", "Waste Management": "Included", "Water Usage": "5000 KLD" },
  },
  {
    id: "EC-2026-005",
    proponentName: "Priya Sharma",
    organization: "EcoHomes Developers",
    email: "priya@ecohomes.in",
    sector: "Construction",
    category: "Category B",
    projectName: "Green Township Project",
    projectDescription: "Eco-friendly residential township with 2000 units, rainwater harvesting, and solar integration.",
    location: "Bengaluru, Karnataka",
    estimatedCost: "₹500,00,00,000",
    status: "mom_generated",
    filedDate: "2025-12-05",
    documents: [
      { name: "Township_Master_Plan.pdf", size: 8200000, type: "application/pdf", uploadedAt: "2025-12-05" },
      { name: "Environmental_Clearance_Form.pdf", size: 1100000, type: "application/pdf", uploadedAt: "2025-12-05" },
      { name: "Green_Building_Certification.pdf", size: 950000, type: "application/pdf", uploadedAt: "2025-12-08" },
      { name: "Traffic_Impact_Study.pdf", size: 2300000, type: "application/pdf", uploadedAt: "2025-12-08" },
    ],
    feePaid: true,
    feeAmount: 150000,
    deficiencies: [],
    meetingGist: "The Expert Appraisal Committee reviewed the Green Township Project by EcoHomes Developers in Bengaluru. The committee appreciated the eco-friendly design incorporating rainwater harvesting and solar integration. The project meets all green building standards. Recommendations: (1) Maintain 33% green cover, (2) Install STP with tertiary treatment, (3) Submit quarterly compliance reports.",
    minutesOfMeeting: "MINUTES OF THE MEETING\n\nExpert Appraisal Committee Meeting\nDate: 2026-02-28\nVenue: MoEFCC Conference Hall\n\nAgenda Item: Green Township Project - EcoHomes Developers\nApplication No: EC-2026-005\n\nPresent:\n1. Dr. R.K. Sharma - Chairman\n2. Prof. M. Krishnan - Environmental Expert\n3. Shri A.K. Singh - Representative, MoEFCC\n\nDeliberations:\nThe committee reviewed the Green Township Project proposed in Bengaluru, Karnataka. The project involves construction of 2000 eco-friendly residential units with integrated rainwater harvesting and solar power systems.\n\nThe committee noted the comprehensive Environmental Impact Assessment and the commitment to green building certification. The traffic impact study was found satisfactory.\n\nDecision:\nThe committee recommends CONDITIONAL ENVIRONMENTAL CLEARANCE subject to the following conditions:\n\n1. Minimum 33% green cover shall be maintained throughout the project lifecycle\n2. Sewage Treatment Plant with tertiary treatment of 5 MLD capacity shall be installed\n3. Quarterly environmental compliance reports shall be submitted to SEIAA Karnataka\n4. Solar energy shall contribute minimum 40% of common area power requirements\n5. Rainwater harvesting system shall be designed for 100% roof area coverage\n\nThe clearance is valid for 7 years from the date of issue.",
    momLocked: false,
    sectorParams: { "Built-up Area": "5,00,000 sq ft", "Green Cover": "33%", "Water Recycling": "100%", "Energy": "40% Solar" },
  },
];

interface WorkflowContextType {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  addApplication: (app: Application) => void;
  getApplicationsByStatus: (statuses: WorkflowStatus[]) => Application[];
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const WorkflowProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<Application[]>(defaultApplications);

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const addApplication = (app: Application) => {
    setApplications(prev => [...prev, app]);
  };

  const getApplicationsByStatus = (statuses: WorkflowStatus[]) => {
    return applications.filter(a => statuses.includes(a.status));
  };

  return (
    <WorkflowContext.Provider value={{ applications, setApplications, updateApplication, addApplication, getApplicationsByStatus }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) throw new Error("useWorkflow must be used within WorkflowProvider");
  return context;
};
