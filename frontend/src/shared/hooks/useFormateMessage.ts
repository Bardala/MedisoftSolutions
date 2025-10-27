import { useIntl } from "react-intl";

// Custom hook to get formatter function
export const useFormate = () => {
  const { formatMessage } = useIntl();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (id: string, values?: Record<string, any>) =>
    formatMessage({ id }, values);
};
