"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { api } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

/*
 * ReportClient.tsx
 * This component allows users to search for patient reports by name.
 * It fetches reports from the server and displays them in a paginated table.
 * NOTE: This component does too much split it into smaller components.
 */
export default function ReportClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [patientName, setPatientName] = useState("");
  const [pageCount, setPageCount] = useState(5);
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "10";
  const pageSizeInt = parseInt(pageSize, 10);
  const pageInt = parseInt(page, 10);

  const { data, isLoading } = api.report.fetchReportsByPatientName.useQuery(
    {
      patientName: searchParams.get("patientName") ?? "",
      page: pageInt,
      pageSize: pageSizeInt,
    },
    { enabled: !!searchParams.get("patientName") },
  );
  useEffect(() => {
    const patientName = searchParams.get("patientName");

    if (patientName) {
      setPatientName(patientName);
    }
  }, [searchParams]);

  useEffect(() => {
    if (data) {
      setPageCount(Math.ceil(data.totalItems / parseInt(pageSize, 10)));
    }
  }, [data, pageSize]);

  const handleSearch = () => {
    if (patientName.trim()) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("patientName", patientName);
      router.push(`/report?${newParams.toString()}`);
    }
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    router.push(`/report?${newParams.toString()}`);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Patient Search</h1>
      <div className="mb-4 flex gap-2">
        <Input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Enter patient name"
          className="flex-1 rounded border p-2"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {searchParams.get("patientName") && (
        <div>
          {isLoading ? (
            <p>Loading results...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items.map((report) => (
                    <TableRow
                      key={report.id}
                      className={
                        report.alertStatus === "alert" ? "bg-red-300" : ""
                      }
                    >
                      <TableCell>
                        {report.reportDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{report.patient.patientName}</TableCell>
                      <TableCell>{report.summary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pageCount !== 1 && (
                <Pagination>
                  <PaginationContent>
                    {pageInt > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(parseInt(page) - 1)}
                        />
                      </PaginationItem>
                    )}
                    {Array.from({ length: pageCount }, (_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)}
                          isActive={index + 1 === parseInt(page)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {pageInt < pageCount && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(parseInt(page) + 1)}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
