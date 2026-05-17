package com.hms.service;

import java.util.List;

import com.hms.model.Billing;

public interface BillingService {
    Billing addBilling(Billing b);
    List<Billing> getAllBilling();
    List<Billing> getBillingByPatientId(Long patientId);
    Billing getBillingById(Long id);
    Billing updateBilling(Long id, Billing b);
    void deleteBilling(Long id);
    Billing markPaid(Long id);
}
