-- SELECT/WHERE/LIKE/NULL/ORDER BY / LIMIT and Pagination/Aggregate Functions

 -- كل الأعمدة
SELECT * FROM doctors;  
 -- أعمدة محددة                       
SELECT name, specialty FROM doctors;
-- alias          
SELECT name AS doctor_name FROM doctors; 
-- بدون تكرار 
SELECT DISTINCT specialty FROM doctors;        


-- WHERE
SELECT * FROM bookings WHERE status = 'CONFIRMED' AND fee >= 50;
-- OR مع أقواس 
SELECT * FROM bookings
WHERE doctor_id = 1 AND (status = 'PENDING' OR status = 'CANCELLED');  
-- IN و NOT IN
SELECT * FROM bookings WHERE status IN ('PENDING', 'CANCELLED');       
SELECT * FROM bookings WHERE status NOT IN ('PENDING', 'CANCELLED');
-- BETWEEN 
SELECT * FROM bookings WHERE fee BETWEEN 40 AND 50; 
-- من بداية اليوم لبداية اليوم يلي بعدو
SELECT * FROM bookings
WHERE appointment_time >= '2026-10-02' AND appointment_time < '2026-10-03'; 

-- LIKE
SELECT name FROM patients WHERE name LIKE 'A%';   -- يبدا ب A
SELECT name FROM patients WHERE name LIKE '%a';    -- ينتهيa
SELECT name FROM patients WHERE name ILIKE 'a%';   -- ILIKE = بدون حساسية لحالة الأحرف 
-- NULL
SELECT name FROM patients WHERE phone IS NULL;       
SELECT name FROM patients WHERE phone IS NOT NULL; 

-- ORDER BY
-- ترتيب تنازلي مع جعل القيم الفارغة بالاخير
-- NULL LAST
SELECT name, phone FROM patients 
ORDER BY phone DESC NULLS LAST;
-- فيني اعمل اولوية بالترتيب في حال كان عندي قيم متساوية فيني اعتمد على عمود تاني 
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
