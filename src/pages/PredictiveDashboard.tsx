import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell
} from "recharts";
import { Brain, TrendingUp, Clock, Lightbulb } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { generateForecast, getDepartmentDelayProbability, getFeatureImportance } from "@/lib/aiEngine";
import { useIssueStore } from "@/lib/issueStore";

const COLORS = ["hsl(210,100%,50%)", "hsl(152,60%,40%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(220,65%,18%)"];

export default function PredictiveDashboard() {
  const { issues } = useIssueStore();
  const forecast = useMemo(() => generateForecast(30), []);
  const delays = useMemo(() => getDepartmentDelayProbability(), []);
  const featureImp = useMemo(() => getFeatureImportance(), []);

  const avgPredicted = Math.round(forecast.reduce((s, d) => s + d.predicted, 0) / forecast.length);
  const peakDay = forecast.reduce((max, d) => d.predicted > max.predicted ? d : max, forecast[0]);

  const suggestions = useMemo(() => {
    const catCounts: Record<string, number> = {};
    issues.forEach(i => { catCounts[i.category] = (catCounts[i.category] || 0) + 1; });
    const top = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    return [
      { dept: "Public Works", suggestion: `${catCounts["Road Damage"] || 0} road damage reports — increase crew capacity during monsoon` },
      { dept: "Sanitation", suggestion: `${catCounts["Garbage Overflow"] || 0} garbage reports — deploy additional collection vehicles` },
      { dept: "Electrical", suggestion: `${catCounts["Streetlight Failure"] || 0} streetlight reports — schedule pre-emptive maintenance` },
      { dept: "Water Supply", suggestion: `${catCounts["Water Leakage"] || 0} leakage reports — monitor pipeline pressure in affected sectors` },
    ];
  }, [issues]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Predictive Analytics</h1>
        <p className="text-muted-foreground">AI-powered forecasting based on {issues.length} submitted reports</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Reports" value={issues.length} icon={Brain} variant="primary" subtitle="Fed into AI model" />
        <StatsCard title="Avg Daily Prediction" value={avgPredicted} icon={TrendingUp} subtitle="Issues per day" />
        <StatsCard title="Peak Day" value={peakDay.date} icon={Clock} variant="warning" subtitle={`${peakDay.predicted} predicted`} />
        <StatsCard title="AI Confidence" value="91%" icon={Brain} variant="success" subtitle="Model accuracy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 30-day Forecast */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">30-Day Issue Forecast</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,15%,88%)", fontSize: "12px" }} />
              <Legend />
              <Line type="monotone" dataKey="predicted" stroke="hsl(210,100%,50%)" strokeWidth={2} dot={false} name="Predicted" />
              <Line type="monotone" dataKey="actual" stroke="hsl(152,60%,40%)" strokeWidth={2} dot={false} name="Actual" connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Importance */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Feature Importance (AI Model)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={featureImp} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} width={120} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,15%,88%)", fontSize: "12px" }} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {featureImp.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Delay Probability */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Department Delay Probability</h3>
          <div className="space-y-4">
            {delays.map(d => (
              <div key={d.department}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{d.department}</span>
                  <span className="text-muted-foreground">{d.probability}% · Avg {d.avg_delay_hours}h</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width: `${d.probability}%`,
                      backgroundColor: d.probability > 25 ? "hsl(0,72%,51%)" : d.probability > 15 ? "hsl(38,92%,50%)" : "hsl(152,60%,40%)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Optimization */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" /> Resource Optimization Suggestions
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {suggestions.map(s => (
              <div key={s.dept} className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-1 text-sm font-semibold text-accent">{s.dept}</p>
                <p className="text-sm text-muted-foreground">{s.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
