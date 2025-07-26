INSERT INTO
  clinic_usage (
    clinic_id,
    visit_count,
    patient_count,
    last_visit_added
  )
SELECT
  id,
  0,
  0,
  NOW()
FROM
  clinics
WHERE
  id NOT IN (
    SELECT
      clinic_id
    FROM
      clinic_usage
  );