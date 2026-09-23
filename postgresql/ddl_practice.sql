-- CREATE / ALTER / DROP / TRUNCATE

-- إضافة عمود جديد
ALTER TABLE doctors ADD COLUMN phone TEXT;

-- حذف عمود
ALTER TABLE doctors DROP COLUMN phone;

-- تغيير اسم عمود 
-- ALTER TABLE doctors RENAME COLUMN field TO doctor_field;

-- تغيير نوع العمود
ALTER TABLE doctors ALTER COLUMN field TYPE VARCHAR(150);

-- تغيير القيمة الافتراضية لعمود field
ALTER TABLE doctors ALTER COLUMN field SET DEFAULT 'Cardiology';
ALTER TABLE doctors ALTER COLUMN field DROP DEFAULT;

-- إضافة أو إزالة قيد NOT NULL
ALTER TABLE doctors ALTER COLUMN field SET NOT NULL;
ALTER TABLE doctors ALTER COLUMN field DROP NOT NULL;

-- إضافة عمود NOT NULL لجدول فيه صفوف سابقة 
ALTER TABLE doctors ADD COLUMN consultation_room INT NOT NULL DEFAULT 101;
ALTER TABLE doctors DROP COLUMN consultation_room; 


-- 3. ALTER  Transaction  (ROLLBACK)
BEGIN;
    ALTER TABLE doctors DROP COLUMN field;
ROLLBACK;


-- 4. Indexes
CREATE INDEX idx_doctors_field ON doctors (field);


-- 5. الحذف 
-- TRUNCATE TABLE: تفريغ كل البيانات من الجدول مع إبقاء الهيكل (أسرع من DELETE)
-- TRUNCATE TABLE doctors RESTART IDENTITY CASCADE;

-- DROP TABLE: حذف الجدول بالكامل مع هيكله وبياناته
-- DROP TABLE IF EXISTS doctors CASCADE;