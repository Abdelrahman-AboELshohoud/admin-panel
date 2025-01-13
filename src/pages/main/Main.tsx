import { useEffect, useState } from "react";
import {
  ChartTimeframe,
  RequestsChartGQL,
  OverviewGQL,
  DriverLocationFragment,
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
                <p className="font-bold text-xl">{t("drivers.title")}</p>
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
    </div>
  );
}
