import type { PatientReport, Patient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { ReportService } from "./report.service";

interface MockDb {
  patientReport: {
    findMany: jest.MockedFunction<
      (
        args: Prisma.PatientReportFindManyArgs,
      ) => Promise<
        (PatientReport & { patient: Pick<Patient, "patientName"> })[]
      >
    >;
    count: jest.MockedFunction<
      (args: { where: Prisma.PatientReportWhereInput }) => Promise<number>
    >;
  };
}

jest.mock("../db", () => {
  const mockDb: MockDb = {
    patientReport: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };
  return {
    db: mockDb,
  };
});

const mockDb = (jest.requireMock("../db") as { db: MockDb }).db;

describe("ReportService", () => {
  let reportService: ReportService;

  beforeEach(() => {
    reportService = new ReportService();
    jest.clearAllMocks();
  });

  describe("fetchReportByPatientId", () => {
    it("should fetch reports by patient ID and add alert status for tachycardia", async () => {
      const mockReports: (PatientReport & {
        patient: Pick<Patient, "patientName">;
      })[] = [
        {
          id: "1",
          patientId: "patient1",
          summary: "Patient has tachycardia",
          reportDate: new Date(),
          patient: { patientName: "John Doe" },
        },
      ];

      mockDb.patientReport.findMany.mockResolvedValue(mockReports);

      const result = await reportService.fetchReportByPatientId("patient1");

      expect(mockDb.patientReport.findMany).toHaveBeenCalledWith({
        where: { patient: { id: "patient1" } },
        orderBy: { reportDate: "desc" },
        include: { patient: { select: { patientName: true } } },
      });

      expect(result).toEqual([
        {
          ...mockReports[0],
          alertStatus: "alert",
        },
      ]);
    });

    it("should fetch reports by patient ID and add empty alert status for normal reports", async () => {
      const mockReports: (PatientReport & {
        patient: Pick<Patient, "patientName">;
      })[] = [
        {
          id: "2",
          patientId: "patient1",
          summary: "Normal",
          reportDate: new Date(),
          patient: { patientName: "John Doe" },
        },
      ];

      mockDb.patientReport.findMany.mockResolvedValue(mockReports);

      const result = await reportService.fetchReportByPatientId("patient1");

      expect(mockDb.patientReport.findMany).toHaveBeenCalledWith({
        where: { patient: { id: "patient1" } },
        orderBy: { reportDate: "desc" },
        include: { patient: { select: { patientName: true } } },
      });

      expect(result).toEqual([
        {
          ...mockReports[0],
          alertStatus: "",
        },
      ]);
    });
  });

  describe("fetchReportsByPatientName", () => {
    it("should fetch paginated reports by patient name and add alert status for arrhythmia", async () => {
      const mockReports: (PatientReport & {
        patient: Pick<Patient, "patientName">;
      })[] = [
        {
          id: "1",
          patientId: "patient1",
          summary: "Patient has arrhythmia",
          reportDate: new Date(),
          patient: { patientName: "John Doe" },
        },
      ];
      const mockTotal = 1;

      mockDb.patientReport.count.mockResolvedValue(mockTotal);
      mockDb.patientReport.findMany.mockResolvedValue(mockReports);

      const result = await reportService.fetchReportsByPatientName(
        "John",
        1,
        10,
      );

      expect(mockDb.patientReport.count).toHaveBeenCalledWith({
        where: {
          patient: { patientName: { search: "John:*" } },
        },
      });

      expect(mockDb.patientReport.findMany).toHaveBeenCalledWith({
        where: {
          patient: { patientName: { search: "John:*" } },
        },
        orderBy: { reportDate: "desc" },
        skip: 0,
        take: 10,
        include: { patient: { select: { patientName: true } } },
      });

      expect(result).toEqual({
        items: [{ ...mockReports[0], alertStatus: "alert" }],
        page: 1,
        pageSize: 10,
        totalItems: 1,
      });
    });

    it("should fetch paginated reports by patient name and add empty alert status for normal reports", async () => {
      const mockReports: (PatientReport & {
        patient: Pick<Patient, "patientName">;
      })[] = [
        {
          id: "2",
          patientId: "patient1",
          summary: "Normal",
          reportDate: new Date(),
          patient: { patientName: "John Doe" },
        },
      ];
      const mockTotal = 1;

      mockDb.patientReport.count.mockResolvedValue(mockTotal);
      mockDb.patientReport.findMany.mockResolvedValue(mockReports);

      const result = await reportService.fetchReportsByPatientName(
        "John",
        1,
        10,
      );

      expect(mockDb.patientReport.count).toHaveBeenCalledWith({
        where: {
          patient: { patientName: { search: "John:*" } },
        },
      });

      expect(mockDb.patientReport.findMany).toHaveBeenCalledWith({
        where: {
          patient: { patientName: { search: "John:*" } },
        },
        orderBy: { reportDate: "desc" },
        skip: 0,
        take: 10,
        include: { patient: { select: { patientName: true } } },
      });

      expect(result).toEqual({
        items: [{ ...mockReports[0], alertStatus: "" }],
        page: 1,
        pageSize: 10,
        totalItems: 1,
      });
    });
  });
});
