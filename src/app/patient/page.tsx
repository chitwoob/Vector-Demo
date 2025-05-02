import Link from "next/link";
import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";

import { PatientList } from "~/app/patient/patient-list";
import { api, HydrateClient } from "~/trpc/server";

export default function Patient() {
  void api.patient.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-bold">Patient Management</h1>
        <Link href="/patient/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </Link>
      </div>
      <PatientList />
    </HydrateClient>
  );
}
