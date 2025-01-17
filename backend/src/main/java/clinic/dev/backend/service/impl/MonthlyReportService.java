package clinic.dev.backend.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import clinic.dev.backend.dto.monthlyReport.MonthlyDayInfo;
import clinic.dev.backend.dto.monthlyReport.MonthlySummary;
import clinic.dev.backend.model.Payment;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitDentalProcedure;
import clinic.dev.backend.repository.PatientRepo;
import clinic.dev.backend.repository.PaymentRepo;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;
import clinic.dev.backend.repository.VisitPaymentRepo;
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

        @Autowired
        private VisitPaymentRepo visitPaymentRepo;

        @Override
        public MonthlySummary monthlySummary() {
                LocalDate currentDate = LocalDate.now();

                // Total New Patients (Created in the current month)
                Integer totalNewPatients = (int) patientRepo.findAll().stream()
                                .filter(patient -> patient.getCreatedAt().getMonthValue() == currentDate.getMonthValue()
                                                &&
                                                patient.getCreatedAt().getYear() == currentDate.getYear()) // Check for
                                                                                                           // the
                                                                                                           // current
                                                                                                           // month and
                                                                                                           // year
                                .count();

                // Total Visits in Current Month
                Integer totalVisits = (int) visitRepo.findAll().stream()
                                .filter(visit -> visit.getCreatedAt().getMonthValue() == currentDate.getMonthValue() &&
                                                visit.getCreatedAt().getYear() == currentDate.getYear()) // Filter by
                                                                                                         // the current
                                                                                                         // month and
                                                                                                         // year
                                .count();

                // Most Common Procedure in Current Month
                List<VisitDentalProcedure> visitDentalProcedures = visitDentalProcedureRepo.findAll().stream()
                                .filter(vdp -> vdp.getVisit().getCreatedAt().getMonthValue() == currentDate
                                                .getMonthValue() &&
                                                vdp.getVisit().getCreatedAt().getYear() == currentDate.getYear()) // Filter
                                                                                                                  // procedures
                                                                                                                  // by
                                                                                                                  // visit
                                                                                                                  // month
                                                                                                                  // and
                                                                                                                  // year
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
                Double totalRevenue = paymentRepo.findAll().stream()
                                .filter(payment -> payment.getCreatedAt().getMonthValue() == currentDate.getMonthValue()
                                                &&
                                                payment.getCreatedAt().getYear() == currentDate.getYear()) // Filter
                                                                                                           // payments
                                                                                                           // by the
                                                                                                           // current
                                                                                                           // month and
                                                                                                           // year
                                .mapToDouble(Payment::getAmount)
                                .sum();

                // Most Crowded Day in Current Month
                List<Visit> visitsInMonth = visitRepo.findAll().stream()
                                .filter(visit -> visit.getCreatedAt().getMonthValue() == currentDate.getMonthValue() &&
                                                visit.getCreatedAt().getYear() == currentDate.getYear()) // Filter
                                                                                                         // visits by
                                                                                                         // current
                                                                                                         // month and
                                                                                                         // year
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

        @Override
        public List<MonthlyDayInfo> monthlyDaysInfo() {
                LocalDate currentDate = LocalDate.now();

                // Get all visits in the current month
                List<Visit> visitsInMonth = visitRepo.findAll().stream()
                                .filter(visit -> visit.getCreatedAt().getMonthValue() == currentDate.getMonthValue() &&
                                                visit.getCreatedAt().getYear() == currentDate.getYear())
                                .collect(Collectors.toList());

                // Group visits by day
                Map<LocalDate, List<Visit>> visitsByDay = visitsInMonth.stream()
                                .collect(Collectors.groupingBy(visit -> visit.getCreatedAt().toLocalDate()));

                // Prepare the result list
                List<MonthlyDayInfo> monthlyDayInfoList = new ArrayList<>();

                // For each day, calculate the required information
                for (Map.Entry<LocalDate, List<Visit>> entry : visitsByDay.entrySet()) {
                        LocalDate day = entry.getKey();
                        List<Visit> visitsOnDay = entry.getValue();

                        // Total visits for the day
                        Integer totalVisit = visitsOnDay.size();

                        // Total revenue for the day
                        Double totalRevenue = visitsOnDay.stream()
                                        .flatMap(visit -> visitPaymentRepo.findByVisit(visit).stream())
                                        .mapToDouble(visitPayment -> visitPayment.getPayment().getAmount())
                                        .sum();

                        // Most common procedure for the day
                        List<VisitDentalProcedure> visitDentalProcedures = visitDentalProcedureRepo.findAll().stream()
                                        .filter(vdp -> vdp.getVisit().getCreatedAt().toLocalDate().equals(day))
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
                        dayInfo.setDate(day);
                        dayInfo.setTotalVisits(totalVisit);
                        dayInfo.setTotalRevenue(totalRevenue);
                        dayInfo.setMostProcedure(mostCommonProcedure);

                        // Add to the result list
                        monthlyDayInfoList.add(dayInfo);
                }

                return monthlyDayInfoList;
        }

        @Override
        public List<String> advices() {
                List<String> advices = new ArrayList<>();

                // Example: If there are more than a certain number of visits, suggest improving
                // scheduling.
                Long totalVisits = visitRepo.findAll().stream()
                                .filter(visit -> visit.getCreatedAt().getMonthValue() == LocalDate.now()
                                                .getMonthValue()) // Filter by
                                                                  // current
                                                                  // month
                                .count();

                if (totalVisits > 100) {
                        advices.add("Consider optimizing your scheduling to handle high visit volume.");
                }

                // Example: If a procedure is overly common, consider promoting less common ones
                List<VisitDentalProcedure> allVisitDentalProcedures = visitDentalProcedureRepo.findAll();
                Map<String, Long> procedureCountMap = allVisitDentalProcedures.stream()
                                .collect(
                                                Collectors.groupingBy(vdp -> vdp.getDentalProcedure().getServiceName(),
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
