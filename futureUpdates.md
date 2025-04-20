Here's my recommended database design improvements for scaling to a multi-clinic cloud system:

### 1. **Multi-Tenancy Architecture**

```sql
CREATE TABLE clinics (
    clinic_id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(63) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    config JSONB -- Clinic-specific settings
);

-- Add clinic_id to all existing tables
ALTER TABLE users ADD COLUMN clinic_id UUID REFERENCES clinics(clinic_id);
ALTER TABLE patients ADD COLUMN clinic_id UUID REFERENCES clinics(clinic_id);
```

### 2. **Security Improvements**

- **Add Role Hierarchy**:

```sql
CREATE TYPE user_role AS ENUM (
    'SYSTEM_ADMIN',
    'CLINIC_OWNER',
    'DENTIST',
    'ASSISTANT',
    'RECEPTIONIST'
);
```

- **Add Audit Tables**:

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    clinic_id UUID REFERENCES clinics(clinic_id),
    user_id BIGINT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    details JSONB
);
```

### 3. **Performance Optimizations**

- **Add Indexes**:

```sql
CREATE INDEX CONCURRENTLY idx_patients_clinic ON patients(clinic_id);
CREATE INDEX CONCURRENTLY idx_visits_clinic_date ON visits(clinic_id, visit_date);
```

- **Partitioning** (for large datasets):

```sql
CREATE TABLE visit_partitions PARTITION BY RANGE (visit_date);
CREATE TABLE visits_2023 PARTITION OF visits FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
```

### 4. **Enhanced Relationships**

```sql
-- Many-to-many clinic-staff relationships
CREATE TABLE clinic_staff (
    clinic_id UUID REFERENCES clinics(clinic_id),
    user_id BIGINT REFERENCES users(id),
    role user_role NOT NULL,
    PRIMARY KEY (clinic_id, user_id)
);
```

### 5. **New Tables for Cloud Requirements**

```sql
CREATE TABLE subscription_plans (
    plan_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    max_users INT NOT NULL,
    max_patients INT NOT NULL,
    features JSONB NOT NULL
);

CREATE TABLE clinic_subscriptions (
    clinic_id UUID PRIMARY KEY REFERENCES clinics(clinic_id),
    plan_id INT REFERENCES subscription_plans(plan_id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_status VARCHAR(20) NOT NULL
);
```

### 6. **Data Isolation Improvements**

- Add row-level security policies (PostgreSQL example):

```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY patient_clinic_isolation
ON patients
FOR ALL
TO PUBLIC
USING (clinic_id = current_setting('app.current_clinic_id'));
```

### 7. **Migration from SQLite Considerations**

1. **Database Engine**: Move to PostgreSQL (better for multi-tenant) or Cloud SQL
2. **Data Type Changes**:
   - Replace SQLite INTEGER PRIMARY KEY with BIGSERIAL/BIGINT
   - Use TIMESTAMPTZ instead of TIMESTAMP
   - Add proper constraints and indexes
3. **Connection Pooling**: Use PgBouncer or cloud provider equivalent
4. **Backup Strategy**: Implement automated cloud backups

### 8. **Cloud-Specific Additions**

```sql
CREATE TABLE api_usage (
    clinic_id UUID REFERENCES clinics(clinic_id),
    month DATE NOT NULL,
    api_calls INT DEFAULT 0,
    storage_used BIGINT DEFAULT 0,
    PRIMARY KEY (clinic_id, month)
);

CREATE TABLE file_storage (
    file_id UUID PRIMARY KEY,
    clinic_id UUID REFERENCES clinics(clinic_id),
    patient_id BIGINT REFERENCES patients(id),
    s3_path VARCHAR(500) NOT NULL,
    uploader_id BIGINT REFERENCES users(id),
    encrypted_key BYTEA NOT NULL
);
```

### Key Migration Steps:

1. **Database Engine Migration**:
   ```bash
   pgloader sqlite:///old.db postgresql://user@cloud/newdb
   ```
2. **Data Anonymization**:
   - Add encryption for sensitive fields
   - Remove any local paths/absolute references
3. **Connection Security**:
   - Use SSL for all database connections
   - Implement cloud IAM authentication
4. **Monitoring**:
   - Set up Cloud Monitoring for query performance
   - Enable slow query logging

### Recommended Cloud Architecture:

```
                          +-------------------+
                          |  Cloud SQL (PG)   |
                          +-------------------+
                          |  - Row Security   |
                          |  - Partitioning   |
                          |  - Read Replicas  |
                          +---------+---------+
                                    |
+----------------+         +--------+--------+
|    App Engine  +---------+  Cloud Storage  |
|  (Stateless)   |         |  (Patient Files)|
+-------+--------+         +-----------------+
        |
        |          +-----------------+
        +----------+ Redis (Cache)   |
                   |  - Clinic Config|
                   |  - Rate Limits  |
                   +-----------------+
```

This design provides:

- **Multi-tenancy** with data isolation
- **Vertical scaling** through cloud SQL options
- **Horizontal scaling** using read replicas
- **Cost control** through usage tracking
- **Security** through row-level access controls
- **Compliance** with healthcare regulations

Would you like me to elaborate on any specific aspect of this design?
