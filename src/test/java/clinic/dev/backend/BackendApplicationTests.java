package clinic.dev.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest(properties = "spring.profiles.active=test")
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
