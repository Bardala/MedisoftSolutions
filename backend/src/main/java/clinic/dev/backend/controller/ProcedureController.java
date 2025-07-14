package clinic.dev.backend.controller;

import clinic.dev.backend.dto.procedure.ProcedureReqDTO;
import clinic.dev.backend.dto.procedure.ProcedureResDTO;
import clinic.dev.backend.service.impl.ProcedureService;
import clinic.dev.backend.util.ApiRes;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services") // todo: update to procedures instead of services
public class ProcedureController {

    @Autowired
    private ProcedureService procedureService;

    @PostMapping
    @PreAuthorize("@auth.isDoctor() or @auth.isOwner()")
    public ResponseEntity<ApiRes<ProcedureResDTO>> createService(@RequestBody @Valid ProcedureReqDTO service) {
        ProcedureResDTO createdDentalProcedure = procedureService.create(service);
        return ResponseEntity.ok(new ApiRes<>(createdDentalProcedure));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@auth.isDoctor() or @auth.isOwner()")
    public ResponseEntity<ApiRes<ProcedureResDTO>> updateDentalProcedure(@PathVariable("id") Long id,
            @RequestBody @Valid ProcedureReqDTO service) {
        ProcedureResDTO updatedDentalProcedure = procedureService.update(id, service);
        return ResponseEntity.ok(new ApiRes<>(updatedDentalProcedure));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@auth.isDoctor() or @auth.isOwner()")
    public ResponseEntity<Void> deleteDentalProcedure(@PathVariable("id") Long id) {
        procedureService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiRes<ProcedureResDTO>> getDentalProcedureById(@PathVariable("id") Long id) {
        ProcedureResDTO service = procedureService.getById(id);
        return ResponseEntity.ok(new ApiRes<>(service));
    }

    @GetMapping
    public ResponseEntity<ApiRes<List<ProcedureResDTO>>> getAllDentalProcedures() {
        List<ProcedureResDTO> services = procedureService.getAll();
        return ResponseEntity.ok(new ApiRes<>(services));
    }

    @GetMapping("/batch")
    public ResponseEntity<ApiRes<List<ProcedureResDTO>>> getProceduresByIds(
            @RequestParam("ids") List<Long> ids) {
        List<ProcedureResDTO> procedures = procedureService.getProceduresByIds(ids);
        return ResponseEntity.ok(new ApiRes<>(procedures));
    }
}