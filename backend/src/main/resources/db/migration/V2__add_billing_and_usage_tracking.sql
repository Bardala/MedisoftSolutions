-- Add new column to clinic_limits
ALTER TABLE
  clinic_limits
ADD
  COLUMN IF NOT EXISTS max_visit_count INTEGER NOT NULL DEFAULT 0;

-- Create clinic_billing_plan table
CREATE TABLE IF NOT EXISTS clinic_billing_plan (
  id BIGSERIAL PRIMARY KEY,
  clinic_id BIGINT NOT NULL UNIQUE REFERENCES clinics(id),
  plan_type VARCHAR(20) NOT NULL CHECK (
    plan_type IN ('VISIT_BASED', 'MONTHLY', 'YEARLY', 'FREE')
  ),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  price_per_visit DECIMAL(10, 2),
  monthly_price DECIMAL(10, 2),
  yearly_price DECIMAL(10, 2),
  status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
  auto_renew BOOLEAN NOT NULL DEFAULT true
);

-- Create clinic_usage table
CREATE TABLE IF NOT EXISTS clinic_usage (
  id BIGSERIAL PRIMARY KEY,
  clinic_id BIGINT NOT NULL UNIQUE REFERENCES clinics(id),
  visit_count INTEGER NOT NULL DEFAULT 0,
  patient_count INTEGER NOT NULL DEFAULT 0,
  last_visit_added TIMESTAMPTZ
);