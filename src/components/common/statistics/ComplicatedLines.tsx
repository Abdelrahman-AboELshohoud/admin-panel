import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  ChartTimeframe,
  DriverRegistrationsGQL,
  RiderRegistrationsGQL,
} from "../../../graphql/requests";
import { Suspense, useEffect, useState } from "react";
import { periodCalculating } from "./periodCalculating";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

// Fake data for testing
// const fakeData = [
//   { time: new Date().getTime(), count: 20 },
//   { time: new Date().getTime() - 86400000, count: 25 },
//   { time: new Date().getTime() - 2 * 86400000, count: 15 },
//   { time: new Date().getTime() - 3 * 86400000, count: 22 },
//   { time: new Date().getTime() - 4 * 86400000, count: 18 },
//   { time: new Date().getTime() - 5 * 86400000, count: 30 },
// ];
// const fakeData2 = [
//   { time: new Date().getTime(), count: 10 },
//   { time: new Date().getTime() - 86400000, count: 15 },
//   { time: new Date().getTime() - 2 * 86400000, count: 10 },
//   { time: new Date().getTime() - 3 * 86400000, count: 12 },
//   { time: new Date().getTime() - 4 * 86400000, count: 10 },
//   { time: new Date().getTime() - 5 * 86400000, count: 10 },
// ];

interface ComplicatedLinesProps {
  getBy: ChartTimeframe;
}

export default function ComplicatedLines({ getBy }: ComplicatedLinesProps) {
  const [driverPeriods, setDriverPeriods] = useState<string[]>([]);
  const [riderPeriods, setRiderPeriods] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [totals, setTotals] = useState({
    driver: 0,
    rider: 0,
  });

  const timeCalculating = periodCalculating(getBy);

  const totalCalc = (data: any) => {
    const total = data?.reduce((acc: any, item: any) => {
      return acc + item.count;
    }, 0);
    console.log(total);
    return total;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driverRes, riderRes, labelsRes, periodsRes]: any =
          await Promise.all([
            DriverRegistrationsGQL({ timeframe: getBy }),
            RiderRegistrationsGQL({ timeframe: getBy }),
            timeCalculating.labels,
            timeCalculating.periods,
          ]);
        console.log(driverRes, riderRes, labelsRes, periodsRes);
        setLabels(labelsRes);
        const driversRegistrations = driverRes?.data?.driverRegistrations;
        const ridersRegistrations = riderRes?.data?.riderRegistrations;
        const totalDriver = totalCalc(driversRegistrations);
        const totalRider = totalCalc(ridersRegistrations);
        const riderPeriods = periodsRes.map((label: any) =>
          getDataPoints(ridersRegistrations, label)
        );
        if (driversRegistrations) {
          console.log("driversRegistrations", driversRegistrations);
          const driverPeriods = periodsRes.map((label: any) => {
            return getDataPoints(driversRegistrations, label);
          });

          setTotals((prev: any) => ({
            ...prev,
            driver: totalDriver,
          }));
          setDriverPeriods(driverPeriods);
        }
        if (ridersRegistrations) {
          console.log("ridersRegistrations", ridersRegistrations);
          setTotals((prev: any) => ({
            ...prev,
            rider: totalRider,
          }));
          setRiderPeriods(riderPeriods);
        }
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };
    fetchData();
  }, [getBy]);

  const getDataPoints = (sourceData: any, label: string) => {
    const dataPoint = sourceData?.find((data: any) => {
      console.log(parseInt(data.time));
      const date = new Date(parseInt(data?.time));
      console.log(date);
      let timeLabel = "";
      switch (getBy) {
        case ChartTimeframe.Daily:
          timeLabel = moment(date).format("HH");
          break;
        case ChartTimeframe.Weekly:
          console.log(moment(date).format("ddd DD"), label);
          timeLabel = moment(date).format("ddd DD");
          break;
        case ChartTimeframe.Monthly:
          timeLabel = moment(date).format("ddd DD");
          break;
      }
      console.log(label, timeLabel);
      return label === timeLabel;
    });
    return dataPoint?.count || 0;
  };

  let data = {
    labels: labels || [],
    datasets: [
      {
        label: "Driver Registrations",
        data: driverPeriods || [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 3,
        yAxisID: "y1",
      },
      {
        label: "Rider Registrations",
        data: riderPeriods,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 3,
        yAxisID: "y2",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: [
          `Total Registrations for drivers: ${totals.driver}`,
          "",
          `Total Registrations for riders: ${totals.rider}`,
        ],
        align: "start" as const,
        color: "#121212",
        font: {
          size: 12,
          weight: "bold" as const,
        },
        padding: {
          bottom: 30,
          left: 30,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        ticks: {
          color: "#9ca3af",
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        ticks: {
          color: "#9ca3af",
          stepSize: 10,
        },
        min: 0,
        max: 100,
      },
      y2: {
        type: "linear" as const,
        display: false,
        position: "right" as const,
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
          drawOnChartArea: false,
        },
        ticks: {
          color: "#9ca3af",
          stepSize: 10,
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <Suspense>
      <Line data={data} options={options} />
    </Suspense>
  );
}
