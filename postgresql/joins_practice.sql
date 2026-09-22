-- 1. INNER JOIN:
SELECT 
    b.id AS booking_id,
    u_pat.name AS patient_name,
    u_doc.name AS doctor_name,
    d.field AS doctor_specialty,
    b.fee,
    b.status,
    b.created_at
FROM bookings b
INNER JOIN patients p ON b.patient_id = p.id
INNER JOIN users u_pat ON p.user_id = u_pat.id
INNER JOIN doctors d ON b.doctor_id = d.id
INNER JOIN users u_doc ON d.user_id = u_doc.id;

-- 2. LEFT JOIN: عرض جميع المرضى حتى لو لم يكن لديهم أي حجوزات مسجلة
SELECT 
    u.id AS user_id,
    u.name AS patient_name,
    p.phone,
    b.id AS booking_id,
    b.status
FROM users u
INNER JOIN patients p ON p.user_id = u.id
LEFT JOIN bookings b ON b.patient_id = p.id;

-- 3. RIGHT JOIN: 
SELECT 
    u_doc.name AS doctor_name,
    d.field AS doctor_specialty,
    b.id AS booking_id,
    b.status
FROM bookings b
RIGHT JOIN doctors d ON b.doctor_id = d.id
JOIN users u_doc ON d.user_id = u_doc.id;

-- 4. FULL OUTER JOIN: 
SELECT 
    d.id AS doctor_id,
    u_doc.name AS doctor_name,
    b.id AS booking_id,
    b.status
FROM doctors d
FULL OUTER JOIN bookings b ON b.doctor_id = d.id
LEFT JOIN users u_doc ON d.user_id = u_doc.id;