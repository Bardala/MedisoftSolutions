export enum ENDPOINT {
  // Authentication APIs
  CREATE_USER = "/auth/signup",
  LOGIN = "/auth/login",
  CURR_USER_INFO = "/auth/userInfo",

  // Patient APIs
  CREATE_PATIENT = "/patients",
  UPDATE_PATIENT = "/patients/:id",
  DELETE_PATIENT = "/patients/:id",
  GET_PATIENT_BY_ID = "/patients/:id",
  GET_ALL_PATIENTS = "/patients",
  PATIENT_REGISTRY = "/patients/registry/:id",

  // User APIs
  HEALTH = "/users/health",
  GET_ALL_USERS = "/users",
  GET_USER_BY_ID = "/users/:id",
  GET_USER_BY_USERNAME = "/users/username/:username",
  GET_USER_BY_PHONE = "/users/phone/:phone",
  GET_USERS_BY_ROLE = "/users/role/:role",
  UPDATE_USER = "/users/:id",
  DELETE_USER_BY_ID = "/users/:id",
  DELETE_USER_BY_USERNAME = "/users/username/:username",
  DELETE_USER_BY_PHONE = "/users/phone/:phone",
  DELETE_ALL_USERS = "/users/all",
  RESET_PASSWORD = "/users/reset-password",

  // Visit APIs
  CREATE_VISIT = "/visits",
  UPDATE_VISIT = "/visits/:id",
  DELETE_VISIT = "/visits/:id",
  GET_VISIT_BY_ID = "/visits/:id",
  GET_ALL_VISITS = "/visits",

  // Dental Procedure APIs
  CREATE_DENTAL_PROCEDURE = "/services",
  UPDATE_DENTAL_PROCEDURE = "/services/:id",
  DELETE_DENTAL_PROCEDURE = "/services/:id",
  GET_DENTAL_PROCEDURE_BY_ID = "/services/:id",
  GET_ALL_DENTAL_PROCEDURES = "/services",

  // Medicine APIs
  CREATE_MEDICINE = "/medicines",
  UPDATE_MEDICINE = "/medicines/:id",
  DELETE_MEDICINE = "/medicines/:id",
  GET_MEDICINE_BY_ID = "/medicines/:id",
  GET_ALL_MEDICINES = "/medicines",

  // Payment APIs
  CREATE_PAYMENT = "/payments",
  UPDATE_PAYMENT = "/payments/:id",
  DELETE_PAYMENT = "/payments/:id",
  GET_PAYMENT_BY_ID = "/payments/:id",
  GET_ALL_PAYMENTS = "/payments",

  // VisitDentalProcedure APIs
  POST_VISIT_DENTAL_PROCEDURE = "/visit-dental-procedures",
  GET_ALL_VISIT_DENTAL_PROCEDURES = "/visit-dental-procedures",
  POST_VISIT_PAYMENT = "/visit-payment",
}
