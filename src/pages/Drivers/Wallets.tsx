import {
  Driver,
  DriverWalletsListGQL,
  DriverWalletsListQuery,
} from "../../graphql/requests";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Wallets({ driverProfile }: { driverProfile: Driver }) {
  const { t } = useTranslation();
  const [wallets, setWallets] = useState<
    DriverWalletsListQuery["driverWallets"]["nodes"]
  >([]);

  useEffect(() => {
    const fetchWallets = async () => {
      const res = await DriverWalletsListGQL({
        paging: {
          limit: 50,
        },
      });
      console.log(res);
      if (res.status) {
        setWallets(res.data.driverWallets.nodes);
      }
    };
    fetchWallets();
  }, []);

  if (wallets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-semibold text-gray-400">
            {t("driversWallets.noWallets")}
          </h3>
          <p className="text-gray-500 max-w-md">
            {t("driversWallets.noWalletsDescription")}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Driver Wallets</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Driver</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wallets?.map((wallet) => (
              <TableRow key={wallet.id}>
                <TableCell>
                  {wallet.driver?.firstName} {wallet.driver?.lastName}
                </TableCell>
                <TableCell>
                  {wallet.balance} {wallet.currency}
                </TableCell>
                <TableCell>{wallet.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
