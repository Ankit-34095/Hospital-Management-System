package com.hms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByName(String name);
}
