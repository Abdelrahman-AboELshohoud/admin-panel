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
import { periodCalculating } from "./periodCalculating";
import { ChartTimeframe } from "../../../graphql/requests";
import { Suspense } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StackedBar({
  getBy,
  apiData,
}: {
  getBy: ChartTimeframe;
  apiData?: any;
}) {
  const calculateMetrics = (apiData: any) => {
    if (!apiData) return null;

    const times = apiData.map((item: any) => item.time);
    const sums = apiData.map((item: any) => item.sum);
    const counts = apiData.map((item: any) => item.count);

    const percentages = counts.map((count: number, i: number) => {
      return sums[i] > 0 ? (count / sums[i]) * 100 : 0;
    });

    return {
      times,
      sums,
      counts,
      percentages,
    };
  };

  const metrics = calculateMetrics(apiData);
  const labels = periodCalculating(getBy).labels;
  console.log(labels);
  const data = {
    labels,
    datasets: [
      {
        backgroundColor: "rgba(255,99,132)",
        data: metrics?.counts || [65, 59, 80, 81, 56, 55, 40, 20],
      },
      {
        backgroundColor: "rgba(54, 162, 235)",
        data: metrics?.percentages || [28, 48, 40, 19, 86, 27, 90, 20],
      },
    ],
  };

  const totalOrders =
    metrics?.counts.reduce((a: number, b: number) => a + b, 0) || 0;

  const options = {
    plugins: {
      title: {
        display: true,
        text: [" Orders", `  ${totalOrders}`],
        align: "start" as const,
        color: "#353535",
        font: {
          size: 16,
          weight: 700,
        },
        padding: {
          bottom: 15,
        },
      },
      legend: {
        display: false,
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
    responsive: true,
  };

  return (
    <Suspense>
      <Bar data={data} options={options} />
    </Suspense>
  );
}
