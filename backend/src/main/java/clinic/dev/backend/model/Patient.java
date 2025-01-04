package clinic.dev.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Patient {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String phoneNumber;
  private String address;

  @Column(unique = true)
  private String email;

  @Column(length = 500)
  private String medicalHistory;
}
