package clinic.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import clinic.dev.backend.constants.MESSAGES;

@RestController
@RequestMapping("/api/v1/healthz")
public class Healthz {

  @GetMapping
  public ResponseEntity<String> healthz() {
    return ResponseEntity.ok().body(MESSAGES.SERVER_IS_UP);
  }
}
