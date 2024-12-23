import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { DriverFinancialsGQL } from "../../graphql/requests";
import { Driver as DriverType } from "../../graphql/requests";
import { useEffect, useState } from "react";
import moment from "moment";

const Balance = ({ profile }: { profile: DriverType }) => {
  const [financialData, setFinancialData] = useState<any>([]);
  const getUserFinancialData = async () => {
    const res = await DriverFinancialsGQL({
      id: profile.id,
      paging: {
        offset: 0,
        limit: 10,
      },
    });
    console.log(res.data);
    setFinancialData(res.data);
  };
  useEffect(() => {
    getUserFinancialData();
  }, []);

  // const transactions: Transaction[] = [
  //   {
  //     date: "30.06.2023",
  //     operation: "Balance on the balance sheet at the beginning of the period",
  //     writedowns: "",
  //     entrance: "-36.15 ₽",
  //   },
  //   {
  //     date: "07.07.2023",
  //     time: "12:07",
  //     operation: "Write-off Comment: Write-off of commission for order No.6212",
  //     writedowns: "155.1 ₽",
  //     entrance: "",
  //   },
  //   {
  //     date: "07.07.2023",
  //     time: "12:07",
  //     operation:
  //       "Crediting - Personal account Comment: Payment for the order by bank card No.6212",
  //     writedowns: "",
  //     entrance: "1,034 rubles",
  //   },
  // ];

  return (
    <div className="space-y-6 p-6 ">
      <Card className="p-6 bg-neutral-800/50 border-none w-1/3 card-shape">
        <h3 className="text-slate-400 mb-4">Current balance</h3>
        <p className="text-4xl font-semibold text-white">
          {financialData?.driver?.wallets?.balance || 0}
        </p>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl text-slate-200">History</h3>

        <div className="flex gap-4 items-center">
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="timeframe"
                value="week"
                className="text-primary accent-primary bg-gray-800 border-neutral-600"
              />
              <span className="text-slate-200">in a week</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="timeframe"
                value="period"
                className="text-primary accent-primary bg-gray-800 border-neutral-600"
              />
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
            <TableRow className="hover:bg-transparent">
              <TableHead>Date of the event</TableHead>
              <TableHead>Deducted</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {financialData?.driver?.transactions?.nodes?.length > 0 ? (
              financialData?.driver?.transactions?.nodes?.map(
                (transaction: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="text-slate-300">
                      {moment(transaction.createdAt).format("DD.MM.YYYY")}{" "}
                      <br />
                      {moment(transaction.createdAt).format("HH:mm A")}
                    </TableCell>
                    <TableCell className="text-slate-300 ">
                      <span className="block truncate w-2/3">
                        {transaction.deductType}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {transaction.currency}
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow className="h-32 w-full hover:bg-transparent">
                <TableCell colSpan={4} className="text-slate-300 text-center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Balance;
