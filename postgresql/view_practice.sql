-- 1. 
CREATE VIEW confirmed_bookings AS
SELECT b.id, b.appointment_time, b.status
FROM bookings b
WHERE b.status = 'confirmed';

SELECT * FROM confirmed_bookings;


-- 2. (JOIN + WHERE + GROUP BY + ORDER BY)
DROP VIEW IF EXISTS confirmed_bookings CASCADE;

CREATE VIEW confirmed_bookings AS
SELECT 
    b.id AS booking_id, 
    u_pat.name AS patient, 
    u_doc.name AS doctor, 
    b.appointment_time, 
    b.fee,
    b.status
FROM bookings b
JOIN patients p ON p.id = b.patient_id
JOIN users u_pat ON p.user_id = u_pat.id
JOIN doctors d ON d.id = b.doctor_id
JOIN users u_doc ON d.user_id = u_doc.id
WHERE b.status = 'confirmed';

SELECT doctor, COUNT(*) AS total_confirmed_bookings
FROM confirmed_bookings
GROUP BY doctor
ORDER BY doctor;


-- 3.(Rename)
ALTER VIEW confirmed_bookings RENAME TO v_confirmed_bookings;


-- 4. (Drop)
DROP VIEW IF EXISTS v_confirmed_bookings CASCADE;