package com.hms.service.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.exception.BadRequestException;
import com.hms.exception.ResourceNotFoundException;
import com.hms.model.Appointment;
import com.hms.model.Billing;
import com.hms.model.Doctor;
import com.hms.model.Patient;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.BillingRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.service.AppointmentService;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final BillingRepository billingRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  BillingRepository billingRepository,
                                  DoctorRepository doctorRepository,
                                  PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.billingRepository = billingRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    @Transactional
    public Appointment addAppointment(Appointment a) {
        Doctor doctor = doctorRepository.findById(a.getDoctor().getId())
                .orElseThrow(() -> new BadRequestException("Doctor not found"));

        Patient patient = patientRepository.findById(a.getPatient().getId())
                .orElseThrow(() -> new BadRequestException("Patient not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isPatientRole = isRole(auth, "ROLE_PATIENT");
        boolean isDoctorRole = isRole(auth, "ROLE_DOCTOR");

        if (isDoctorRole) {
            enforceDoctorSelfBooking(auth, doctor);
        }
        if (isPatientRole) {
            enforcePatientSelfBooking(auth, patient);
        }

        LocalDate date = a.getDate();
        LocalTime time = a.getTime();

        validateAppointmentSlot(date, time);
        checkDoctorConflict(doctor, date, time);
        checkPatientConflict(patient, date, time, null, isPatientRole);

        a.setDoctor(doctor);
        a.setPatient(patient);
        a.setStatus("Scheduled");

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
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }

    @Override
    @Transactional
    public Appointment updateAppointment(Long id, Appointment a) {
        Appointment existing = getAppointmentById(id);

        Doctor doctor = a.getDoctor() != null && a.getDoctor().getId() != null
                ? doctorRepository.findById(a.getDoctor().getId())
                      .orElseThrow(() -> new BadRequestException("Doctor not found"))
                : existing.getDoctor();

        Patient patient = a.getPatient() != null && a.getPatient().getId() != null
                ? patientRepository.findById(a.getPatient().getId())
                      .orElseThrow(() -> new BadRequestException("Patient not found"))
                : existing.getPatient();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isPatientRole = isRole(auth, "ROLE_PATIENT");
        boolean isDoctorRole = isRole(auth, "ROLE_DOCTOR");

        if (isDoctorRole) {
            enforceDoctorSelfBooking(auth, doctor);
        }
        if (isPatientRole) {
            enforcePatientSelfBooking(auth, patient);
        }

        LocalDate date = a.getDate() != null ? a.getDate() : existing.getDate();
        LocalTime time = a.getTime() != null ? a.getTime() : existing.getTime();

        boolean dateChanged = !date.equals(existing.getDate()) || !time.equals(existing.getTime())
                || !doctor.getId().equals(existing.getDoctor().getId())
                || !patient.getId().equals(existing.getPatient().getId());

        if (dateChanged) {
            validateAppointmentSlot(date, time);
            checkDoctorConflict(doctor, date, time, id);
            checkPatientConflict(patient, date, time, id, isPatientRole);
        }

        existing.setDoctor(doctor);
        existing.setPatient(patient);
        existing.setDate(date);
        existing.setTime(time);
        if (a.getStatus() != null) {
            existing.setStatus(a.getStatus());
        }

        return appointmentRepository.save(existing);
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    private void validateAppointmentSlot(LocalDate date, LocalTime time) {
        DayOfWeek day = date.getDayOfWeek();
        if (day == DayOfWeek.SUNDAY) {
            throw new BadRequestException("Appointments can only be booked from Monday to Saturday.");
        }
        if (time.isBefore(LocalTime.of(10, 0)) || time.isAfter(LocalTime.of(16, 30))) {
            throw new BadRequestException(
                    "Appointments can only be booked between 10:00 AM and 5:00 PM (last slot starts at 4:30 PM).");
        }
    }

    private void checkDoctorConflict(Doctor doctor, LocalDate date, LocalTime time) {
        checkDoctorConflict(doctor, date, time, null);
    }

    private void checkDoctorConflict(Doctor doctor, LocalDate date, LocalTime time, Long excludeId) {
        LocalTime checkStart = time.minusMinutes(29);
        LocalTime checkEnd = time.plusMinutes(30);

        List<Appointment> conflicts = appointmentRepository
                .findConflictingDoctorAppointments(doctor.getId(), date, checkStart, checkEnd);

        for (Appointment c : conflicts) {
            if (excludeId != null && c.getId().equals(excludeId)) {
                continue;
            }
            throw new BadRequestException(
                    String.format("the %s (ID: %d) has already have an appointment at the %s, %s. Please select any other time.",
                            doctor.getName(), doctor.getId(), c.getTime(), c.getDate()));
        }
    }

    private void checkPatientConflict(Patient patient, LocalDate date, LocalTime time) {
        checkPatientConflict(patient, date, time, null, true);
    }

    private void checkPatientConflict(Patient patient, LocalDate date, LocalTime time, Long excludeId, boolean isPatientRole) {
        List<Appointment> conflicts = appointmentRepository
                .findByPatientIdAndDateAndTime(patient.getId(), date, time);

        for (Appointment c : conflicts) {
            if (excludeId != null && c.getId().equals(excludeId)) {
                continue;
            }
            if (isPatientRole) {
                Doctor d = c.getDoctor();
                throw new BadRequestException(
                        String.format("Error. Cannot book an appointment as you already have an appointment at %s, %s with %s (ID: %d). Please select any other Slot.",
                                c.getTime(), c.getDate(), d.getName(), d.getId()));
            } else {
                throw new BadRequestException(
                        String.format("The patient has already an appointment at %s, %s.",
                                c.getTime(), c.getDate()));
            }
        }
    }

    private boolean isRole(Authentication auth, String role) {
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(g -> g.getAuthority().equals(role));
    }

    private void enforceDoctorSelfBooking(Authentication auth, Doctor doctor) {
        String username = auth.getName();
        List<Doctor> doctors = doctorRepository.findByName(username);
        if (doctors.isEmpty()) {
            throw new BadRequestException("Doctor profile not found for current user.");
        }
        Doctor currentDoctor = doctors.get(0);
        if (!currentDoctor.getId().equals(doctor.getId())) {
            throw new BadRequestException("You can only book appointments for yourself as a doctor.");
        }
    }

    private void enforcePatientSelfBooking(Authentication auth, Patient patient) {
        String username = auth.getName();
        List<Patient> patients = patientRepository.findByName(username);
        if (patients.isEmpty()) {
            throw new BadRequestException("Patient profile not found for current user.");
        }
        Patient currentPatient = patients.get(0);
        if (!currentPatient.getId().equals(patient.getId())) {
            throw new BadRequestException("You can only book appointments for yourself as a patient.");
        }
    }
}
