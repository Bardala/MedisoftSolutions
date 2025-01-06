package clinic.dev.backend.model;

import java.util.Collection;
import java.util.Date;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import clinic.dev.backend.validation.RoleConstraint;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_phone", columnList = "phone")
})
public class User implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Pattern(regexp = "^[\\S]+$", message = "Username must not contain spaces")
  @Column(unique = true, nullable = false)
  private String username;

  @NotBlank
  private String password;

  @NotBlank
  @Column(unique = true, nullable = false)
  private String name;

  @NotBlank
  @Column(unique = true, nullable = false)
  private String phone;

  @NotNull
  @RoleConstraint(message = "Invalid role. Allowed roles are 'Doctor' and 'Assistant'")
  private String role; // e.g., 'Doctor', 'Assistant'

  @Column(nullable = true)
  private String profilePicture;

  @Column(nullable = false, updatable = false)
  @Temporal(TemporalType.TIMESTAMP)
  @org.hibernate.annotations.CreationTimestamp
  private Date createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = new Date();
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return null;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true; // Implement logic if needed
  }

  @Override
  public boolean isAccountNonLocked() {
    return true; // Implement logic if needed
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true; // Implement logic if needed
  }

  @Override
  public boolean isEnabled() {
    return true; // Implement logic if needed
  }
}