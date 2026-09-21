CREATE TYPE user_role AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');

CREATE TABLE users (
    id    INT PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role  user_role NOT NULL DEFAULT 'PATIENT'
);

CREATE TABLE doctors (
    id        INT PRIMARY KEY,
    specialty TEXT NOT NULL DEFAULT 'General',
    user_id   INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE patients (
    id      INT PRIMARY KEY,
    phone   TEXT,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    id               INT PRIMARY KEY,
    appointment_time TIMESTAMP NOT NULL,
    status           TEXT NOT NULL DEFAULT 'PENDING',
    patient_id       INT NOT NULL REFERENCES patients(id),
    doctor_id        INT REFERENCES doctors(id)  
);

CREATE TABLE time_slots (
    slot TIME PRIMARY KEY
);



-- INNER JOIN
SELECT d.id AS doctor_id,d.specialty, b.id AS booking_id, b.status
FROM doctors d
INNER JOIN bookings b ON b.doctor_id = d.id;

-- LEFT JOIN
SELECT d.id AS doctor_id, d.specialty, b.id AS booking_id, b.status
FROM doctors d
LEFT JOIN bookings b ON b.doctor_id = d.id;
-- only doctors with NO bookings at all
SELECT d.id AS doctor_id, d.specialty
FROM doctors d
LEFT JOIN bookings b ON b.doctor_id = d.id
WHERE b.id IS NULL;

-- RIGHT JOIN
SELECT d.id AS doctor_id, d.specialty, b.id AS booking_id, b.status
FROM doctors d
RIGHT JOIN bookings b ON b.doctor_id = d.id;

SELECT b.id AS booking_id, b.appointment_time
FROM doctors d
RIGHT JOIN bookings b ON b.doctor_id = d.id
WHERE d.id IS NULL;

-- FULL JOIN
SELECT d.id AS doctor_id, d.specialty, b.id AS booking_id, b.status
FROM doctors d
FULL JOIN bookings b ON b.doctor_id = d.id;

-- cross join
SELECT d.id AS doctor_id, d.specialty, t.slot
FROM doctors d
CROSS JOIN time_slots t
ORDER BY d.id, t.slot;


SELECT
    b.id                AS booking_id,
    pu.name             AS patient,
    du.name             AS doctor,
    d.specialty,
    b.appointment_time,
    b.status
FROM bookings b
JOIN      patients p  ON p.id  = b.patient_id
JOIN      users    pu ON pu.id = p.user_id
LEFT JOIN doctors  d  ON d.id  = b.doctor_id
LEFT JOIN users    du ON du.id = d.user_id
ORDER BY b.id;

