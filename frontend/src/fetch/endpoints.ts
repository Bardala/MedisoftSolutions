export enum ENDPOINT {
  // Authentication APIs
  SIGN_UP = "/auth/signup",
  LOGIN = "/auth/login",
  CURR_USER_INFO = "/auth/userInfo",

  // Patient APIs
  CREATE_PATIENT = "/patients",
  UPDATE_PATIENT = "/patients/:id",
  DELETE_PATIENT = "/patients/:id",
  GET_PATIENT_BY_ID = "/patients/:id",
  GET_ALL_PATIENTS = "/patients",
  PATIENT_REGISTRY = "/patients/registry/:id",
  DAILY_NEW_PATIENTS = "/patients/dailyNew",
  SEARCH_PATIENTS = "/patients/search",
  PATIENT_BATCH = "/patients/batch",

  // User APIs
  HEALTH = "/users/health",
  GET_ALL_USERS = "/users",
  GET_USER_BY_ID = "/users/:id",
  GET_USER_BY_USERNAME = "/users/username/:username",
  GET_USER_BY_PHONE = "/users/phone/:phone",
  GET_USERS_BY_ROLE = "/users/role/:role",
  UPDATE_USER = "/users/update",
  DELETE_USER_BY_ID = "/users/:id",
  DELETE_USER_BY_USERNAME = "/users/username/:username",
  DELETE_USER_BY_PHONE = "/users/phone/:phone",
  DELETE_ALL_USERS = "/users/all",
  RESET_PASSWORD = "/users/reset-password",
  USER_BATCH = "/patients/batch",
  CREATE_USER = "/users",

  // Visit APIs
  CREATE_VISIT = "/visits",
  UPDATE_VISIT = "/visits",
  DELETE_VISIT = "/visits/:id",
  GET_VISIT_BY_ID = "/visits/:id",
  GET_ALL_VISITS = "/visits",
  GET_WORKDAY_VISITS = "/visits/workday",
  VISIT_BATCH = "/patients/batch",

  // Procedure APIs
  CREATE_DENTAL_PROCEDURE = "/services",
  UPDATE_DENTAL_PROCEDURE = "/services/:id",
  DELETE_DENTAL_PROCEDURE = "/services/:id",
  GET_DENTAL_PROCEDURE_BY_ID = "/services/:id",
  GET_ALL_DENTAL_PROCEDURES = "/services",
  PROCEDURE_BATCH = "/patients/batch",

  // Medicine APIs
  CREATE_MEDICINE = "/medicines",
  UPDATE_MEDICINE = "/medicines",
  DELETE_MEDICINE = "/medicines/:id",
  GET_MEDICINE_BY_ID = "/medicines/:id",
  GET_ALL_MEDICINES = "/medicines",
  MEDICINE_BATCH = "/patients/batch",

  // Payment APIs
  CREATE_PAYMENT = "/payments",
  UPDATE_PAYMENT = "/payments",
  DELETE_PAYMENT = "/payments/:id",
  GET_PAYMENT_BY_ID = "/payments/:id",
  GET_ALL_PAYMENTS = "/payments",
  GET_WORKDAY_PAYMENTS = "/payments/workday",
  GET_WORKDAY_PAYMENTS_SUMMARY = "/payments/summary",
  PAYMENT_BATCH = "/patients/batch",

  // VisitDentalProcedure APIs
  POST_VISIT_DENTAL_PROCEDURE = "/visit-dental-procedures",
  GET_ALL_VISIT_DENTAL_PROCEDURES = "/visit-dental-procedures",
  UPDATE_VISIT_DENTALPROCEDURE = "/visit-dental-procedures/update/:id",
  DELETE_VISIT_PROCEDURE = "/visit-dental-procedures/:id",
  GET_VISIT_PROCEDURES_BY_VISIT_ID = "/visit-dental-procedures/:id/visit",

  // VisitPayment
  POST_VISIT_PAYMENT = "/visit-payment",
  GET_VISIT_PAYMENT = "/visit-payment/patient/:id",

  // MonthlyReport APIs
  GET_MONTHLY_SUMMARY = "/reports/month/summary",
  GET_MONTHLY_DAYS_INFO = "/reports/month/daysInfo",

  // PatientFile APIs
  UPLOAD_PATIENT_FILE = "/patient-file",
  UPLOAD_FILES = "/patient-file/upload-multiple",
  GET_FILES = "/patient-file/:patientId",
  DELETE_FILES = "/patient-file/:patientId/delete-patient-files",
  DELETE_FILE = "/patient-file/:fileId/delete-file",
  UPDATE_FILE = "/patient-file/:fileId",

  // VisitMedicine APIs
  GET_ALL_VISIT_MEDICINES = "/visit-medicines",
  GET_VISIT_MEDICINE_BY_ID = "/visit-medicines/:id",
  CREATE_VISIT_MEDICINE = "/visit-medicines",
  DELETE_VISIT_MEDICINE = "/visit-medicines/:id",
  GET_VISIT_MEDICINES_BY_VISIT_ID = "/visit-medicines/visit/:visitId",
  GET_VISIT_MEDICINES_BY_MEDICINE_ID = "/visit-medicines/medicine/:medicineId",

  // Settings APIs
  // GET_CLINIC_SETTINGS = "/settings",
  // CREATE_CLINIC_SETTINGS = "/settings",
  // UPDATE_CLINIC_SETTINGS = "/settings/:id",

  // Clinic CRUD
  CREATE_CLINIC = "/clinics",
  GET_CLINIC_BY_ID = "/clinics",
  GET_USER_CLINIC = "/clinics/user-clinic",
  GET_ALL_CLINICS = "/clinics",
  UPDATE_CLINIC = "/clinics",
  DELETE_CLINIC = "/clinics",

  // Settings
  GET_CURRENT_CLINIC_SETTINGS = "/clinics/settings",
  GET_CLINIC_SETTINGS = "/clinics",
  UPDATE_CURRENT_CLINIC_SETTINGS = "/clinics/settings",
  UPDATE_CLINIC_SETTINGS = "/clinics",

  // Limits
  GET_CURRENT_CLINIC_LIMITS = "/clinics/limits",
  GET_CLINIC_LIMITS = "/clinics",
  UPDATE_CLINIC_LIMITS = "/clinics",
}
