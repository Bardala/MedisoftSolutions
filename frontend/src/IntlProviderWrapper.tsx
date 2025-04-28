import React, { ReactNode, useState, createContext, useEffect } from "react";
import { IntlProvider } from "react-intl";

// Import translations
import enCommon from "./locales/en/common.json";
import enSettings from "./locales/en/settings.json";
import arCommon from "./locales/ar/common.json";
import arSettings from "./locales/ar/settings.json";
import arSidebar from "./locales/ar/sidebar.json";
import enSidebar from "./locales/en/sidebar.json";
import enAddPatient from "./locales/en/addPatient.json";
import arAddPatient from "./locales/ar/addPatient.json";
import enAddAssistant from "./locales/en/addAssistant.json";
import arAddAssistant from "./locales/ar/addAssistant.json";
import enChart from "./locales/en/chart.json";
import arChart from "./locales/ar/chart.json";
import enAddVisit from "./locales/en/addVisit.json";
import arAddVisit from "./locales/ar/addVisit.json";
import enDailyReport from "./locales/en/dailyReport.json";
import arDailyReport from "./locales/ar/dailyReport.json";
import arHome from "./locales/ar/home.json";
import enHome from "./locales/en/home.json";
import enPatientSearch from "./locales/en/patientSearch.json";
import arPatientSearch from "./locales/ar/patientSearch.json";
import enRegistry from "./locales/en/registry.json";
import arRegistry from "./locales/ar/registry.json";
import enPayment from "./locales/en/recordPayment.json";
import arPayment from "./locales/ar/recordPayment.json";
import enMonthlyReport from "./locales/en/monthlyReport.json";
import arMonthlyReport from "./locales/ar/monthlyReport.json";
import enQueue from "./locales/en/queue.json";
import arQueue from "./locales/ar/queue.json";
import enPatientProfile from "./locales/en/patientProfile.json";
import arPatientProfile from "./locales/ar/patientProfile.json";
import enMedicine from "./locales/en/medicine.json";
import arMedicine from "./locales/ar/medicine.json";
import enVisitCard from "./locales/en/visitCard.json";
import arVisitCard from "./locales/ar/visitCard.json";
import enPrescriptionForm from "./locales/en/prescriptionForm.json";
import arPrescriptionForm from "./locales/ar/prescriptionForm.json";
import enProcedureSearch from "./locales/en/procedureSearch.json";
import arProcedureSearch from "./locales/ar/procedureSearch.json";
import enUploadImages from "./locales/en/uploadImages.json";
import arUploadImages from "./locales/ar/uploadImages.json";
import enPatientProfileHeader from "./locales/en/patientProfileHeader.json";
import arPatientProfileHeader from "./locales/ar/patientProfileHeader.json";
import enLogin from "./locales/en/login.json";
import arLogin from "./locales/ar/login.json";
import enFiles from "./locales/en/files.json";
import arFiles from "./locales/ar/files.json";
import enPresPrint from "./locales/en/prescriptionContainer.json";
import arPresPrint from "./locales/ar/prescriptionContainer.json";
import enSelectDoctor from "./locales/en/doctorSelect.json";
import arSelectDoctor from "./locales/ar/doctorSelect.json";

// Combine translations
const messages = {
  en: {
    ...enCommon,
    ...enSettings,
    ...enSidebar,
    ...enAddAssistant,
    ...enAddPatient,
    ...enChart,
    ...enAddVisit,
    ...enDailyReport,
    ...enHome,
    ...enPatientSearch,
    ...enRegistry,
    ...enPayment,
    ...enMonthlyReport,
    ...enQueue,
    ...enPatientProfile,
    ...enMedicine,
    ...enVisitCard,
    ...enPrescriptionForm,
    ...enProcedureSearch,
    ...enUploadImages,
    ...enPatientProfileHeader,
    ...enLogin,
    ...enFiles,
    ...enPresPrint,
    ...enSelectDoctor,
  },
  ar: {
    ...arCommon,
    ...arSettings,
    ...arSidebar,
    ...arAddAssistant,
    ...arAddPatient,
    ...arChart,
    ...arAddVisit,
    ...arDailyReport,
    ...arHome,
    ...arPatientSearch,
    ...arRegistry,
    ...arPayment,
    ...arMonthlyReport,
    ...arQueue,
    ...arPatientProfile,
    ...arMedicine,
    ...arVisitCard,
    ...arPrescriptionForm,
    ...arProcedureSearch,
    ...arUploadImages,
    ...arPatientProfileHeader,
    ...arLogin,
    ...arFiles,
    ...arPresPrint,
    ...arSelectDoctor,
  },
};

// Create a context for language switching
export const LanguageContext = createContext({
  locale: "en",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  switchLanguage: (lang: string) => {},
});

interface IntlWrapperProps {
  children: ReactNode;
}

const IntlProviderWrapper: React.FC<IntlWrapperProps> = ({ children }) => {
  const [locale, setLocale] = useState(localStorage.getItem("lang") || "en");

  // Function to update language & direction
  const switchLanguage = (lang: string) => {
    localStorage.setItem("lang", lang);
    localStorage.setItem("dir", lang === "ar" ? "rtl" : "ltr"); // Save direction
    setLocale(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  // Apply saved language & direction on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    const savedDir = localStorage.getItem("dir") || "ltr";

    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedDir;
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <LanguageContext.Provider value={{ locale, switchLanguage }}>
        {children}
      </LanguageContext.Provider>
    </IntlProvider>
  );
};

export default IntlProviderWrapper;
