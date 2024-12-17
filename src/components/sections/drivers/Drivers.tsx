import { Button } from "../../ui/button";
import Switch from "../../common/Switch";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import DriverRow from "./DriverRow";
import DriversFilters from "./DriversFilters";

const tabItems = [
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "inactive", label: "Inactive" },
];

const TableColumns = [
  "Date of registration",
  "FCs",
  "Call sign",
  "Profession",
  "Balance",
  "Car",
  "Partner",
  "Date of change",
  "Whom changed",
];

const Performers = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const renderPagination = () => (
    <div className="flex items-center gap-2 mt-4">
      <Button variant="outline" size="icon" className="w-8 h-8">
        1
      </Button>
      <Button variant="outline" size="icon" className="w-8 h-8 text-gray-400">
        2
      </Button>
      <span className="text-gray-400">...</span>
      <Button variant="outline" size="icon" className="w-8 h-8 text-gray-400">
        7
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue={location.pathname.split("/")[3]} className="w-full">
        <TabsList className="bg-transparent hover:bg-transparent mb-6 w-full">
          {tabItems.map((tab) => (
            <TabsTrigger
              onClick={() => {
                navigate(`/control-panel/drivers/${tab.value}`);
              }}
              key={tab.value}
              value={tab.value}
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
            >
              {tab.label}
            </TabsTrigger>
          ))}
          <div className="ml-auto">
            <Button variant="outline" className="gap-2 add-button">
              <UserPlus size={16} />
              Add
            </Button>
          </div>
        </TabsList>

        <TabsContent value={location.pathname.split("/")[3]}>
          <DriversFilters />

          {location.pathname.split("/")[3] === "active" && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-300">Performers Online</span>
              <Switch checked={false} disabled={false} />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                {TableColumns.map((column) => (
                  <TableHead key={column} className="text-gray-400">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {performers.map((performer) => (
                <DriverRow
                  key={performer.id}
                  {...performer}
                  id={String(performer.id)}
                />
              ))}
            </TableBody>
          </Table>

          {renderPagination()}
        </TabsContent>

        <TabsContent value="blocked" />
        <TabsContent value="inactive" />
      </Tabs>
    </div>
  );
};

const performers = [
  {
    id: 1,
    registrationDate: "06.07.2023 12:15",
    name: "Shamsemukhametov",
    fullName: "Fail Nurmukhametovich",
    avatar: "/path-to-avatar.jpg",
    callSign: "333",
    profession: "Taxi driver",
    balance: "1,721.42 Rubles",
    status: "active",
    car: {
      model: "Hyundai Equus",
      number: "0333EC116",
    },
    partner: "Olrus Auto",
    changeDate: "06.07.2023 12:33",
    changedBy: "Jalalitdinov P.P.",
  },
];

export default Performers;
