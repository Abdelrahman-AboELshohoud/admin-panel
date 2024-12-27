import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  Tabs,
} from "../../components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import CarRow from "../../components/sections/drivers/CarRow";
import { DriversListGQL } from "../../graphql/requests";
import { useEffect, useState } from "react";
import { t } from "i18next";

const tabItems = [
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "inactive", label: "Inactive" },
];

const Cars = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  const getDriverCars = async () => {
    try {
      const response = await DriversListGQL({
        paging: {
          offset: 0,
          limit: 100,
        },
      });
      console.log(response.data.drivers.nodes);
      if (response.data) {
        setCars(response.data.drivers.nodes);
      }
    } catch (error) {
      console.error("Error fetching driver cars:", error);
    }
  };

  useEffect(() => {
    getDriverCars();
  }, []);

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
              {t("add")}
            </Button>
          </div>
        </TabsList>

        <TabsContent value={location.pathname.split("/")[3]}></TabsContent>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Select>
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="All companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All companies</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="All types of cars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types of cars</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="All car colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All car colors</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="All auto options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All auto options</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue placeholder="Rental cars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All rental cars</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search by brand, model, state..."
            className="bg-[#1E1E1E] border-none"
          />

          <div className="col-span-2 flex justify-end">
            <Button className="bg-black text-white hover:bg-black/90 px-8">
              {t("show")}
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-gray-400">
                {t("cars.carPlate")}
              </TableHead>
              <TableHead className="text-gray-400">
                {t("drivers.driver.title")}
              </TableHead>
              <TableHead className="text-gray-400">
                {t("cars.carProductionYear")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car) => (
              <CarRow key={car} car={car} />
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" size="icon" className="w-8 h-8">
            1
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 text-gray-400"
          >
            2
          </Button>
          <span className="text-gray-400">...</span>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 text-gray-400"
          >
            7
          </Button>
          <Button variant="outline" size="icon" className="w-8 h-8 ml-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="w-8 h-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default Cars;
