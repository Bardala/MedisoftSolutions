package clinic.dev.backend.dto.monthlyReport;

import lombok.Data;

@Data
public class MonthlySummary {
  private Integer totalNewPatients;
  private Integer totalVisits;
  private Double totalRevenue;
  private String mostCommonProcedure;
  private String mostCrowdedDay;
}