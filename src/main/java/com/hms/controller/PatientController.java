package com.hms.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.model.Patient;
import com.hms.service.PatientService;

@RestController
@RequestMapping("/patients","/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public List<Patient> all() {
        return patientService.getAllPatients();
    }

    @GetMapping("/by-name/{name}")
    public Patient byName(@PathVariable String name) {
        return patientService.getPatientByName(name);
    }

    @PostMapping
    public Patient create(@Valid @RequestBody Patient p) {
        return patientService.addPatient(p);
    }

    @PutMapping("/{id}")
    public Patient update(@PathVariable Long id, @RequestBody Patient p) {
        return patientService.updatePatient(id, p);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok().build();
    }
}
