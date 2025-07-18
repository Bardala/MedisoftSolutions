package clinic.dev.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import clinic.dev.backend.util.SystemUtils;

// @Profile("prod")
@Service
public class LicenseValidatorService {

  @Value("${license.cpu}")
  private String licensedCpuFromConfig;

  public boolean isLicenseValid() {
    String currentCpuId = SystemUtils.getCpuId();
    return currentCpuId.equalsIgnoreCase(licensedCpuFromConfig);
  }

}
