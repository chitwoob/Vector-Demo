import { HydrateClient } from "~/trpc/server";
import ReportClient from "~/app/report/report-client";
import { Suspense } from "react";

export default function ReportPage() {
  return (
    <HydrateClient>
      <Suspense>
        <ReportClient />
      </Suspense>
    </HydrateClient>
  );
}
