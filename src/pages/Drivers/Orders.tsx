import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { t } from "i18next";
import {
  Driver,
  DriverOrdersQuery,
  DriverOrdersQueryVariables,
  OrderStatus,
} from "../../graphql/requests";
import { DriverOrdersGQL } from "../../graphql/requests";
import { useNavigate } from "react-router-dom";

export default function Orders({ driverProfile }: { driverProfile: Driver }) {
  const [orders, setOrders] = useState<
    DriverOrdersQuery["driver"]["orders"]["nodes"]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (driverProfile?.id) {
        const variables: DriverOrdersQueryVariables = {
          driverId: driverProfile.id,
        };
        const response = await DriverOrdersGQL(variables);
        console.log(response);
        if (response?.data?.driver?.orders?.nodes) {
          setOrders([
            {
              id: "1",
              createdOn: new Date().toISOString(),
              status: OrderStatus.Finished,
              distanceBest: 12.5,
              durationBest: 25,
              costBest: 50,
              costAfterCoupon: 45,
              currency: "USD",
              addresses: ["123 Main St", "456 Market St"],
              points: [{ lat: 37.7749, lng: -122.4194 }],
              expectedTimestamp: new Date().toISOString(),
            },
            {
              id: "2",
              createdOn: new Date().toISOString(),
              status: OrderStatus.Started,
              distanceBest: 8.3,
              durationBest: 15,
              costBest: 35,
              costAfterCoupon: 35,
              currency: "USD",
              addresses: ["789 Oak Ave", "321 Pine St"],
              points: [{ lat: 37.7833, lng: -122.4167 }],
              expectedTimestamp: new Date().toISOString(),
            },
          ]);
        }
      }
    };
    fetchOrders();
  }, [driverProfile]);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-semibold text-gray-400">
            {t("driversOrders.noOrders")}
          </h3>
          <p className="text-gray-500 max-w-md">
            {t("driversOrders.noOrdersDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>{t("driversOrders.inputs.createdOn")}</TableHead>
            <TableHead>{t("driversOrders.inputs.status")}</TableHead>
            <TableHead>{t("driversOrders.inputs.distance")}</TableHead>
            <TableHead>{t("driversOrders.inputs.duration")}</TableHead>
            <TableHead>{t("driversOrders.inputs.cost")}</TableHead>
            <TableHead>{t("driversOrders.inputs.finalCost")}</TableHead>
            <TableHead>{t("driversOrders.inputs.currency")}</TableHead>
            <TableHead>{t("driversOrders.inputs.addresses")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders &&
            orders.length > 0 &&
            orders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-gray-200"
                onClick={() => {
                navigate(`/control-panel/orders/${order.id}`);
              }}
            >
              <TableCell>
                {new Date(order.createdOn).toLocaleString()}
              </TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.distanceBest}</TableCell>
              <TableCell>{order.durationBest}</TableCell>
              <TableCell>{order.costBest}</TableCell>
              <TableCell>{order.costAfterCoupon}</TableCell>
              <TableCell>{order.currency}</TableCell>
              <TableCell>{order.addresses.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
