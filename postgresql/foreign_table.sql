-- SQL/MED
-- 1/Extension
-- 2/Server
-- 3/User Mapping
-- 4/Foreign table


-- 1
CREATE EXTENSION postgres_fdw;
-- 2
CREATE SERVER remote_pg_server
 FOREIGN DATA WRAPPER postgres_fdw
 OPTIONS (host '192.168.1.50', dbname 'salse_db', port '5432');
--  3
CREATE USER MAPPING FOR current_user
 SERVER remote_pg_server
 OPTIONS (user 'remote_user', password 'secret_password');
--  4
CREATE FOREIGN TABLE local_customers(
    customer_id INT,
    customer_name TEXT
)
SERVER remote_pg_server
OPTIONS (schema_name 'public', table_name 'customers');
