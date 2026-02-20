import type { AIAnalysis, IssueCategory, Department } from "./types";

const categoryToDepartment: Record<IssueCategory, Department> = {
  "Road Damage": "Public Works",
  "Garbage Overflow": "Sanitation",
  "Streetlight Failure": "Electrical",
  "Water Leakage": "Water Supply",
  "Public Safety Hazard": "Public Safety",
};

const severityLevels = ["Low", "Medium", "High", "Critical"] as const;

export function analyzeIssue(category: IssueCategory, description: string): AIAnalysis {
  const confidence = Math.floor(Math.random() * 15) + 85;
  const priority = Math.floor(Math.random() * 4) + 6;
  const sevIdx = priority >= 9 ? 3 : priority >= 7 ? 2 : priority >= 5 ? 1 : 0;
  const clusterNum = Math.floor(Math.random() * 200) + 1;
  const isDuplicate = Math.random() > 0.6;

  return {
    category,
    confidence,
    severity: severityLevels[sevIdx],
    priority_score: priority,
    duplicate_cluster: isDuplicate ? `CL-${clusterNum}` : null,
    assigned_department: categoryToDepartment[category],
  };
}

export function generateForecast(days: number) {
  const data = [];
  const base = 40;
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      predicted: Math.floor(base + Math.sin(i / 5) * 15 + Math.random() * 10),
      actual: i < 7 ? Math.floor(base + Math.sin(i / 5) * 15 + Math.random() * 8) : null,
    });
  }
  return data;
}

export function getDepartmentDelayProbability() {
  return [
    { department: "Public Works", probability: 32, avg_delay_hours: 18 },
    { department: "Sanitation", probability: 15, avg_delay_hours: 6 },
    { department: "Electrical", probability: 22, avg_delay_hours: 12 },
    { department: "Water Supply", probability: 28, avg_delay_hours: 14 },
    { department: "Public Safety", probability: 10, avg_delay_hours: 4 },
  ];
}

export function getFeatureImportance() {
  return [
    { feature: "Category", importance: 0.28 },
    { feature: "Location Density", importance: 0.22 },
    { feature: "Time of Day", importance: 0.18 },
    { feature: "Historical Frequency", importance: 0.15 },
    { feature: "Severity Level", importance: 0.10 },
    { feature: "Weather Conditions", importance: 0.07 },
  ];
}
