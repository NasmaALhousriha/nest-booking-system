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
WITH RECURSIVE numbered_users AS (
    SELECT id, name, email, 
           ROW_NUMBER() OVER (ORDER BY id) as row_num
    FROM users
),
user_hierarchy AS (
    SELECT id, name, email, 1 AS level, row_num
    FROM numbered_users
    WHERE row_num = 1
    
    UNION ALL
    
    SELECT nu.id, nu.name, nu.email, h.level + 1, nu.row_num
    FROM numbered_users nu
    JOIN user_hierarchy h ON nu.row_num = h.row_num + 1
)
SELECT id, name, email, level FROM user_hierarchy;