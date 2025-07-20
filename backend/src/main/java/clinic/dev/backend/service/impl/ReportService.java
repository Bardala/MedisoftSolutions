package clinic.dev.backend.service.impl;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clinic.dev.backend.dto.monthlyReport.MonthlyDayInfo;
import clinic.dev.backend.dto.monthlyReport.MonthlySummary;
import clinic.dev.backend.model.Payment;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitDentalProcedure;
import clinic.dev.backend.repository.*;
import clinic.dev.backend.service.ReportServiceBase;
import clinic.dev.backend.util.AuthContext;

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

	@Autowired
	private AuthContext authContext;

	private Long getClinicId() {
		return authContext.getClinicId();
	}

	@Override
	@Transactional(readOnly = true)
	public MonthlySummary monthlySummary(int year, int month) {
		YearMonth targetYearMonth = YearMonth.of(year, month);
		Instant monthStart = targetYearMonth.atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
		Instant monthEnd = targetYearMonth.atEndOfMonth().atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant();

		// Total New Patients
		Integer totalNewPatients = patientRepo.countByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);

		// Total Visits
		Integer totalVisits = visitRepo.countByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);

		// Most Common Procedure
		List<VisitDentalProcedure> visitDentalProcedures = visitDentalProcedureRepo
				.findByVisitClinicIdAndVisitCreatedAtBetween(getClinicId(), monthStart, monthEnd);

		String mostCommonProcedure = visitDentalProcedures.stream()
				.collect(Collectors.groupingBy(
						vdp -> vdp.getDentalProcedure().getServiceName(),
						Collectors.counting()))
				.entrySet().stream()
				.max(Map.Entry.comparingByValue())
				.map(Map.Entry::getKey)
				.orElse("None");

		// Total Revenue
		Double totalRevenue = paymentRepo.sumAmountByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);

		// Most Crowded Day
		Map<LocalDate, Long> visitCountPerDay = visitRepo
				.findByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd)
				.stream()
				.collect(Collectors.groupingBy(
						visit -> toWorkdayDate(visit.getCreatedAt()),
						Collectors.counting()));

		LocalDate mostCrowdedDay = visitCountPerDay.entrySet().stream()
				.max(Map.Entry.comparingByValue())
				.map(Map.Entry::getKey)
				.orElse(targetYearMonth.atDay(1));

		// Create summary
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
		YearMonth targetYearMonth = YearMonth.of(year, month);
		Instant monthStart = targetYearMonth.atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
		Instant monthEnd = targetYearMonth.atEndOfMonth().atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant();

		// Get all payments and visits for the month
		List<Payment> payments = paymentRepo.findByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);
		List<Visit> visits = visitRepo.findByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);

		// Group by workday (6 AM to 6 AM)
		Map<LocalDate, List<Payment>> paymentsByWorkday = payments.stream()
				.collect(Collectors.groupingBy(
						payment -> toWorkdayDate(payment.getCreatedAt())));

		Map<LocalDate, List<Visit>> visitsByWorkday = visits.stream()
				.collect(Collectors.groupingBy(
						visit -> toWorkdayDate(visit.getCreatedAt())));

		// Get all unique workdays
		Set<LocalDate> allWorkdays = new HashSet<>();
		allWorkdays.addAll(paymentsByWorkday.keySet());
		allWorkdays.addAll(visitsByWorkday.keySet());

		return allWorkdays.stream()
				.map(workday -> {
					List<Payment> dayPayments = paymentsByWorkday.getOrDefault(workday, Collections.emptyList());
					List<Visit> dayVisits = visitsByWorkday.getOrDefault(workday, Collections.emptyList());

					// Get procedures for this workday
					Instant workdayStart = workday.atTime(6, 0).atZone(ZoneId.systemDefault()).toInstant();
					Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

					List<VisitDentalProcedure> procedures = visitDentalProcedureRepo
							.findByVisitClinicIdAndVisitCreatedAtBetween(getClinicId(), workdayStart, workdayEnd);

					String mostCommonProcedure = procedures.stream()
							.collect(Collectors.groupingBy(
									vdp -> vdp.getDentalProcedure().getServiceName(),
									Collectors.counting()))
							.entrySet().stream()
							.max(Map.Entry.comparingByValue())
							.map(Map.Entry::getKey)
							.orElse("None");

					MonthlyDayInfo dayInfo = new MonthlyDayInfo();
					dayInfo.setDate(workday);
					dayInfo.setTotalRevenue(dayPayments.stream().mapToDouble(Payment::getAmount).sum());
					dayInfo.setTotalVisits(dayVisits.size());
					dayInfo.setMostProcedure(mostCommonProcedure);

					return dayInfo;
				})
				.sorted(Comparator.comparing(MonthlyDayInfo::getDate))
				.collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public List<String> advices(int year, int month) {
		List<String> advices = new ArrayList<>();
		YearMonth targetYearMonth = YearMonth.of(year, month);
		Instant monthStart = targetYearMonth.atDay(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
		Instant monthEnd = targetYearMonth.atEndOfMonth().atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant();

		// Visit volume advice
		Integer totalVisits = visitRepo.countByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);
		if (totalVisits > 100) {
			advices.add("Consider optimizing your scheduling to handle high visit volume.");
		}

		// Procedure balance advice
		List<VisitDentalProcedure> procedures = visitDentalProcedureRepo
				.findByVisitClinicIdAndVisitCreatedAtBetween(getClinicId(), monthStart, monthEnd);

		if (!procedures.isEmpty()) {
			Map<String, Long> procedureCounts = procedures.stream()
					.collect(Collectors.groupingBy(
							vdp -> vdp.getDentalProcedure().getServiceName(),
							Collectors.counting()));

			String mostCommon = Collections.max(procedureCounts.entrySet(), Map.Entry.comparingByValue()).getKey();
			advices.add("Try promoting other dental procedures to balance your services (most common: " + mostCommon + ")");
		}

		return advices;
	}

	/**
	 * Converts an Instant to the workday date (6 AM to 6 AM)
	 */
	private LocalDate toWorkdayDate(Instant instant) {
		ZonedDateTime zoned = instant.atZone(ZoneId.systemDefault());
		if (zoned.toLocalTime().isBefore(LocalTime.of(6, 0))) {
			return zoned.toLocalDate().minusDays(1);
		}
		return zoned.toLocalDate();
	}
}