import { ReactNode } from "react";
import MyTable from "./MyTable";


export default function MyTableWithHeader({
  Header,
  headers,
  rows,
  navigate,
}: {
  Header: React.FC;
  headers: string[];
  rows: {
    data: ReactNode | string | number | undefined;
    id?: string;
  }[];
  navigate: (id?: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <Header />
      <MyTable headers={headers} rows={rows} navigate={navigate} />
    </div>
  );
}
