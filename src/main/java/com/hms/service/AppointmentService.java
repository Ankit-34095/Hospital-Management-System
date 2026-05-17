package com.hms.service;

import java.util.List;

import com.hms.model.Appointment;

public interface AppointmentService {
    Appointment addAppointment(Appointment a);
    List<Appointment> getAllAppointments();
    List<Appointment> getAppointmentsByPatientId(Long patientId);
    List<Appointment> getAppointmentsByDoctorId(Long doctorId);
    Appointment getAppointmentById(Long id);
    Appointment updateAppointment(Long id, Appointment a);
    void deleteAppointment(Long id);
}
