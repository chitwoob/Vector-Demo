"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { formSchema } from "~/app/patient/patient.type";
import { submitPatientForm } from "~/app/patient/patient.actions";

export default function PatientForm({
  id = undefined,
  patientName = "",
}: {
  id?: string | undefined;
  patientName: string;
}) {
  const [isPending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setPending(true);
    await submitPatientForm({ ...data, id });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Patient Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Full Name"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : id ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
