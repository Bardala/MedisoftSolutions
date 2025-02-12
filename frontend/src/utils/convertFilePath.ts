import { host } from "./extractParams";

export const convertFilePath = (filePath: string) => {
  // Normalize path: replace all backslashes with forward slashes
  const normalizedPath = filePath.replace(/\\/g, "/");

  // Remove the "src/main/resources/static" segment, with an optional leading slash
  let correctedPath = normalizedPath.replace(
    /^\/?src\/main\/resources\/static/,
    "",
  );

  // Ensure the path starts with a single slash
  if (!correctedPath.startsWith("/")) {
    correctedPath = "/" + correctedPath;
  }

  // Remove the "src/main/resources/static" and "C:/ClinicSys" segments
  correctedPath = normalizedPath.replace(
    /^\/?C:\/ClinicSys\/src\/main\/resources\/static/,
    "",
  );

  return host(correctedPath);
};
