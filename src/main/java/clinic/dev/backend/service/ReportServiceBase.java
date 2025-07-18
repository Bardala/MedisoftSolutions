package clinic.dev.backend.service;

import java.util.List;

import clinic.dev.backend.dto.monthlyReport.MonthlyDayInfo;
import clinic.dev.backend.dto.monthlyReport.MonthlySummary;

public interface ReportServiceBase {
  MonthlySummary monthlySummary(int year, int month);

  List<MonthlyDayInfo> monthlyDaysInfo(int year, int month);

  List<String> advices(int year, int month);
}
