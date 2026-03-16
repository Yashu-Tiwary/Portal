import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkflowProvider } from "@/context/WorkflowContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProponentDashboard from "./pages/ProponentDashboard";
import ApplicationForm from "./pages/ApplicationForm";
import ScrutinyDashboard from "./pages/ScrutinyDashboard";
import MomDashboard from "./pages/MomDashboard";
import Presentation from "./pages/Presentation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WorkflowProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/proponent" element={<ProponentDashboard />} />
            <Route path="/proponent/apply" element={<ApplicationForm />} />
            <Route path="/scrutiny" element={<ScrutinyDashboard />} />
            <Route path="/mom" element={<MomDashboard />} />
            <Route path="/presentation" element={<Presentation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WorkflowProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
