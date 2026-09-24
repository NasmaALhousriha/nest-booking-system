-- CREATE OR REPLACE FUNCTION fn_set_updated_at()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at := clock_timestamp();
--     RETURN NEW;             
-- END;
-- $$ LANGUAGE plpgsql;
-- -- ربط التريغير بجدول bookings
-- DROP TRIGGER IF EXISTS trg_bookings_set_updated_at ON bookings;
-- CREATE TRIGGER trg_bookings_set_updated_at
-- BEFORE UPDATE ON bookings
-- FOR EACH ROW
-- EXECUTE FUNCTION fn_set_updated_at();

-- منع الحجز المزدوج
CREATE OR REPLACE FUNCTION fn_prevent_double_booking()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.doctor_id IS NOT NULL AND UPPER(NEW.status) <> 'CANCELLED' THEN
        IF EXISTS (
            SELECT 1
            FROM bookings b
            WHERE b.doctor_id      = NEW.doctor_id
              AND b.appointment_time = NEW.appointment_time
              AND UPPER(b.status)  <> 'CANCELLED'
              AND b.id             <> COALESCE(NEW.id, 0)
        ) THEN
            RAISE EXCEPTION 'Doctor % is already booked at %',
                NEW.doctor_id, NEW.appointment_time;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bookings_prevent_double_booking ON bookings;
CREATE TRIGGER trg_bookings_prevent_double_booking
    BEFORE INSERT OR UPDATE OF doctor_id, appointment_time, status ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION fn_prevent_double_booking();

DO $$
DECLARE
    v_inserted BOOLEAN := FALSE;
BEGIN
    BEGIN
        INSERT INTO bookings (doctor_id, patient_id, appointment_time, fee, status)
        VALUES (2, 1, '2026-10-01 11:30:00', 50.00, 'pending');
        v_inserted := TRUE;
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'TEST PASSED: duplicate booking was rejected.';
    END;
    IF v_inserted THEN
        RAISE EXCEPTION 'TEST FAILED: duplicate booking was accepted — trigger/index did not block it.';
    END IF;
END;
$$;
