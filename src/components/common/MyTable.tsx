import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "../../components/ui/table";
import { useTranslation } from "react-i18next";
export default function MyTable({
  headers,
  rows,
  navigate,
}: {
  headers: string[];
  rows: any[];
  navigate?: (path: string) => void;
}) {
  const { t } = useTranslation();

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
                  navigate && navigate(row[0]);
                }}
              >
                {row.map((cell: any) => (
                  <TableCell key={cell}>{cell}</TableCell>
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
