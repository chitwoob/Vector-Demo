import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import PatientForm from "~/app/patient/patient-form";
import { HydrateClient } from "~/trpc/server";

export default async function CreatePatientPage() {
  return (
    <HydrateClient>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Patient</CardTitle>
          <CardDescription>Update the patients information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PatientForm patientName="" />
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
