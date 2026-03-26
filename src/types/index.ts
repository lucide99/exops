// ─── Domain Types ─────────────────────────────────────────────

export type ExhibitionStatus = "planning" | "active" | "closed" | "cancelled";
export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
export type GateStatus = "passed" | "pending" | "blocked";
export type LeadGrade = "A" | "B" | "C";
export type LeadSource = "badge_scan" | "business_card" | "manual";
export type CostCategory = "booth" | "flight" | "hotel" | "interpreter" | "promotion" | "other";
export type TaskCategory = "logistics" | "booth" | "marketing" | "onsite" | "post";
export type UserRole = "admin" | "ops" | "sales" | "executive";

export interface Gate {
  id?: string;
  order: number;
  name: string;
  status: GateStatus;
}

export interface ExhibitionKPI {
  visitors: number;
  qualifiedLeads: number;
  aLeads: number;
  execMeetings: number;
  distributors: number;
  proposals: number;
  contracts: number;
  rev6m: number;
  rev12m: number;
}

export interface Exhibition {
  id: string;
  name: string;
  city: string;
  country: string;
  venueName: string;
  startsAt: string;
  endsAt: string;
  status: ExhibitionStatus;
  budgetUsd: number;
  goalLeads: number;
  goalMeetings: number;
  gates: Gate[];
  kpi: ExhibitionKPI;
}

export interface Lead {
  id: string;
  exhibitionId: string;
  company: string;
  fullName: string;
  title: string;
  email: string;
  country: string;
  interest?: string;
  leadType: string;
  grade: LeadGrade;
  isQualified: boolean;
  nextAction: string;
  assignee: string;
  source: LeadSource;
  collectedAt: string;
  slaOverdue: boolean;
}

export interface TaskInstance {
  id: string;
  exhibitionId: string;
  category: TaskCategory;
  title: string;
  dueDate: string;
  assignee: string;
  status: TaskStatus;
}

export interface Cost {
  id: string;
  exhibitionId: string;
  category: CostCategory;
  description: string;
  budgeted: number;
  actual: number | null;
  receipt: boolean;
}

export interface Meeting {
  id: string;
  exhibitionId: string;
  company: string | null;
  contactName: string;
  contactTitle: string | null;
  meetingAt: string;
  notes: string | null;
  isExec: boolean;
}
