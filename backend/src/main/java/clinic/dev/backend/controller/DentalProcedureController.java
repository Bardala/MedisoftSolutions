package clinic.dev.backend.controller;

import clinic.dev.backend.model.DentalProcedure;
import clinic.dev.backend.service.impl.DentalProcedureService;
import clinic.dev.backend.util.ApiRes;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
public class DentalProcedureController {

  @Autowired
  private DentalProcedureService serviceService;

  @PostMapping
  public ResponseEntity<ApiRes<DentalProcedure>> createService(@RequestBody DentalProcedure service) {
    DentalProcedure createdDentalProcedure = serviceService.create(service);
    return ResponseEntity.ok(new ApiRes<>(createdDentalProcedure));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<DentalProcedure>> updateDentalProcedure(@PathVariable Long id,
      @RequestBody DentalProcedure service) {
    DentalProcedure updatedDentalProcedure = serviceService.update(id, service);
    return ResponseEntity.ok(new ApiRes<>(updatedDentalProcedure));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteDentalProcedure(@PathVariable Long id) {
    serviceService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<DentalProcedure>> getDentalProcedureById(@PathVariable Long id) {
    DentalProcedure service = serviceService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(service));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<DentalProcedure>>> getAllDentalProcedures() {
    List<DentalProcedure> services = serviceService.getAll();
    return ResponseEntity.ok(new ApiRes<>(services));
  }

  @PostConstruct
  public void initDentalProcedures() {
    if (serviceService.getAll().isEmpty()) {

      serviceService.deleteAll();

      // Endodontics
      serviceService.create(new DentalProcedure("Endodontics - Amalgam", "علاج جذور - حشوة أملغم",
          "Endodontics Amalgam Description", 100.0));
      serviceService.create(new DentalProcedure("Endodontics - Composite", "علاج جذور - حشوة كومبوزيت",
          "Endodontics Composite Description", 150.0));

      // Operative Dentistry
      serviceService.create(new DentalProcedure("Operative Dentistry - Amalgam", "طب الأسنان التحفظي - حشوة أملغم",
          "Operative Dentistry Amalgam Description", 100.0));
      serviceService.create(new DentalProcedure("Operative Dentistry - Composite", "طب الأسنان التحفظي - حشوة كومبوزيت",
          "Operative Dentistry Composite Description", 150.0));
      serviceService.create(new DentalProcedure("Operative Dentistry - Metal", "طب الأسنان التحفظي - حشوة معدنية",
          "Operative Dentistry Metal Description", 200.0));
      serviceService.create(new DentalProcedure("Operative Dentistry - Porcelain", "طب الأسنان التحفظي - حشوة بورسلين",
          "Operative Dentistry Porcelain Description", 250.0));
      serviceService.create(new DentalProcedure("Operative Dentistry - Zircon", "طب الأسنان التحفظي - حشوة زركون",
          "Operative Dentistry Zircon Description", 300.0));

      // Crown
      serviceService.create(new DentalProcedure("Crown - Metal", "تاج - معدني", "Crown Metal Description", 200.0));
      serviceService
          .create(new DentalProcedure("Crown - Porcelain", "تاج - بورسلين", "Crown Porcelain Description", 250.0));
      serviceService.create(new DentalProcedure("Crown - Zircon", "تاج - زركون", "Crown Zircon Description", 300.0));

      // Bridge
      serviceService.create(new DentalProcedure("Bridge - Metal", "جسر - معدني", "Bridge Metal Description", 200.0));
      serviceService
          .create(new DentalProcedure("Bridge - Porcelain", "جسر - بورسلين", "Bridge Porcelain Description", 250.0));
      serviceService.create(new DentalProcedure("Bridge - Zircon", "جسر - زركون", "Bridge Zircon Description", 300.0));

      // Extraction
      serviceService
          .create(new DentalProcedure("Extraction - Tooth", "خلع - سن", "Extraction Tooth Description", 100.0));
      serviceService.create(
          new DentalProcedure("Extraction - Pediatric (Pedo)", "خلع - أطفال", "Extraction Pediatric Description",
              150.0));
      serviceService
          .create(
              new DentalProcedure("Extraction - Impacted", "خلع - مطمور", "Extraction Impacted Description", 200.0));
      serviceService.create(new DentalProcedure("Extraction - Remaining Root", "خلع - جذر متبقي",
          "Extraction Remaining Root Description", 250.0));

      // Orthodontics
      serviceService.create(new DentalProcedure("Orthodontics - Fixed - Metal", "تقويم الأسنان - ثابت - معدني",
          "Orthodontics Fixed Metal Description", 500.0));
      serviceService.create(new DentalProcedure("Orthodontics - Fixed - Porcelain", "تقويم الأسنان - ثابت - بورسلين",
          "Orthodontics Fixed Porcelain Description", 600.0));
      serviceService.create(new DentalProcedure("Orthodontics - Removable - Fixation", "تقويم الأسنان - متحرك - تثبيت",
          "Orthodontics Removable Fixation Description", 300.0));
      serviceService.create(new DentalProcedure("Orthodontics - Removable - Night Guard",
          "تقويم الأسنان - متحرك - حارس ليلي", "Orthodontics Removable Night Guard Description", 350.0));
      serviceService.create(new DentalProcedure("Orthodontics - Removable - Removable", "تقويم الأسنان - متحرك",
          "Orthodontics Removable Description", 400.0));
      serviceService.create(new DentalProcedure("Orthodontics - Removable - Fixed", "تقويم الأسنان - متحرك - ثابت",
          "Orthodontics Removable Fixed Description", 450.0));

      // Dentures
      serviceService.create(
          new DentalProcedure("Dentures - Complete", "أطقم الأسنان - كاملة", "Dentures Complete Description", 700.0));
      serviceService.create(
          new DentalProcedure("Dentures - Partial", "أطقم الأسنان - جزئية", "Dentures Partial Description", 600.0));
      serviceService.create(
          new DentalProcedure("Dentures - Acrylic", "أطقم الأسنان - أكريليك", "Dentures Acrylic Description", 500.0));
      serviceService.create(
          new DentalProcedure("Dentures - Vitalium", "أطقم الأسنان - فيتاليوم", "Dentures Vitalium Description",
              800.0));
      serviceService.create(new DentalProcedure("Dentures - Soft Liner", "أطقم الأسنان - بطانة ناعمة",
          "Dentures Soft Liner Description", 550.0));
      serviceService.create(
          new DentalProcedure("Dentures - Flexible", "أطقم الأسنان - مرنة", "Dentures Flexible Description", 650.0));

      // Scaling
      serviceService.create(new DentalProcedure("Scaling - With Polishing", "تنظيف الأسنان - مع تلميع",
          "Scaling With Polishing Description", 100.0));
      serviceService.create(new DentalProcedure("Scaling - Without Polishing", "تنظيف الأسنان - بدون تلميع",
          "Scaling Without Polishing Description", 80.0));

      // Bleaching
      serviceService.create(new DentalProcedure("Bleaching - Monitex Technique", "تبييض الأسنان - تقنية مونيتكس",
          "Bleaching Monitex Technique Description", 300.0));
      serviceService.create(new DentalProcedure("Bleaching - Zoom Technique", "تبييض الأسنان - تقنية زووم",
          "Bleaching Zoom Technique Description", 350.0));
    }
  }
}