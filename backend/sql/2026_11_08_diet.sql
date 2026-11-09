-- Apply once to the production MySQL database before deploying the Diet API.
CREATE TABLE IF NOT EXISTS meal_entries (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    logged_date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    food_name VARCHAR(120) NOT NULL,
    serving VARCHAR(80),
    calories INT NOT NULL,
    protein_grams DECIMAL(6, 1),
    carbs_grams DECIMAL(6, 1),
    fat_grams DECIMAL(6, 1),
    created_at DATETIME(6) NOT NULL,
    INDEX idx_meal_user_date (user_id, logged_date)
);

CREATE TABLE IF NOT EXISTS nutrition_targets (
    user_id VARCHAR(36) NOT NULL PRIMARY KEY,
    calories INT,
    protein_grams DECIMAL(6, 1),
    carbs_grams DECIMAL(6, 1),
    fat_grams DECIMAL(6, 1)
);
