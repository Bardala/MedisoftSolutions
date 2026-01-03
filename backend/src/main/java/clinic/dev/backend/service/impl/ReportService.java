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
import clinic.dev.backend.model.VisitPayment;
import clinic.dev.backend.repository.*;
import clinic.dev.backend.service.ReportServiceBase;
import clinic.dev.backend.util.AuthContext;
import clinic.dev.backend.util.WorkdayWindowUtil;
import clinic.dev.backend.util.WorkdayWindowUtil.TimeWindow;

@Service
public class ReportService implements ReportServiceBase {

	@Autowired
	private PatientRepo patientRepo;

	@Autowired
	private VisitRepo visitRepo;

	@Autowired
	private PaymentRepo paymentRepo;

	@Autowired
	private VisitPaymentRepo visitPaymentRepo;

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
		TimeWindow window = WorkdayWindowUtil.resolveMonthWindow(year, month);

		if (authContext.isDoctor()) {
			return buildDoctorSummary(window.start(), window.end(), targetYearMonth);
		} else {
			return buildClinicSummary(window.start(), window.end(), targetYearMonth);
		}
	}

	private MonthlySummary buildClinicSummary(Instant monthStart, Instant monthEnd, YearMonth targetYearMonth) {
		Integer totalNewPatients = patientRepo.countByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);
		Integer totalVisits = visitRepo.countByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);

		String mostCommonProcedure = findMostCommonProcedure(
				visitDentalProcedureRepo.findByVisitClinicIdAndVisitCreatedAtBetween(getClinicId(), monthStart, monthEnd));

		Double totalRevenue = paymentRepo.sumAmountByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);
		LocalDate mostCrowdedDay = findMostCrowdedDay(
				visitRepo.findByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd),
				targetYearMonth);

		MonthlySummary summary = new MonthlySummary();
		summary.setTotalNewPatients(totalNewPatients);
		summary.setTotalVisits(totalVisits);
		summary.setMostCommonProcedure(mostCommonProcedure);
		summary.setTotalRevenue(totalRevenue);
		summary.setMostCrowdedDay(mostCrowdedDay.toString());
		return summary;
	}

	private MonthlySummary buildDoctorSummary(Instant monthStart, Instant monthEnd, YearMonth targetYearMonth) {
		Long doctorId = authContext.getUserId();

		Integer totalDoctorVisits = visitRepo.countByDoctorIdAndClinicIdAndCreatedAtBetween(doctorId, getClinicId(),
				monthStart, monthEnd);

		String doctorMostCommonProcedure = findMostCommonProcedure(
				visitDentalProcedureRepo.findByVisitDoctorIdAndClinicIdAndVisitCreatedAtBetween(doctorId, getClinicId(),
						monthStart,
						monthEnd));

		Double doctorTotalRevenue = visitPaymentRepo.sumPaymentsByDoctorAndClinicAndCreatedAtBetween(doctorId,
				getClinicId(), monthStart, monthEnd);
		LocalDate doctorMostCrowdedDay = findMostCrowdedDay(
				visitRepo.findByDoctorIdAndClinicIdAndCreatedAtBetween(doctorId, getClinicId(), monthStart, monthEnd),
				targetYearMonth);

		MonthlySummary summary = new MonthlySummary();
		summary.setTotalVisits(totalDoctorVisits);
		summary.setMostCommonProcedure(doctorMostCommonProcedure);
		summary.setTotalRevenue(doctorTotalRevenue);
		summary.setMostCrowdedDay(doctorMostCrowdedDay.toString());
		return summary;
	}

	private String findMostCommonProcedure(List<VisitDentalProcedure> procedures) {
		return procedures.stream()
				.collect(Collectors.groupingBy(
						vdp -> vdp.getDentalProcedure().getServiceName(),
						Collectors.counting()))
				.entrySet().stream()
				.max(Map.Entry.comparingByValue())
				.map(Map.Entry::getKey)
				.orElse("None");
	}

	private LocalDate findMostCrowdedDay(List<Visit> visits, YearMonth targetYearMonth) {
		return visits.stream()
				.collect(Collectors.groupingBy(
						visit -> toWorkdayDate(visit.getCreatedAt()),
						Collectors.counting()))
				.entrySet().stream()
				.max(Map.Entry.comparingByValue())
				.map(Map.Entry::getKey)
				.orElse(targetYearMonth.atDay(1));
	}

	@Override
	@Transactional(readOnly = true)
	public List<MonthlyDayInfo> monthlyDaysInfo(int year, int month) {
		YearMonth targetYearMonth = YearMonth.of(year, month);
		TimeWindow window = WorkdayWindowUtil.resolveMonthWindow(year, month);

		if (authContext.isDoctor()) {
			return buildDoctorMonthlyDaysInfo(window.start(), window.end(), targetYearMonth);
		} else {
			return buildClinicMonthlyDaysInfo(window.start(), window.end(), targetYearMonth);
		}
	}

	private List<MonthlyDayInfo> buildClinicMonthlyDaysInfo(
			Instant monthStart,
			Instant monthEnd,
			YearMonth targetYearMonth) {
		List<Payment> payments = paymentRepo.findByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);
		List<Visit> visits = visitRepo.findByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);

		return buildMonthlyDayInfos(payments, visits, monthStart, monthEnd, targetYearMonth, false);
	}

	private List<MonthlyDayInfo> buildDoctorMonthlyDaysInfo(
			Instant monthStart,
			Instant monthEnd,
			YearMonth targetYearMonth) {
		Long doctorId = authContext.getUserId();

		List<VisitPayment> doctorPayments = visitPaymentRepo.findByVisitDoctorIdAndClinicIdAndPaymentCreatedAtBetween(
				doctorId, getClinicId(), monthStart, monthEnd);
		List<Payment> payments = doctorPayments.stream()
				.map(VisitPayment::getPayment)
				.collect(Collectors.toList());

		List<Visit> visits = visitRepo.findByDoctorIdAndClinicIdAndCreatedAtBetween(doctorId, getClinicId(), monthStart,
				monthEnd);

		return buildMonthlyDayInfos(payments, visits, monthStart, monthEnd, targetYearMonth, true);
	}

	private List<MonthlyDayInfo> buildMonthlyDayInfos(
			List<Payment> payments,
			List<Visit> visits,
			Instant monthStart,
			Instant monthEnd,
			YearMonth targetYearMonth,
			boolean isDoctor) {

		Map<LocalDate, List<Payment>> paymentsByWorkday = payments.stream()
				.collect(Collectors.groupingBy(payment -> toWorkdayDate(payment.getCreatedAt())));

		Map<LocalDate, List<Visit>> visitsByWorkday = visits.stream()
				.collect(Collectors.groupingBy(visit -> toWorkdayDate(visit.getCreatedAt())));

		Set<LocalDate> allWorkdays = new HashSet<>();
		allWorkdays.addAll(paymentsByWorkday.keySet());
		allWorkdays.addAll(visitsByWorkday.keySet());

		return allWorkdays.stream()
				.map(workday -> buildDayInfo(workday, paymentsByWorkday, visitsByWorkday, targetYearMonth, isDoctor))
				.sorted(Comparator.comparing(MonthlyDayInfo::getDate))
				.collect(Collectors.toList());
	}

	private MonthlyDayInfo buildDayInfo(
			LocalDate workday,
			Map<LocalDate, List<Payment>> paymentsByWorkday,
			Map<LocalDate, List<Visit>> visitsByWorkday,
			YearMonth targetYearMonth,
			boolean isDoctor) {

		List<Payment> dayPayments = paymentsByWorkday.getOrDefault(workday, Collections.emptyList());
		List<Visit> dayVisits = visitsByWorkday.getOrDefault(workday, Collections.emptyList());

		Instant workdayStart = workday.atTime(6, 0).atZone(ZoneId.systemDefault()).toInstant();
		Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

		List<VisitDentalProcedure> procedures = isDoctor
				? visitDentalProcedureRepo.findByVisitDoctorIdAndClinicIdAndVisitCreatedAtBetween(authContext.getUserId(),
						getClinicId(), workdayStart, workdayEnd)
				: visitDentalProcedureRepo.findByVisitClinicIdAndVisitCreatedAtBetween(getClinicId(), workdayStart, workdayEnd);

		String mostCommonProcedure = procedures.stream()
				.collect(Collectors.groupingBy(vdp -> vdp.getDentalProcedure().getServiceName(), Collectors.counting()))
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
	}

	@Override
	@Transactional(readOnly = true)
	public List<String> advices(int year, int month) {
		TimeWindow window = WorkdayWindowUtil.resolveMonthWindow(year, month);

		if (authContext.isDoctor()) {
			return buildDoctorAdvices(window.start(), window.end());
		} else {
			return buildClinicAdvices(window.start(), window.end());
		}
	}

	private List<String> buildClinicAdvices(Instant monthStart, Instant monthEnd) {
		List<String> advices = new ArrayList<>();

		// Visit volume advice
		Integer totalVisits = visitRepo.countByClinicIdAndCreatedAtBetween(getClinicId(), monthStart, monthEnd);
		if (totalVisits > 100) {
			advices.add("Consider optimizing your scheduling to handle high visit volume.");
		}

		// Procedure balance advice
		List<VisitDentalProcedure> procedures = visitDentalProcedureRepo
				.findByVisitClinicIdAndVisitCreatedAtBetween(getClinicId(), monthStart, monthEnd);

		addProcedureBalanceAdvice(procedures, advices);

		return advices;
	}

	private List<String> buildDoctorAdvices(Instant monthStart, Instant monthEnd) {
		List<String> advices = new ArrayList<>();
		Long doctorId = authContext.getUserId();

		// Visit volume advice for doctor
		Integer doctorVisits = visitRepo.countByDoctorIdAndClinicIdAndCreatedAtBetween(doctorId, getClinicId(), monthStart,
				monthEnd);
		if (doctorVisits > 50) {
			advices.add("Consider optimizing your personal schedule to handle high patient volume.");
		}

		// Procedure balance advice for doctor
		List<VisitDentalProcedure> doctorProcedures = visitDentalProcedureRepo
				.findByVisitDoctorIdAndClinicIdAndVisitCreatedAtBetween(doctorId, getClinicId(), monthStart, monthEnd);

		addProcedureBalanceAdvice(doctorProcedures, advices);

		return advices;
	}

	private void addProcedureBalanceAdvice(List<VisitDentalProcedure> procedures, List<String> advices) {
		if (!procedures.isEmpty()) {
			Map<String, Long> procedureCounts = procedures.stream()
					.collect(Collectors.groupingBy(
							vdp -> vdp.getDentalProcedure().getServiceName(),
							Collectors.counting()));

			String mostCommon = Collections.max(procedureCounts.entrySet(), Map.Entry.comparingByValue()).getKey();
			advices.add("Try promoting other dental procedures to balance your services (most common: " + mostCommon + ")");
		}
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