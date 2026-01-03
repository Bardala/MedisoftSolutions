package clinic.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import clinic.dev.backend.dto.monthlyReport.MonthlyDayInfo;
import clinic.dev.backend.dto.monthlyReport.MonthlySummary;
import clinic.dev.backend.service.impl.ReportService;
import clinic.dev.backend.util.ApiRes;

// todo: Add authorization checks for all endpoints
@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

  @Autowired
  private ReportService monthlyReportService;

  @GetMapping("/month/summary")
  @PreAuthorize("@auth.isDoctor || @auth.isOwner")
  public ResponseEntity<ApiRes<MonthlySummary>> getMonthlySummary(
      @RequestParam("year") int year,
      @RequestParam("month") int month) {
    MonthlySummary monthlySummary = monthlyReportService.monthlySummary(year, month);
    return ResponseEntity.ok(new ApiRes<>(monthlySummary));
  }

  @GetMapping("/month/daysInfo")
  @PreAuthorize("@auth.isDoctor || @auth.isOwner")
  public ResponseEntity<ApiRes<List<MonthlyDayInfo>>> getMonthlyDaysInfo(
      @RequestParam("year") int year,
      @RequestParam("month") int month) {
    List<MonthlyDayInfo> monthlyDayInfos = monthlyReportService.monthlyDaysInfo(year, month);
    return ResponseEntity.ok(new ApiRes<>(monthlyDayInfos));
  }

  @GetMapping("/month/advices")
  @PreAuthorize("@auth.isDoctor || @auth.isOwner")
  public ResponseEntity<ApiRes<List<String>>> getMonthlyAdvices(
      @RequestParam("year") int year,
      @RequestParam("month") int month) {
    List<String> advices = monthlyReportService.advices(year, month);
    return ResponseEntity.ok(new ApiRes<>(advices));
  }
}