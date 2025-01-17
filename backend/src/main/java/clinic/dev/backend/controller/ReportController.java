package clinic.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import clinic.dev.backend.dto.monthlyReport.MonthlyDayInfo;
import clinic.dev.backend.dto.monthlyReport.MonthlySummary;
import clinic.dev.backend.service.impl.MonthlyReportService;
import clinic.dev.backend.util.ApiRes;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

  @Autowired
  private MonthlyReportService monthlyReportService;

  @GetMapping("/month/summary")
  public ResponseEntity<ApiRes<MonthlySummary>> getMonthlySummary() {
    MonthlySummary monthlySummary = monthlyReportService.monthlySummary();
    return ResponseEntity.ok(new ApiRes<>(monthlySummary));
  }

  @GetMapping("/month/daysInfo")
  public ResponseEntity<ApiRes<List<MonthlyDayInfo>>> getMonthlyDaysInfo() {
    List<MonthlyDayInfo> monthlyDayInfos = monthlyReportService.monthlyDaysInfo();
    return ResponseEntity.ok(new ApiRes<>(monthlyDayInfos));
  }

  @GetMapping("/month/advices")
  public ResponseEntity<ApiRes<List<String>>> getMonthlyAdvices() {
    List<String> advices = monthlyReportService.advices();
    return ResponseEntity.ok(new ApiRes<>(advices));
  }
}
