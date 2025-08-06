export const AppRoutes = {
  // Common routes
  Dashboard: "/dashboard",
  WELCOME_PAGE: "/",
  RECORD_VISIT: "/record-new-visit",
  PATIENTS: "/patients",
  REPORTS: "/reports/:date?",
  SETTINGS: "/settings",
  PATIENT_HISTORY: "/patient-history",
  PATIENT_PROFILE: "/patient-profile",
  ADD_PATIENT: "/add-patient",
  PAYMENTS: "/payments",
  UPDATE_USER_INFO: "/update-user-info",
  PATIENT_PAGE: "/patient-page/:id",
  APPOINTMENT_CALENDER: "/appointment-calender",
  LOGIN: "/login",

  // Owner-only routes
  MONTHLY_REPORTS: "/monthly-reports",
  ADD_ASSISTANT: "/add-assistant",
  CLINIC_SETTINGS: "/clinic-settings",
  CLINIC_DATA: "/clinic-data",

  // SuperAdmin-only routes
  ADMIN_CLINICS: "/admin-clinics",
  CREATE_CLINIC: "/create-clinic",
} as const;

export type AppRoute = keyof typeof AppRoutes;
