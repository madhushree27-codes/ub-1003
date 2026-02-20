import type { Issue, DepartmentData, IssueCategory, IssueStatus, Department } from "./types";

const categories: IssueCategory[] = ["Road Damage", "Garbage Overflow", "Streetlight Failure", "Water Leakage", "Public Safety Hazard"];
const statuses: IssueStatus[] = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved"];
const departments: Department[] = ["Public Works", "Sanitation", "Electrical", "Water Supply", "Public Safety"];
const severities = ["Low", "Medium", "High", "Critical"] as const;

const locations = [
  { lat: 28.6139, lng: 77.2090, name: "Connaught Place" },
  { lat: 28.6329, lng: 77.2197, name: "Karol Bagh" },
  { lat: 28.5355, lng: 77.2100, name: "Saket" },
  { lat: 28.6692, lng: 77.4538, name: "Noida Sector 18" },
  { lat: 28.4595, lng: 77.0266, name: "Gurgaon" },
  { lat: 28.7041, lng: 77.1025, name: "Rohini" },
  { lat: 28.5672, lng: 77.3211, name: "Mayur Vihar" },
  { lat: 28.6280, lng: 77.3649, name: "Vasundhara" },
  { lat: 28.6508, lng: 77.1855, name: "Patel Nagar" },
  { lat: 28.5244, lng: 77.1855, name: "Hauz Khas" },
  { lat: 28.5921, lng: 77.0460, name: "Dwarka" },
  { lat: 28.7164, lng: 77.1484, name: "Pitampura" },
];

const descriptions = [
  "Large pothole near main intersection causing traffic issues",
  "Garbage bins overflowing for past 3 days, causing hygiene concerns",
  "Street light not working for over a week, safety risk at night",
  "Water pipe leakage flooding the road and nearby shops",
  "Broken railing on pedestrian bridge, immediate hazard",
  "Road surface completely damaged after heavy rains",
  "Waste dumped illegally near residential area",
  "Multiple street lights flickering in the colony",
  "Sewage water mixing with drinking water supply",
  "Open manhole without any cover near school zone",
];

const catToDept: Record<IssueCategory, Department> = {
  "Road Damage": "Public Works",
  "Garbage Overflow": "Sanitation",
  "Streetlight Failure": "Electrical",
  "Water Leakage": "Water Supply",
  "Public Safety Hazard": "Public Safety",
};

function randomDate(daysBack: number) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d.toISOString();
}

export function generateMockIssues(count: number, userId?: string): Issue[] {
  return Array.from({ length: count }, (_, i) => {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const loc = locations[i % locations.length];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = Math.floor(Math.random() * 5) + 5;
    const sevIdx = priority >= 9 ? 3 : priority >= 7 ? 2 : priority >= 5 ? 1 : 0;
    const created = randomDate(60);

    return {
      issue_id: `ISS-${1000 + i}`,
      user_id: userId || `USR-${Math.floor(Math.random() * 50) + 1}`,
      image_url: "",
      category: cat,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      latitude: loc.lat + (Math.random() - 0.5) * 0.01,
      longitude: loc.lng + (Math.random() - 0.5) * 0.01,
      status,
      priority,
      ai_confidence: Math.floor(Math.random() * 15) + 85,
      severity: severities[sevIdx],
      duplicate_cluster: Math.random() > 0.7 ? `CL-${Math.floor(Math.random() * 200)}` : null,
      assigned_department: catToDept[cat],
      satisfaction_score: status === "Resolved" ? Math.floor(Math.random() * 3) + 3 : null,
      created_at: created,
      updated_at: new Date(new Date(created).getTime() + Math.random() * 86400000 * 5).toISOString(),
    };
  });
}

export function generateDepartments(): DepartmentData[] {
  return [
    { dept_id: "D1", name: "Public Works", sla_hours: 72, performance_score: 78, resolved_count: 145, pending_count: 32 },
    { dept_id: "D2", name: "Sanitation", sla_hours: 48, performance_score: 85, resolved_count: 210, pending_count: 18 },
    { dept_id: "D3", name: "Electrical", sla_hours: 24, performance_score: 72, resolved_count: 98, pending_count: 25 },
    { dept_id: "D4", name: "Water Supply", sla_hours: 36, performance_score: 68, resolved_count: 87, pending_count: 30 },
    { dept_id: "D5", name: "Public Safety", sla_hours: 12, performance_score: 91, resolved_count: 156, pending_count: 8 },
  ];
}

export const ALL_ISSUES = generateMockIssues(120);
export const DEPARTMENTS = generateDepartments();
