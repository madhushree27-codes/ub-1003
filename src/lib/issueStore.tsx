import React, { createContext, useContext, useState, useCallback } from "react";
import type { Issue, IssueStatus, IssueCategory, Department } from "./types";

const today = new Date().toISOString();

const SEED_ISSUES: Issue[] = [
  {
    issue_id: "ISS-1001",
    user_id: "USR-1",
    image_url: "",
    category: "Road Damage",
    description: "Large pothole near main intersection at Connaught Place causing traffic congestion and risk to two-wheelers",
    latitude: 28.6139,
    longitude: 77.2090,
    status: "In Progress",
    priority: 8,
    ai_confidence: 94,
    severity: "High",
    duplicate_cluster: null,
    assigned_department: "Public Works",
    satisfaction_score: null,
    created_at: today,
    updated_at: today,
  },
  {
    issue_id: "ISS-1002",
    user_id: "USR-2",
    image_url: "",
    category: "Garbage Overflow",
    description: "Garbage bins overflowing for 3 days near Saket residential block, causing severe hygiene concerns",
    latitude: 28.5355,
    longitude: 77.2100,
    status: "Submitted",
    priority: 7,
    ai_confidence: 91,
    severity: "High",
    duplicate_cluster: null,
    assigned_department: "Sanitation",
    satisfaction_score: null,
    created_at: today,
    updated_at: today,
  },
  {
    issue_id: "ISS-1003",
    user_id: "USR-1",
    image_url: "",
    category: "Streetlight Failure",
    description: "Multiple street lights not working on Rohini Sector 7 main road, creating safety hazard at night",
    latitude: 28.7041,
    longitude: 77.1025,
    status: "Resolved",
    priority: 6,
    ai_confidence: 89,
    severity: "Medium",
    duplicate_cluster: null,
    assigned_department: "Electrical",
    satisfaction_score: 4,
    created_at: today,
    updated_at: today,
  },
  {
    issue_id: "ISS-1004",
    user_id: "USR-3",
    image_url: "",
    category: "Water Leakage",
    description: "Broken water pipeline flooding the road near Dwarka Sector 10 metro station, affecting commuters",
    latitude: 28.5921,
    longitude: 77.0460,
    status: "Under Review",
    priority: 9,
    ai_confidence: 96,
    severity: "Critical",
    duplicate_cluster: null,
    assigned_department: "Water Supply",
    satisfaction_score: null,
    created_at: today,
    updated_at: today,
  },
];

interface IssueStoreContextType {
  issues: Issue[];
  addIssue: (issue: Issue) => void;
  updateIssueStatus: (issueId: string, status: IssueStatus) => void;
  updateIssueSatisfaction: (issueId: string, score: number) => void;
  bulkUpdateStatus: (issueIds: string[], status: IssueStatus) => void;
}

const IssueStoreContext = createContext<IssueStoreContextType | null>(null);

export function IssueStoreProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(SEED_ISSUES);

  const addIssue = useCallback((issue: Issue) => {
    setIssues(prev => [issue, ...prev]);
  }, []);

  const updateIssueStatus = useCallback((issueId: string, status: IssueStatus) => {
    setIssues(prev => prev.map(i =>
      i.issue_id === issueId ? { ...i, status, updated_at: new Date().toISOString() } : i
    ));
  }, []);

  const updateIssueSatisfaction = useCallback((issueId: string, score: number) => {
    setIssues(prev => prev.map(i =>
      i.issue_id === issueId ? { ...i, satisfaction_score: score } : i
    ));
  }, []);

  const bulkUpdateStatus = useCallback((issueIds: string[], status: IssueStatus) => {
    const idSet = new Set(issueIds);
    setIssues(prev => prev.map(i =>
      idSet.has(i.issue_id) ? { ...i, status, updated_at: new Date().toISOString() } : i
    ));
  }, []);

  return (
    <IssueStoreContext.Provider value={{ issues, addIssue, updateIssueStatus, updateIssueSatisfaction, bulkUpdateStatus }}>
      {children}
    </IssueStoreContext.Provider>
  );
}

export function useIssueStore() {
  const ctx = useContext(IssueStoreContext);
  if (!ctx) throw new Error("useIssueStore must be used within IssueStoreProvider");
  return ctx;
}
