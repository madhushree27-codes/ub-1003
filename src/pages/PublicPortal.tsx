import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import { Globe, TrendingUp, Shield, FileText } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useIssueStore } from "@/lib/issueStore";

export default function PublicPortal() {
  const { issues } = useIssueStore();

  const deptScores = useMemo(() => {
    const depts: Record<string, { resolved: number; total: number }> = {};
    issues.forEach(i => {
      if (!depts[i.assigned_department]) depts[i.assigned_department] = { resolved: 0, total: 0 };
      depts[i.assigned_department].total++;
      if (i.status === "Resolved") depts[i.assigned_department].resolved++;
    });
    return Object.entries(depts)
      .sort((a, b) => b[1].resolved - a[1].resolved)
      .map(([name, d]) => ({ name, resolved: d.resolved, score: d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0 }));
  }, [issues]);

  const monthlyProblems = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [issues]);

  const totalResolved = issues.filter(i => i.status === "Resolved").length;
  const topDept = deptScores[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
          <Globe className="h-4 w-4" /> Public Access
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Transparency Portal</h1>
        <p className="text-muted-foreground">Open civic data for public accountability · {issues.length} total reports</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Resolved" value={totalResolved} icon={Shield} variant="success" />
        <StatsCard title="Top Department" value={topDept ? topDept.name.split(" ")[0] : "N/A"} icon={TrendingUp} subtitle={topDept ? `${topDept.resolved} resolved` : ""} />
        <StatsCard title="Active Issues" value={issues.filter(i => i.status !== "Resolved").length} icon={FileText} variant="warning" />
        <StatsCard title="Total Reports" value={issues.length} icon={Globe} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Public Scores */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Department Public Scores</h3>
          {deptScores.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,15%,88%)", fontSize: "12px" }} />
                <Bar dataKey="resolved" fill="hsl(210,100%,50%)" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-muted-foreground">No reports submitted yet</div>
          )}
        </div>

        {/* Monthly Civic Report */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Monthly Civic Report</h3>
          <p className="mb-4 text-sm text-muted-foreground">Most reported issues this month</p>
          {monthlyProblems.length > 0 ? (
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
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground">No reports yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
