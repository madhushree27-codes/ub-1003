import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell
} from "recharts";
import { Brain, TrendingUp, Clock, Lightbulb } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { generateForecast, getDepartmentDelayProbability, getFeatureImportance } from "@/lib/aiEngine";
import { ALL_ISSUES, DEPARTMENTS } from "@/lib/mockData";

const COLORS = ["hsl(210,100%,50%)", "hsl(152,60%,40%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(220,65%,18%)"];

export default function PredictiveDashboard() {
  const forecast = useMemo(() => generateForecast(30), []);
  const delays = useMemo(() => getDepartmentDelayProbability(), []);
  const featureImp = useMemo(() => getFeatureImportance(), []);

  const avgPredicted = Math.round(forecast.reduce((s, d) => s + d.predicted, 0) / forecast.length);
  const peakDay = forecast.reduce((max, d) => d.predicted > max.predicted ? d : max, forecast[0]);

  const suggestions = [
    { dept: "Public Works", suggestion: "Increase crew capacity by 20% in Zone A during monsoon season" },
    { dept: "Sanitation", suggestion: "Deploy additional waste collection vehicles in high-density areas" },
    { dept: "Electrical", suggestion: "Pre-emptive maintenance for streetlights older than 5 years" },
    { dept: "Water Supply", suggestion: "Monitor pipeline pressure in sectors with recurring leakage" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Predictive Analytics</h1>
        <p className="text-muted-foreground">AI-powered forecasting and resource optimization</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Avg Daily Prediction" value={avgPredicted} icon={Brain} variant="primary" subtitle="Issues per day" />
        <StatsCard title="Peak Day" value={peakDay.date} icon={TrendingUp} subtitle={`${peakDay.predicted} predicted issues`} />
        <StatsCard title="Highest Delay Risk" value={delays.sort((a, b) => b.probability - a.probability)[0].department.split(" ")[0]} icon={Clock} variant="warning" subtitle={`${delays[0].probability}% delay probability`} />
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
