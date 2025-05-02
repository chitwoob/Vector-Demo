"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Edit, FileText, MoreHorizontal, Trash } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export function PatientList() {
  const [patients] = api.patient.getAll.useSuspenseQuery();
  const utils = api.useUtils();
  const deletePatient = api.patient.delete.useMutation({
    onSuccess: async () => {
      await utils.patient.getAll.invalidate();
      toast.success("Patient deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting patient: ${error.message}`);
    },
  });

  const handleDeleteClick = (id: string) => {
    deletePatient.mutate({ id });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">
                  {patient.patientName}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/patient/${patient.id}/reports`}>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Reports
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/patient/${patient.id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(`${patient.id}`)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
