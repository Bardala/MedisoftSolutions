-- 1. First ensure all existing NULL values are set to 0
UPDATE
  clinic_billing_plan
SET
  price_per_visit = 0
WHERE
  price_per_visit IS NULL;

UPDATE
  clinic_billing_plan
SET
  monthly_price = 0
WHERE
  monthly_price IS NULL;

UPDATE
  clinic_billing_plan
SET
  yearly_price = 0
WHERE
  yearly_price IS NULL;

-- 2. Add NOT NULL constraints with defaults
ALTER TABLE
  clinic_billing_plan
ALTER COLUMN
  price_per_visit
SET
  DEFAULT 0,
ALTER COLUMN
  price_per_visit
SET
  NOT NULL,
ALTER COLUMN
  monthly_price
SET
  DEFAULT 0,
ALTER COLUMN
  monthly_price
SET
  NOT NULL,
ALTER COLUMN
  yearly_price
SET
  DEFAULT 0,
ALTER COLUMN
  yearly_price
SET
  NOT NULL;

-- 3. Initialize billing plans for clinics without one
DO $$ DECLARE clinic_record RECORD;

default_start_date TIMESTAMP := NOW();

default_end_date TIMESTAMP := NOW() + INTERVAL '1 year';

BEGIN FOR clinic_record IN
SELECT
  id
FROM
  clinics
WHERE
  id NOT IN (
    SELECT
      clinic_id
    FROM
      clinic_billing_plan
  ) LOOP
INSERT INTO
  clinic_billing_plan (
    clinic_id,
    plan_type,
    start_date,
    end_date,
    price_per_visit,
    monthly_price,
    yearly_price,
    status,
    auto_renew
  )
VALUES
  (
    clinic_record.id,
    'FREE',
    default_start_date,
    default_end_date,
    0.0,
    -- price_per_visit
    0.0,
    -- monthly_price
    0.0,
    -- yearly_price
    'ACTIVE',
    false
  );

END LOOP;

END $$;