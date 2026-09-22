-- تنفيذ جميع السكريبتات بالترتيب الصحيح داخل مجلد postgresql

\echo '1. Creating Schema...'
\i postgresql/schema.sql

\echo '2. Inserting Seed Data...'
\i postgresql/seed.sql

\echo '3. Running DDL Practice...'
\i postgresql/ddl_practice.sql

\echo '4. Running DML Practice...'
\i postgresql/dml_practice.sql

\echo '5. Running DQL Practice...'
\i postgresql/dql_practice.sql

\echo '6. Running Joins Practice...'
\i postgresql/joins_practice.sql

\echo '7. Running Views Practice...'
\i postgresql/view_practice.sql

\echo '8. Running Materialized Views...'
\i postgresql/Materialized_View.sql

\echo '9. Running Recursive CTEs...'
\i postgresql/recursive_practice.sql

\echo '10. Running Triggers Practice...'
\i postgresql/triggers_practice.sql

\echo '11. Running Foreign Tables (SQL/MED)...'
\i postgresql/foreign_table.sql

\echo 'All scripts executed successfully on PostgreSQL 18!'