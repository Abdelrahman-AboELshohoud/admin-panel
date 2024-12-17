import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface Transaction {
  date: string;
  time?: string;
  operation: string;
  writedowns: string;
  entrance: string;
}

const Balance = () => {
  const currentBalance = "4 455,58 ₽";

  const transactions: Transaction[] = [
    {
      date: "30.06.2023",
      operation: "Balance on the balance sheet at the beginning of the period",
      writedowns: "",
      entrance: "-36.15 ₽",
    },
    {
      date: "07.07.2023",
      time: "12:07",
      operation: "Write-off Comment: Write-off of commission for order No.6212",
      writedowns: "155.1 ₽",
      entrance: "",
    },
    {
      date: "07.07.2023",
      time: "12:07",
      operation:
        "Crediting - Personal account Comment: Payment for the order by bank card No.6212",
      writedowns: "",
      entrance: "1,034 rubles",
    },
  ];

  return (
    <div className="space-y-6 p-6 ">
      <Card className="p-6 bg-neutral-800/50 border-none w-1/3 card-shape">
        <h3 className="text-slate-400 mb-4">Current balance</h3>
        <p className="text-4xl font-semibold text-white">{currentBalance}</p>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl text-slate-200">History</h3>

        <div className="flex gap-4 items-center">
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name="timeframe" value="week" className="text-primary accent-primary bg-gray-800 border-neutral-600" />
              <span className="text-slate-200">in a week</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="timeframe" value="period" className="text-primary accent-primary bg-gray-800 border-neutral-600" />
              <span className="text-slate-200">period</span>
            </label>
          </div>
          <Input
            type="date"
            className="w-40 bg-neutral-800/50"
            defaultValue="2023-07-05"
          />
          <Input
            type="date"
            className="w-40 bg-neutral-800/50"
            defaultValue="2023-07-07"
          />
          <Button className="ml-auto">Show</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date of the event</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead>Write-downs</TableHead>
              <TableHead>Entrance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index} className="h-16">
                <TableCell className="text-slate-300">
                  {transaction.date}
                  {transaction.time && (
                    <div className="text-sm text-slate-400">
                      {transaction.time}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-slate-300 w-1/3">
                  <span className="block truncate w-2/3">
                    {transaction.operation}
                  </span>
                </TableCell>
                <TableCell className="text-slate-300">
                  {transaction.writedowns}
                </TableCell>
                <TableCell className="text-slate-300">
                  {transaction.entrance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Balance;
