import { z } from "zod";

export const formSchema = z.object({
  patientName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export type FormData = z.infer<typeof formSchema> & { id?: string };
