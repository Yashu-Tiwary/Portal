import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, FileText, Users, ArrowRight, Leaf, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Digital Application Filing",
    description: "Multi-step application forms with sector-specific parameters and document uploads.",
  },
  {
    icon: Users,
    title: "Role-Based Workflow",
    description: "Admin, Scrutiny Team, and MoM Team with dynamic role assignment and access control.",
  },
  {
    icon: Shield,
    title: "Transparent Governance",
    description: "Complete audit trail from filing to publication of Minutes of the Meeting.",
  },
  {
    icon: Clock,
    title: "Faster Clearances",
    description: "Streamlined processes reduce delays with automated notifications and tracking.",
  },
];

const stats = [
  { value: "10,000+", label: "Applications Processed" },
  { value: "95%", label: "Faster Processing" },
  { value: "100%", label: "Digital Compliance" },
  { value: "24/7", label: "Portal Availability" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl text-foreground">PARIVESH 3.0</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="container relative flex min-h-[85vh] flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-card">
              <CheckCircle className="h-4 w-4 text-success" />
              Government of India Initiative
            </div>
            <h1 className="mb-6 font-display text-5xl leading-tight text-foreground md:text-6xl lg:text-7xl">
              Environmental Clearance,{" "}
              <span className="text-primary">Reimagined</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              A unified digital portal for managing the complete lifecycle of environmental
              clearance applications — from initial filing to final publication of Minutes of the Meeting.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  File an Application <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="font-display text-3xl text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl text-foreground md:text-4xl">
              Streamlined Governance
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Built for transparency, speed, and compliance across all stakeholders.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-body text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-display text-lg text-foreground">PARIVESH 3.0</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Ministry of Environment, Forest and Climate Change. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
