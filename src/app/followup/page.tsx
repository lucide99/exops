import { FollowUpQueue } from "@/components/leads/followup-queue";
import { getAllLeads } from "@/lib/supabase/queries";

export default async function FollowUpPage() {
  const leads = await getAllLeads();
  return <FollowUpQueue leads={leads} />;
}
