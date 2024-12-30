import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Card, CardContent } from "../../components/ui/card";
import OrdersTable from "./OrdersTable";
import { useTranslation } from "react-i18next";

type Transaction = {
  id: string;
  period: string;
  city: string;
  carClass: string;
  operationType: string;
  status: string;
  amount: number;
};

export default function MoneyTransaction() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = React.useState("Kazan");
  const [selectedCarClass, setSelectedCarClass] = React.useState(
    t("allClassesOfCars")
  );
  const [selectedOperation, setSelectedOperation] = React.useState(
    t("allTypesOfOperations")
  );
  const [selecteddriver, setSelecteddriver] = React.useState(
    t("allDriversClients")
  );
  const [dateRange, setDateRange] = React.useState<
    [Date | undefined, Date | undefined]
  >([undefined, undefined]);
  const [_selectedDateFilter, setSelectedDateFilter] = React.useState("all");

  const transactions: Transaction[] = [
    {
      id: "1",
      period: "01.01.2023 - 03.02.2023",
      city: "Kazan",
      carClass: "-",
      operationType: t("replenishmentOfBalance"),
      status: t("updatedOn", { date: "02/19/2023 14:18" }),
      amount: 1000,
    },
    {
      id: "2",
      period: "04.02.2023 - 05.02.2023",
      city: "Moscow",
      carClass: t("economy"),
      operationType: t("withdrawal"),
      status: t("updatedOn", { date: "02/20/2023 10:30" }),
      amount: 500,
    },
  ];

  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  return (
    <div className="p-6 space-y-6 flex flex-col">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{t("monetaryTransactions")}</h1>

        <div className="flex flex-wrap gap-4">
          <Select onValueChange={setSelectedCity} defaultValue={selectedCity}>
            <SelectTrigger className="w-[200px] rounded-full h-10 bg-[#282828] text-gray-100 placeholder:text-gray-500 custom-input">
              <SelectValue placeholder={t("selectCity")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kazan">{t("kazan")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={setSelectedCarClass}
            defaultValue={selectedCarClass}
          >
            <SelectTrigger className="w-[200px] rounded-full h-10 bg-[#282828] text-gray-100 placeholder:text-gray-500 custom-input">
              <SelectValue placeholder={t("selectCarClass")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={t("allClassesOfCars")}>
                {t("allClassesOfCars")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={setSelectedOperation}
            defaultValue={selectedOperation}
          >
            <SelectTrigger className="w-[200px] rounded-full h-10 bg-[#282828] text-gray-100 placeholder:text-gray-500 custom-input">
              <SelectValue placeholder={t("selectOperationType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={t("allTypesOfOperations")}>
                {t("allTypesOfOperations")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={setSelecteddriver}
            defaultValue={selecteddriver}
          >
            <SelectTrigger className="w-[200px] rounded-full h-10 bg-[#282828] text-gray-100 placeholder:text-gray-500 custom-input">
              <SelectValue placeholder={t("selectDriverClient")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={t("allDriversClients")}>
                {t("allDriversClients")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]"
            onClick={() => setSelectedDateFilter("all")}
          >
            {t("all")}
          </Button>
          <Button
            className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]"
            onClick={() => setSelectedDateFilter("today")}
          >
            {t("today")}
          </Button>
          <Button
            className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]"
            onClick={() => setSelectedDateFilter("yesterday")}
          >
            {t("yesterday")}
          </Button>
          <Button
            className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]"
            onClick={() => setSelectedDateFilter("june")}
          >
            {t("june")}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal text-slate-200 bg-stone-700 hover:bg-stone-800 border-none hover:text-slate-200 select-none"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange[0] && dateRange[1]
                  ? `${format(dateRange[0], "dd.MM.yyyy")} - ${format(
                      dateRange[1],
                      "dd.MM.yyyy"
                    )}`
                  : dateRange[0]
                  ? format(dateRange[0], "dd.MM.yyyy")
                  : t("pickDateRange")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange[0]}
                selected={{ from: dateRange[0], to: dateRange[1] }}
                onSelect={(range) => setDateRange([range?.from, range?.to])}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button className="ml-auto">{t("show")}</Button>
        </div>
      </div>

      <div className="rounded-lg">
        <OrdersTable />
      </div>

      <Card className="bg-transparent border-none">
        <CardContent className="flex justify-between items-center py-3 px-5 bg-black rounded-full text-slate-200">
          <span className="font-semibold">{t("total")}:</span>
          <span className="text-lg font-bold">${totalAmount}</span>
        </CardContent>
      </Card>
    </div>
  );
}
