package com.hms.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.model.Billing;
import com.hms.service.BillingService;

@RestController
@RequestMapping("/billing","/api/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping
    public List<Billing> all() {
        return billingService.getAllBilling();
    }

    @GetMapping("/by-patient/{patientId}")
    public List<Billing> byPatient(@PathVariable Long patientId) {
        return billingService.getBillingByPatientId(patientId);
    }

    @PostMapping
    public Billing create(@Valid @RequestBody Billing b) {
        return billingService.addBilling(b);
    }

    @PutMapping("/{id}")
    public Billing update(@PathVariable Long id, @RequestBody Billing b) {
        return billingService.updateBilling(id, b);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        billingService.deleteBilling(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/simulate/{billingId}")
    public ResponseEntity<?> simulatePayment(@PathVariable Long billingId) {
        Billing paid = billingService.markPaid(billingId);
        return ResponseEntity.ok().body("Payment simulated: billing id " + paid.getId() + " marked as Paid");
    }
}
