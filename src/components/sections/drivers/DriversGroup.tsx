import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Driver = {
  title: string;
  class: string;
  city: string;
  profession: string;
  priority: number;
};

const drivers: Driver[] = [
  {
    title: "Business+\nA sober driver",
    class: "Business+",
    city: "Kazan",
    profession: "Taxi driver",
    priority: 0,
  },
  {
    title: "Business\nis a Sober driver",
    class: "Business",
    city: "Kazan",
    profession: "Taxi driver",
    priority: 0,
  },
];

export default function DriversGroups() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("active");
  const [filters, setFilters] = useState({
    city: "all",
    profession: "all",
    title: "",
  });

  const navigate = useNavigate();

  const FleetDrivers = async () => {
    const res = 2;
    console.log(res);
  };

  useEffect(() => {
    FleetDrivers();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/control-panel/drivers-groups/${value}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-background text-foreground p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("fleetDrivers")}</h1>
        <Button
          onClick={() => navigate("/control-panel/drivers-groups/add-group")}
          className="add-button"
        >
          <Plus className="mr-2 h-4 w-4" /> {t("add")}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-transparent flex justify-start gap-4 mb-6">
          <TabsTrigger
            value="active"
            className="bg-transparent px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            {t("active")}
          </TabsTrigger>
          <TabsTrigger
            value="blocked"
            className="bg-transparent px-4 py-2 data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            {t("blocked")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select
          value={filters.city}
          onValueChange={(value) => handleFilterChange("city", value)}
        >
          <SelectTrigger className="custom-input">
            <SelectValue placeholder={t("allCities")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCities")}</SelectItem>
            <SelectItem value="kazan">{t("kazan")}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.profession}
          onValueChange={(value) => handleFilterChange("profession", value)}
        >
          <SelectTrigger className="custom-input">
            <SelectValue placeholder={t("profession")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allProfessions")}</SelectItem>
            <SelectItem value="taxi">{t("taxiDriver")}</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder={t("titlePlaceholder")}
          value={filters.title}
          onChange={(e) => handleFilterChange("title", e.target.value)}
          className="custom-input"
        />
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        {t("taxiDriver")}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>{t("title")}</TableHead>
            <TableHead>{t("class")}</TableHead>
            <TableHead>{t("city")}</TableHead>
            <TableHead>{t("profession")}</TableHead>
            <TableHead>{t("priority")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell className="whitespace-pre-line">
                {driver.title}
              </TableCell>
              <TableCell>{driver.class}</TableCell>
              <TableCell>{driver.city}</TableCell>
              <TableCell>{driver.profession}</TableCell>
              <TableCell>{driver.priority}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
