-- INSERT / UPDATE / DELETE / MERGE

INSERT INTO users (name, email) VALUES
    ('Nada', 'nada@clinic.com'),
    ('Yaser', 'yaser@clinic.com');

INSERT INTO doctors (user_id, field) VALUES
    (4, 'الجلدية والتجميلية'),
    (5, 'الأمراض الجلدية');


-- 2. RETURNING 
INSERT INTO users (name, email)
VALUES ('Lubna', 'lubna@clinic.com')
RETURNING id, name;


-- 3. INSERT ... SELECT
CREATE TABLE IF NOT EXISTS bookings_archive (LIKE bookings INCLUDING ALL);
INSERT INTO bookings_archive
SELECT * FROM bookings WHERE status = 'confirmed';


-- 4. UPSERT 
INSERT INTO users (name, email)
VALUES ('Sara', 'sara@clinic.com')
ON CONFLICT (email) DO NOTHING;

UPDATE users 
SET name = 'Sara Ali' 
WHERE email = 'sara@clinic.com';


-- 5. UPDATE 
UPDATE bookings SET status = 'confirmed' WHERE id = 2;

UPDATE doctors
SET field = 'الجراحة العامة'
WHERE id = 1;  


-- 6. UPDATE ... FROM 
PDATE bookings AS b
SET status = 'cancelled'
FROM doctors AS d
WHERE b.doctor_id = d.id
  AND d.is_active = FALSE;


-- 7. Subquery 
UPDATE bookings
SET fee = fee * 1.10
WHERE doctor_id IN (
    SELECT d.id FROM doctors d WHERE d.field = 'الأمراض الجلدية'
);


-- 8. CASE Statement 
UPDATE bookings
SET fee = CASE
    WHEN fee >= 60 THEN fee * 0.90
    WHEN fee >= 50 THEN fee * 0.95
    ELSE fee
END;


-- 9. RETURNING مع الـ UPDATE 
UPDATE bookings SET status = 'confirmed'
WHERE id = 3
RETURNING id, status, fee;


-- 10. DELETE (الحذف)

DELETE FROM bookings
WHERE status = 'pending' AND appointment_time < '2026-10-02';


-- 11. DELETE ... USING 
DELETE FROM bookings AS b
USING doctors AS d
WHERE b.doctor_id = d.id
  AND d.is_active = FALSE;


-- 12. Subquery مع DELETE
DELETE FROM bookings
WHERE doctor_id IN (SELECT id FROM doctors WHERE field = 'الجلدية والتجميلية');


-- 13. MERGE (الدمج والمطابقة)
MERGE INTO doctors AS d
USING (VALUES (1, 'الجلدية والتجميلية', TRUE)) AS i(doc_id, new_field, active)
ON d.id = i.doc_id
WHEN MATCHED THEN
    UPDATE SET field = i.new_field, is_active = i.active;


-- 14. Atomic Operation
WITH deleted AS (
    DELETE FROM bookings
    WHERE status = 'pending'
    RETURNING *
)
INSERT INTO bookings_archive
SELECT * FROM deleted;