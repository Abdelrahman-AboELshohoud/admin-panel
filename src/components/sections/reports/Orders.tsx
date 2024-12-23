import { useTranslation } from 'react-i18next';
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import ByTheClock from "./ByTheClock";
import ListOfOrders from "./ListOfOrders";

const Orders = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl text-white mb-4">{t('ordersReports.title')}</h1>

      <Tabs defaultValue="statistics" className="space-y-6">
        <TabsList className="bg-transparent border-b border-gray-800 w-full justify-start gap-6 h-auto pb-4">
          <TabsTrigger value="statistics" className="custom-tabs select-none">
            {t('ordersReports.tabs.statistics')}
          </TabsTrigger>
          <TabsTrigger value="by-the-clock" className="custom-tabs select-none">
            {t('ordersReports.tabs.byTheClock')}
          </TabsTrigger>
          <TabsTrigger value="list-of-orders" className="custom-tabs select-none">
            {t('ordersReports.tabs.listOfOrders')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="statistics">
          <div className="grid grid-cols-6 gap-4 mb-6">
            <Select>
              <SelectTrigger className="w-full col-span-2 bg-[#1E1E1E] border-none custom-input h-10 mb-2">
                <SelectValue placeholder={t('ordersReports.filters.city')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kazan">{t('ordersReports.filters.cityOption')}</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full col-span-2 bg-[#1E1E1E] border-none custom-input h-10 mb-2">
                <SelectValue placeholder={t('ordersReports.filters.allProfessions')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('ordersReports.filters.allProfessionsOption')}</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full col-span-2 bg-[#1E1E1E] border-none custom-input h-10 mb-2">
                <SelectValue placeholder={t('ordersReports.filters.allProfessions')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('ordersReports.filters.allProfessionsOption')}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center col-span-5 gap-6">
              <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
                <span>{t('ordersReports.filters.today')}</span>
              </Button>
              <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
                <span>{t('ordersReports.filters.yesterday')}</span>
              </Button>
              <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
                <span>{t('ordersReports.filters.june')}</span>
              </Button>
              <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
                <span>{t('ordersReports.filters.period')}</span>
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
                {t('ordersReports.filters.show')}
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-gray-400">{t('ordersReports.table.status')}</TableHead>
                <TableHead className="text-gray-400">{t('ordersReports.table.total')}</TableHead>
                <TableHead className="text-gray-400">{t('ordersReports.table.amount')}</TableHead>
                <TableHead className="text-gray-400">{t('ordersReports.table.quantity')}</TableHead>
                <TableHead className="text-gray-400">{t('ordersReports.table.drivers')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="bg-[#282828] border-none mb-2 hover:bg-[#2F2F2F]"
                >
                  <TableCell
                    className={
                      order.status === t('ordersReports.statuses.specialAndCancelled')
                        ? "text-red-500"
                        : ""
                    }
                  >
                    {t(`ordersReports.statuses.${order.status}`)}
                  </TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.drivers}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="by-the-clock"><ByTheClock /></TabsContent>
        <TabsContent value="list-of-orders"><ListOfOrders/></TabsContent>
      </Tabs>
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
