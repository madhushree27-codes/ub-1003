import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from "recharts";
import { Award, TrendingUp, Users, BarChart3 } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useIssueStore } from "@/lib/issueStore";
import { DEPARTMENTS } from "@/lib/mockData";

const COLORS = ["hsl(210,100%,50%)", "hsl(152,60%,40%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(220,65%,18%)"];

export default function GovernanceDashboard() {
  const { issues } = useIssueStore();

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace(" ", "\n"), value }));
  }, [issues]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach(i => { counts[i.status] = (counts[i.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [issues]);

  const deptPerformance = useMemo(() => {
    const depts: Record<string, { resolved: number; total: number }> = {};
    issues.forEach(i => {
      if (!depts[i.assigned_department]) depts[i.assigned_department] = { resolved: 0, total: 0 };
      depts[i.assigned_department].total++;
      if (i.status === "Resolved") depts[i.assigned_department].resolved++;
    });
    return Object.entries(depts)
      .map(([name, d]) => ({ name, score: d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0, resolved: d.resolved, pending: d.total - d.resolved }))
      .sort((a, b) => b.score - a.score);
  }, [issues]);

  const avgSatisfaction = useMemo(() => {
    const rated = issues.filter(i => i.satisfaction_score !== null);
    return rated.length ? (rated.reduce((s, i) => s + (i.satisfaction_score || 0), 0) / rated.length).toFixed(1) : "N/A";
  }, [issues]);

  const resolvedCount = issues.filter(i => i.status === "Resolved").length;
  const slaCompliance = resolvedCount > 0 ? Math.round((resolvedCount / issues.length) * 100) : 0;

  const avgScore = deptPerformance.length > 0
    ? Math.round(deptPerformance.reduce((s, d) => s + d.score, 0) / deptPerformance.length)
    : 0;

  const radarData = deptPerformance.map(d => ({
    dept: d.name.split(" ")[0],
    score: d.score,
    sla: d.pending > 0 ? Math.round(100 - (d.pending / (d.resolved + d.pending)) * 100) : 100,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Governance Intelligence</h1>
        <p className="text-muted-foreground">Policy-grade analytics and department performance metrics</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Dept. Performance Index" value={`${avgScore}%`} icon={Award} variant="primary" />
        <StatsCard title="SLA Compliance" value={`${slaCompliance}%`} icon={TrendingUp} variant="success" />
        <StatsCard title="Citizen Rating" value={avgSatisfaction} icon={Users} subtitle="Out of 5.0" />
        <StatsCard title="Total Issues" value={issues.length} icon={BarChart3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Issue Density */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Issue Density by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,15%,88%)", fontSize: "12px" }} />
                <Bar dataKey="value" fill="hsl(210,100%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-muted-foreground">No data yet</div>
          )}
        </div>

        {/* Resolution Distribution */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Resolution Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-muted-foreground">No data yet</div>
          )}
        </div>

        {/* Department Performance Radar */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Department Performance Radar</h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220,15%,88%)" />
                <PolarAngleAxis dataKey="dept" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
                <PolarRadiusAxis tick={{ fontSize: 10 }} />
                <Radar name="Performance" dataKey="score" stroke="hsl(210,100%,50%)" fill="hsl(210,100%,50%)" fillOpacity={0.3} />
                <Radar name="SLA" dataKey="sla" stroke="hsl(152,60%,40%)" fill="hsl(152,60%,40%)" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-muted-foreground">No data yet</div>
          )}
        </div>

        {/* Department Leaderboard */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Department Leaderboard</h3>
          {deptPerformance.length > 0 ? (
            <div className="space-y-3">
              {deptPerformance.map((dept, i) => (
                <div key={dept.name} className="flex items-center gap-4 rounded-lg border border-border p-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full font-display font-bold text-sm ${
                    i === 0 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">{dept.resolved} resolved · {dept.pending} pending</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-foreground">{dept.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground">No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
