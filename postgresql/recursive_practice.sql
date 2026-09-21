-- recursive CTE(Common Table Expression)
-- الشكل العام
WITH RECURSIVE cte_name (columns) AS (
    -- 1. Anchor Member
    SELECT initial_query
    UNION [ALL]
    -- 2. Recursive Member
    SELECT recursive_query 
    FROM cte_name 
    WHERE condition_to_stop
)
SELECT * FROM cte_name;



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