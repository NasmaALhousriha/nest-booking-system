-- هون التخزين عم يصير بشكل فعلي على الديسك
-- REFRESH
--  وكتير بقراها وقليل حتى غيرهاjoin  بستخدمو وقت يكون عندي مثلا كويري فيها كتير
-- احصائيات مقبول انو تكون قديمة 
-- تقاير او لوحات تحكم
-- CREATE MATERIALIZED VIEW [IF NOT EXISTS] view_name
--     [ (column_name [, ...]) ]
--     [ USING access_method ]
--     [ WITH ( storage_parameter [= value] [, ...] ) ]
--     [ TABLESPACE tablespace_name ]
-- AS
--     select_query
-- [ WITH [ NO ] DATA ];

-- 1  حساب إيرادات وأعداد الحجوزات لكل طبيب
CREATE MATERIALIZED VIEW doctor_revenue AS
SELECT 
    d.id AS doctor_id, 
    u.name AS doctor_name,
    d.field,
    COUNT(b.id) AS total_bookings,
    COALESCE(SUM(b.fee), 0) AS total_revenue
FROM doctors d
JOIN users u ON d.user_id = u.id
LEFT JOIN bookings b ON b.doctor_id = d.id AND b.status <> 'cancelled'
GROUP BY d.id, u.name, d.field;

CREATE UNIQUE INDEX idx_doc_rev_id ON doctor_revenue (doctor_id);

CREATE MATERIALIZED VIEW mv_active_doctors AS
SELECT 
    d.id AS doctor_id,
    u.name AS doctor_name,
    d.field,
    d.is_active
FROM doctors d
JOIN users u ON d.user_id = u.id
WHERE d.is_active = TRUE;

--  REFRESH CONCURRENTLY
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_active_doctors;

-- WITH NO DATA
CREATE MATERIALIZED VIEW mv_yearly_bookings AS
SELECT 
    EXTRACT(YEAR FROM b.created_at) AS booking_year, 
    COUNT(b.id) AS yearly_total_bookings,
    SUM(b.fee) AS yearly_revenue
FROM bookings b
GROUP BY EXTRACT(YEAR FROM b.created_at)
WITH NO DATA;

CREATE UNIQUE INDEX idx_booking_year ON mv_yearly_bookings (booking_year);
REFRESH MATERIALIZED VIEW mv_yearly_bookings;

-- ALTER AND DROP
ALTER MATERIALIZED VIEW doctor_revenue RENAME TO mv_doctor_revenue;
ALTER MATERIALIZED VIEW mv_doctor_revenue RENAME COLUMN total_revenue TO total_earnings;

DROP MATERIALIZED VIEW IF EXISTS mv_doctor_revenue CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_active_doctors CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_yearly_bookings CASCADE;
