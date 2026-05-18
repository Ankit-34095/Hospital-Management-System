package com.hms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;

import com.hms.config.JwtUtil;
import com.hms.dto.AuthRequest;
import com.hms.dto.AuthResponse;
import com.hms.model.User;
import com.hms.repository.UserRepository;
import com.hms.model.Patient;
import com.hms.model.Doctor;
import com.hms.repository.PatientRepository;
import com.hms.repository.DoctorRepository;

import javax.validation.Valid;

@RestController
@RequestMapping("auth","/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil,
            AuthenticationManager authenticationManager, PatientRepository patientRepository, DoctorRepository doctorRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest req) {
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        User u = new User();
        u.setUsername(req.getUsername());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRole("PATIENT");
        userRepository.save(u);

        Patient p = new Patient();
        p.setName(req.getUsername());
        patientRepository.save(p);

        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        try {
            Optional<User> uOpt = userRepository.findByUsername(req.getUsername());
            if (uOpt.isEmpty() || !uOpt.get().getRole().equalsIgnoreCase(req.getRole())) {
                return ResponseEntity.status(401).body("Invalid credentials or role");
            }
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
            String token = jwtUtil.generateToken(req.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/register-doctor")
    public ResponseEntity<?> registerDoctor(@RequestBody AuthRequest req, org.springframework.security.core.Authentication auth) {
        if (auth == null || auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("Only admin can register doctors");
        }
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (req.getDoctorId() == null) {
            return ResponseEntity.badRequest().body("doctorId is required — create the doctor record first");
        }
        Optional<Doctor> doctorOpt = doctorRepository.findById(req.getDoctorId());
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Doctor not found with ID: " + req.getDoctorId());
        }
        User u = new User();
        u.setUsername(req.getUsername());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRole("DOCTOR");
        userRepository.save(u);

        return ResponseEntity.ok("Login credentials created for doctor: " + doctorOpt.get().getName());
    }
}
