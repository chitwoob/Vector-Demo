import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import PatientForm from "~/app/patient/patient-form";
import { api, HydrateClient } from "~/trpc/server";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { patientName } = await api.patient.findById({ id });

  return (
    <HydrateClient>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Patient</CardTitle>
          <CardDescription>Update the patients information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PatientForm id={id} patientName={patientName} />
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
