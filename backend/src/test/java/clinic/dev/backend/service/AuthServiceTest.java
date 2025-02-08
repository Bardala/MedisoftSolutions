// package clinic.dev.backend.service;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;
// import static org.junit.jupiter.api.Assertions.*;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.BadCredentialsException;
// import
// org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.AuthenticationException;
// import org.springframework.security.core.userdetails.UserDetails;
// import
// org.springframework.security.core.userdetails.UsernameNotFoundException;

// import clinic.dev.backend.constants.ErrorMsg;
// import clinic.dev.backend.service.impl.AuthService;
// import clinic.dev.backend.service.impl.UserDetailsServiceImpl;
// import clinic.dev.backend.util.JwtUtil;

// class AuthServiceTest {

// @Mock
// private AuthenticationManager authenticationManager;

// @Mock
// private UserDetailsServiceImpl userDetailsService;

// @Mock
// private JwtUtil jwtUtil;

// @InjectMocks
// private AuthService authService;

// @BeforeEach
// void setUp() {
// MockitoAnnotations.openMocks(this);
// }

// @Test
// void testLoginSuccess() throws Exception {
// // Arrange
// String username = "testuser";
// String password = "password";
// String token = "sample-jwt-token";

// UserDetails mockUserDetails = mock(UserDetails.class);
// when(mockUserDetails.getUsername()).thenReturn(username);

// when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
// .thenReturn(null);
// when(userDetailsService.loadUserByUsername(username)).thenReturn(mockUserDetails);
// when(jwtUtil.generateToken(username)).thenReturn(token);

// // Act
// String resultToken = authService.login(username, password);

// // Assert
// assertEquals(token, resultToken);
// verify(authenticationManager, times(1))
// .authenticate(new UsernamePasswordAuthenticationToken(username, password));
// verify(userDetailsService, times(1)).loadUserByUsername(username);
// verify(jwtUtil, times(1)).generateToken(username);
// }

// @Test
// void testUserNotFound() {
// // Arrange
// String username = "unknownuser";
// String password = "password";

// when(userDetailsService.loadUserByUsername(username))
// .thenThrow(new UsernameNotFoundException("User not found"));

// // Act & Assert
// AuthenticationException exception =
// assertThrows(AuthenticationException.class,
// () -> authService.login(username, password));

// assertEquals(ErrorMsg.USER_DOES_NOT_EXIST, exception.getMessage());
// verify(userDetailsService, times(1)).loadUserByUsername(username);
// }

// @Test
// void testInvalidCredentials() {
// // Arrange
// String username = "testuser";
// String password = "wrongpassword";

// when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
// .thenThrow(new BadCredentialsException("Invalid credentials"));

// // Act & Assert
// AuthenticationException exception =
// assertThrows(AuthenticationException.class,
// () -> authService.login(username, password));

// assertEquals(ErrorMsg.INVALID_USERNAME_OR_PASSWORD, exception.getMessage());
// verify(authenticationManager, times(1))
// .authenticate(new UsernamePasswordAuthenticationToken(username, password));
// }

// }
