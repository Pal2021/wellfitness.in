-- Apply once to production MySQL before deploying body measurement history.
CREATE TABLE IF NOT EXISTS body_measurements (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    logged_date DATE NOT NULL,
    weight_kg DECIMAL(5, 2),
    height_cm INT,
    UNIQUE KEY uq_body_measurement_user_date (user_id, logged_date)
);
