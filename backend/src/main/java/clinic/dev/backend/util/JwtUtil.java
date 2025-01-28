package clinic.dev.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import clinic.dev.backend.exceptions.ExpiredTokenException;
import clinic.dev.backend.exceptions.InvalidTokenException;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

  // todo: Change to a strong secret key in .env
  private final String SECRET_KEY_STRING = "my_secret_key_which_should_be_at_least_32_character_long";
  private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 day

  private final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());

  public String generateToken(String username) {
    Map<String, Object> claims = new HashMap<>();
    return createToken(claims, username);
  }

  private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
        .compact();
  }

  public boolean validateToken(String token, String username) throws InvalidTokenException, ExpiredTokenException {
    final String extractedUsername = extractUsername(token);

    if (isTokenExpired(token))
      throw new ExpiredTokenException("The token has expired.");

    if (!extractedUsername.equals(username))
      throw new InvalidTokenException("The token is invalid.");

    return true; // Token is valid
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

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(SECRET_KEY)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}
