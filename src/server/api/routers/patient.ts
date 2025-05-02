import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const patientRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ patientName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.patient.create({
        data: {
          patientName: input.patientName,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.patient.delete({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), patientName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.patient.update({
        where: { id: input.id },
        data: { patientName: input.patientName },
      });
    }),

  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const patient = await ctx.db.patient.findUnique({
        where: { id: input.id },
      });

      if (!patient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Patient with ID ${input.id} not found`,
        });
      }

      return patient;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.patient.findMany({
      orderBy: { patientName: "asc" },
    });
  }),
});
