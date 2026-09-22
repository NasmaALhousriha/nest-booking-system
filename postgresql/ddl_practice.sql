-- CREATE / ALTER / DROP / TRUNCATE

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INT, -- يربط مع جدول users لجلب الاسم والبريد
    field VARCHAR(100) DEFAULT 'General', -- تم توحيد الاسم من specialty إلى field
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



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

-- إضافة قيود مثل Foreign Key 
ALTER TABLE bookings
ADD CONSTRAINT fk_bookings_doctor
FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE;

-- إضافة قيد UNIQUE (مثلاً على رقم هاتف الطبيب لو أضفناه)
-- ALTER TABLE doctors ADD COLUMN phone TEXT UNIQUE;

-- إضافة عمود NOT NULL لجدول فيه صفوف سابقة 
ALTER TABLE doctors ADD COLUMN consultation_room INT NOT NULL DEFAULT 101;
ALTER TABLE doctors DROP COLUMN consultation_room; -- للتنظيف بعد التجربة


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