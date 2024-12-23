import moment from "moment";

export const getDaysInMonth = () => {
  const now = new Date();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const checkpoints = 7;
  const interval = Math.floor(daysInMonth / (checkpoints - 1));

  const dates = [];
  const periods = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), i);
    periods.push(
      moment().date(date.getDate()).format("ddd") + " " + date.getDate()
    );
  }

  for (let i = 1; i <= daysInMonth; i += interval) {
    const date = new Date(now.getFullYear(), now.getMonth(), i);
    dates.push(date.getDate());

    if (i + interval <= daysInMonth && dates.length < checkpoints * 5 - 1) {
      const emptySlots = interval - 1;
      for (let j = 0; j < emptySlots; j++) {
        dates.push("");
      }
    }
  }
  if (dates[dates.length - 1] !== daysInMonth) {
    dates[dates.length - 1] = daysInMonth;
  }
  const datesAfterEdit = dates.map((day) => {
    if (typeof day === "string") {
      return "";
    } else {
      return moment().date(day).format("ddd") + " " + day;
    }
  });
  return { labels: datesAfterEdit, periods };
};

export const getDaysInWeek = () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(
    now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
  );

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }
  const week = dates.map((date) => moment(date).format("ddd DD"));

  return { labels: week, periods: week };
};

export const getHoursInDay = () => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const hours = [];
  const periods = [];
  for (let i = 0; i <= 24; i += 1) {
    periods.push(i < 9 ? "0" + i : i + "");
    if (i === 23) {
      hours.push("23");
      hours.push("");
      break;
    } else if (i % 4 === 0) {
      hours.push(i < 9 ? "0" + i : i + "");
    } else {
      hours.push("");
    }
  }
  return { labels: hours, periods };
};
