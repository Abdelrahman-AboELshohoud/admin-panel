import { Button } from "../../ui/button";
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

const Performers = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl text-white mb-6">Performers</h1>

      {/* Navigation */}
      <div className="flex gap-6 text-gray-400 mb-6">
        <button className="hover:text-white">Orders</button>
        <button className="hover:text-white">Change</button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Select>
          <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
            <SelectValue placeholder="Kazan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kazan">Kazan</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
            <SelectValue placeholder="Everything is a profession" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Everything is a profession</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
            <SelectValue placeholder="All classes of cars" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes of cars</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full bg-[#1E1E1E] border-none">
            <SelectValue placeholder="Partners" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="partners">Partners</SelectItem>
          </SelectContent>
        </Select>
      </div>


      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-[#B89962] text-black hover:bg-[#B89962]/90"
          >
            Today
          </Button>
          <Button variant="outline" className="bg-[#1E1E1E] border-none">
            Yesterday
          </Button>
          <Button variant="outline" className="bg-[#1E1E1E] border-none">
            June
          </Button>
          <Button variant="outline" className="bg-[#1E1E1E] border-none">
            Period
          </Button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value="08.07.2023"
            className="bg-[#1E1E1E] border-none rounded-md px-3 py-2 text-white"
          />
          <input
            type="text"
            value="10.07.2023"
            className="bg-[#1E1E1E] border-none rounded-md px-3 py-2 text-white"
          />
        </div>

        <Button className="bg-black text-white hover:bg-black/90 px-8">
          Show
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            {[
              "Executor",
              "Total orders",
              "Number of paid",
              "The amount paid",
              "Quantity unpaid",
              "The amount unpaid",
              "Quantity cancelled",
              "Effectiveness",
            ].map((performer) => (
              <TableHead className="text-gray-400">{performer}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {performers.map((performer) => (
            <TableRow
              key={performer.id}
              className="border-none hover:bg-[#2F2F2F]"
            >
              <TableCell>
                <div>
                  <div className="font-medium">{performer.id}</div>
                  <div className="text-sm text-gray-400">{performer.name}</div>
                </div>
              </TableCell>
              <TableCell>{performer.totalOrders}</TableCell>
              <TableCell>{performer.numberPaid}</TableCell>
              <TableCell>{performer.amountPaid} ₽</TableCell>
              <TableCell>{performer.quantityUnpaid}</TableCell>
              <TableCell>{performer.amountUnpaid} ₽</TableCell>
              <TableCell>{performer.quantityCancelled}</TableCell>
              <TableCell>{performer.effectiveness}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Total */}
      <div className="flex justify-between items-center bg-black rounded-lg p-4 mt-4">
        <span className="text-white text-lg">Total</span>
        <span className="text-white text-lg">0 ₽</span>
      </div>
    </div>
  );
};

// Sample data
const performers = [
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
  // Add more performers as needed
];

export default Performers;
