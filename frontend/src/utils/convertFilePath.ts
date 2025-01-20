import { host } from "./extractParams";

export const convertFilePath = (filePath: string) => {
  const correctedPath = filePath.replace("src/main/resources/static", "");
  return `${host(correctedPath)}`;
};
