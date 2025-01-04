package clinic.dev.backend.controller;

import clinic.dev.backend.model.Log;
import clinic.dev.backend.service.impl.LogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogController {

  @Autowired
  private LogService logService;

  @PostMapping
  public void addLog(
      @RequestParam(required = false) Long userId,
      @RequestParam String action,
      @RequestParam(required = false) String details,
      @RequestParam(required = false) String ipAddress,
      @RequestParam String logLevel,
      @RequestParam(required = false) String stackTrace) {
    logService.createLog(userId, action, details, ipAddress, logLevel, stackTrace);
  }

  @GetMapping
  public List<Log> getLogs() {
    return logService.getAllLogs();
  }
}
