INSERT INTO patient (id, name, age, gender, contact, address) VALUES (1, 'John Doe', 30, 'Male', '555-0100', '123 Main St');
INSERT INTO doctor (id, name, specialization, contact, email) VALUES (1, 'Dr. Smith', 'Cardiology', '555-0200', 'smith@example.com');
INSERT INTO billing (id, patient_id, amount, service_type, payment_status, date) VALUES (1, 1, 200.0, 'Consultation', 'Pending', now());
