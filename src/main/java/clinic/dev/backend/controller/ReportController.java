package clinic.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import clinic.dev.backend.dto.monthlyReport.MonthlyDayInfo;
import clinic.dev.backend.dto.monthlyReport.MonthlySummary;
import clinic.dev.backend.service.impl.ReportService;
import clinic.dev.backend.util.ApiRes;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

  @Autowired
  private ReportService monthlyReportService;

  @GetMapping("/month/summary")
  public ResponseEntity<ApiRes<MonthlySummary>> getMonthlySummary(
      @RequestParam("year") int year, // Explicitly specify the parameter name
      @RequestParam("month") int month) { // Explicitly specify the parameter name
    MonthlySummary monthlySummary = monthlyReportService.monthlySummary(year, month);
    return ResponseEntity.ok(new ApiRes<>(monthlySummary));
  }

  @GetMapping("/month/daysInfo")
  public ResponseEntity<ApiRes<List<MonthlyDayInfo>>> getMonthlyDaysInfo(
      @RequestParam("year") int year, // Explicitly specify the parameter name
      @RequestParam("month") int month) { // Explicitly specify the parameter name
    List<MonthlyDayInfo> monthlyDayInfos = monthlyReportService.monthlyDaysInfo(year, month);
    return ResponseEntity.ok(new ApiRes<>(monthlyDayInfos));
  }

  @GetMapping("/month/advices")
  public ResponseEntity<ApiRes<List<String>>> getMonthlyAdvices(
      @RequestParam("year") int year, // Explicitly specify the parameter name
      @RequestParam("month") int month) { // Explicitly specify the parameter name
    List<String> advices = monthlyReportService.advices(year, month);
    return ResponseEntity.ok(new ApiRes<>(advices));
  }
}