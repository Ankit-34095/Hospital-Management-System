package com.hms.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.model.Doctor;
import com.hms.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public List<Doctor> all() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/by-name/{name}")
    public Doctor byName(@PathVariable String name) {
        return doctorService.getDoctorByName(name);
    }

    @PostMapping
    public Doctor create(@Valid @RequestBody Doctor d) {
        return doctorService.addDoctor(d);
    }

    @PutMapping("/{id}")
    public Doctor update(@PathVariable Long id, @RequestBody Doctor d) {
        return doctorService.updateDoctor(id, d);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }
}
