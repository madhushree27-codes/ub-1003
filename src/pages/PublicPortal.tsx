import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import { Globe, TrendingUp, Shield, FileText } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { ALL_ISSUES, DEPARTMENTS } from "@/lib/mockData";

export default function PublicPortal() {
  const deptScores = useMemo(() => {
    return [...DEPARTMENTS]
      .sort((a, b) => b.resolved_count - a.resolved_count)
      .map(d => ({
        name: d.name,
        resolved: d.resolved_count,
        score: d.performance_score,
      }));
  }, []);

  const monthlyProblems = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_ISSUES.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, []);

  const trendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((m, i) => ({
      month: m,
      issues: Math.floor(80 + Math.sin(i) * 30 + Math.random() * 20),
      resolved: Math.floor(60 + Math.sin(i + 1) * 25 + Math.random() * 15),
    }));
  }, []);

  const totalResolved = DEPARTMENTS.reduce((s, d) => s + d.resolved_count, 0);
  const topDept = deptScores[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
          <Globe className="h-4 w-4" /> Public Access
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Transparency Portal</h1>
        <p className="text-muted-foreground">Open civic data for public accountability</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Resolved" value={totalResolved} icon={Shield} variant="success" />
        <StatsCard title="Top Department" value={topDept.name.split(" ")[0]} icon={TrendingUp} subtitle={`${topDept.resolved} resolved`} />
        <StatsCard title="Active Issues" value={ALL_ISSUES.filter(i => i.status !== "Resolved").length} icon={FileText} variant="warning" />
        <StatsCard title="Categories Tracked" value={5} icon={Globe} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Public Scores */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Department Public Scores</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,15%,88%)", fontSize: "12px" }} />
              <Bar dataKey="resolved" fill="hsl(210,100%,50%)" radius={[4, 4, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Civic Report */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Monthly Civic Report</h3>
          <p className="mb-4 text-sm text-muted-foreground">Most reported issues this month</p>
          <div className="space-y-3">
            {monthlyProblems.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 font-display text-sm font-bold text-accent">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <div className="mt-1 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-accent"
                      style={{ width: `${(p.count / monthlyProblems[0].count) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="font-display font-bold text-foreground">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Issue Trends */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Issue Trends (6 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,15%,88%)", fontSize: "12px" }} />
              <Legend />
              <Line type="monotone" dataKey="issues" stroke="hsl(210,100%,50%)" strokeWidth={2} name="Reported" />
              <Line type="monotone" dataKey="resolved" stroke="hsl(152,60%,40%)" strokeWidth={2} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
