import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const DriversChange = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl text-white mb-6">{t("driversChange.title")}</h1>

      <div className="flex gap-6 text-gray-400 mb-6">
        <button className="hover:text-white">
          {t("driversChange.nav.orders")}
        </button>
        <button className="hover:text-white">
          {t("driversChange.nav.change")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {["city", "profession", "carClass", "partners"].map((filter) => (
          <Select key={filter}>
            <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
              <SelectValue
                placeholder={t(`driversChange.filters.${filter}.placeholder`)}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={filter}>
                {t(`driversChange.filters.${filter}.option`)}
              </SelectItem>
            </SelectContent>
          </Select>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-2">
          {["today", "yesterday", "june", "period"].map((period) => (
            <Button
              key={period}
              variant="outline"
              className={
                period === "today"
                  ? "bg-[#B89962] text-black hover:bg-[#B89962]/90"
                  : "bg-[#1E1E1E] border-none"
              }
            >
              {t(`driversChange.periods.${period}`)}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          {["startDate", "endDate"].map((date) => (
            <input
              key={date}
              type="text"
              value={t(`driversChange.dates.${date}`)}
              className="bg-[#1E1E1E] border-none rounded-md px-3 py-2 text-white"
            />
          ))}
        </div>

        <Button className="bg-black text-white hover:bg-black/90 px-8">
          {t("driversChange.showButton")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            {Object.keys(
              t("driversChange.tableHeaders", { returnObjects: true })
            ).map((header) => (
              <TableHead key={header} className="text-gray-400">
                {t(`driversChange.tableHeaders.${header}`)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow
              key={driver.id}
              className="border-none hover:bg-[#2F2F2F]"
            >
              <TableCell>
                <div>
                  <div className="font-medium">{driver.id}</div>
                  <div className="text-sm text-gray-400">{driver.name}</div>
                </div>
              </TableCell>
              <TableCell>{driver.totalOrders}</TableCell>
              <TableCell>{driver.numberPaid}</TableCell>
              <TableCell>{driver.amountPaid} ₽</TableCell>
              <TableCell>{driver.quantityUnpaid}</TableCell>
              <TableCell>{driver.amountUnpaid} ₽</TableCell>
              <TableCell>{driver.quantityCancelled}</TableCell>
              <TableCell>{driver.effectiveness}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center bg-black rounded-lg p-4 mt-4">
        <span className="text-white text-lg">
          {t("driversChange.total.label")}
        </span>
        <span className="text-white text-lg">
          {t("driversChange.total.amount")}
        </span>
      </div>
    </div>
  );
};

const drivers = [
  {
    id: "22287",
    name: "Dmitry Dolgov",
    totalOrders: "1",
    numberPaid: "0",
    amountPaid: "0",
    quantityUnpaid: "0",
    amountUnpaid: "0",
    quantityCancelled: "0",
    effectiveness: "0%",
  },
  {
    id: "22287",
    name: "Dmitry Dolgov",
    totalOrders: "1",
    numberPaid: "0",
    amountPaid: "0",
    quantityUnpaid: "0",
    amountUnpaid: "0",
    quantityCancelled: "0",
    effectiveness: "0%",
  },
];

export default DriversChange;
