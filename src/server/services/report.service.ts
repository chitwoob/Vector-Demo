import { db } from "../db";
import { type PatientReport, type Patient, type Prisma } from "@prisma/client";

type ReportWithAlert = PatientReport & {
  patient: Pick<Patient, "patientName">;
  alertStatus?: "alert" | "";
};

type PagedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
};

export class ReportService {
  /**
   * Fetches all reports for a given patient ID.
   * @id - The ID of the patient to fetch reports for.
   */
  public async fetchReportByPatientId(id: string) {
    const reports = await db.patientReport.findMany({
      where: { patient: { id } },
      orderBy: { reportDate: "desc" },
      include: {
        patient: {
          select: { patientName: true },
        },
      },
    });

    return this.addAlertStatus(reports);
  }

  /**
   * Fetches reports by patient name with pagination.
   * @param patientName
   * @param page
   * @param pageSize
   */
  public async fetchReportsByPatientName(
    patientName: string,
    page: number,
    pageSize: number,
  ): Promise<PagedResponse<ReportWithAlert>> {
    // This is by no means a perfect search, but it is a demo.
    const search =
      patientName.trim().toLowerCase().split(" ").length === 1
        ? patientName.trim().toLowerCase() + ":*"
        : patientName.trim().toLowerCase().replace(" ", " & ") + ":*";

    const where: Prisma.PatientReportWhereInput = {
      patient: {
        patientName: {
          search,
        },
      },
    };

    const totalItems = await db.patientReport.count({ where });
    const reports = await db.patientReport.findMany({
      where,
      orderBy: { reportDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        patient: {
          select: { patientName: true },
        },
      },
    });

    return {
      items: this.addAlertStatus(reports),
      page,
      pageSize,
      totalItems,
    };
  }

  /**
   * Adds an alert status to each report based on the summary content.
   * If the summary contains "tachycardia" or "arrhythmia", it sets the alertStatus to "alert".
   * Otherwise, it leaves alertStatus as an empty string.
   * Note: Typically this logic would be done at the time of db insertion or update. I did it this way in
   * the spirit of the requested demo.
   */
  private addAlertStatus(reports: ReportWithAlert[]): ReportWithAlert[] {
    return reports.map((report) => {
      const alertStatus =
        report.summary &&
        (report.summary.includes("tachycardia") ||
          report.summary.includes("arrhythmia"))
          ? "alert"
          : "";
      return { ...report, alertStatus };
    });
  }
}
