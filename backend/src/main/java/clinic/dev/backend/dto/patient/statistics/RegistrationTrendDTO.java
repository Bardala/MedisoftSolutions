package clinic.dev.backend.dto.patient.statistics;

public record RegistrationTrendDTO(
    String month,
    long count) {
}
