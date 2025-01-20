import { useEffect, useState } from "react";
import {
  ChartTimeframe,
  RequestsChartGQL,
  OverviewGQL,
  DriverLocationFragment,
  Order,
  OrderStatus,
  DriverStatus,
} from "../../graphql/requests";
import { useTranslation } from "react-i18next";
import StackedBar from "../../components/common/statistics/StackedBar";
import Lines from "../../components/common/statistics/Lines";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ComplicatedLines from "../../components/common/statistics/ComplicatedLines";
import OverView from "./OverView";
import { toast } from "react-hot-toast";
import ViewOrderDialog from "../orders/ViewOrderDialog";
import { Button } from "../../components/ui/button";
import { Eye } from "lucide-react";

interface OverviewStats {
  complaints: number;
  activeOrders: number;
  bookedOrders: number;
  pendingDrivers: number;
  driversLocations: DriverLocationFragment[];
}

export default function Main() {
  const { t } = useTranslation();
  const [getBy, setGetBy] = useState<ChartTimeframe>(ChartTimeframe.Daily);
  const [_requestsCount, setRequestsCount] = useState();
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    complaints: 0,
    activeOrders: 0,
    bookedOrders: 0,
    pendingDrivers: 0,
    driversLocations: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const fetchRequestsData = async () => {
    try {
      const res = await RequestsChartGQL({ timeframe: getBy });
      setRequestsCount(res.data.requestChart);
    } catch (error) {
      console.error("Error fetching requests data:", error);
      toast.error(t("main.errors.fetchFailed"));
    }
  };

  const fetchOverviewStats = async () => {
    try {
      setLoading(true);
      const response = await OverviewGQL({});
      console.log(response.data);
      console.log({
        complaints: response.data.complaintAggregate[0].count.id,
        activeOrders: response.data.bookedOrders[0].count.id, // InProgress
        bookedOrders: response.data.activeOrders[0].count.id, // Booked
        pendingDrivers: response.data.driverAggregate[0].count.id,
      });

      if (response.data) {
        setOverviewStats({
          complaints: response.data.complaintAggregate[0].count.id,
          activeOrders: response.data.activeOrders[0].count.id, // InProgress
          bookedOrders: response.data.bookedOrders[0].count.id, // Booked
          pendingDrivers: response.data.driverAggregate[0].count.id,
          driversLocations: response.data.driverLocations,
        });
      }
    } catch (error) {
      console.error("Error fetching overview stats:", error);
      toast.error(t("main.errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      // Add your order fetch query here
      // const response = await GetOrderByIdGQL({ id: orderId });
      // if (response.data?.order) {
      //   setSelectedOrder(response.data.order);
      //   setShowOrderDialog(true);
      // }

      // For now, just open with mock data
      setSelectedOrder({
        id: orderId,
        status: OrderStatus.Finished,
        createdOn: new Date().toISOString(),
        addresses: ["123 Main St", "456 Oak Ave"],
        currency: "USD",
        costBest: 25.0,
        costAfterCoupon: 20.0,
        rider: {
          firstName: "John",
          lastName: "Doe",
          mobileNumber: "+1234567890",
        },
        driver: {
          firstName: "Jane",
          lastName: "Smith",
          mobileNumber: "+0987654321",
          status: DriverStatus.Online,
        },
      });
      setShowOrderDialog(true);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error(t("orders.errors.fetchFailed"));
    }
  };

  useEffect(() => {
    fetchRequestsData();
    fetchOverviewStats();
  }, [getBy]);

  return (
    <div className="h-full flex flex-col gap-5">
      <Tabs defaultValue={ChartTimeframe.Daily}>
        <TabsList className="bg-transparent">
          <TabsTrigger
            value={ChartTimeframe.Daily}
            onClick={() => setGetBy(ChartTimeframe.Daily)}
            className="custom-tabs"
          >
            {t("main.dateButtons.today")}
          </TabsTrigger>
          <TabsTrigger
            value={ChartTimeframe.Weekly}
            onClick={() => setGetBy(ChartTimeframe.Weekly)}
            className="custom-tabs"
          >
            {t("main.dateButtons.week")}
          </TabsTrigger>
          <TabsTrigger
            value={ChartTimeframe.Monthly}
            onClick={() => setGetBy(ChartTimeframe.Monthly)}
            className="custom-tabs"
          >
            {t("main.dateButtons.month")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={getBy}>
          <div className="w-full h-full flex flex-col gap-4">
            <div className="flex gap-3 items-stretch h-[250px]">
              <div className="w-1/4 flex flex-col gap-6 bg-gray-200 text-[#121212] rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-xl">{t("drivers.title")}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder("mock-order-id")}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {t("orders.view.latestOrder")}
                  </Button>
                </div>
                <div className="font-semibold flex flex-col gap-2">
                  <div className="border-b border-black pb-3">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      `${overviewStats.complaints} ${t("main.complaints")}`
                    )}
                  </div>

                  <div className="border-b border-black pb-3">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      `${overviewStats.activeOrders} ${t("main.activeOrders")}`
                    )}
                  </div>
                  <div className="border-b border-black pb-3">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      `${overviewStats.bookedOrders} ${t("main.bookedOrders")}`
                    )}
                  </div>
                  <div>
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      `${overviewStats.pendingDrivers} ${t(
                        "main.pendingDrivers"
                      )}`
                    )}
                  </div>
                </div>
              </div>
              <div className="w-1/4 aspect-[9/4] bg-gray-200 rounded-lg p-4">
                <ComplicatedLines getBy={getBy} />
              </div>
              <div className="w-1/4 aspect-[9/4] bg-gray-200 rounded-lg p-4">
                <Lines getBy={getBy} />
              </div>
              <div className="w-1/4 h-full flex flex-col text-sm font-semibold justify-stretch bg-gray-200 rounded-lg px-4 py-2 ">
                <StackedBar getBy={getBy} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <OverView
        locations={overviewStats.driversLocations}
        data={{
          listOfData: [],
          locations: [],
          page: 0,
          setPage: () => {},
          searchData: () => {},
        }}
      />
      <ViewOrderDialog
        isOpen={showOrderDialog}
        onOpenChange={setShowOrderDialog}
        order={selectedOrder}
      />
    </div>
  );
}
