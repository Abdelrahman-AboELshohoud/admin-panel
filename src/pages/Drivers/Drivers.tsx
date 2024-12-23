import { Button } from "../../components/ui/button";
import Switch from "../../components/common/Switch";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { UserPlus } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import DriverRow from "../../components/sections/drivers/DriverRow";
import DriversFilters from "../../components/sections/drivers/DriversFilters";
import { Driver, DriversListGQL } from "../../graphql/requests";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
const tabItems = [
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "inactive", label: "Inactive" },
];

const TableColumns = [
  "Date of registration",
  "Name",
  "Phone number",
  "Rating",
  "Car",
  "Status",
  "Reviews count",
];

const Drivers = () => {
  const location = useLocation();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const getAllDrivers = async () => {
      const res: any = await DriversListGQL({
        paging: {
          offset: 0,
          limit: 10,
        },
      });
      console.log(res);
      setDrivers(res?.data?.drivers?.nodes);
    };
    getAllDrivers();
  }, []);

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
              {t(`tabs.${tab.value}`)}
            </TabsTrigger>
          ))}
          <div className="ml-auto">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/control-panel/drivers/add-driver");
              }}
              className="gap-2 add-button"
            >
              <UserPlus size={16} />
              {t("drivers.buttons.add")}
            </Button>
          </div>
        </TabsList>

        <TabsContent value={location.pathname.split("/")[3]}>
          <DriversFilters />

          {location.pathname.split("/")[3] === "active" && (
            <div className="flex items-center gap-6 mb-6">
              <span className="text-sm text-gray-300">
                {t("drivers.online")}
              </span>
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
              {drivers &&
                drivers?.map((driver: Driver) => (
                  <DriverRow
                    key={driver.id}
                    data={driver}
                    id={String(driver.id)}
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

// const drivers = [
//   {
//     id: 1,
//     registrationDate: "06.07.2023 12:15",
//     name: "Shamsemukhametov",
//     fullName: "Fail Nurmukhametovich",
//     avatar: undefined,
//     profession: "Taxi driver",
//     balance: "1,721.42 Rubles",
//     status: "active",
//     car: {
//       model: "Hyundai Equus",
//       number: "0333EC116",
//     },
//     changeDate: "06.07.2023 12:33",
//     changedBy: "Jalalitdinov P.P.",
//   },
// ];

export default Drivers;
