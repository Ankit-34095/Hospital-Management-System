package com.hms.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hms.exception.ResourceNotFoundException;
import com.hms.model.Doctor;
import com.hms.repository.DoctorRepository;
import com.hms.repository.AppointmentRepository;
import com.hms.model.Appointment;
import com.hms.service.DoctorService;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public Doctor addDoctor(Doctor d) {
        return doctorRepository.save(d);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
    }

    @Override
    public Doctor getDoctorByName(String name) {
        List<Doctor> doctors = doctorRepository.findByName(name);
        if (doctors.isEmpty()) throw new ResourceNotFoundException("Doctor not found with name: " + name);
        return doctors.get(0);
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor d) {
        Doctor existing = getDoctorById(id);
        existing.setName(d.getName());
        existing.setSpecialization(d.getSpecialization());
        existing.setContact(d.getContact());
        existing.setEmail(d.getEmail());
        return doctorRepository.save(existing);
    }

    @Override
    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);
        for (Appointment a : appointments) {
            a.setDoctor(null);
            appointmentRepository.save(a);
        }
        doctorRepository.deleteById(id);
    }
}
