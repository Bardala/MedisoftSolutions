package clinic.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/healthz")
public class Healthz {

  @GetMapping
  public ResponseEntity<String> healthz() {
    return ResponseEntity.ok().body("Server is up");
  }
}
