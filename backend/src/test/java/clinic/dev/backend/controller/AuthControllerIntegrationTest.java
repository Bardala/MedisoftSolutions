// package clinic.dev.backend.controller;

// import com.fasterxml.jackson.databind.ObjectMapper;

// import clinic.dev.backend.constants.ErrorMsg;
// import clinic.dev.backend.dto.auth.LoginRequest;
// import clinic.dev.backend.dto.auth.SignupRequest;
// import clinic.dev.backend.repository.UserRepo;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import
// org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.MvcResult;
// import org.springframework.transaction.annotation.Transactional;

// import static org.junit.jupiter.api.Assertions.assertTrue;
// import static
// org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static
// org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
// import static
// org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// @SpringBootTest
// @AutoConfigureMockMvc
// @ActiveProfiles("test")
// @Transactional
// public class AuthControllerIntegrationTest {

// private SignupRequest signupRequest;
// private LoginRequest loginRequest;

// @Autowired
// private UserRepo userRepo;

// @Autowired
// private MockMvc mockMvc;

// @Autowired
// private ObjectMapper objectMapper;

// @BeforeEach
// public void setUp() {
// signupRequest = new SignupRequest("newUser", "password123", "Doctor",
// "newUser", "1234567890");
// loginRequest = new LoginRequest("newUser", "password123");

// userRepo.deleteAll();
// }

// @Test
// public void testSignup() throws Exception {
// mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isOk())
// .andExpect(jsonPath("$.username").value("newUser"))
// .andExpect(jsonPath("$.token").isNotEmpty());
// }

// @Test
// public void testSignupWithTheSameUsername() throws Exception {
// mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isOk())
// .andExpect(jsonPath("$.username").value("newUser"))
// .andExpect(jsonPath("$.token").isNotEmpty());

// MvcResult result = mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isBadRequest())
// .andReturn();

// String response = result.getResponse().getContentAsString();
// assertTrue(response.contains(ErrorMsg.USERNAME_ALREADY_EXISTS));
// }

// @Test
// public void testSignupWithoutUsername() throws Exception {
// signupRequest.setUsername("");
// MvcResult result = mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isBadRequest())
// .andReturn();

// String errorResponse = result.getResponse().getContentAsString();
// assertTrue(errorResponse.contains(ErrorMsg.USERNAME_IS_REQUIRED));
// }

// @Test
// public void testSignupWithoutPassword() throws Exception {
// signupRequest.setPassword("");
// MvcResult result = mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isBadRequest())
// .andReturn();

// String errorResponse = result.getResponse().getContentAsString();
// assertTrue(errorResponse.contains(ErrorMsg.PASSWORD_IS_REQUIRED));
// }

// @Test
// public void testLogin() throws Exception {
// mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isOk());

// mockMvc.perform(post("/api/v1/auth/login")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(loginRequest)))
// .andExpect(status().isOk())
// .andExpect(jsonPath("$.username").value("newUser"))
// .andExpect(jsonPath("$.token").isNotEmpty());
// }

// @Test
// public void testLoginWithPhone() throws Exception {
// signupRequest.setUsername("newUser");
// signupRequest.setPhone("1234567890");

// mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isOk());

// loginRequest.setIdentifier("1234567890");

// mockMvc.perform(post("/api/v1/auth/login")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(loginRequest)))
// .andExpect(status().isOk())
// .andExpect(jsonPath("$.username").value("1234567890"))
// .andExpect(jsonPath("$.token").isNotEmpty());
// }

// @Test
// public void testLoginWithWrongUsername() throws Exception {
// mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isOk());

// loginRequest.setIdentifier("wrongUsername");

// MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(loginRequest)))
// .andExpect(status().isUnauthorized())
// .andReturn();

// String errorRes = result.getResponse().getContentAsString();
// assertTrue(errorRes.contains(ErrorMsg.INVALID_USERNAME_OR_PASSWORD));
// }

// @Test
// public void testLoginWithWrongPassword() throws Exception {
// mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isOk());

// loginRequest.setPassword("wrongPassword");

// MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(loginRequest)))
// .andExpect(status().isUnauthorized())
// .andReturn();

// String errorRes = result.getResponse().getContentAsString();
// assertTrue(errorRes.contains(ErrorMsg.INVALID_USERNAME_OR_PASSWORD));
// }

// @Test
// public void testLoginWithoutUsernameOrPassword() throws Exception {
// loginRequest.setIdentifier("");
// loginRequest.setPassword("");

// MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(loginRequest)))
// .andExpect(status().isBadRequest())
// .andReturn();

// String errorResponse = result.getResponse().getContentAsString();
// assertTrue(errorResponse.contains(ErrorMsg.USERNAME_OR_PHONE_MUST_NOT_BE_NULL));
// assertTrue(errorResponse.contains(ErrorMsg.PASSWORD_IS_REQUIRED));
// }

// @Test
// public void testSignupWithoutRole() throws Exception {
// signupRequest.setRole("");
// MvcResult result = mockMvc.perform(post("/api/v1/auth/signup")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(signupRequest)))
// .andExpect(status().isBadRequest())
// .andReturn();

// String errorResponse = result.getResponse().getContentAsString();
// assertTrue(errorResponse.contains(ErrorMsg.FIELD_MUST_NOT_BE_BLANK));
// }

// }
