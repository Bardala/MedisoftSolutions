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
import clinic.dev.backend.service.ReportServiceBase;

@Service
public class ReportService implements ReportServiceBase {

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
	public MonthlySummary monthlySummary(int year, int month) {
		LocalDate targetDate = LocalDate.of(year, month, 1);

		// Total New Patients (Created in the target month)
		Integer totalNewPatients = (int) patientRepo.findAll().stream()
				.filter(patient -> patient.getCreatedAt().getMonthValue() == targetDate.getMonthValue()
						&& patient.getCreatedAt().getYear() == targetDate.getYear())
				.count();

		// Total Visits in Target Month
		Integer totalVisits = (int) visitRepo.findAll().stream()
				.filter(visit -> visit.getCreatedAt().getMonthValue() == targetDate.getMonthValue()
						&& visit.getCreatedAt().getYear() == targetDate.getYear())
				.count();

		// Most Common Procedure in Target Month
		List<VisitDentalProcedure> visitDentalProcedures = visitDentalProcedureRepo.findAll().stream()
				.filter(vdp -> vdp.getVisit().getCreatedAt().getMonthValue() == targetDate.getMonthValue()
						&& vdp.getVisit().getCreatedAt().getYear() == targetDate.getYear())
				.collect(Collectors.toList());

		Map<String, Long> procedureCountMap = visitDentalProcedures.stream()
				.collect(Collectors.groupingBy(vdp -> vdp.getDentalProcedure().getServiceName(), Collectors.counting()));

		String mostCommonProcedure = procedureCountMap.entrySet().stream()
				.max(Comparator.comparingLong(Map.Entry::getValue))
				.map(Map.Entry::getKey)
				.orElse("None");

		// Total Revenue in Target Month
		Double totalRevenue = paymentRepo.findAll().stream()
				.filter(payment -> payment.getCreatedAt().getMonthValue() == targetDate.getMonthValue()
						&& payment.getCreatedAt().getYear() == targetDate.getYear())
				.mapToDouble(Payment::getAmount)
				.sum();

		// Most Crowded Day in Target Month
		List<Visit> visitsInMonth = visitRepo.findAll().stream()
				.filter(visit -> visit.getCreatedAt().getMonthValue() == targetDate.getMonthValue()
						&& visit.getCreatedAt().getYear() == targetDate.getYear())
				.collect(Collectors.toList());

		Map<LocalDate, Long> visitCountPerDay = visitsInMonth.stream()
				.collect(Collectors.groupingBy(visit -> visit.getCreatedAt().toLocalDate(), Collectors.counting()));

		LocalDate mostCrowdedDay = visitCountPerDay.entrySet().stream()
				.max(Comparator.comparingLong(Map.Entry::getValue))
				.map(Map.Entry::getKey)
				.orElse(targetDate); // Default to the first day of the target month if no visits found

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
	@Transactional(readOnly = true)
	public List<MonthlyDayInfo> monthlyDaysInfo(int year, int month) {
		LocalDate targetDate = LocalDate.of(year, month, 1);

		Map<LocalDate, List<Payment>> paymentsByWorkday = groupPaymentByWorkday(targetDate);
		Map<LocalDate, List<Visit>> visitsByWorkday = groupVisitByWorkday(targetDate);

		// Prepare the result list
		List<MonthlyDayInfo> monthlyDayInfoList = new ArrayList<>();

		// Combine the keys from both maps
		Set<LocalDate> allWorkdays = new HashSet<>();
		allWorkdays.addAll(paymentsByWorkday.keySet());
		allWorkdays.addAll(visitsByWorkday.keySet());

		for (LocalDate workday : allWorkdays) {
			// Get payments and visits for the workday
			List<Payment> paymentsOnWorkday = paymentsByWorkday.getOrDefault(workday, Collections.emptyList());
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
					.collect(Collectors.groupingBy(vdp -> vdp.getDentalProcedure().getServiceName(), Collectors.counting()));

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
	public List<String> advices(int year, int month) {
		List<String> advices = new ArrayList<>();

		// Example: If there are more than a certain number of visits, suggest improving
		// scheduling.
		Long totalVisits = visitRepo.findAll().stream()
				.filter(visit -> visit.getCreatedAt().getMonthValue() == month && visit.getCreatedAt().getYear() == year)
				.count();

		if (totalVisits > 100) {
			advices.add("Consider optimizing your scheduling to handle high visit volume.");
		}

		// Example: If a procedure is overly common, consider promoting less common ones
		List<VisitDentalProcedure> allVisitDentalProcedures = visitDentalProcedureRepo.findAll().stream()
				.filter(vdp -> vdp.getVisit().getCreatedAt().getMonthValue() == month
						&& vdp.getVisit().getCreatedAt().getYear() == year)
				.collect(Collectors.toList());

		Map<String, Long> procedureCountMap = allVisitDentalProcedures.stream()
				.collect(Collectors.groupingBy(vdp -> vdp.getDentalProcedure().getServiceName(), Collectors.counting()));

		String mostCommonProcedure = procedureCountMap.entrySet().stream()
				.max(Comparator.comparingLong(Map.Entry::getValue))
				.map(Map.Entry::getKey)
				.orElse("None");

		if (!mostCommonProcedure.equals("None")) {
			advices.add("Try promoting other dental procedures, such as X-rays, to balance your services.");
		}

		return advices;
	}

	// Helper methods
	public List<Payment> getPaymentsInMonth(LocalDate targetDate) {
		return paymentRepo.findAll().stream()
				.filter(payment -> payment.getCreatedAt().getMonthValue() == targetDate.getMonthValue()
						&& payment.getCreatedAt().getYear() == targetDate.getYear())
				.collect(Collectors.toList());
	}

	public Map<LocalDate, List<Payment>> groupPaymentByWorkday(LocalDate targetDate) {
		List<Payment> paymentsInMonth = getPaymentsInMonth(targetDate);

		return paymentsInMonth.stream()
				.collect(Collectors.groupingBy(payment -> {
					LocalDateTime createdAt = payment.getCreatedAt();
					if (createdAt.toLocalTime().isBefore(LocalTime.of(6, 0))) {
						return createdAt.toLocalDate().minusDays(1);
					}
					return createdAt.toLocalDate();
				}));
	}

	public List<Visit> getVisitsInMonth(LocalDate targetDate) {
		return visitRepo.findAll().stream()
				.filter(visit -> visit.getCreatedAt().getMonthValue() == targetDate.getMonthValue()
						&& visit.getCreatedAt().getYear() == targetDate.getYear())
				.collect(Collectors.toList());
	}

	public Map<LocalDate, List<Visit>> groupVisitByWorkday(LocalDate targetDate) {
		List<Visit> visitsInMonth = getVisitsInMonth(targetDate);

		return visitsInMonth.stream()
				.collect(Collectors.groupingBy(visit -> {
					LocalDateTime createdAt = visit.getCreatedAt();
					if (createdAt.toLocalTime().isBefore(LocalTime.of(6, 0))) {
						return createdAt.toLocalDate().minusDays(1);
					}
					return createdAt.toLocalDate();
				}));
	}

	// public List<Visit> getTodayVisits() {
	// LocalDateTime referenceDate = LocalDateTime.now();
	// LocalDateTime workdayStart = referenceDate.with(LocalTime.of(6, 0)); // 6 AM
	// today
	// LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

	// // if the current time is after 12 AM and before 6 AM
	// if (referenceDate.isBefore(workdayStart)) {
	// LocalDateTime at12Am = referenceDate.with(LocalTime.MIN); // 12 AM today
	// LocalDateTime at6Am = at12Am.plusHours(6); // 6 AM today

	// List<Visit> visitsFrom0to6Am = getVisitsAtThisPeriod(at12Am, at6Am);

	// // Now we have to get the visits from the previous day from 6 AM to 12 AM
	// LocalDateTime after6AmYesterday =
	// workdayStart.minusDays(1).with(LocalTime.of(6, 0));

	// List<Visit> visitsAfter6AmYesterday =
	// getVisitsAtThisPeriod(after6AmYesterday, at12Am);

	// visitsFrom0to6Am.addAll(visitsAfter6AmYesterday);

	// return visitsFrom0to6Am;
	// }

	// return getVisitsAtThisPeriod(workdayStart, workdayEnd);
	// }

	// public List<Visit> getDayVisits(LocalDateTime date) {
	// LocalDateTime referenceDate = date;
	// LocalDateTime workdayStart =
	// referenceDate.toLocalDate().atTime(LocalTime.of(6, 0)); // 6 AM today
	// LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

	// // if the current time is after 12am and before 6am
	// if (referenceDate.isBefore(workdayStart)) {
	// LocalDateTime at12Am = referenceDate.toLocalDate().atTime(LocalTime.of(0,
	// 0)); // let the day starts at 12am
	// LocalDateTime at6Am = at12Am.plusHours(6); // let the day ends at 6am

	// List<Visit> visitsFrom0to6Am = getVisitsAtThisPeriod(at12Am, at6Am);

	// // Now we have to get the patient of the day before from 6am to 12am
	// LocalDateTime after6AmYesterday = at12Am.minusHours(18);

	// List<Visit> visitsAfter6AmYesterday =
	// getVisitsAtThisPeriod(after6AmYesterday, at12Am);

	// for (int i = 0; i < visitsAfter6AmYesterday.size() - 1; i++) {
	// visitsFrom0to6Am.add(visitsAfter6AmYesterday.get(i));
	// }

	// return visitsFrom0to6Am;
	// }

	// return getVisitsAtThisPeriod(workdayStart, workdayEnd);
	// }

	// public List<Visit> getVisitsAtThisPeriod(LocalDateTime start, LocalDateTime
	// end) {
	// return visitRepo.findAll().stream()
	// .filter(
	// visit -> !visit.getCreatedAt().isBefore(start) &&
	// visit.getCreatedAt().isBefore(end))
	// .collect(Collectors.toList());
	// }

}