-- recursive CTE(Common Table Expression)
-- -- الشكل العام
-- WITH RECURSIVE cte_name (columns) AS (
--     -- 1. Anchor Member
--     SELECT initial_query
--     UNION [ALL]
--     -- 2. Recursive Member
--     SELECT recursive_query 
--     FROM cte_name 
--     WHERE condition_to_stop
-- )
-- SELECT * FROM cte_name;



-- مثال 

WITH RECURSIVE numbers AS (
    SELECT 1 AS n
    UNION ALL
    
-- التكرار: إضافة 1 في كل خطوة حتى الوصول إلى الرقم 10
    SELECT n + 1
    FROM numbers
    WHERE n < 10
)
SELECT * FROM numbers;


-- 2
DROP TABLE IF EXISTS specializations CASCADE;
CREATE TABLE specializations (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT REFERENCES specializations(id)
);
INSERT INTO specializations (id, name, parent_id) VALUES
(1, 'الطب', NULL),
(2, 'الجلدية', 1),
(3, 'التجميلية', 1),
(4, 'جراحات الجلد', 2);
WITH RECURSIVE spec_tree AS (
    SELECT id, name, parent_id, 1 AS level, name AS path
    FROM specializations
    WHERE parent_id IS NULL
    UNION ALL
    SELECT s.id, s.name, s.parent_id, st.level + 1, st.path || ' > ' || s.name
    FROM specializations s
    JOIN spec_tree st ON s.parent_id = st.id
)
SELECT id, name, level, path FROM spec_tree ORDER BY path;