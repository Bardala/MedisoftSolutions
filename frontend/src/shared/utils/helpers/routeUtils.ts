import { AppRoute, AppRoutes } from "@/app/constants";

export const buildRoute = (
  route: AppRoute,
  params?: Record<string, string>,
): string => {
  let path: string = AppRoutes[route];

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });
  }

  return path;
};

// Usage examples:
// buildRoute('PATIENT_PAGE', { id: '123' }) => '/patient-page/123'
// buildRoute('HOME') => '/'
