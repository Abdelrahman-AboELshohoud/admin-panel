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
import { Badge } from "../../ui/badge";

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
        text: "Completed",
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
        {[
          { label: "City", defaultValue: "kazan", options: [{ value: "kazan", label: "Kazan" }] },
          { label: "Profession", defaultValue: "profession", options: [{ value: "profession", label: "Everything is a profession" }] },
          { label: "Partners", defaultValue: "partners", options: [{ value: "partners", label: "Partners" }] },
          { label: "Payment method", defaultValue: "all", options: [{ value: "all", label: "All payment methods" }] },
          { label: "All sources", defaultValue: "all", options: [{ value: "all", label: "All sources" }] },
          { label: "All statuses", options: [{ value: "all", label: "All statuses" }] }
        ].map(({ label, defaultValue, options }) => (
          <Select key={label} defaultValue={defaultValue}>
            <SelectTrigger className="custom-input border-none h-10">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      <div className="flex gap-6 items-center">
      {['Today', 'Yesterday', 'June', 'Period'].map((text) => (
        <Button key={text}  className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
          <span>{text}</span>
        </Button>
      ))}

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
        <Button className="ml-auto bg-[#121212] hover:bg-[#888]">Show</Button>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Order number" className="bg-[#121212] hover:bg-[#888] border-none" />
        <Input
          placeholder="The driver's or car's call sign"
          className="bg-[#121212] hover:bg-[#888] border-none"
        />
        <Button variant="outline" className="bg-[#121212] hover:bg-[#888] border-none">
          Show
        </Button>
        <Button variant="outline" className="border-none bg-[#121212] hover:bg-[#888]">
          Create a file in the queue
        </Button>
      </div>

      <Table>
        <TableHeader  className="border-none">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead>№</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Executor</TableHead>
            <TableHead>Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-neutral-800">
              <TableCell className="text-slate-300">
                {order.id}
                <div className="text-sm text-slate-400">
                  on {order.date}
                  <br />
                  {order.time}
                </div>
                <div className="text-sm text-slate-400 mt-2">
                  Dispatcher
                  <br />
                  {order.dispatcher}
                </div>
                <div className="text-sm text-slate-400 mt-2">
                  From the client
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
                    order.status.type === "completed" ? "destructive" : "default"
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
        <span className="text-white text-lg">Total</span>
        <span className="text-white text-lg">4122.3 ₽</span>
      </div>
    </div>
  );
};

export default ListOfOrders;
