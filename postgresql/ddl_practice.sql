-- CREATE/ALTER/DROP/TRUNCATE

CREATE TABLE doctors (
    id        SERIAL PRIMARY KEY,
    name      TEXT NOT NULL,
    specialty TEXT DEFAULT 'General'
);


-- اضافة عمود
ALTER TABLE doctors ADD COLUMN phone TEXT;
-- حذف عمود
ALTER TABLE doctors DROP COLUMN phone;
-- تغيير اسم عمود
ALTER TABLE doctors RENAME COLUMN specialty TO field;
-- تغيير اسم جدول 
ALTER TABLE doctors RENAME TO physicians;
-- تغيير نوع العمود
ALTER TABLE doctors ALTER COLUMN name TYPE VARCHAR(100);

-- تغيير القيمة الافتراصية
ALTER TABLE doctors ALTER COLUMN specialty SET DEFAULT 'Cardiology';
ALTER TABLE doctors ALTER COLUMN specialty DROP DEFAULT;
-- NOT NULL اضافة قيد
ALTER TABLE doctors ALTER COLUMN specialty SET NOT NULL;
-- NOT NULL ازالة قيد
ALTER TABLE doctors ALTER COLUMN specialty DROP NOT NULL;
--  إضافة أو حذف قيود (constraints)
-- (foreign key)
ALTER TABLE bookings
ADD CONSTRAINT fk_bookings_doctor
FOREIGN KEY (doctor_id) REFERENCES doctors(id);
-- قيد unique
ALTER TABLE doctors ADD CONSTRAINT uq_doctors_phone UNIQUE (phone);

-- حذف قيد
ALTER TABLE doctors DROP CONSTRAINT uq_doctors_phone;
-- إضافة عمود NOT NULL لجدول فيه صفوف بدها قيمة افتراضية، وإلا بيعطي خطأ لأن الصفوف القديمة ما عندها قيمة:
  ALTER TABLE doctors ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

--   فيني ضيف alter table داخل transaction
  BEGIN;
  ALTER TABLE doctors DROP COLUMN specialty;
  ROLLBACK; 


-- إنشاء index لتسريع البحث
CREATE INDEX idx_doctors_specialty ON doctors (specialty);
-- حذف كل الصفوف مع إبقاء الجدول
TRUNCATE TABLE doctors;
-- حذف الجدول نهائياً (بيانات + هيكل)
DROP TABLE doctors;