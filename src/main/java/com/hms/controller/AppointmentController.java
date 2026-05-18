package com.hms.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.model.Appointment;
import com.hms.service.AppointmentService;

@RestController
@RequestMapping("/appointments","/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Appointment> all() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/by-patient/{patientId}")
    public List<Appointment> byPatient(@PathVariable Long patientId) {
        return appointmentService.getAppointmentsByPatientId(patientId);
    }

    @GetMapping("/by-doctor/{doctorId}")
    public List<Appointment> byDoctor(@PathVariable Long doctorId) {
        return appointmentService.getAppointmentsByDoctorId(doctorId);
    }

    @PostMapping
    public Appointment create(@Valid @RequestBody Appointment a) {
        return appointmentService.addAppointment(a);
    }

    @PutMapping("/{id}")
    public Appointment update(@PathVariable Long id, @RequestBody Appointment a) {
        return appointmentService.updateAppointment(id, a);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }
}
