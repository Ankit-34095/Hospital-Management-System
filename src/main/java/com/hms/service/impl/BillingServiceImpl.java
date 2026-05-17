package com.hms.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hms.exception.ResourceNotFoundException;
import com.hms.model.Billing;
import com.hms.repository.BillingRepository;
import com.hms.service.BillingService;

@Service
public class BillingServiceImpl implements BillingService {

    private final BillingRepository billingRepository;

    public BillingServiceImpl(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    @Override
    public Billing addBilling(Billing b) {
        if (b.getDate() == null) b.setDate(LocalDate.now());
        if (b.getPaymentStatus() == null) b.setPaymentStatus("Pending");
        return billingRepository.save(b);
    }

    @Override
    public List<Billing> getAllBilling() {
        return billingRepository.findAll();
    }

    @Override
    public List<Billing> getBillingByPatientId(Long patientId) {
        return billingRepository.findByPatientId(patientId);
    }

    @Override
    public Billing getBillingById(Long id) {
        return billingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Billing not found"));
    }

    @Override
    public Billing updateBilling(Long id, Billing b) {
        Billing existing = getBillingById(id);
        existing.setAmount(b.getAmount());
        existing.setServiceType(b.getServiceType());
        existing.setPaymentStatus(b.getPaymentStatus());
        existing.setDate(b.getDate());
        existing.setPatient(b.getPatient());
        return billingRepository.save(existing);
    }

    @Override
    public void deleteBilling(Long id) {
        billingRepository.deleteById(id);
    }

    @Override
    public Billing markPaid(Long id) {
        Billing b = getBillingById(id);
        b.setPaymentStatus("Paid");
        return billingRepository.save(b);
    }
}
