package clinic.dev.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import clinic.dev.backend.exceptions.ExpiredTokenException;
import clinic.dev.backend.exceptions.InvalidTokenException;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Component
public class JwtUtil {
  private final Key signingKey;
  private final long expirationTimeMs;

  public JwtUtil(
      @Value("${token.secret-key}") String secretKey,
      @Value("${token.expiration-time-ms:86400000}") long expirationTimeMs // Default 24h
  ) {
    // Validate configuration
    Objects.requireNonNull(secretKey, "JWT secret key must not be null");
    if (secretKey.length() < 32) {
      throw new IllegalArgumentException(
          "JWT secret key must be at least 32 characters long");
    }

    this.signingKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    this.expirationTimeMs = expirationTimeMs;
  }

  public String generateToken(String username, Long userId, String role, Long clinicId) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("clinicId", clinicId);
    claims.put("userId", userId);
    claims.put("role", role);

    return Jwts.builder()
        .setClaims(claims)
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expirationTimeMs))
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public boolean validateToken(String token, String username)
      throws InvalidTokenException, ExpiredTokenException {
    try {
      final String extractedUsername = extractUsername(token);

      if (isTokenExpired(token)) {
        throw new ExpiredTokenException("Token has expired");
      }

      if (!extractedUsername.equals(username)) {
        throw new InvalidTokenException("Token is invalid");
      }

      return true;
    } catch (SecurityException | IllegalArgumentException e) {
      throw new InvalidTokenException("Invalid token signature");
    }
  }

  public String refreshToken(String oldToken) throws InvalidTokenException {
    try {
      Claims claims = extractAllClaims(oldToken);
      claims.setIssuedAt(new Date());
      claims.setExpiration(new Date(System.currentTimeMillis() + expirationTimeMs));

      return Jwts.builder()
          .setClaims(claims)
          .signWith(signingKey, SignatureAlgorithm.HS256)
          .compact();
    } catch (ExpiredJwtException ex) {
      // Allow refreshing expired (but otherwise valid) tokens
      Claims claims = ex.getClaims();
      return Jwts.builder()
          .setClaims(claims)
          .setIssuedAt(new Date())
          .setExpiration(new Date(System.currentTimeMillis() + expirationTimeMs))
          .signWith(signingKey, SignatureAlgorithm.HS256)
          .compact();
    } catch (JwtException | IllegalArgumentException e) {
      throw new InvalidTokenException("Cannot refresh invalid token");
    }
  }

  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token) {
    return extractAllClaims(token).getExpiration();
  }

  public String extractUsername(String token) {
    return extractAllClaims(token).getSubject();
  }

  public Long extractClinicId(String token) {
    return extractAllClaims(token).get("clinicId", Long.class);
  }

  public Long extractUserId(String token) {
    return extractAllClaims(token).get("userId", Long.class);
  }

  public String extractRole(String token) {
    return extractAllClaims(token).get("role", String.class);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(signingKey)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}