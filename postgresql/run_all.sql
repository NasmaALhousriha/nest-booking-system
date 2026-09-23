-- تنفيذ جميع السكريبتات بالترتيب الصحيح داخل مجلد postgresql
\set ON_ERROR_STOP on

\echo '1. Creating Schema...'
\ir schema.sql

\echo '2. Inserting Seed Data...'
\ir seed.sql

\echo '3. Running DDL Practice...'
\ir ddl_practice.sql

\echo '4. Running DML Practice...'
\ir dml_practice.sql

\echo '5. Running DQL Practice...'
\ir dql_practice.sql

\echo '6. Running Joins Practice...'
\ir joins_practice.sql

\echo '7. Running Views Practice...'
\ir view_practice.sql

\echo '8. Running Materialized Views...'
\ir Materialized_View.sql

\echo '9. Running Recursive CTEs...'
\ir recursive_practice.sql

\echo '10. Running Triggers Practice...'
\ir triggers_practice.sql

\echo '11. Running Foreign Tables (SQL/MED)...'
\ir foreign_table.sql

\echo 'All scripts executed successfully on PostgreSQL 18!'