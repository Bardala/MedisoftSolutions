package clinic.dev.backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import clinic.dev.backend.constants.MESSAGES;

@SpringBootTest // Load the full Spring context
@AutoConfigureMockMvc // Automatically configure MockMvc
@ActiveProfiles("test") // Activates the test profile
public class HealthZIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void testHealthzEndpoint() throws Exception {
    mockMvc.perform(get("/api/v1/healthz")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().string(MESSAGES.SERVER_IS_UP));
  }
}
