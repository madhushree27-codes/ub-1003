import { useState, useMemo } from "react";
import {
  FileText, Plus, Star, Clock, CheckCircle, AlertTriangle, Upload, MapPin, Send, ChevronDown, Eye
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { analyzeIssue } from "@/lib/aiEngine";
import { ALL_ISSUES } from "@/lib/mockData";
import type { Issue, IssueCategory, AIAnalysis } from "@/lib/types";

const categories: IssueCategory[] = [
  "Road Damage", "Garbage Overflow", "Streetlight Failure", "Water Leakage", "Public Safety Hazard"
];

const statusColors: Record<string, string> = {
  Submitted: "bg-info/10 text-info",
  "Under Review": "bg-warning/10 text-warning",
  Assigned: "bg-accent/10 text-accent",
  "In Progress": "bg-civic-sky/10 text-civic-sky",
  Resolved: "bg-success/10 text-success",
};

const CURRENT_USER = "USR-1";

export default function CitizenPortal() {
  const [tab, setTab] = useState<"report" | "issues" | "dashboard">("dashboard");
  const [category, setCategory] = useState<IssueCategory>("Road Damage");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [userIssues, setUserIssues] = useState<Issue[]>(
    () => ALL_ISSUES.filter((_, i) => i < 8).map(iss => ({ ...iss, user_id: CURRENT_USER }))
  );
  const [ratingIssueId, setRatingIssueId] = useState<string | null>(null);

  const myResolved = userIssues.filter(i => i.status === "Resolved").length;
  const myInProgress = userIssues.filter(i => ["In Progress", "Assigned", "Under Review"].includes(i.status)).length;
  const myPending = userIssues.filter(i => i.status === "Submitted").length;
  const avgSatisfaction = useMemo(() => {
    const rated = userIssues.filter(i => i.satisfaction_score !== null);
    return rated.length ? (rated.reduce((s, i) => s + (i.satisfaction_score || 0), 0) / rated.length).toFixed(1) : "N/A";
  }, [userIssues]);

  const handleSubmit = () => {
    const result = analyzeIssue(category, description);
    setAiResult(result);

    const loc = {
      lat: 28.5 + Math.random() * 0.3,
      lng: 77.0 + Math.random() * 0.5,
    };

    const newIssue: Issue = {
      issue_id: `ISS-${2000 + userIssues.length}`,
      user_id: CURRENT_USER,
      image_url: imageFile ? URL.createObjectURL(imageFile) : "",
      category,
      description,
      latitude: loc.lat,
      longitude: loc.lng,
      status: "Submitted",
      priority: result.priority_score,
      ai_confidence: result.confidence,
      severity: result.severity,
      duplicate_cluster: result.duplicate_cluster,
      assigned_department: result.assigned_department,
      satisfaction_score: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUserIssues(prev => [newIssue, ...prev]);
    setSubmitted(true);
  };

  const handleRate = (issueId: string, rating: number) => {
    setUserIssues(prev => prev.map(i =>
      i.issue_id === issueId ? { ...i, satisfaction_score: rating } : i
    ));
    setRatingIssueId(null);
  };

  const resetForm = () => {
    setCategory("Road Damage");
    setDescription("");
    setImageFile(null);
    setAiResult(null);
    setSubmitted(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Citizen Portal</h1>
        <p className="text-muted-foreground">Report issues, track progress, and rate resolutions</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        {[
          { key: "dashboard" as const, label: "My Dashboard", icon: Eye },
          { key: "report" as const, label: "Report Issue", icon: Plus },
          { key: "issues" as const, label: "My Reports", icon: FileText },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); if (t.key === "report") resetForm(); }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border hover:bg-muted"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab === "dashboard" && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="My Reports" value={userIssues.length} icon={FileText} variant="primary" subtitle="Total submitted" />
            <StatsCard title="Resolved" value={myResolved} icon={CheckCircle} variant="success" subtitle={`${myInProgress} in progress`} />
            <StatsCard title="Pending" value={myPending} icon={Clock} variant="warning" subtitle="Awaiting action" />
            <StatsCard title="Avg Satisfaction" value={avgSatisfaction} icon={Star} subtitle="Based on your ratings" />
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Resolution History</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-success/5 p-4 text-center border border-success/10">
                <p className="text-3xl font-bold font-display text-success">{myResolved}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
              <div className="rounded-lg bg-info/5 p-4 text-center border border-info/10">
                <p className="text-3xl font-bold font-display text-info">{myInProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="rounded-lg bg-warning/5 p-4 text-center border border-warning/10">
                <p className="text-3xl font-bold font-display text-warning">{myPending}</p>
                <p className="text-sm text-muted-foreground">Not Solved</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Tab */}
      {tab === "report" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            {submitted ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">Issue Reported Successfully</h3>
                  <p className="text-muted-foreground">AI has analyzed your report</p>
                </div>
                <button onClick={resetForm} className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:opacity-90">
                  Report Another Issue
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <h3 className="font-display text-xl font-semibold text-foreground">Report an Issue</h3>

                {/* Image Upload */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Upload Image</label>
                  <label className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-accent hover:bg-accent/5">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {imageFile ? imageFile.name : "Click to upload from desktop"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                  {imageFile && (
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="mt-3 h-40 w-full rounded-lg object-cover" />
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as IssueCategory)}
                      className="w-full appearance-none rounded-lg border border-input bg-background px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Location</label>
                  <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> GPS auto-captured (random unique location)
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the issue in detail..."
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!description.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" /> Submit Report
                </button>
              </div>
            )}
          </div>

          {/* AI Result Panel */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">AI Analysis</h3>
            {aiResult ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-accent/5 border border-accent/20 p-4">
                  <p className="text-xs font-medium text-accent mb-1">AI Classification</p>
                  <p className="font-display text-lg font-bold text-foreground">{aiResult.category}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="font-display text-xl font-bold text-foreground">{aiResult.confidence}%</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Priority</p>
                    <p className="font-display text-xl font-bold text-foreground">{aiResult.priority_score}/10</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Severity</p>
                    <p className={`font-display text-lg font-bold ${
                      aiResult.severity === "Critical" ? "text-destructive" :
                      aiResult.severity === "High" ? "text-warning" : "text-foreground"
                    }`}>{aiResult.severity}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Duplicate Cluster</p>
                    <p className="font-display text-lg font-bold text-foreground">
                      {aiResult.duplicate_cluster || "None"}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Assigned Department</p>
                  <p className="font-semibold text-foreground">{aiResult.assigned_department}</p>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <p>Submit a report to see AI analysis</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Issues Tab */}
      {tab === "issues" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground">
              My Reports ({userIssues.length})
            </h3>
          </div>
          <div className="space-y-3">
            {userIssues.map(issue => (
              <div key={issue.issue_id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{issue.issue_id}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[issue.status]}`}>
                        {issue.status}
                      </span>
                      {issue.severity === "Critical" && (
                        <span className="flex items-center gap-1 text-xs text-destructive">
                          <AlertTriangle className="h-3 w-3" /> Critical
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-foreground">{issue.category}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{issue.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(issue.created_at).toLocaleDateString()} · {issue.assigned_department} · Confidence: {issue.ai_confidence}%
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground">Priority: {issue.priority}/10</span>
                    {issue.status === "Resolved" && (
                      <div>
                        {issue.satisfaction_score ? (
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`h-4 w-4 ${s <= issue.satisfaction_score! ? "fill-warning text-warning" : "text-border"}`} />
                            ))}
                          </div>
                        ) : (
                          ratingIssueId === issue.issue_id ? (
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(s => (
                                <button key={s} onClick={() => handleRate(issue.issue_id, s)}
                                  className="rounded p-1 hover:bg-muted">
                                  <Star className="h-5 w-5 text-warning hover:fill-warning" />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <button onClick={() => setRatingIssueId(issue.issue_id)}
                              className="text-xs text-accent hover:underline">
                              Rate Resolution
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
