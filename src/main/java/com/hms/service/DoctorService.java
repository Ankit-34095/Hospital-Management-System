package com.hms.service;

import java.util.List;

import com.hms.model.Doctor;

public interface DoctorService {
    Doctor addDoctor(Doctor d);
    List<Doctor> getAllDoctors();
    Doctor getDoctorById(Long id);
    Doctor getDoctorByName(String name);
    Doctor updateDoctor(Long id, Doctor d);
    void deleteDoctor(Long id);
}
