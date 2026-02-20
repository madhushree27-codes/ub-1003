import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { Award, TrendingUp, Users, BarChart3 } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { ALL_ISSUES, DEPARTMENTS } from "@/lib/mockData";

const COLORS = ["hsl(210,100%,50%)", "hsl(152,60%,40%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(220,65%,18%)"];

export default function GovernanceDashboard() {
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_ISSUES.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace(" ", "\n"), value }));
  }, []);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_ISSUES.forEach(i => { counts[i.status] = (counts[i.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  const deptLeaderboard = useMemo(() => {
    return [...DEPARTMENTS].sort((a, b) => b.performance_score - a.performance_score);
  }, []);

  const avgSatisfaction = useMemo(() => {
    const rated = ALL_ISSUES.filter(i => i.satisfaction_score !== null);
    return rated.length ? (rated.reduce((s, i) => s + (i.satisfaction_score || 0), 0) / rated.length).toFixed(1) : "N/A";
  }, []);

  const slaCompliance = useMemo(() => {
    const resolved = ALL_ISSUES.filter(i => i.status === "Resolved");
    if (!resolved.length) return 0;
    const withinSla = resolved.filter(i => {
      const dept = DEPARTMENTS.find(d => d.name === i.assigned_department);
      if (!dept) return true;
      const hours = (new Date(i.updated_at).getTime() - new Date(i.created_at).getTime()) / 3600000;
      return hours <= dept.sla_hours;
    });
    return Math.round((withinSla.length / resolved.length) * 100);
  }, []);

  const radarData = DEPARTMENTS.map(d => ({
    dept: d.name.split(" ")[0],
    score: d.performance_score,
    sla: Math.min(100, Math.round(100 - (d.pending_count / (d.resolved_count + d.pending_count)) * 100)),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Governance Intelligence</h1>
        <p className="text-muted-foreground">Policy-grade analytics and department performance metrics</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Dept. Performance Index" value={`${(DEPARTMENTS.reduce((s, d) => s + d.performance_score, 0) / DEPARTMENTS.length).toFixed(0)}%`} icon={Award} variant="primary" />
        <StatsCard title="SLA Compliance" value={`${slaCompliance}%`} icon={TrendingUp} variant="success" />
        <StatsCard title="Citizen Rating" value={avgSatisfaction} icon={Users} subtitle="Out of 5.0" />
        <StatsCard title="Total Issues" value={ALL_ISSUES.length} icon={BarChart3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Issue Density */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Issue Density by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,15%,88%)", fontSize: "12px" }} />
              <Bar dataKey="value" fill="hsl(210,100%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution Distribution */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Resolution Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance Radar */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Department Performance Radar</h3>
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
        </div>

        {/* Department Leaderboard */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Department Leaderboard</h3>
          <div className="space-y-3">
            {deptLeaderboard.map((dept, i) => (
              <div key={dept.dept_id} className="flex items-center gap-4 rounded-lg border border-border p-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full font-display font-bold text-sm ${
                  i === 0 ? "bg-warning/10 text-warning" : i === 1 ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{dept.name}</p>
                  <p className="text-xs text-muted-foreground">{dept.resolved_count} resolved · {dept.pending_count} pending</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-foreground">{dept.performance_score}%</p>
                  <p className="text-xs text-muted-foreground">SLA: {dept.sla_hours}h</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
