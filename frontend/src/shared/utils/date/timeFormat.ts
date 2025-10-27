export const timeFormate = (date: Date | number | string) =>
  new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
  });

export const dateFormate = (date: Date | number | string) =>
  new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export const dailyTimeFormate = (date: Date | number | string) =>
  new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

export const monthlyTimeFormate = (date: Date | number | string) =>
  new Date(date).toLocaleTimeString("en-GB", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: true,
  });

export const yearlyTimeFormate = (date: Date | number | string) =>
  new Date(date).getFullYear();

export const monthAndYearTimeFormat = (date: Date | number | string) =>
  new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
  });
