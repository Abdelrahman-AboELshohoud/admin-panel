import {
  DriverWalletsListGQL,
  DriverWalletsListQuery,
} from "../../graphql/requests";
import MyTable from "../../components/common/table-components/MyTable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Wallets() {
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

      <MyTable
        headers={[
          t("driversWallets.driver"),
          t("driversWallets.balance"),
          t("driversWallets.currency"),
        ]}
        rows={wallets.map((wallet) => ({
          id: wallet.id,
          data: [
            `${wallet.driver?.firstName} ${wallet.driver?.lastName}`,
            `${wallet.balance} ${wallet.currency}`,
            wallet.currency,
          ],
        }))}
      />
    </div>
  );
}
