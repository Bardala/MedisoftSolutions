package clinic.dev.backend.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clinic.dev.backend.dto.monthlyReport.MonthlyDayInfo;
import clinic.dev.backend.dto.monthlyReport.MonthlySummary;
import clinic.dev.backend.model.Payment;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitDentalProcedure;
import clinic.dev.backend.repository.PatientRepo;
import clinic.dev.backend.repository.PaymentRepo;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;
import clinic.dev.backend.repository.VisitRepo;
import clinic.dev.backend.service.MonthlyReportServiceBase;

@Service
public class MonthlyReportService implements MonthlyReportServiceBase {

        @Autowired
        private PatientRepo patientRepo;

        @Autowired
        private VisitRepo visitRepo;

        @Autowired
        private PaymentRepo paymentRepo;

        @Autowired
        private VisitDentalProcedureRepo visitDentalProcedureRepo;

        @Override
        @Transactional(readOnly = true)
        public MonthlySummary monthlySummary() {
                LocalDate currentDate = LocalDate.now();

                // Total New Patients (Created in the current month)
                // Check for the current month and year
                Integer totalNewPatients = (int) patientRepo.findAll().stream()
                                .filter(patient -> patient.getCreatedAt().getMonthValue() == currentDate.getMonthValue()
                                                && patient.getCreatedAt().getYear() == currentDate.getYear())
                                .count();

                // Total Visits in Current Month
                // Filter by the current month and year
                Integer totalVisits = (int) visitRepo.findAll().stream()
                                .filter(visit -> visit.getCreatedAt().getMonthValue() == currentDate.getMonthValue()
                                                && visit.getCreatedAt().getYear() == currentDate.getYear())
                                .count();

                // Most Common Procedure in Current Month
                // Filter procedure by visit month and year
                List<VisitDentalProcedure> visitDentalProcedures = visitDentalProcedureRepo.findAll().stream()
                                .filter(vdp -> vdp.getVisit().getCreatedAt().getMonthValue() == currentDate
                                                .getMonthValue() &&
                                                vdp.getVisit().getCreatedAt().getYear() == currentDate.getYear())
                                .collect(Collectors.toList());

                Map<String, Long> procedureCountMap = visitDentalProcedures.stream()
                                .collect(
                                                Collectors.groupingBy(vdp -> vdp.getDentalProcedure().getServiceName(),
                                                                Collectors.counting()));

                String mostCommonProcedure = procedureCountMap.entrySet().stream()
                                .max(Comparator.comparingLong(Map.Entry::getValue))
                                .map(Map.Entry::getKey)
                                .orElse("None");

                // Total Revenue in Current Month
                // Filter payments by current month and year
                Double totalRevenue = paymentRepo.findAll().stream()
                                .filter(payment -> payment.getCreatedAt().getMonthValue() == currentDate.getMonthValue()
                                                &&
                                                payment.getCreatedAt().getYear() == currentDate.getYear())
                                .mapToDouble(Payment::getAmount)
                                .sum();

                // Most Crowded Day in Current Month
                // Filter visits by current month and year
                List<Visit> visitsInMonth = visitRepo.findAll().stream()
                                .filter(visit -> visit.getCreatedAt().getMonthValue() == currentDate.getMonthValue() &&
                                                visit.getCreatedAt().getYear() == currentDate.getYear())
                                .collect(Collectors.toList());

                Map<LocalDate, Long> visitCountPerDay = visitsInMonth.stream()
                                .collect(Collectors.groupingBy(visit -> visit.getCreatedAt().toLocalDate(),
                                                Collectors.counting()));

                LocalDate mostCrowdedDay = visitCountPerDay.entrySet().stream()
                                .max(Comparator.comparingLong(Map.Entry::getValue))
                                .map(Map.Entry::getKey)
                                .orElse(LocalDate.now()); // Default to today if no visits found

                // Setting values to the MonthlySummary object
                MonthlySummary summary = new MonthlySummary();
                summary.setTotalNewPatients(totalNewPatients);
                summary.setTotalVisits(totalVisits);
                summary.setMostCommonProcedure(mostCommonProcedure);
                summary.setTotalRevenue(totalRevenue);
                summary.setMostCrowdedDay(mostCrowdedDay.toString());

                return summary;
        }

        public List<Payment> getPaymentsInMonth(LocalDate currentDate) {
                List<Payment> paymentsInMonth = paymentRepo.findAll().stream()
                                .filter(payment -> {
                                        LocalDateTime createdAt = payment.getCreatedAt();
                                        return createdAt.getMonthValue() == currentDate.getMonthValue() &&
                                                        createdAt.getYear() == currentDate.getYear();
                                })
                                .collect(Collectors.toList());
                return paymentsInMonth;
        }

        // Group payments by adjusted workday (6 AM to 6 AM)
        public Map<LocalDate, List<Payment>> groupPaymentByWorkday(LocalDate currentDate) {
                List<Payment> paymentsInMonth = getPaymentsInMonth(currentDate);

                Map<LocalDate, List<Payment>> paymentsByWorkday = paymentsInMonth.stream()
                                .collect(Collectors.groupingBy(payment -> {
                                        LocalDateTime createdAt = payment.getCreatedAt();
                                        // If the payment is before 6 AM, consider it part of the previous day
                                        if (createdAt.toLocalTime().isBefore(LocalTime.of(6, 0))) {
                                                // Shift to the previous day
                                                return createdAt.toLocalDate().minusDays(1);
                                        }
                                        return createdAt.toLocalDate();
                                }));
                return paymentsByWorkday;
        }

        // Get all visits in the current month
        public List<Visit> getVisitsInMonth(LocalDate currentDate) {
                List<Visit> visitsInMonth = visitRepo.findAll().stream()
                                .filter(visit -> {
                                        LocalDateTime createdAt = visit.getCreatedAt();
                                        return createdAt.getMonthValue() == currentDate.getMonthValue() &&
                                                        createdAt.getYear() == currentDate.getYear();
                                })
                                .collect(Collectors.toList());
                return visitsInMonth;
        }

        // Group visits by adjusted workday (6 AM to 6 AM)
        public Map<LocalDate, List<Visit>> groupVisitByWorkday(LocalDate currentDate) {
                List<Visit> visitsInMonth = getVisitsInMonth(currentDate);

                Map<LocalDate, List<Visit>> visitsByWorkday = visitsInMonth.stream()
                                .collect(Collectors.groupingBy(visit -> {
                                        LocalDateTime createdAt = visit.getCreatedAt();
                                        // If the visit is before 6 AM, consider it part of the previous day
                                        if (createdAt.toLocalTime().isBefore(LocalTime.of(6, 0))) {
                                                // Shift to the previous day
                                                return createdAt.toLocalDate().minusDays(1);
                                        }
                                        return createdAt.toLocalDate();
                                }));
                return visitsByWorkday;
        }

        @Override
        @Transactional(readOnly = true)
        public List<MonthlyDayInfo> monthlyDaysInfo() {
                LocalDate currentDate = LocalDate.now();

                Map<LocalDate, List<Payment>> paymentsByWorkday = groupPaymentByWorkday(currentDate);
                Map<LocalDate, List<Visit>> visitsByWorkday = groupVisitByWorkday(currentDate);

                // Prepare the result list
                List<MonthlyDayInfo> monthlyDayInfoList = new ArrayList<>();

                // Combine the keys from both maps
                Set<LocalDate> allWorkdays = new HashSet<>();
                allWorkdays.addAll(paymentsByWorkday.keySet());
                allWorkdays.addAll(visitsByWorkday.keySet());

                for (LocalDate workday : allWorkdays) {
                        // Get payments and visits for the workday
                        List<Payment> paymentsOnWorkday = paymentsByWorkday.getOrDefault(workday,
                                        Collections.emptyList());
                        List<Visit> visitsOnWorkday = visitsByWorkday.getOrDefault(workday, Collections.emptyList());

                        // Total revenue for the workday
                        double totalRevenue = paymentsOnWorkday.stream().mapToDouble(Payment::getAmount).sum();

                        // Total visits for the workday
                        int totalVisits = visitsOnWorkday.size();

                        // Most common procedure for the workday
                        List<VisitDentalProcedure> visitDentalProcedures = visitDentalProcedureRepo.findAll().stream()
                                        .filter(vdp -> {
                                                LocalDateTime createdAt = vdp.getVisit().getCreatedAt();
                                                // Ensure procedures are grouped by the adjusted workday
                                                if (createdAt.toLocalTime().isBefore(LocalTime.of(6, 0))) {
                                                        return createdAt.toLocalDate().minusDays(1).equals(workday);
                                                }
                                                return createdAt.toLocalDate().equals(workday);
                                        })
                                        .collect(Collectors.toList());

                        Map<String, Long> procedureCountMap = visitDentalProcedures.stream()
                                        .collect(Collectors.groupingBy(vdp -> vdp.getDentalProcedure().getServiceName(),
                                                        Collectors.counting()));

                        String mostCommonProcedure = procedureCountMap.entrySet().stream()
                                        .max(Comparator.comparingLong(Map.Entry::getValue))
                                        .map(Map.Entry::getKey)
                                        .orElse("None");

                        // Create and populate the MonthlyDayInfo object
                        MonthlyDayInfo dayInfo = new MonthlyDayInfo();
                        dayInfo.setDate(workday); // Use adjusted workday start
                        dayInfo.setTotalRevenue(totalRevenue);
                        dayInfo.setTotalVisits(totalVisits);
                        dayInfo.setMostProcedure(mostCommonProcedure);

                        // Add to the result list
                        monthlyDayInfoList.add(dayInfo);
                }

                return monthlyDayInfoList;
        }

        @Override
        @Transactional(readOnly = true)
        public List<String> advices() {
                List<String> advices = new ArrayList<>();

                // Example: If there are more than a certain number of visits, suggest improving
                // scheduling.
                // Filter by current month
                Long totalVisits = visitRepo.findAll().stream().filter(
                                visit -> visit.getCreatedAt().getMonthValue() == LocalDate.now().getMonthValue())
                                .count();

                if (totalVisits > 100) {
                        advices.add("Consider optimizing your scheduling to handle high visit volume.");
                }

                // Example: If a procedure is overly common, consider promoting less common ones
                List<VisitDentalProcedure> allVisitDentalProcedures = visitDentalProcedureRepo.findAll();
                Map<String, Long> procedureCountMap = allVisitDentalProcedures.stream()
                                .collect(Collectors.groupingBy(vdp -> vdp.getDentalProcedure().getServiceName(),
                                                Collectors.counting()));

                String mostCommonProcedure = procedureCountMap.entrySet().stream()
                                .max(Comparator.comparingLong(Map.Entry::getValue))
                                .map(Map.Entry::getKey)
                                .orElse("None");

                if (!mostCommonProcedure.equals("None")) {
                        advices.add("Try promoting other dental procedures, such as X-rays, to balance your services.");
                }

                return advices;
        }

}
