package clinic.dev.backend.dto.patient.statistics;

import java.util.List;

public record PatientStatisticsDTO(
    List<AgeDistributionDTO> ageDistribution,
    List<AddressDistributionDTO> addressDistribution,
    List<RegistrationTrendDTO> registrationTrend) {

}
