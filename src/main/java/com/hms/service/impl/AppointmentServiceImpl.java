package com.hms.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hms.exception.ResourceNotFoundException;
import com.hms.model.Appointment;
import com.hms.model.Billing;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.BillingRepository;
import com.hms.service.AppointmentService;
import java.time.LocalDate;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final BillingRepository billingRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, BillingRepository billingRepository) {
        this.appointmentRepository = appointmentRepository;
        this.billingRepository = billingRepository;
    }

    @Override
    public Appointment addAppointment(Appointment a) {
        Appointment saved = appointmentRepository.save(a);
        
        Billing bill = new Billing();
        bill.setPatient(saved.getPatient());
        bill.setAmount(700.0);
        bill.setServiceType("Appointment");
        bill.setPaymentStatus("Pending");
        bill.setDate(LocalDate.now());
        billingRepository.save(bill);
        
        return saved;
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }

    @Override
    public Appointment updateAppointment(Long id, Appointment a) {
        Appointment existing = getAppointmentById(id);
        existing.setDoctor(a.getDoctor());
        existing.setPatient(a.getPatient());
        existing.setDate(a.getDate());
        existing.setTime(a.getTime());
        existing.setStatus(a.getStatus());
        return appointmentRepository.save(existing);
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}
