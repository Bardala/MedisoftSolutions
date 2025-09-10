// package clinic.dev.backend.service.impl;

// import java.time.Instant;
// import java.time.temporal.ChronoUnit;
// import java.util.List;
// import java.util.Set;
// import java.util.stream.Collectors;

// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Component;

// import clinic.dev.backend.dto.queue.QueueReqDTO;
// import clinic.dev.backend.model.Queue.Status;
// import clinic.dev.backend.model.Visit;
// import clinic.dev.backend.repository.QueueRepo;
// import clinic.dev.backend.repository.VisitRepo;
// import lombok.RequiredArgsConstructor;

// @Component
// @RequiredArgsConstructor
// public class ScheduledVisitProcessor {
// private final QueueService queueService;
// private final VisitRepo visitRepo;
// private final QueueRepo queueRepo;

// // Constants for outlier detection
// private static final double OUTLIER_THRESHOLD = 1.5; // IQR multiplier
// private static final int MIN_HISTORICAL_DATA = 5;

// @Scheduled(fixedRate = 10 * 60 * 1000) // Every 10 minutes
// public void processUpcomingVisits() {
// Instant now = Instant.now();
// Instant lookAhead = now.plus(2, ChronoUnit.HOURS);

// visitRepo.findUpcomingVisits(now, lookAhead).forEach(visit -> {
// // Check if there's already a queue entry for this patient/doctor
// boolean alreadyInQueue = queueRepo.existsByPatientAndDoctorAndStatusIn(
// visit.getPatient(),
// visit.getDoctor(),
// Set.of(Status.WAITING, Status.IN_PROGRESS));

// if (!alreadyInQueue) {
// long offsetMinutes =
// calculateEnqueueOffsetMinutes(visit.getDoctor().getId());
// Instant enqueueTime = visit.getScheduledTime().minus(offsetMinutes,
// ChronoUnit.MINUTES);

// if (enqueueTime.isBefore(now)) {
// // Time to add to queue
// QueueReqDTO req = new QueueReqDTO(
// visit.getPatient().getId(),
// visit.getDoctor().getId(),
// visit.getAssistant() != null ? visit.getAssistant().getId() : null);
// queueService.addPatientToQueue(req);
// }
// }
// });
// }

// private long calculateEnqueueOffsetMinutes(Long doctorId) {
// List<Visit> historicalVisits =
// visitRepo.findCompletedVisitsByDoctor(doctorId);

// if (historicalVisits.size() < MIN_HISTORICAL_DATA) {
// return 30; // Default fallback in minutes
// }

// // Calculate total times (wait + duration)
// List<Long> totalTimes = historicalVisits.stream()
// .filter(v -> v.getWait() != null && v.getDuration() != null)
// .map(v -> (long) (v.getWait() + v.getDuration()))
// .sorted()
// .collect(Collectors.toList());

// // Calculate quartiles for outlier detection
// double q1 = getPercentile(totalTimes, 25);
// double q3 = getPercentile(totalTimes, 75);
// double iqr = q3 - q1;
// double lowerBound = q1 - OUTLIER_THRESHOLD * iqr;
// double upperBound = q3 + OUTLIER_THRESHOLD * iqr;

// // Filter outliers and calculate average
// double average = totalTimes.stream()
// .filter(t -> t >= lowerBound && t <= upperBound)
// .mapToLong(Long::longValue)
// .average()
// .orElse(30.0);

// return (long) Math.ceil(average);
// }

// private double getPercentile(List<Long> data, double percentile) {
// int index = (int) Math.ceil(percentile / 100.0 * data.size());
// return data.get(index - 1);
// }
// }