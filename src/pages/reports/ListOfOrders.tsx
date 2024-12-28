import { useTranslation } from "react-i18next";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";

interface Order {
  id: string;
  date: string;
  time: string;
  dispatcher: string;
  client: string;
  location: {
    city: string;
    address: string;
    area: string;
  };
  status: {
    text: string;
    type: "completed" | "pending" | "cancelled";
  };
  executor: {
    name: string;
    vehicle: string;
    plate: string;
  };
  business: {
    type: string;
    distance: string;
    duration: string;
    amount: string;
  };
}

const ListOfOrders = () => {
  const { t } = useTranslation();

  const orders: Order[] = [
    {
      id: "№6267",
      date: "07/09/2023",
      time: "23:30",
      dispatcher: "Jalalitdinov R.",
      client: "Ruslan Sarbaev",
      location: {
        city: "Kazan",
        address: "Bekhtereva street, 9A",
        area: "Center",
      },
      status: {
        text: t("listOfOrders.completed"),
        type: "completed",
      },
      executor: {
        name: "Shamsemukhamelev File",
        vehicle: "Hyundai Equus",
        plate: "0333EC116",
      },
      business: {
        type: "BUSINESS",
        distance: "26.96 km",
        duration: "25.5 min",
        amount: "2,052.75 Rubles",
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Select defaultValue="kazan">
          <SelectTrigger className="custom-input border-none h-10">
            <SelectValue placeholder={t("listOfOrders.city")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kazan">{t("listOfOrders.kazan")}</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="profession">
          <SelectTrigger className="custom-input border-none h-10">
            <SelectValue placeholder={t("listOfOrders.profession")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profession">
              {t("listOfOrders.everythingIsProfession")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="partners">
          <SelectTrigger className="custom-input border-none h-10">
            <SelectValue placeholder={t("listOfOrders.partners")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="partners">
              {t("listOfOrders.partners")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="custom-input border-none h-10">
            <SelectValue placeholder={t("listOfOrders.paymentMethod")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("listOfOrders.allPaymentMethods")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="custom-input border-none h-10">
            <SelectValue placeholder={t("listOfOrders.allSources")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("listOfOrders.allSources")}</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="custom-input border-none h-10">
            <SelectValue placeholder={t("listOfOrders.allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("listOfOrders.allStatuses")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-6 items-center">
        <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{t("listOfOrders.today")}</span>
        </Button>
        <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{t("listOfOrders.yesterday")}</span>
        </Button>
        <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{t("listOfOrders.june")}</span>
        </Button>
        <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{t("listOfOrders.period")}</span>
        </Button>

        <Input
          type="date"
          className="bg-[#1E1E1E] border-none text-white"
          defaultValue="2023-07-08"
        />
        <Input
          type="date"
          className="bg-[#1E1E1E] border-none text-white"
          defaultValue="2023-07-10"
        />
        <Button className="ml-auto bg-[#121212] hover:bg-[#888]">
          {t("listOfOrders.show")}
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder={t("listOfOrders.orderNumber")}
          className="bg-[#121212] hover:bg-[#888] border-none"
        />
        <Input
          placeholder={t("listOfOrders.driverOrCarCallSign")}
          className="bg-[#121212] hover:bg-[#888] border-none"
        />
        <Button
          variant="outline"
          className="bg-[#121212] hover:bg-[#888] border-none"
        >
          {t("listOfOrders.show")}
        </Button>
        <Button
          variant="outline"
          className="border-none bg-[#121212] hover:bg-[#888]"
        >
          {t("listOfOrders.createFileInQueue")}
        </Button>
      </div>

      <Table>
        <TableHeader className="border-none">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead>{t("listOfOrders.number")}</TableHead>
            <TableHead>{t("listOfOrders.address")}</TableHead>
            <TableHead>{t("listOfOrders.status")}</TableHead>
            <TableHead>{t("listOfOrders.executor")}</TableHead>
            <TableHead>{t("listOfOrders.rate")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-neutral-800">
              <TableCell className="text-slate-300">
                {order.id}
                <div className="text-sm text-slate-400">
                  {t("listOfOrders.on")} {order.date}
                  <br />
                  {order.time}
                </div>
                <div className="text-sm text-slate-400 mt-2">
                  {t("listOfOrders.dispatcher")}
                  <br />
                  {order.dispatcher}
                </div>
                <div className="text-sm text-slate-400 mt-2">
                  {t("listOfOrders.fromTheClient")}
                  <br />
                  {order.client}
                </div>
              </TableCell>
              <TableCell className="text-slate-300">
                {order.location.city},
                <br />
                {order.location.address}
                <br />
                {order.location.area}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status.type === "completed"
                      ? "destructive"
                      : "default"
                  }
                  className="bg-green-900/50 text-green-400 hover:bg-green-900/50"
                >
                  {order.status.text}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-300">
                {order.executor.name}
                <br />
                {order.executor.vehicle}
                <br />
                {order.executor.plate}
              </TableCell>
              <TableCell className="text-slate-300">
                {order.business.type}
                <br />
                {order.business.amount}
                <br />
                {order.business.distance}
                <br />
                {order.business.duration}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center bg-black rounded-full p-4 mt-4">
        <span className="text-white text-lg">{t("listOfOrders.total")}</span>
        <span className="text-white text-lg">4122.3 ₽</span>
      </div>
    </div>
  );
};

export default ListOfOrders;
