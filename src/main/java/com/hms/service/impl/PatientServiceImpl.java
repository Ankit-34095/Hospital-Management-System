package com.hms.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hms.exception.ResourceNotFoundException;
import com.hms.model.Patient;
import com.hms.repository.PatientRepository;
import com.hms.service.PatientService;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public Patient addPatient(Patient p) {
        return patientRepository.save(p);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
    }

    @Override
    public Patient getPatientByName(String name) {
        List<Patient> patients = patientRepository.findByName(name);
        if (patients.isEmpty()) throw new ResourceNotFoundException("Patient not found with name: " + name);
        return patients.get(0);
    }

    @Override
    public Patient updatePatient(Long id, Patient p) {
        Patient existing = getPatientById(id);
        existing.setName(p.getName());
        existing.setAge(p.getAge());
        existing.setGender(p.getGender());
        existing.setContact(p.getContact());
        existing.setAddress(p.getAddress());
        return patientRepository.save(existing);
    }

    @Override
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}
