package clinic.dev.backend.controller;

import clinic.dev.backend.dto.procedure.ProcedureReqDTO;
import clinic.dev.backend.dto.procedure.ProcedureResDTO;
import clinic.dev.backend.service.impl.ProcedureService;
import clinic.dev.backend.util.ApiRes;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services") // todo: update to procedures instead of services
public class ProcedureController {

    @Autowired
    private ProcedureService serviceService;

    @PostMapping
    public ResponseEntity<ApiRes<ProcedureResDTO>> createService(@RequestBody @Valid ProcedureReqDTO service) {
        ProcedureResDTO createdDentalProcedure = serviceService.create(service);
        return ResponseEntity.ok(new ApiRes<>(createdDentalProcedure));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiRes<ProcedureResDTO>> updateDentalProcedure(@PathVariable("id") Long id,
            @RequestBody @Valid ProcedureReqDTO service) {
        ProcedureResDTO updatedDentalProcedure = serviceService.update(id, service);
        return ResponseEntity.ok(new ApiRes<>(updatedDentalProcedure));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDentalProcedure(@PathVariable("id") Long id) {
        serviceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiRes<ProcedureResDTO>> getDentalProcedureById(@PathVariable("id") Long id) {
        ProcedureResDTO service = serviceService.getById(id);
        return ResponseEntity.ok(new ApiRes<>(service));
    }

    @GetMapping
    public ResponseEntity<ApiRes<List<ProcedureResDTO>>> getAllDentalProcedures() {
        List<ProcedureResDTO> services = serviceService.getAll();
        return ResponseEntity.ok(new ApiRes<>(services));
    }

}