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
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl text-white mb-4">Orders</h1>

      <Tabs defaultValue="statistics" className="space-y-6">
        <TabsList className="bg-transparent border-b border-gray-800 w-full justify-start gap-6 h-auto pb-4">
          {[
            { value: "statistics", label: "Statistics" },
            { value: "by-the-clock", label: "By the clock" },
            { value: "list-of-orders", label: "List of orders" }
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="custom-tabs select-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="statistics">


        {/* Filters */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[
            { placeholder: "Kazan", options: [{ value: "kazan", label: "Kazan" }] },
            { placeholder: "All professions", options: [{ value: "all", label: "All professions" }] },
            { placeholder: "All professions", options: [{ value: "all", label: "All professions" }] }
          ].map((select, index) => (
            <Select key={index}>
              <SelectTrigger className="w-full col-span-2 bg-[#1E1E1E] border-none custom-input h-10 mb-2">
                <SelectValue placeholder={select.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {select.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          <div className="flex items-center col-span-5 gap-6">
          {['Today', 'Yesterday', 'June', 'Period'].map((text) => (
        <Button key={text}  className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{text}</span>
        </Button>
      ))}
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
              Show
            </Button>
          </div>
        </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Total</TableHead>
              <TableHead className="text-gray-400">For the amount of</TableHead>
              <TableHead className="text-gray-400">Quantity</TableHead>
              <TableHead className="text-gray-400">Drivers</TableHead>
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
                    order.status === "Special and Cancelled"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {order.status}
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
    status: "Created",
    total: "2",
    amount: "100%",
    quantity: ".",
    drivers: "2",
  },
  {
    id: 2,
    status: "Preliminary",
    total: "0",
    amount: "0%",
    quantity: ".",
    drivers: "0",
  },
  {
    id: 3,
    status: "Done",
    total: "2",
    amount: "100%",
    quantity: "4,122.3 Point",
    drivers: "2",
  },
  {
    id: 4,
    status: "Special and Cancelled",
    total: "0",
    amount: "0%",
    quantity: ".",
    drivers: "0",
  },
];

export default Orders;
