import { Link } from "react-router-dom";
import {
  Brain, Eye, Copy, Clock, TrendingUp, BarChart3,
  ArrowRight, Shield, ChevronRight, Globe
} from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import heroImage from "@/assets/hero-city.jpg";

const features = [
  { icon: Brain, title: "AI Image Classification", desc: "Automated categorization of civic issues using intelligent analysis" },
  { icon: TrendingUp, title: "Urgency Prediction", desc: "Priority scoring engine that ensures critical issues are addressed first" },
  { icon: Copy, title: "Duplicate Detection", desc: "Smart clustering to prevent redundant reports and save resources" },
  { icon: Clock, title: "SLA Monitoring", desc: "Real-time tracking of service level agreements across departments" },
  { icon: Eye, title: "Zone Risk Forecasting", desc: "Predictive models for identifying high-risk areas before issues arise" },
  { icon: BarChart3, title: "Governance Analytics", desc: "Data-driven insights for policy decisions and resource allocation" },
];

const metrics = [
  { value: 42, suffix: "%", label: "Duplicate Reduction" },
  { value: 3.2, suffix: " hrs", label: "Avg Resolution Time" },
  { value: 94, suffix: "%", label: "SLA Compliance" },
  { value: 87, suffix: "%", label: "Citizen Satisfaction" },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 gradient-hero opacity-85" />
        <div className="relative container mx-auto px-4 py-24 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent-foreground/90">
              <Shield className="h-4 w-4 text-civic-sky" />
              <span className="text-civic-sky font-medium">AI-Powered Civic Intelligence</span>
            </div>
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Transforming Civic Reporting into{" "}
              <span className="text-gradient">Predictive Urban Intelligence</span>
            </h1>
            <p className="mb-10 text-lg text-primary-foreground/70 md:text-xl">
              Harness AI to classify, prioritize, and resolve urban issues faster. Empower citizens and enable data-driven governance.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/citizen"
                className="inline-flex items-center gap-2 rounded-xl gradient-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-glow transition-all hover:opacity-90"
              >
                Report an Issue <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-6 py-3.5 font-semibold text-primary-foreground backdrop-blur transition-all hover:bg-primary-foreground/20"
              >
                Explore Dashboard
              </Link>
              <Link
                to="/governance"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-6 py-3.5 font-semibold text-primary-foreground backdrop-blur transition-all hover:bg-primary-foreground/20"
              >
                City Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-foreground">
            Intelligent Civic Infrastructure
          </h2>
          <p className="text-muted-foreground">Six pillars powering the next generation of urban governance</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:border-accent/30">
              <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-primary-foreground">
            Impact at Scale
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className="mb-2 font-display text-5xl font-bold text-civic-sky">
                  <AnimatedCounter end={typeof m.value === "number" ? m.value : 0} suffix={m.suffix} />
                </div>
                <p className="text-primary-foreground/70">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <span className="font-display font-bold text-foreground">CivicPulse</span>
            </div>
            <p className="text-sm text-muted-foreground">AI-Driven Urban Civic Intelligence System</p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Platform</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/citizen" className="block hover:text-accent">Citizen Portal</Link>
              <Link to="/admin" className="block hover:text-accent">Admin Dashboard</Link>
              <Link to="/governance" className="block hover:text-accent">Governance Analytics</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Resources</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/public" className="block hover:text-accent">Open Data Portal</Link>
              <span className="block">Government Integration</span>
              <span className="block">API Documentation</span>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Support</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <span className="block">Contact Support</span>
              <span className="block">Privacy Policy</span>
              <span className="block">Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-8 border-t border-border px-4 pt-6 text-center text-xs text-muted-foreground">
          © 2026 CivicPulse. Empowering Smart Cities with AI.
        </div>
      </footer>
    </div>
  );
}
