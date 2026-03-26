"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./server";

// ─── Gates ───────────────────────────────────────────────────

export async function toggleGateStatus(gateId: string, currentStatus: string, exhibitionId: string) {
  const supabase = await createClient();
  const next = currentStatus === "passed" ? "pending" : "passed";
  await supabase
    .from("exhibition_gates")
    .update({ status: next as "passed" | "pending", passed_at: next === "passed" ? new Date().toISOString() : null })
    .eq("id", gateId);
  revalidatePath(`/exhibitions/${exhibitionId}`);
}

// ─── Tasks ───────────────────────────────────────────────────

export async function createTask(exhibitionId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase.from("tasks").insert({
    exhibition_id: exhibitionId,
    category: formData.get("category") as "logistics" | "booth" | "marketing" | "onsite" | "post",
    title: formData.get("title") as string,
    due_date: (formData.get("due_date") as string) || null,
    status: "todo" as const,
  });
  revalidatePath(`/exhibitions/${exhibitionId}`);
}

export async function updateTaskStatus(taskId: string, status: string, exhibitionId: string) {
  const supabase = await createClient();
  await supabase
    .from("tasks")
    .update({
      status: status as "todo" | "in_progress" | "done" | "blocked",
      completed_at: status === "done" ? new Date().toISOString() : null,
    })
    .eq("id", taskId);

  // 모든 태스크가 완료되면 전시 상태를 자동으로 closed로 변경
  if (status === "done") {
    const { data: tasks } = await supabase
      .from("tasks")
      .select("status")
      .eq("exhibition_id", exhibitionId);
    const allDone = tasks && tasks.length > 0 && tasks.every((t) => t.status === "done");
    if (allDone) {
      const { data: ex } = await supabase
        .from("exhibitions")
        .select("status")
        .eq("id", exhibitionId)
        .single();
      if (ex?.status === "active") {
        await supabase
          .from("exhibitions")
          .update({ status: "closed" })
          .eq("id", exhibitionId);
      }
    }
  }

  revalidatePath(`/exhibitions/${exhibitionId}`);
  revalidatePath("/");
}

export async function deleteTask(taskId: string, exhibitionId: string) {
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", taskId);
  revalidatePath(`/exhibitions/${exhibitionId}`);
}

// ─── Leads ───────────────────────────────────────────────────

export async function createLead(exhibitionId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: lead } = await supabase
    .from("leads")
    .insert({
      exhibition_id: exhibitionId,
      company: formData.get("company") as string,
      full_name: formData.get("full_name") as string,
      title: (formData.get("title") as string) || null,
      email: (formData.get("email") as string) || null,
      country: (formData.get("country") as string) || null,
      lead_type: (formData.get("lead_type") as string) || null,
      grade: (formData.get("grade") as "A" | "B" | "C" | "ungraded") || "ungraded",
      is_qualified: formData.get("is_qualified") === "true",
      source: (formData.get("source") as "badge_scan" | "business_card" | "manual") || "manual",
    })
    .select("id")
    .single();

  const nextAction = formData.get("next_action") as string;
  if (lead && nextAction) {
    await supabase.from("lead_next_actions").insert({
      lead_id: lead.id,
      description: nextAction,
    });
  }
  revalidatePath(`/exhibitions/${exhibitionId}`);
}

export async function updateLead(leadId: string, exhibitionId: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("leads")
    .update({
      grade: formData.get("grade") as "A" | "B" | "C" | "ungraded",
      is_qualified: formData.get("is_qualified") === "true",
    })
    .eq("id", leadId);
  revalidatePath(`/exhibitions/${exhibitionId}`);
}

export async function deleteLead(leadId: string, exhibitionId: string) {
  const supabase = await createClient();
  await supabase.from("leads").delete().eq("id", leadId);
  revalidatePath(`/exhibitions/${exhibitionId}`);
}

// ─── Meetings ────────────────────────────────────────────────

export async function createMeeting(exhibitionId: string, formData: FormData) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("meetings").insert({
    exhibition_id: exhibitionId,
    contact_name: formData.get("contact_name") as string,
    company: (formData.get("company") as string) || null,
    contact_title: (formData.get("contact_title") as string) || null,
    meeting_at: formData.get("meeting_at") as string,
    notes: (formData.get("notes") as string) || null,
    is_exec: formData.get("is_exec") === "true",
  });
  revalidatePath(`/exhibitions/${exhibitionId}`);
}

export async function deleteMeeting(meetingId: string, exhibitionId: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("meetings").delete().eq("id", meetingId);
  revalidatePath(`/exhibitions/${exhibitionId}`);
}

const DEFAULT_GATES = [
  { order: 1, name: "Go/No-go" },
  { order: 2, name: "참가확정" },
  { order: 3, name: "부스/메시지 동결" },
  { order: 4, name: "현장준비완료" },
  { order: 5, name: "D+1 리드정제완료" },
  { order: 6, name: "D+7 후속점검" },
];

export async function createExhibition(formData: FormData) {
  const supabase = await createClient();

  const payload = {
    name: formData.get("name") as string,
    city: formData.get("city") as string,
    country: (formData.get("country") as string).toUpperCase().slice(0, 2),
    venue_name: formData.get("venue_name") as string,
    starts_at: formData.get("starts_at") as string,
    ends_at: formData.get("ends_at") as string,
    budget_usd: Number(formData.get("budget_usd")) || 0,
    goal_leads: Number(formData.get("goal_leads")) || 0,
    goal_meetings: Number(formData.get("goal_meetings")) || 0,
    status: "planning" as const,
  };

  const { data: exhibition, error } = await supabase
    .from("exhibitions")
    .insert(payload)
    .select("id")
    .single();

  if (error || !exhibition) throw new Error(error?.message ?? "전시 생성 실패");

  // 기본 게이트 생성
  await supabase.from("exhibition_gates").insert(
    DEFAULT_GATES.map((g) => ({
      exhibition_id: exhibition.id,
      order: g.order,
      name: g.name,
      status: "pending" as const,
    }))
  );

  // 빈 KPI 스냅샷 생성
  await supabase.from("exhibition_kpis").insert({
    exhibition_id: exhibition.id,
  });

  revalidatePath("/");
  revalidatePath("/admin/exhibitions");
  redirect(`/exhibitions/${exhibition.id}`);
}

export async function updateExhibitionStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase
    .from("exhibitions")
    .update({ status: status as "planning" | "active" | "closed" | "cancelled" })
    .eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/exhibitions");
  revalidatePath(`/exhibitions/${id}`);
}

export async function updateExhibition(id: string, formData: FormData) {
  const supabase = await createClient();
  await supabase
    .from("exhibitions")
    .update({
      name: formData.get("name") as string,
      city: formData.get("city") as string,
      country: (formData.get("country") as string).toUpperCase().slice(0, 2),
      venue_name: formData.get("venue_name") as string,
      starts_at: formData.get("starts_at") as string,
      ends_at: formData.get("ends_at") as string,
      budget_usd: Number(formData.get("budget_usd")) || 0,
      goal_leads: Number(formData.get("goal_leads")) || 0,
      goal_meetings: Number(formData.get("goal_meetings")) || 0,
    })
    .eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/exhibitions");
  revalidatePath(`/exhibitions/${id}`);
  redirect(`/admin/exhibitions`);
}

export async function deleteExhibition(id: string) {
  const supabase = await createClient();
  await supabase.from("exhibitions").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/exhibitions");
  redirect("/admin/exhibitions");
}
