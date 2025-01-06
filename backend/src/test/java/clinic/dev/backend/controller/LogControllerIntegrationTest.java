// package clinic.dev.backend.controller;

// import clinic.dev.backend.dto.LoginRequest;
// import clinic.dev.backend.dto.SignupRequest;
// import clinic.dev.backend.model.Log;
// import clinic.dev.backend.model.LogLevel;
// import clinic.dev.backend.repository.LogRepo;
// import clinic.dev.backend.repository.UserRepo;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import
// org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.MvcResult;
// import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.jayway.jsonpath.JsonPath;

// import static
// org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static
// org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @SpringBootTest
// @AutoConfigureMockMvc
// public class LogControllerIntegrationTest {

// @Autowired
// private MockMvc mockMvc;

// @Autowired
// private LogRepo logRepository;

// @Autowired
// private ObjectMapper objectMapper;

// @Autowired
// private UserRepo userRepository;

// private String token;

// @BeforeEach
// public void setUp() throws Exception {
// logRepository.deleteAll();

// userRepository.deleteAll();

// SignupRequest signupRequest = new SignupRequest("ahmed", "password",
// "Doctor", "ahmed", "1234567890");
// mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isOk());

// LoginRequest loginRequest = new LoginRequest("ahmed", "password");
// MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(loginRequest)))
// .andExpect(status().isOk())
// .andReturn();

// token = JsonPath.read(loginResult.getResponse().getContentAsString(),
// "$.token");
// }

// @Test
// public void testAddLog() throws Exception {
// mockMvc.perform(MockMvcRequestBuilders.post("/api/logs")
// .header("Authorization", "Bearer " + token)
// .param("userId", "1")
// .param("action", "User Login")
// .param("details", "User logged in successfully")
// .param("ipAddress", "192.168.1.1")
// .param("logLevel", LogLevel.INFO.name())
// .param("stackTrace", "")
// .contentType(MediaType.APPLICATION_FORM_URLENCODED))
// .andExpect(status().isOk());

// // Verify the log was created
// Log log = logRepository.findAll().get(0);
// assert log.getUserId() == 1;
// assert log.getAction().equals("User Login");
// assert log.getDetails().equals("User logged in successfully");
// assert log.getIpAddress().equals("192.168.1.1");
// assert log.getLogLevel() == LogLevel.INFO;
// }
// }