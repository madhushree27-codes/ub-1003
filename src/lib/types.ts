export type IssueCategory =
  | "Road Damage"
  | "Garbage Overflow"
  | "Streetlight Failure"
  | "Water Leakage"
  | "Public Safety Hazard";

export type IssueStatus = "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Resolved";

export type UserRole = "citizen" | "admin";

export type Department =
  | "Public Works"
  | "Sanitation"
  | "Electrical"
  | "Water Supply"
  | "Public Safety";

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface Issue {
  issue_id: string;
  user_id: string;
  image_url: string;
  category: IssueCategory;
  description: string;
  latitude: number;
  longitude: number;
  status: IssueStatus;
  priority: number;
  ai_confidence: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  duplicate_cluster: string | null;
  assigned_department: Department;
  satisfaction_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface DepartmentData {
  dept_id: string;
  name: Department;
  sla_hours: number;
  performance_score: number;
  resolved_count: number;
  pending_count: number;
}

export interface AIAnalysis {
  category: IssueCategory;
  confidence: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  priority_score: number;
  duplicate_cluster: string | null;
  assigned_department: Department;
}
