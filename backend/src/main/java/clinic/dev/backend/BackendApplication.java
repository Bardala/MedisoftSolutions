package clinic.dev.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

import clinic.dev.backend.service.LicenseValidatorService;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class BackendApplication {

	@Autowired
	private LicenseValidatorService licenseValidatorService;

	@Autowired
	private Environment environment; // Inject Spring environment

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@PostConstruct
	public void validateLicense() {
		// Skip validation if running in the "test" profile
		String activeProfile = environment.getActiveProfiles().length > 0 ? environment.getActiveProfiles()[0] : "default";

		if (!"test".equals(activeProfile)) {
			if (!licenseValidatorService.isLicenseValid()) {
				System.out.println(":( Invalid license! Exiting program...");
				System.exit(0); // Stop execution if MAC address does not match
			} else {
				System.out.println(":) License validated successfully.");
			}
		}
	}
}
