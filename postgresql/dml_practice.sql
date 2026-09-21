-- INSERT /UPDATE /DELETE /MERGE
INSERT INTO doctors (name, email) VALUES
    ('Nada', 'nada@clinic.com'),
    ('Yaser', 'yaser@clinic.com');

-- RETURNING
INSERT INTO doctors (name, email)
VALUES ('Lubna', 'lubna@clinic.com')
RETURNING id, name;

-- INSERT ... SELECT
CREATE TABLE bookings_archive (LIKE bookings);
INSERT INTO bookings_archive
SELECT * FROM bookings WHERE status = 'CONFIRMED';

-- UPSERT
-- ON CONFLICT (تجاهل اذا موجود)
INSERT INTO doctors (name, email)
VALUES ('Sara', 'sara@clinic.com')
ON CONFLICT (email) DO NOTHING;
-- أو حدث الموجود
INSERT INTO doctors (name, email, specialty)
VALUES ('Sara Ali', 'sara@clinic.com', 'Surgery')
ON CONFLICT (email) DO UPDATE
SET name      = EXCLUDED.name,
    specialty = EXCLUDED.specialty;


-- update
UPDATE bookings SET status = 'CONFIRMED' WHERE id = 2;

UPDATE doctors
SET specialty = 'Surgery'
WHERE name = 'Sara';  

-- UPDATE ... FROM
UPDATE bookings AS b
SET status = 'CANCELLED'
FROM doctors AS d
WHERE b.doctor_id = d.id
  AND d.is_active = false;

-- subquery
UPDATE bookings
SET fee = fee * 1.10
WHERE doctor_id IN (SELECT id FROM doctors WHERE specialty = 'Cardiology');

-- case
UPDATE bookings
SET fee = CASE
    WHEN fee >= 60 THEN fee * 0.90
    WHEN fee >= 50 THEN fee * 0.95
    ELSE fee
END;

-- شوف شو تعدل RETURNING
UPDATE bookings SET status = 'CONFIRMED'
WHERE id = 3
RETURNING id, patient_name, status;

DELETE FROM doctors
WHERE name = 'Khaled';

DELETE FROM bookings
WHERE status = 'PENDING' AND appointment_time < '2026-10-02';
-- اذا ما حطيت where رح يصير الحذف او التعديل على كل صفوف الجدول

-- DELETE ... USING
-- بدي احذف الحجوزات المرتبطة باطباء حالتن غير نشطة
DELETE FROM bookings AS b
USING doctors AS d
WHERE b.doctor_id = d.id
  AND d.is_active = false;

--   subquery
DELETE FROM bookings
WHERE doctor_id IN (SELECT id FROM doctors WHERE specialty = 'Dermatology');

-- MARGE
-- بعمل مطابقة ودمج

MERGE INTO doctors AS d
USING doctors_import AS i ON d.email = i.email
WHEN MATCHED THEN
    UPDATE SET specialty = i.specialty
WHEN NOT MATCHED THEN
    INSERT (name, email, specialty) VALUES (i.name, i.email, i.specialty);

-- Atomic Operation
-- منع فقدان البيانات
WITH deleted AS (
    DELETE FROM bookings
    WHERE status = 'PENDING'
    RETURNING *
)
INSERT INTO bookings_archive
SELECT * FROM deleted; 


