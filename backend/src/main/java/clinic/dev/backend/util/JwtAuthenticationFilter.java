package clinic.dev.backend.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import clinic.dev.backend.exceptions.InvalidTokenException;
import clinic.dev.backend.service.impl.UserDetailsServiceImpl;

import java.io.IOException;
import java.util.Map;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthContext authContext;

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    // Exclude the following endpoints from JWT authentication filter
    String path = request.getRequestURI();

    // List of paths that should not require authentication
    return path.startsWith("/api/v1/auth/login") ||
        path.startsWith("/api/v1/auth/signup") ||
        path.startsWith("/api/v1/healthz") ||
        path.startsWith("/static/") ||
        path.startsWith("/uploads/") ||
        // return
        path.equals("/api/v1/auth/login") ||
        path.equals("/api/v1/auth/signup") ||
        path.equals("/api/v1/healthz") ||
        path.equals("/static/**") ||
        path.equals("/uploads/**") ||

        path.equals("/index.html") ||
        path.endsWith(".jpg") ||
        path.endsWith(".png") ||
        path.endsWith(".jpeg") ||
        path.endsWith(".pdf") ||
        path.endsWith(".ico") ||
        path.endsWith(".mp3") ||
        path.endsWith(".svg") ||
        path.equals("/") ||
        path.equals("/login") ||
        path.equals("/home");
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    final String authorizationHeader = request.getHeader("Authorization");
    String identifier = null;
    String token = null;

    if (authorizationHeader == null || authorizationHeader.isEmpty() || !authorizationHeader.startsWith("Bearer ")) {
      // filterChain.doFilter(request, response); // complete through SecurityConfig
      sendErrorResponse(response, "Unauthorized", "Authorization header is missing or invalid.");
      return;
    }

    token = authorizationHeader.substring(7);
    String username = jwtUtil.extractUsername(token);
    Long clinicId = jwtUtil.extractClinicId(token);
    Long userId = jwtUtil.extractUserId(token);
    String role = jwtUtil.extractRole(token);

    if (role == null || username == null || userId == null) {
      sendErrorResponse(response, "Unauthorized", "Missing token details.");
      return;
    }

    // Optional strict check (fail early)
    if (!"SuperAdmin".equalsIgnoreCase(role) && clinicId == null) {
      sendErrorResponse(response, "Unauthorized", "Clinic ID is required for non-SuperAdmin users.");
      return;
    }

    if (token.length() == 0) {
      sendErrorResponse(response, "Unauthorized", "Authorization header is missing or invalid.");
      return;
    }

    try {
      // Attempt to parse and extract the username from the token
      identifier = jwtUtil.extractUsername(token);

      if (identifier != null &&
          SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails userDetails = userDetailsService.loadUserByIdentifier(identifier);

        // Validate the token
        jwtUtil.validateToken(token, userDetails.getUsername());

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities());
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // Set the authentication in the context
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        authContext.setClinicId(clinicId); // this is fine if null
        authContext.setUsername(username);
        authContext.setRole(role);
        authContext.setUserId(userId);
      } else if (identifier == null) {
        sendErrorResponse(response, "Unauthorized", "Invalid or missing user information in token.");
        return;
      }

    } catch (io.jsonwebtoken.ExpiredJwtException e) {
      sendErrorResponse(response, "TokenExpired", "The token has expired.");
      return;

    } catch (io.jsonwebtoken.MalformedJwtException e) {
      sendErrorResponse(response, "InvalidToken", "The token is malformed.");
      return;

    } catch (@SuppressWarnings("deprecation") io.jsonwebtoken.SignatureException e) {
      sendErrorResponse(response, "InvalidSignature", "The token signature is invalid.");
      return;

    } catch (InvalidTokenException e) {
      sendErrorResponse(response, "InvalidToken", e.getMessage());
      return;

    } catch (Exception e) {
      sendErrorResponse(response, "Unauthorized", "An unexpected error occurred.");
      return;
    }

    filterChain.doFilter(request, response);
  }

  /**
   * Utility method to send a formatted error response using ApiRes.
   */
  private void sendErrorResponse(HttpServletResponse response, String errorCode, String errorMessage)
      throws IOException {
    response.setContentType("application/json");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    // Create the error map
    Map<String, String> error = Map.of("code", errorCode, "message",
        errorMessage);

    // Create an ApiRes instance with the error
    ApiRes<Object> apiResponse = new ApiRes<>(error);

    // Convert ApiRes to JSON and write it to the response
    ObjectMapper objectMapper = new ObjectMapper();
    String jsonResponse = objectMapper.writeValueAsString(apiResponse);
    response.getWriter().write(jsonResponse);
  }

}
