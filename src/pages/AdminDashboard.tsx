import { useState, useMemo } from "react";
import {
  FileText, AlertTriangle, Clock, CheckCircle, ChevronDown, Search
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useIssueStore } from "@/lib/issueStore";
import type { IssueStatus } from "@/lib/types";

const statusColors: Record<string, string> = {
  Submitted: "bg-info/10 text-info",
  "Under Review": "bg-warning/10 text-warning",
  Assigned: "bg-accent/10 text-accent",
  "In Progress": "bg-civic-sky/10 text-civic-sky",
  Resolved: "bg-success/10 text-success",
};

export default function AdminDashboard() {
  const { issues, updateIssueStatus, bulkUpdateStatus } = useIssueStore();
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterDept, setFilterDept] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());

  const totalReports = issues.length;
  const critical = issues.filter(i => i.severity === "Critical" || i.severity === "High").length;
  const inProgress = issues.filter(i => ["In Progress", "Assigned", "Under Review"].includes(i.status)).length;
  const resolved = issues.filter(i => i.status === "Resolved").length;

  const filtered = useMemo(() => {
    return issues.filter(i => {
      if (filterStatus !== "All" && i.status !== filterStatus) return false;
      if (filterCategory !== "All" && i.category !== filterCategory) return false;
      if (filterDept !== "All" && i.assigned_department !== filterDept) return false;
      if (searchTerm && !i.description.toLowerCase().includes(searchTerm.toLowerCase()) && !i.issue_id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [issues, filterStatus, filterCategory, filterDept, searchTerm]);

  const handleBulkStatus = (newStatus: IssueStatus) => {
    bulkUpdateStatus(Array.from(selectedIssues), newStatus);
    setSelectedIssues(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIssues(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage and monitor all civic reports</p>
      </div>

      {/* Top Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Reports" value={totalReports} icon={FileText} variant="primary" subtitle="From all citizens" />
        <StatsCard title="Critical" value={critical} icon={AlertTriangle} variant="destructive" subtitle="High + Critical severity" />
        <StatsCard title="In Progress" value={inProgress} icon={Clock} variant="warning" subtitle="Being handled" />
        <StatsCard title="Resolved" value={resolved} icon={CheckCircle} variant="success" subtitle={`${totalReports > 0 ? ((resolved / totalReports) * 100).toFixed(0) : 0}% resolution rate`} />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search issues..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {[
          { label: "Status", value: filterStatus, setter: setFilterStatus, options: ["All", "Submitted", "In Progress", "Resolved"] },
          { label: "Category", value: filterCategory, setter: setFilterCategory, options: ["All", "Road Damage", "Garbage Overflow", "Streetlight Failure", "Water Leakage", "Public Safety Hazard"] },
          { label: "Department", value: filterDept, setter: setFilterDept, options: ["All", "Public Works", "Sanitation", "Electrical", "Water Supply", "Public Safety"] },
        ].map(f => (
          <div key={f.label} className="relative">
            <select
              value={f.value}
              onChange={e => f.setter(e.target.value)}
              className="appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {f.options.map(o => <option key={o} value={o}>{o === "All" ? `All ${f.label}` : o}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedIssues.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 p-3">
          <span className="text-sm font-medium text-foreground">{selectedIssues.size} selected</span>
          <button onClick={() => handleBulkStatus("In Progress")} className="rounded-md bg-info/10 px-3 py-1.5 text-xs font-medium text-info hover:bg-info/20">Mark In Progress</button>
          <button onClick={() => handleBulkStatus("Resolved")} className="rounded-md bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20">Mark Resolved</button>
          <button onClick={() => setSelectedIssues(new Set())} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Clear</button>
        </div>
      )}

      {/* Issues Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left w-8">
                <input type="checkbox"
                  checked={selectedIssues.size === filtered.length && filtered.length > 0}
                  onChange={e => setSelectedIssues(e.target.checked ? new Set(filtered.map(i => i.issue_id)) : new Set())}
                  className="rounded border-input"
                />
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">ID</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Priority</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Department</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Location</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(issue => (
              <tr key={issue.issue_id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <input type="checkbox"
                    checked={selectedIssues.has(issue.issue_id)}
                    onChange={() => toggleSelect(issue.issue_id)}
                    className="rounded border-input"
                  />
                </td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{issue.issue_id}</td>
                <td className="p-3 font-medium text-foreground">{issue.category}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[issue.status]}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`font-bold ${issue.priority >= 8 ? "text-destructive" : issue.priority >= 6 ? "text-warning" : "text-foreground"}`}>
                    {issue.priority}/10
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{issue.assigned_department}</td>
                <td className="p-3 text-xs text-muted-foreground">{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(issue.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <select
                    value={issue.status}
                    onChange={e => updateIssueStatus(issue.issue_id, e.target.value as IssueStatus)}
                    className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No reports yet. Submit one from the Citizen Portal!</div>
        )}
      </div>
    </div>
  );
}
