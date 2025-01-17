export const timeFormate = (date: Date | number) =>
  new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
  });

export const dailyTimeFormate = (date: Date | number) =>
  new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
  });
