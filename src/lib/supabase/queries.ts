import { createClient } from './server'
import type { Exhibition, Lead, TaskInstance, Cost, Gate, ExhibitionKPI, Meeting } from '@/types'

// ─── Exhibitions ─────────────────────────────────────────────

export async function getExhibitions(): Promise<Exhibition[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('exhibitions')
    .select(`
      *,
      exhibition_gates (*),
      exhibition_kpis (*)
    `)
    .order('starts_at', { ascending: false })

  if (error || !data) return []
  return data.map(mapExhibition)
}

export async function getExhibition(id: string): Promise<Exhibition | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('exhibitions')
    .select(`
      *,
      exhibition_gates (*),
      exhibition_kpis (*)
    `)
    .eq('id', id)
    .single()

  if (error || !data) return null
  return mapExhibition(data)
}

// ─── Leads ───────────────────────────────────────────────────

export async function getLeadsByExhibition(exhibitionId: string): Promise<Lead[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      users!leads_assignee_id_fkey (name),
      lead_next_actions (description, is_done)
    `)
    .eq('exhibition_id', exhibitionId)
    .order('collected_at', { ascending: false })

  if (error || !data) return []
  return data.map(mapLead)
}

export async function getAllLeads(): Promise<Lead[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      users!leads_assignee_id_fkey (name),
      lead_next_actions (description, is_done)
    `)
    .order('collected_at', { ascending: false })

  if (error || !data) return []
  return data.map(mapLead)
}

// ─── Tasks ───────────────────────────────────────────────────

export async function getTasksByExhibition(exhibitionId: string): Promise<TaskInstance[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      users!tasks_assignee_id_fkey (name)
    `)
    .eq('exhibition_id', exhibitionId)
    .order('due_date', { ascending: true })

  if (error || !data) return []
  return data.map(mapTask)
}

// ─── Meetings ────────────────────────────────────────────────

export async function getMeetingsByExhibition(exhibitionId: string): Promise<Meeting[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('meetings')
    .select('*')
    .eq('exhibition_id', exhibitionId)
    .order('meeting_at', { ascending: false })

  if (error || !data) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any): Meeting => ({
    id: row.id,
    exhibitionId: row.exhibition_id,
    company: row.company,
    contactName: row.contact_name,
    contactTitle: row.contact_title,
    meetingAt: row.meeting_at,
    notes: row.notes,
    isExec: row.is_exec,
  }))
}

// ─── Costs ───────────────────────────────────────────────────

export async function getCostsByExhibition(exhibitionId: string): Promise<Cost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('costs')
    .select(`
      *,
      cost_receipts (id)
    `)
    .eq('exhibition_id', exhibitionId)
    .order('created_at', { ascending: true })

  if (error || !data) return []
  return data.map(mapCost)
}

// ─── Mappers ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapExhibition(row: any): Exhibition {
  const gates: Gate[] = (row.exhibition_gates ?? [])
    .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
    .map((g: { id: string; order: number; name: string; status: string }) => ({
      id: g.id,
      order: g.order,
      name: g.name,
      status: g.status as Gate['status'],
    }))

  const latestKpi = (row.exhibition_kpis ?? [])
    .sort((a: { recorded_at: string }, b: { recorded_at: string }) =>
      new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
    )[0]

  const kpi: ExhibitionKPI = latestKpi
    ? {
        visitors: latestKpi.visitors,
        qualifiedLeads: latestKpi.qualified_leads,
        aLeads: latestKpi.a_leads,
        execMeetings: latestKpi.exec_meetings,
        distributors: latestKpi.distributors,
        proposals: latestKpi.proposals,
        contracts: latestKpi.contracts,
        rev6m: Number(latestKpi.rev_6m_usd),
        rev12m: Number(latestKpi.rev_12m_usd),
      }
    : { visitors: 0, qualifiedLeads: 0, aLeads: 0, execMeetings: 0, distributors: 0, proposals: 0, contracts: 0, rev6m: 0, rev12m: 0 }

  return {
    id: row.id,
    name: row.name,
    city: row.city,
    country: row.country,
    venueName: row.venue_name,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    budgetUsd: Number(row.budget_usd),
    goalLeads: row.goal_leads,
    goalMeetings: row.goal_meetings,
    gates,
    kpi,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLead(row: any): Lead {
  const nextAction =
    (row.lead_next_actions ?? []).find((a: { is_done: boolean }) => !a.is_done)?.description ?? ''

  return {
    id: row.id,
    exhibitionId: row.exhibition_id,
    company: row.company,
    fullName: row.full_name,
    title: row.title ?? '',
    email: row.email ?? '',
    country: row.country ?? '',
    interest: row.interest ?? undefined,
    leadType: row.lead_type ?? '',
    grade: row.grade,
    isQualified: row.is_qualified,
    nextAction,
    assignee: row.users?.name ?? '',
    source: row.source,
    collectedAt: row.collected_at,
    slaOverdue: row.sla_due_at ? new Date(row.sla_due_at) < new Date() : false,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTask(row: any): TaskInstance {
  return {
    id: row.id,
    exhibitionId: row.exhibition_id,
    category: row.category,
    title: row.title,
    dueDate: row.due_date ?? '',
    assignee: row.users?.name ?? '',
    status: row.status,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCost(row: any): Cost {
  return {
    id: row.id,
    exhibitionId: row.exhibition_id,
    category: row.category,
    description: row.description,
    budgeted: Number(row.budgeted_usd),
    actual: row.actual_usd !== null ? Number(row.actual_usd) : null,
    receipt: (row.cost_receipts ?? []).length > 0,
  }
}
