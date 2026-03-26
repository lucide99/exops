import { PortfolioDashboard } from "@/components/dashboard/portfolio-dashboard";
import { getExhibitions, getAllLeads } from "@/lib/supabase/queries";

export default async function Home() {
  const [exhibitions, leads] = await Promise.all([getExhibitions(), getAllLeads()]);
  const slaBreaches = leads.filter((l) => l.slaOverdue).length;
  const slaCompleted = leads.filter((l) => !l.slaOverdue && (l.grade === "A" || l.grade === "B")).length;
  return <PortfolioDashboard exhibitions={exhibitions} slaBreaches={slaBreaches} slaCompleted={slaCompleted} />;
}
