import "react-i18next";
import { resources, defaultNS } from "../i18n";

declare module "react-i18next" {
  // Extend CustomTypeOptions for type safety
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["en"];
  }
}
