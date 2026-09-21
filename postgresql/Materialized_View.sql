-- هون التخزين عم يصير بشكل فعلي على الديسك
-- REFRESH
--  وكتير بقراها وقليل حتى غيرهاjoin  بستخدمو وقت يكون عندي مثلا كويري فيها كتير
-- احصائيات مقبول انو تكون قديمة 
-- تقاير او لوحات تحكم
CREATE MATERIALIZED VIEW [IF NOT EXISTS] view_name
    [ (column_name [, ...]) ]
    [ USING access_method ]
    [ WITH ( storage_parameter [= value] [, ...] ) ]
    [ TABLESPACE tablespace_name ]
AS
    select_query
[ WITH [ NO ] DATA ];
-- REFRESH
REFRESH MATERIALIZED VIEW [ CONCURRENTLY ] view_name [ WITH [ NO ] DATA ];
-- ALTER
ALTER MATERIALIZED VIEW view_name RENAME TO new_name;
ALTER MATERIALIZED VIEW view_name RENAME COLUMN old_col TO new_col;
ALTER MATERIALIZED VIEW view_name OWNER TO new_owner;
-- DROP
DROP MATERIALIZED VIEW [IF EXISTS] view_name [CASCADE | RESTRICT];


CREATE MATERIALIZED VIEW doctor_revenue AS
SELECT d.id, d.name,
       COUNT(b.id) AS bookings
FROM doctors d
LEFT JOIN bookings b ON b.doctor_id = d.id AND b.status <> 'CANCELLED'
GROUP BY d.id, d.name;

-- INDEX
CREATE [ UNIQUE ] INDEX index_name ON view_name (column_name);

CREATE MATERIALIZED VIEW mv_active_employees AS
SELECT employee_id, first_name, last_name, department
FROM employees
WHERE status = 'Active';

CREATE INDEX idx_emp_firstname ON mv_active_employees (first_name);

SELECT * FROM mv_active_employees 
WHERE first_name = 'Ahmed';

-- REFRESH CONCURRENTLY
-- هون التحديث بصير دون قفل الجدول 
-- يعني فيني اقرا البيانات اثناء التحديث 
-- unique index لازم يكون في
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_active_employees;

-- WITH NO DATA
CREATE MATERIALIZED VIEW mv_yearly_sales AS
SELECT year, SUM(amount) AS total_sales
FROM sales
GROUP BY year
WITH NO DATA;

CREATE UNIQUE INDEX idx_year_sales ON mv_yearly_sales (year);

REFRESH MATERIALIZED VIEW mv_yearly_sales;
