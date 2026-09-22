-- SELECT/WHERE/LIKE/NULL/ORDER BY / LIMIT and Pagination/Aggregate Functions

 -- كل الأعمدة
SELECT * FROM doctors;  
 -- أعمدة محددة                       
SELECT u.name AS doctor_name, d.field 
FROM doctors d
JOIN users u ON d.user_id = u.id;
-- alias          
-- alias          
SELECT u.name AS doctor_name 
FROM doctors d
JOIN users u ON d.user_id = u.id;
-- بدون تكرار 
SELECT DISTINCT field FROM doctors;

-- WHERE
SELECT * FROM bookings WHERE status = 'confirmed' AND fee >= 50;

-- OR مع أقواس 
SELECT * FROM bookings
WHERE doctor_id = 1 AND (status = 'pending' OR status = 'cancelled');

-- IN و NOT IN
SELECT * FROM bookings WHERE status IN ('pending', 'cancelled');       
SELECT * FROM bookings WHERE status NOT IN ('pending', 'cancelled');

-- BETWEEN 
SELECT * FROM bookings WHERE fee BETWEEN 40 AND 50;

-- من بداية اليوم لبداية اليوم يلي بعدو
SELECT * FROM bookings
WHERE appointment_time >= '2026-10-01 00:00:00' AND appointment_time < '2026-10-02 00:00:00';

-- LIKE
SELECT u.name 
FROM patients p 
JOIN users u ON p.user_id = u.id 
WHERE u.name LIKE 'أ%';

SELECT u.name 
FROM patients p 
JOIN users u ON p.user_id = u.id 
WHERE u.name LIKE '%محمد';

SELECT u.name 
FROM patients p 
JOIN users u ON p.user_id = u.id 
WHERE u.name ILIKE 'a%';   -- ILIKE = بدون حساسية لحالة الأحرف 

-- NULL
SELECT u.name, p.phone 
FROM patients p 
JOIN users u ON p.user_id = u.id 
WHERE p.phone IS NULL;       

SELECT u.name, p.phone 
FROM patients p 
JOIN users u ON p.user_id = u.id 
WHERE p.phone IS NOT NULL;

-- ORDER BY
-- ترتيب تنازلي مع جعل القيم الفارغة بالاخير
SELECT u.name, p.phone 
FROM patients p 
JOIN users u ON p.user_id = u.id 
ORDER BY p.phone DESC NULLS LAST;

-- ترتيب متعدد الأولوية (حسب الأجرة ثم وقت الموعد)
SELECT id, fee, appointment_time FROM bookings
ORDER BY fee DESC, appointment_time ASC;

-- LIMIT and Pagination
SELECT id, fee FROM bookings ORDER BY fee DESC LIMIT 3;

-- offset مشان اعمل الصفحات
SELECT id FROM bookings ORDER BY id LIMIT 2 OFFSET 0;
SELECT id FROM bookings ORDER BY id LIMIT 2 OFFSET 2;

-- Aggregate Functions
SELECT COUNT(*)            AS total,
       SUM(fee)            AS sum_fee,
       ROUND(AVG(fee), 2)  AS avg_fee,
       MIN(fee)            AS min_fee,
       MAX(fee)            AS max_fee
FROM bookings;
