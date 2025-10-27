import { Visit } from "@/shared/types";

export const getHourlyVisitDensity = (visits: Visit[]) => {
  const hourLabels = Array.from({ length: 24 }, (_, i) => {
    const hour = (i + 6) % 24;
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = (hour % 12 || 12) + ampm;
    return formattedHour;
  });

  const hourData: Record<string, number> = {};
  hourLabels.forEach((label) => (hourData[label] = 0));

  visits.forEach((visit) => {
    const date = new Date(visit.createdAt);
    let hour = date.getHours();
    // Adjust to 6AM–6AM cycle
    hour = (hour - 6 + 24) % 24;
    const adjustedHour = (hour + 6) % 24;
    const label =
      (adjustedHour % 12 || 12) + (adjustedHour >= 12 ? "PM" : "AM");
    hourData[label]++;
  });

  return hourData;
};

export const baseOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" } as const,
  },
};
