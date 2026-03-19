import type { ExhibitionStatus, TaskStatus, GateStatus, LeadGrade, TaskCategory, CostCategory } from "@/types";

export const STATUS_LABEL: Record<ExhibitionStatus | TaskStatus | GateStatus, string> = {
  planning: "계획중",
  active: "진행중",
  closed: "완료",
  cancelled: "취소",
  todo: "미완료",
  in_progress: "진행중",
  done: "완료",
  blocked: "차단",
  passed: "통과",
  pending: "대기",
};

export const CATEGORY_LABEL: Record<TaskCategory | CostCategory, string> = {
  logistics: "항공/숙박",
  booth: "부스",
  marketing: "마케팅",
  onsite: "현장",
  post: "사후",
  flight: "항공",
  hotel: "숙박",
  interpreter: "통역",
  promotion: "프로모션",
  other: "기타",
};

export const GRADE_VARIANT: Record<LeadGrade, "default" | "secondary" | "outline"> = {
  A: "default",
  B: "secondary",
  C: "outline",
};
