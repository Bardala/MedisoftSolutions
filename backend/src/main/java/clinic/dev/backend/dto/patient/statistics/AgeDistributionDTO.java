package clinic.dev.backend.dto.patient.statistics;

public record AgeDistributionDTO(
    String phase,
    String emoji,
    String color,
    long count) {
}