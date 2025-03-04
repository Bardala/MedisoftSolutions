package clinic.dev.backend.service;

import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import clinic.dev.backend.util.MacAddressUtils;

// import java.io.BufferedReader;
// import java.io.FileReader;
// import java.io.IOException;

// @Profile("prod")
@Service
public class MacValidatorService {

  @Value("${license.mac}")
  private String licensedMacFromConfig;

  // private static final String LICENSE_FILE_PATH = "license.txt"; // Optional
  // license file

  public boolean isLicenseValid() {
    String currentMac = MacAddressUtils.getMacAddress();
    String licensedMac = getLicensedMacAddress();

    return currentMac.equalsIgnoreCase(licensedMac);
  }

  private String getLicensedMacAddress() {
    // Use the MAC from application.properties if available
    if (!licensedMacFromConfig.isEmpty()) {
      return licensedMacFromConfig;
    }

    // Otherwise, read from license.txt file
    // try (BufferedReader reader = new BufferedReader(new
    // FileReader(LICENSE_FILE_PATH))) {
    // return reader.readLine().trim();
    // } catch (IOException e) {
    // e.printStackTrace();
    // return "UNKNOWN";
    // }
    return "UNKNOWN";
  }
}
