import { useEffect, useState } from "react";
import { ChartTimeframe, RequestsChartGQL } from "../graphql/requests";
import { useTranslation } from "react-i18next";
import StackedBar from "../components/common/statistics/StackedBar";
import Lines from "../components/common/statistics/Lines";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import ComplicatedLines from "../components/common/statistics/ComplicatedLines";

export default function Main() {
  const { t } = useTranslation();
  const [getBy, setGetBy] = useState<ChartTimeframe>(ChartTimeframe.Daily);
  const [requestsCount, setRequestsCount] = useState();

  const func = async () => {
    const res = await RequestsChartGQL({ timeframe: getBy });
    console.log(res.data.requestChart);
    setRequestsCount(res.data.requestChart);
    return res;
  };

  useEffect(() => {
    func();
  }, []);

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
                  <div className="border-b border-black  pb-3">
                    5 {t("main.online")}
                  </div>

                  <div className="border-b border-black pb-3">
                    1 {t("main.onOrder")}
                  </div>
                  <div className="border-b border-black pb-3">
                    4 {t("main.free")}
                  </div>
                  <div>2 {t("main.onPause")}</div>
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
            <div className="flex gap-3 items-stretch h-[250px]">
              <div className="w-1/2 aspect-[9/4] bg-gray-200 rounded-lg p-4">
                <Lines getBy={getBy} />
              </div>
              <div className="w-1/2 aspect-[9/4] bg-gray-200 rounded-lg p-4">
                <Lines getBy={getBy} />
              </div>
            </div>
            <div className="flex gap-3 items-stretch h-[250px]">
              <div className="w-1/2 aspect-[9/4] bg-gray-200 rounded-lg p-4">
                <Lines getBy={getBy} />
              </div>
              <div className="w-1/2 aspect-[9/4] bg-gray-200 rounded-lg p-4">
                <Lines getBy={getBy} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
