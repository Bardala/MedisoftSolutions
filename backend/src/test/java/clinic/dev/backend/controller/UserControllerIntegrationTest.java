package clinic.dev.backend.controller;

import clinic.dev.backend.dto.auth.LoginRequest;
import clinic.dev.backend.dto.auth.SignupRequest;
import clinic.dev.backend.dto.user.ResetPasswordRequest;
import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.UserRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepo userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private ObjectMapper objectMapper;

  private String token;

  @BeforeEach
  public void setUp() throws Exception {
    userRepository.deleteAll();

    SignupRequest signupRequest = new SignupRequest("ahmed", "password", "Doctor", "ahmed", "1234567890");
    mockMvc.perform(post("/api/v1/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(signupRequest)))
        .andExpect(status().isOk());

    LoginRequest loginRequest = new LoginRequest("ahmed", "password");
    MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(loginRequest)))
        .andExpect(status().isOk())
        .andReturn();

    token = JsonPath.read(loginResult.getResponse().getContentAsString(), "$.token");
  }

  @Test
  public void testHealth() throws Exception {
    mockMvc.perform(get("/api/v1/users/health")
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().string("User controller is healthy"));
  }

  @Test
  public void testGetAllUsers() throws Exception {
    mockMvc.perform(get("/api/v1/users")
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].username").value("ahmed"))
        .andExpect(jsonPath("$[0].role").value("Doctor"));
  }

  @Test
  public void testGetUserById() throws Exception {
    User user = userRepository.findByUsername("ahmed").orElseThrow();
    mockMvc.perform(get("/api/v1/users/" + user.getId())
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("ahmed"))
        .andExpect(jsonPath("$.role").value("Doctor"));
  }

  @Test
  public void testGetUserByUsername() throws Exception {
    mockMvc.perform(get("/api/v1/users/username/ahmed")
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("ahmed"))
        .andExpect(jsonPath("$.role").value("Doctor"));
  }

  @Test
  public void testGetUserByPhone() throws Exception {
    mockMvc.perform(get("/api/v1/users/phone/1234567890")
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("ahmed"))
        .andExpect(jsonPath("$.role").value("Doctor"));
  }

  @Test
  public void testGetUsersByRole() throws Exception {
    mockMvc.perform(get("/api/v1/users/role/Doctor")
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].username").value("ahmed"))
        .andExpect(jsonPath("$[0].role").value("Doctor"));
  }

  @Test
  public void testUpdateUser() throws Exception {
    User user = userRepository.findByUsername("ahmed").orElseThrow();
    user.setName("Ahmed Updated");
    mockMvc.perform(put("/api/v1/users/" + user.getId())
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(user)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Ahmed Updated"));
  }

  @Test
  public void testDeleteUserById() throws Exception {
    User user = userRepository.findByUsername("ahmed").orElseThrow();
    mockMvc.perform(delete("/api/v1/users/" + user.getId())
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());

    Optional<User> deletedUser = userRepository.findByUsername("ahmed");
    assertThat(deletedUser).isEmpty();
  }

  @Test
  public void testDeleteUserByUsername() throws Exception {
    mockMvc.perform(delete("/api/v1/users/username/ahmed")
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());

    Optional<User> deletedUser = userRepository.findByUsername("ahmed");
    assertThat(deletedUser).isEmpty();
  }

  @Test
  public void testDeleteUserByPhone() throws Exception {
    mockMvc.perform(delete("/api/v1/users/phone/1234567890")
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());

    Optional<User> deletedUser = userRepository.findByPhone("1234567890L");
    assertThat(deletedUser).isEmpty();
  }

  @Test
  public void testDeleteAllUsers() throws Exception {
    mockMvc.perform(delete("/api/v1/users/all")
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());

    assertThat(userRepository.findAll()).isEmpty();
  }

  @Test
  public void testResetPassword() throws Exception {
    ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.setUsername("ahmed");
    resetPasswordRequest.setNewPassword("newpassword");

    mockMvc.perform(put("/api/v1/users/reset-password")
        .header("Authorization", "Bearer " + token)
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(resetPasswordRequest)))
        .andExpect(status().isOk());

    User updatedUser = userRepository.findByUsername("ahmed").orElseThrow();
    assertThat(passwordEncoder.matches("newpassword", updatedUser.getPassword())).isTrue();
  }
}