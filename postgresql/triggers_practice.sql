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




