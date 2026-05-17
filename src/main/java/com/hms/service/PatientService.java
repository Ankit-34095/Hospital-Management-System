package com.hms.service;

import java.util.List;

import com.hms.model.Patient;

public interface PatientService {
    Patient addPatient(Patient p);
    List<Patient> getAllPatients();
    Patient getPatientById(Long id);
    Patient getPatientByName(String name);
    Patient updatePatient(Long id, Patient p);
    void deletePatient(Long id);
}
