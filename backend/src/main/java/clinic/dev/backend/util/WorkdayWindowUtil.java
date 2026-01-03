// backend/src/main/java/clinic/dev/backend/util/WorkdayWindowUtil.java
package clinic.dev.backend.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;

/**
 * Utility class for handling time window calculations with centralized control
 * over work hours and date boundaries.
 * 
 * Supports:
 * - Workday windows (6 AM to 6 AM next day)
 * - Month windows (start to end of month)
 * - Week windows
 * 
 * Change the constants below to control all time windows across the
 * application.
 */
public final class WorkdayWindowUtil {

  // ===== CENTRALIZED CONFIGURATION =====
  // Change these values to update all time windows across the application
  private static final int WORKDAY_START_HOUR = 6;
  private static final int WORKDAY_START_MINUTE = 0;
  private static final int MONTH_END_HOUR = 23;
  private static final int MONTH_END_MINUTE = 59;
  private static final int MONTH_END_SECOND = 59;

  private WorkdayWindowUtil() {
    // Utility class
  }

  /**
   * Resolves the workday window for a given date:
   * - Normally: WORKDAY_START_HOUR to WORKDAY_START_HOUR next day
   * - Special case: if it's today but before WORKDAY_START_HOUR, shift window
   * back one day
   */
  public static TimeWindow resolveWorkdayWindow(LocalDate date) {
    ZoneId zone = ZoneId.systemDefault();
    Instant workdayStart = date.atTime(WORKDAY_START_HOUR, WORKDAY_START_MINUTE)
        .atZone(zone)
        .toInstant();
    Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

    LocalDate today = LocalDate.now(zone);
    Instant now = Instant.now();
    if (date.equals(today) && now.isBefore(workdayStart)) {
      workdayStart = workdayStart.minus(24, ChronoUnit.HOURS);
      workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);
    }

    return new TimeWindow(workdayStart, workdayEnd);
  }

  /**
   * Resolves the month window for a given year and month.
   * - Start: First day of month at 00:00:00
   * - End: Last day of month at MONTH_END_HOUR:MONTH_END_MINUTE:MONTH_END_SECOND
   */
  public static TimeWindow resolveMonthWindow(int year, int month) {
    YearMonth targetYearMonth = YearMonth.of(year, month);
    ZoneId zone = ZoneId.systemDefault();

    Instant monthStart = targetYearMonth.atDay(1)
        .atStartOfDay(zone)
        .toInstant();

    Instant monthEnd = targetYearMonth.atEndOfMonth()
        .atTime(MONTH_END_HOUR, MONTH_END_MINUTE, MONTH_END_SECOND)
        .atZone(zone)
        .toInstant();

    return new TimeWindow(monthStart, monthEnd);
  }

  /**
   * Resolves the month window for a given YearMonth.
   * - Start: First day of month at 00:00:00
   * - End: Last day of month at MONTH_END_HOUR:MONTH_END_MINUTE:MONTH_END_SECOND
   */
  public static TimeWindow resolveMonthWindow(YearMonth yearMonth) {
    return resolveMonthWindow(yearMonth.getYear(), yearMonth.getMonthValue());
  }

  /**
   * Resolves the week window for a given start date (typically Monday).
   * - Start: Start date at 00:00:00
   * - End: 8 days later at 00:00:00 (covers full week including weekend)
   */
  public static TimeWindow resolveWeekWindow(LocalDate startDate) {
    ZoneId zone = ZoneId.systemDefault();
    Instant weekStart = startDate.atStartOfDay(zone).toInstant();
    Instant weekEnd = weekStart.plus(8, ChronoUnit.DAYS);

    return new TimeWindow(weekStart, weekEnd);
  }

  /**
   * Helper record to hold start/end instants for a time window.
   */
  public record TimeWindow(Instant start, Instant end) {
  }
}