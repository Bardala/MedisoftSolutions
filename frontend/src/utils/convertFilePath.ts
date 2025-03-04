import { host } from "./extractParams";

export const convertFilePath2 = (filePath: string) => {
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

export const convertFilePath = (filePath: string) => {
  // Normalize path: replace all backslashes with forward slashes
  const normalizedPath = filePath.replace(/\\/g, "/");

  // Find the index of the last "/uploads" segment
  const uploadsIndex = normalizedPath.lastIndexOf("/uploads/");

  // If "/uploads" is found, extract the path starting from the last "/uploads"
  if (uploadsIndex !== -1) {
    const correctedPath = normalizedPath.slice(uploadsIndex);

    // Construct the final URL using the host function
    return host(correctedPath);
  }

  // If "/uploads" is not found, return the original path (or handle it as needed)
  return host(normalizedPath);
};
