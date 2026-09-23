
\if (SELECT usesuper FROM pg_user WHERE usename = current_user)

    -- 1/ 
    DROP EXTENSION IF EXISTS postgres_fdw CASCADE;

    -- 2/ 
    CREATE EXTENSION IF NOT EXISTS postgres_fdw;

    -- 3/
    CREATE SERVER clinic_archive_server
        FOREIGN DATA WRAPPER postgres_fdw
        OPTIONS (host 'localhost', port '5432', dbname 'clinic_archive');

    -- 4/ 
        CREATE USER MAPPING FOR CURRENT_USER
        SERVER clinic_archive_server
        OPTIONS (user 'archive_reader', password 'archive_pass');

    -- 5/ Foreign Table
    CREATE FOREIGN TABLE archived_clinic_bookings (
        booking_id       INT,
        patient_name     VARCHAR(150),
        doctor_name      VARCHAR(150),
        appointment_time TIMESTAMP,
        fee              NUMERIC(10, 2),
        status           VARCHAR(50)
    )
    SERVER clinic_archive_server
    OPTIONS (schema_name 'public', table_name 'old_bookings');

    -- 6/
    \if (SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = 'clinic_archive'))

        SELECT * FROM archived_clinic_bookings WHERE status = 'confirmed';

        SELECT appointment_time, fee, status, 'محلي'  AS source FROM bookings
        UNION ALL
        SELECT appointment_time, fee, status, 'أرشيف' AS source FROM archived_clinic_bookings;

    \else
        \echo 'SKIP الاستعلامات: قاعدة clinic_archive غير موجودة — انشئها أولاً للتجربة'
    \endif

    -- DROP FOREIGN TABLE IF EXISTS archived_clinic_bookings;
    -- DROP USER MAPPING IF EXISTS FOR CURRENT_USER SERVER clinic_archive_server;
    -- DROP SERVER IF EXISTS clinic_archive_server;
    -- DROP EXTENSION IF EXISTS postgres_fdw;

\else
    \echo 'SKIP SQL/MED: تحتاج صلاحية superuser لتشغيل postgres_fdw'
\endif