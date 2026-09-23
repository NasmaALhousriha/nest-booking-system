
INSERT INTO users (id, name, email) VALUES
(1, 'أحمد علي', 'ahmad@example.com'),
(2, 'سارة محمد', 'sara@example.com'),
(3, 'خالد عمر', 'khaled@example.com');
SELECT setval(pg_get_serial_sequence('users','id'), (SELECT MAX(id) FROM users));

INSERT INTO patients (id, user_id, phone) VALUES
(1, 1, '0911111111');
SELECT setval(pg_get_serial_sequence('patients','id'), (SELECT MAX(id) FROM patients));

INSERT INTO doctors (id, user_id, field, is_active) VALUES
(1, 2, 'الجلدية والتجميلية', TRUE),
(2, 3, 'الأمراض الجلدية', TRUE);
SELECT setval(pg_get_serial_sequence('doctors','id'), (SELECT MAX(id) FROM doctors));

INSERT INTO bookings (doctor_id, patient_id, appointment_time, fee, status) VALUES
(1, 1, '2026-10-01 10:00:00', 50.00, 'confirmed'),
(2, 1, '2026-10-01 11:30:00', 75.00, 'pending');