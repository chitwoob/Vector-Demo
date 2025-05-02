import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { patientRouter } from "~/server/api/routers/patient";
import { reportRouter } from "~/server/api/routers/report";

export const appRouter = createTRPCRouter({
  patient: patientRouter,
  report: reportRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
