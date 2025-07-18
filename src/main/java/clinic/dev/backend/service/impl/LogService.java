package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Log;
import clinic.dev.backend.model.LogLevel;
import clinic.dev.backend.repository.LogRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class LogService {

  @Autowired
  private LogRepo logRepository;

  private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

  public void createLog(Long userId, String action, String details, String ipAddress, String logLevel,
      String stackTrace) {
    Log log = new Log();
    log.setTimestamp(LocalDateTime.now().format(formatter));
    log.setUserId(userId);
    log.setAction(action);
    log.setDetails(details);
    log.setIpAddress(ipAddress);
    log.setLogLevel(LogLevel.valueOf(logLevel.toUpperCase()));
    log.setStackTrace(stackTrace);
    logRepository.save(log);
  }

  public List<Log> getAllLogs() {
    return logRepository.findAll();
  }
}
