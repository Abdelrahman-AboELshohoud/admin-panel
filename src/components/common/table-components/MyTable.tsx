import { ReactNode } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "../../ui/table";
import { useTranslation } from "react-i18next";
export default function MyTable({
  headers,
  rows,
  navigate,
}: {
  headers: string[];
  rows: {
    data: ReactNode | string | number | undefined;
    id?: string;
  }[];
  navigate?: (id?: string) => void;
}) {
  const { t } = useTranslation();
  console.log(rows);
  return (
    <div className="text-gray-100 h-full flex card-shape">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none h-12">
            {headers?.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows && rows?.length > 0 ? (
            rows?.map((row: any, index: number) => (
              <TableRow
                key={index}
                className="hover:bg-transparent border-none h-12 cursor-pointer"
                onClick={() => {
                  navigate ? (row?.id ? navigate(row?.id) : navigate()) : null;
                }}
              >
                {row?.data?.map((cell: any, index: number) => (
                  <TableCell key={index}>{cell}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent mb-4">
              <TableCell
                colSpan={headers?.length}
                className="text-center py-20 text-lg font-medium"
              >
                {t("common.noData")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
