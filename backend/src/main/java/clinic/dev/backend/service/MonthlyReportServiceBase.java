package clinic.dev.backend.service;

import java.util.List;

import clinic.dev.backend.dto.monthlyReport.MonthlyDayInfo;
import clinic.dev.backend.dto.monthlyReport.MonthlySummary;

public interface MonthlyReportServiceBase {
  MonthlySummary monthlySummary();

  List<MonthlyDayInfo> monthlyDaysInfo();

  List<String> advices();
}
