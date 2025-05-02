"use server";

import { redirect } from "next/navigation";
import type { FormData } from "~/app/patient/patient.type";
import { api } from "~/trpc/server";

export async function submitPatientForm(data: FormData) {
  if (data.id) {
    await api.patient.update({
      id: data.id,
      patientName: data.patientName,
    });
  } else {
    await api.patient.create({
      patientName: data.patientName,
    });
  }

  redirect("/patient");
}
