package com.hms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.model.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    java.util.List<Appointment> findByDoctor(com.hms.model.Doctor doctor);
    java.util.List<Appointment> findByDoctorId(Long doctorId);
    java.util.List<Appointment> findByPatientId(Long patientId);
}
