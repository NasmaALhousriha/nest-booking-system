--    وبصير استدعي بس الاسمviewبدل ما اكتب استعلام طويل وكررو كل مرة بعمل 
-- CREATE VIEW name AS [الاستعلام]

CREATE VIEW confirmed_bookings AS
SELECT b.id
FROM bookings b
WHERE b.status = 'CONFIRMED';

SELECT * FROM confirmed_bookings;

-- ORDER BY/GROUP BY/JOIN/WHERE

CREATE VIEW confirmed_bookings AS
SELECT b.id, p.name AS patient, d.name AS doctor, b.appointment_time, b.fee
FROM bookings b
JOIN patients p ON p.id = b.patient_id
JOIN doctors  d ON d.id = b.doctor_id
WHERE b.status = 'CONFIRMED';

SELECT doctor
FROM confirmed_bookings
GROUP BY doctor
ORDER BY doctor;

-- rename
ALTER VIEW confirmed_bookings RENAME TO v_confirmed_bookings;
-- drop
DROP VIEW IF EXISTS v_confirmed_bookings;
