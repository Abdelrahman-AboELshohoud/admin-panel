import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartTimeframe } from "../../../graphql/requests";
import { Suspense } from "react";
import { periodCalculating } from "./periodCalculating";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Lines({
  getBy,
  apiData,
}: {
  getBy: ChartTimeframe;
  apiData?: Array<{
    count: number;
    time: number;
  }>;
}) {
  const res = periodCalculating(getBy);
  const labels = res.labels;
  const periods = res.periods;

  console.log(apiData);
  const data = {
    labels,
    datasets: [
      {
        label: "Orders",
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
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        pointRadius: 0,
        pointHoverRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: [
          " Opening hours",
          ` ${apiData?.reduce((acc, data) => acc + data.count, 0) || 0}`,
        ],
        align: "start" as const,
        color: "#353535",
        font: {
          size: 16,
          weight: 700,
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
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return periods[index];
          },
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
        grid: {
          offset: true,
        },
      },
      y: {
        ticks: {
          stepSize: 2,
          maxTicksLimit: 20,
        },
        min: 0,
        max: 300,
        suggestedMax: 200,
        stacked: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Suspense>
      <Line data={data} options={options} />
    </Suspense>
  );
}
