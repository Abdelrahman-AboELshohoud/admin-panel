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
import ByTheClock from "./ByTheClock";
import ListOfOrders from "./ListOfOrders";
import MyTable from "../../components/common/table-components/MyTable";
import MyTabs from "../../components/common/MyTabs";

const Orders = () => {
  const { t } = useTranslation();

  const tabs = [
    { title: t("ordersReports.tabs.statistics"), value: "statistics" },
    { title: t("ordersReports.tabs.byTheClock"), value: "by-the-clock" },
    { title: t("ordersReports.tabs.listOfOrders"), value: "list-of-orders" },
  ];

  const StatisticsContent = () => (
    <>
      <div className="grid grid-cols-6 gap-4 mb-6">
        <Select>
          <SelectTrigger className="w-full col-span-2 bg-[#1E1E1E] border-none custom-input h-10 mb-2">
            <SelectValue placeholder={t("ordersReports.filters.city")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kazan">
              {t("ordersReports.filters.cityOption")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full col-span-2 bg-[#1E1E1E] border-none custom-input h-10 mb-2">
            <SelectValue
              placeholder={t("ordersReports.filters.allProfessions")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("ordersReports.filters.allProfessionsOption")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full col-span-2 bg-[#1E1E1E] border-none custom-input h-10 mb-2">
            <SelectValue
              placeholder={t("ordersReports.filters.allProfessions")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("ordersReports.filters.allProfessionsOption")}
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center col-span-5 gap-6">
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("ordersReports.filters.today")}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("ordersReports.filters.yesterday")}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("ordersReports.filters.june")}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("ordersReports.filters.period")}</span>
          </Button>
          <div className="flex justify-center gap-4">
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
          </div>
        </div>

        <div className="col-span-1 flex justify-end">
          <Button className="bg-black text-white hover:bg-black/90 px-8">
            {t("ordersReports.filters.show")}
          </Button>
        </div>
      </div>

      <div className="bg-[#1C1C1E] rounded-xl">
        <MyTable
          headers={[
            t("ordersReports.table.status"),
            t("ordersReports.table.total"),
            t("ordersReports.table.amount"),
            t("ordersReports.table.quantity"),
            t("ordersReports.table.drivers"),
          ]}
          rows={orders.map((order) => ({
            id: order.id.toString(),
            data: [
              <span
                className={
                  order.status === "specialAndCancelled" ? "text-red-500" : ""
                }
              >
                {t(`ordersReports.statuses.${order.status}`)}
              </span>,
              order.total,
              order.amount,
              order.quantity,
              order.drivers,
            ],
          }))}
        />
      </div>
    </>
  );

  const tabsContent = [
    { value: "statistics", content: <StatisticsContent /> },
    { value: "by-the-clock", content: <ByTheClock /> },
    { value: "list-of-orders", content: <ListOfOrders /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl text-white mb-4">{t("ordersReports.title")}</h1>

      <MyTabs tabs={tabs} tabsContent={tabsContent} setActiveTab={() => {}} />
    </div>
  );
};

const orders = [
  {
    id: 1,
    status: "created",
    total: "2",
    amount: "100%",
    quantity: ".",
    drivers: "2",
  },
  {
    id: 2,
    status: "preliminary",
    total: "0",
    amount: "0%",
    quantity: ".",
    drivers: "0",
  },
  {
    id: 3,
    status: "done",
    total: "2",
    amount: "100%",
    quantity: "4,122.3 Point",
    drivers: "2",
  },
  {
    id: 4,
    status: "specialAndCancelled",
    total: "0",
    amount: "0%",
    quantity: ".",
    drivers: "0",
  },
];

export default Orders;
