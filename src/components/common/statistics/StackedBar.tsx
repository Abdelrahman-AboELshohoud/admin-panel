import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartTimeframe, RequestsChartGQL } from "../../../graphql/requests";
import { Suspense, useEffect, useState } from "react";
import { periodCalculating } from "./periodCalculating";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Fake data structure matching the API response
const fakeData = [
  { time: new Date().getTime(), sum: 100, count: 20 },
  { time: new Date().getTime() - 86400000, sum: 150, count: 25 },
  { time: new Date().getTime() - 2 * 86400000, sum: 80, count: 15 },
  { time: new Date().getTime() - 3 * 86400000, sum: 120, count: 22 },
  { time: new Date().getTime() - 4 * 86400000, sum: 90, count: 18 },
  { time: new Date().getTime() - 5 * 86400000, sum: 160, count: 30 },
];

interface StackedBarProps {
  getBy: ChartTimeframe;
}

export default function StackedBar({ getBy }: StackedBarProps) {
  const [apiData, setApiData] = useState<typeof fakeData>(fakeData);

  const fetchOrdersFunction = async () => {
    const res = await RequestsChartGQL({ timeframe: getBy });
    setApiData(res.data.requestChart);
  };

  const timeCalculating = periodCalculating(getBy);
  const labels = timeCalculating.labels;
  const periods = timeCalculating.periods;

  const data = {
    labels,
    datasets: [
      {
        label: "Orders Count",
        data: periods.map((label) => {
          const dataPoint = apiData?.find((data) => {
            const date = new Date(data.time);
            let timeLabel = "";
            switch (getBy) {
              case ChartTimeframe.Daily:
                timeLabel = moment(date).format("HH");
                break;
              case ChartTimeframe.Weekly:
                timeLabel = moment(date).format("ddd DD");
                break;
              case ChartTimeframe.Monthly:
                timeLabel = moment(date).format("ddd DD");
                break;
            }
            return label === timeLabel;
          });
          return dataPoint ? dataPoint.count : 0;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
      },
      {
        label: "Success Rate %",
        data: periods.map((label) => {
          const dataPoint = apiData?.find((data) => {
            const date = new Date(data.time);
            let timeLabel = "";
            switch (getBy) {
              case ChartTimeframe.Daily:
                timeLabel = moment(date).format("HH");
                break;
              case ChartTimeframe.Weekly:
                timeLabel = moment(date).format("ddd DD");
                break;
              case ChartTimeframe.Monthly:
                timeLabel = moment(date).format("ddd DD");
                break;
            }
            return label === timeLabel;
          });
          return dataPoint && dataPoint.sum > 0
            ? Math.round((dataPoint.count / dataPoint.sum) * 100)
            : 0;
        }),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: [
          "Orders Overview",
          `Total: ${apiData?.reduce((acc, data) => acc + data.count, 0) || 0}`,
        ],
        align: "start" as const,
        color: "#121212",
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: {
          bottom: 20,
          left: 30,
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value}${context.datasetIndex === 1 ? "%" : ""}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        ticks: {
          color: "#9ca3af",
          autoSkip: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        ticks: {
          color: "#9ca3af",
          callback: function (value: any): any {
            return `${value}${
              this.chart.getDatasetMeta(1) ===
              this.chart.getDatasetMeta(this.datasetIndex)
                ? "%"
                : ""
            }`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    fetchOrdersFunction();
  }, [getBy]);

  return (
    <Suspense>
      <div style={{ height: "400px", width: "100%" }}>
        <Bar data={data} options={options} />
      </div>
    </Suspense>
  );
}
