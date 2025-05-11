import { useIntl } from "react-intl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFormate = (id: string, values?: Record<string, any>) => {
  const { formatMessage } = useIntl();
  return formatMessage({ id }, values);
};
