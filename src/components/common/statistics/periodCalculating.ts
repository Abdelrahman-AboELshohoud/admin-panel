import { ChartTimeframe } from "../../../graphql/requests";

import { getHoursInDay, getDaysInWeek, getDaysInMonth } from "./timesFunctions";

export const periodCalculating = (getBy: ChartTimeframe) => {
  let labels;
  let periods;
  let res;
  switch (getBy) {
    case ChartTimeframe.Daily:
      res = getHoursInDay();
      labels = res.labels;
      periods = res.periods;
      break;
    case ChartTimeframe.Weekly:
      res = getDaysInWeek();
      labels = res.labels;
      periods = res.periods;
      break;
    case ChartTimeframe.Monthly:
      res = getDaysInMonth();
      labels = res.labels;
      periods = res.periods;
      break;
    default:
      res = getHoursInDay();
      labels = res.labels;
      periods = res.periods;
      break;
  }
  return { labels, periods };
};
