package clinic.dev.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import clinic.dev.backend.model.ClinicSettings;
import clinic.dev.backend.service.ClinicSettingsServiceBase;
import clinic.dev.backend.util.ApiRes;

@RestController
@RequestMapping("/api/v1/settings")
@CrossOrigin(origins = "*")
public class ClinicSettingsController {

  @Autowired
  private ClinicSettingsServiceBase settingsService;

  @GetMapping
  public ResponseEntity<ApiRes<ClinicSettings>> getSettings() {
    ClinicSettings settings = settingsService.getSettings();

    if (settings != null) {
      return ResponseEntity.ok(new ApiRes<>(settings));
    } else {
      Map<String, String> error = Map.of("message", "Settings not found");
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiRes<>(error));
    }
  }

  @PostMapping
  public ResponseEntity<ApiRes<ClinicSettings>> saveSettings(@RequestBody ClinicSettings settings) {
    return ResponseEntity.ok(new ApiRes<>(settingsService.saveSettings(settings)));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<ClinicSettings>> updateSettings(@PathVariable("id") Long id,
      @RequestBody ClinicSettings updatedSettings) {
    return ResponseEntity.ok(new ApiRes<>(settingsService.updateSettings(id, updatedSettings)));
  }
}
