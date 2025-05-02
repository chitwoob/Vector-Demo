import { api, HydrateClient } from "~/trpc/server";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import ReportList from "~/app/patient/[id]/reports/report-list";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void api.report.fetchReportByPatientId.prefetch({ id });

  return (
    <HydrateClient>
      <Card>
        <CardHeader>Patient Reports</CardHeader>
        <CardContent>
          <ReportList id={id}></ReportList>
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
