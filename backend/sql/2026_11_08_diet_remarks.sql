-- Apply once after 2026_11_08_diet.sql and before deploying nutrition estimation.
-- Additive: existing entries retain NULL remarks; no nutrition values are changed.
ALTER TABLE meal_entries ADD COLUMN remarks VARCHAR(1000) NULL;
