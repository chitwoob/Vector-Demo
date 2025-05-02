import { z } from "zod";

import { ReportService } from "~/server/services/report.service";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const reportService = new ReportService();

export const reportRouter = createTRPCRouter({
  fetchReportsByPatientName: protectedProcedure
    .input(
      z.object({
        patientName: z.string(),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).default(10),
      }),
    )
    .query(async ({ input }) => {
      return reportService.fetchReportsByPatientName(
        input.patientName,
        input.page,
        input.pageSize,
      );
    }),

  fetchReportByPatientId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return reportService.fetchReportByPatientId(input.id);
    }),
});
