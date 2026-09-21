-- CREATE OR REPLACE FUNCTION fn_name()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     -- trigger
    
-- END; -- هنا ينتهي جسم التريغير
-- $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := clock_timestamp();
    RETURN NEW;                
END;
$$ LANGUAGE plpgsql;

-- هلا بدي اربط التريغير بالجدول 
CREATE TRIGGER trg_bookings_set_updated_at
--ايمت ووين لازم يشتغل
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION fn_set_updated_at();

-- منع الحجز المزدوج
CREATE OR REPLACE FUNCTION fn_prevent_double_booking()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.doctor_id IS NOT NULL AND NEW.status <> 'CANCELLED' THEN
        IF EXISTS (
            SELECT 1
            FROM bookings b
            WHERE b.doctor_id        = NEW.doctor_id
              AND b.appointment_time = NEW.appointment_time
              AND b.status          <> 'CANCELLED'
              AND b.id              <> NEW.id      -- ignore the row itself on UPDATE
        ) THEN
            RAISE EXCEPTION 'Doctor % is already booked at %',
                NEW.doctor_id, NEW.appointment_time;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bookings_prevent_double_booking
BEFORE INSERT OR UPDATE OF doctor_id, appointment_time, status ON bookings
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_double_booking();







