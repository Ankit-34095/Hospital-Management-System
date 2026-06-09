package com.hms.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hms.model.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor(com.hms.model.Doctor doctor);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByPatientId(Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.date = :date " +
           "AND a.time >= :startTime AND a.time < :endTime")
    List<Appointment> findConflictingDoctorAppointments(@Param("doctorId") Long doctorId,
                                                       @Param("date") LocalDate date,
                                                       @Param("startTime") LocalTime startTime,
                                                       @Param("endTime") LocalTime endTime);

    List<Appointment> findByPatientIdAndDateAndTime(Long patientId, LocalDate date, LocalTime time);
}
