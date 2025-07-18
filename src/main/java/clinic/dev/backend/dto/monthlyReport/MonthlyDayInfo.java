package clinic.dev.backend.dto.monthlyReport;

import java.time.LocalDate;

import lombok.Data;

@Data
public class MonthlyDayInfo {
  private LocalDate date; // Add date field
  private Integer totalVisits;
  private Double totalRevenue;
  private String mostProcedure;
}
