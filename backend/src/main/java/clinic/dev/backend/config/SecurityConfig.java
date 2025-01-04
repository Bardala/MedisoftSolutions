package clinic.dev.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.GET, "/healthz").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/**").permitAll() // Permits all endpoints under /api
            .requestMatchers(HttpMethod.POST, "/api/**").permitAll() // Permits all endpoints under /api
            .requestMatchers(HttpMethod.POST, "/login").permitAll()
            .anyRequest().authenticated())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    // .addFilterBefore(jwtAuthenticationFilter,
    // UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

}
