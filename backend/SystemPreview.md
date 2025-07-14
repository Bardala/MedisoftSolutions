# Dental Clinic Management System

A dental clinic management system that allows a single doctor to manage multiple assistants, patients, services, payments and materials. The system tracks patient visits, prescriptions, and payments, providing a comprehensive solution for dental clinics.

# **Table of Contents**

1. [**Key Features and Explanations**](#key-features-and-explanations)
2. [**Database Design**](#database-design)

   - [**Users Table**](#1-users-table)
   - [**Patients Table**](#2-patients-table)
   - [**Services (Dental Procedures) Table**](#3-services-table)
   - [**Medicines Table**](#4-medicines-table)
   - [**Visits Table**](#5-visits-table)
   - [**Payments Table**](#6-payments-table)
   - [**Visit Payments Table**](#7-visit-payments-table)
   - [**Visit Services Table**](#8-visit-services-table)
   - [**Visit Medicines Table**](#9-visit-medicines-table)
   - [**Patient Files Table**](#10-patient-files-table)
   - [**Queue Table**](#11-queue-table)
   - [**Settings Table**](#12-settings-table)

3. [**Relationships**](#relationships)
4. [**Doctor Controls**](#doctor-controls)
5. [**Assistants Controls**](#assistants-controls)
6. [**Sequence Diagrams**](#sequence diagrams)

# **Key Features and Explanations**

1. **Single Doctor with Multiple Assistants**

   - Assistants have controlled permissions, managed by the doctor.

2. **Service Management**

   - The system includes a list of dental services (e.g., cleaning, root canal, etc.), which can be associated with patient visits.

3. **Prescription Auto-Generation**

   - When a doctor prescribes medicine, the system can automatically generate a prescription with details like dosage, frequency, and duration.

4. **Patient arrival synchronization**

   - Queue system tracks patient status (WAITING, IN_PROGRESS, COMPLETED)
   - Tracks estimated wait time and actual position in queue

5. **Patient Tracking**

   - Track patient details, including medical history, address, and notes.
   - Store patient files (medical tests, x-rays, etc.)

6. **Medicine Tracking**

   - Track all medicines prescribed to patients during visits.

7. **Payment Tracking**

   - Payments are linked to the user (doctor/assistant) who recorded them.

8. **Visit Tracking**
   - Each patient visit includes details like the patient, services provided, payment (if any), and visit date.

---

# **Database Design**

## **1. Clinic Table**

Core clinic information and settings.

| **Column Name**         | **Type**     | **Constraints**                          |
| ----------------------- | ------------ | ---------------------------------------- |
| id                      | BIGINT       | Primary Key, Auto-Increment              |
| name                    | VARCHAR(100) | NOT NULL                                 |
| address                 | TEXT         | NULLABLE                                 |
| phone_number            | VARCHAR(20)  | NULLABLE                                 |
| email                   | VARCHAR(100) | NULLABLE                                 |
| logo_url                | VARCHAR(255) | NULLABLE                                 |
| working_hours           | TEXT         | NULLABLE                                 |
| phone_supports_whatsapp | BOOLEAN      | DEFAULT FALSE                            |
| created_at              | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP, Not updatable |
| updated_at              | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP on update      |

## **2. ClinicLimits Table**

Clinic subscription limits and features.

| **Column Name**         | **Type** | **Constraints**                   |
| ----------------------- | -------- | --------------------------------- |
| id                      | BIGINT   | Primary Key, Auto-Increment       |
| clinic_id               | BIGINT   | Foreign Key -> Clinic(id), UNIQUE |
| max_users               | INT      | NULLABLE                          |
| max_file_storage_mb     | INT      | NULLABLE                          |
| max_patient_records     | INT      | NULLABLE                          |
| allow_file_upload       | BOOLEAN  | DEFAULT TRUE                      |
| allow_multiple_branches | BOOLEAN  | DEFAULT FALSE                     |
| allow_billing_feature   | BOOLEAN  | DEFAULT TRUE                      |

## **3. ClinicSettings Table**

Clinic-specific configurations.

| **Column Name**       | **Type**     | **Constraints**                          |
| --------------------- | ------------ | ---------------------------------------- |
| id                    | BIGINT       | Primary Key, Auto-Increment              |
| clinic_id             | BIGINT       | Foreign Key -> Clinic(id), UNIQUE        |
| doctor_name           | VARCHAR(100) | NULLABLE                                 |
| doctor_title          | VARCHAR(100) | NULLABLE                                 |
| doctor_qualification  | VARCHAR(100) | NULLABLE                                 |
| backup_db_path        | TEXT         | NULLABLE                                 |
| backup_images_path    | TEXT         | NULLABLE                                 |
| healing_message       | TEXT         | NULLABLE                                 |
| print_footer_notes    | TEXT         | NULLABLE                                 |
| language              | VARCHAR(10)  | DEFAULT 'en'                             |
| backup_enabled        | BOOLEAN      | DEFAULT FALSE                            |
| backup_frequency_cron | VARCHAR(20)  | NULLABLE                                 |
| created_at            | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP, Not updatable |
| updated_at            | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP on update      |

## **4. Users Table**

All system users with authentication.

| **Column Name** | **Type**     | **Constraints**                          |
| --------------- | ------------ | ---------------------------------------- |
| id              | BIGINT       | Primary Key, Auto-Increment              |
| clinic_id       | BIGINT       | Foreign Key -> Clinic(id), NOT NULL      |
| username        | VARCHAR(20)  | NOT NULL, UNIQUE, No spaces allowed      |
| password        | VARCHAR(255) | NOT NULL                                 |
| name            | VARCHAR(200) | NOT NULL                                 |
| phone           | VARCHAR(20)  | NOT NULL, UNIQUE                         |
| role            | VARCHAR(10)  | 'Admin','Doctor' or 'Assistant'          |
| profile_picture | VARCHAR(255) | NULLABLE                                 |
| created_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP, Not updatable |

## **5. Patients Table**

Patient medical records.

| **Column Name** | **Type**     | **Constraints**                          |
| --------------- | ------------ | ---------------------------------------- |
| id              | BIGINT       | Primary Key, Auto-Increment              |
| clinic_id       | BIGINT       | Foreign Key -> Clinic(id), NOT NULL      |
| full_name       | VARCHAR(200) | NOT NULL, Clinic-scoped UNIQUE           |
| age             | INT          | NULLABLE                                 |
| notes           | TEXT         | NULLABLE                                 |
| phone           | VARCHAR(20)  | NOT NULL                                 |
| address         | TEXT         | NULLABLE                                 |
| medical_history | VARCHAR(500) | NULLABLE                                 |
| created_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP, Not updatable |

## **6. PatientFiles Table**

Patient documents and attachments.

| **Column Name** | **Type**     | **Constraints**                          |
| --------------- | ------------ | ---------------------------------------- |
| id              | BIGINT       | Primary Key, Auto-Increment              |
| clinic_id       | BIGINT       | Foreign Key -> Clinic(id), NOT NULL      |
| patient_id      | BIGINT       | Foreign Key -> Patients(id), NOT NULL    |
| file_type       | VARCHAR(50)  | NOT NULL                                 |
| description     | VARCHAR(200) | NULLABLE                                 |
| file_path       | VARCHAR(300) | NULLABLE                                 |
| created_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP, Not updatable |

## **7. Procedures Table**

Dental services offered.

| **Column Name** | **Type**      | **Constraints**                     |
| --------------- | ------------- | ----------------------------------- |
| id              | BIGINT        | Primary Key, Auto-Increment         |
| clinic_id       | BIGINT        | Foreign Key -> Clinic(id), NOT NULL |
| service_name    | VARCHAR(150)  | NOT NULL, UNIQUE                    |
| arabic_name     | VARCHAR(150)  | NOT NULL                            |
| description     | VARCHAR(1000) | NULLABLE                            |
| cost            | DOUBLE        | NOT NULL                            |

## **8. Medicines Table**

Prescription medications.

| **Column Name** | **Type**     | **Constraints**                          |
| --------------- | ------------ | ---------------------------------------- |
| id              | BIGINT       | Primary Key, Auto-Increment              |
| clinic_id       | BIGINT       | Foreign Key -> Clinic(id), NOT NULL      |
| medicine_name   | VARCHAR(150) | NOT NULL, UNIQUE                         |
| dosage          | VARCHAR(50)  | NOT NULL                                 |
| frequency       | VARCHAR(50)  | NOT NULL                                 |
| duration        | INT          | NOT NULL                                 |
| instructions    | TEXT         | NULLABLE                                 |
| created_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP, Not updatable |

## **9. Visits Table**

Patient appointment records.

| **Column Name** | **Type**  | **Constraints**                          |
| --------------- | --------- | ---------------------------------------- |
| id              | BIGINT    | Primary Key, Auto-Increment              |
| clinic_id       | BIGINT    | Foreign Key -> Clinic(id), NOT NULL      |
| patient_id      | BIGINT    | Foreign Key -> Patients(id), NOT NULL    |
| doctor_id       | BIGINT    | Foreign Key -> Users(id), NOT NULL       |
| assistant_id    | BIGINT    | Foreign Key -> Users(id), NULLABLE       |
| wait            | INT       | NULLABLE (minutes)                       |
| duration        | INT       | NULLABLE (minutes)                       |
| doctor_notes    | TEXT      | NULLABLE                                 |
| created_at      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, Not updatable |

## **10. Payments Table**

Financial transactions.

| **Column Name** | **Type**  | **Constraints**                          |
| --------------- | --------- | ---------------------------------------- |
| id              | BIGINT    | Primary Key, Auto-Increment              |
| clinic_id       | BIGINT    | Foreign Key -> Clinic(id), NOT NULL      |
| patient_id      | BIGINT    | Foreign Key -> Patients(id), NOT NULL    |
| recorded_by     | BIGINT    | Foreign Key -> Users(id), NOT NULL       |
| amount          | DOUBLE    | NOT NULL                                 |
| created_at      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, Not updatable |

## **11. Queue Table**

Patient queue management.

| **Column Name**     | **Type**  | **Constraints**                          |
| ------------------- | --------- | ---------------------------------------- |
| id                  | BIGINT    | Primary Key, Auto-Increment              |
| clinic_id           | BIGINT    | Foreign Key -> Clinic(id), NOT NULL      |
| patient_id          | BIGINT    | Foreign Key -> Patients(id), NOT NULL    |
| doctor_id           | BIGINT    | Foreign Key -> Users(id), NOT NULL       |
| assistant_id        | BIGINT    | Foreign Key -> Users(id), NULLABLE       |
| position            | INT       | NOT NULL                                 |
| status              | VARCHAR   | WAITING/IN_PROGRESS/COMPLETED            |
| estimated_wait_time | INT       | NULLABLE (minutes)                       |
| created_at          | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, Not updatable |
| updated_at          | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP on update      |

## **12. VisitProcedure Table**

Services performed during visits.

| **Column Name** | **Type** | **Constraints**                         |
| --------------- | -------- | --------------------------------------- |
| id              | BIGINT   | Primary Key, Auto-Increment             |
| clinic_id       | BIGINT   | Foreign Key -> Clinic(id), NOT NULL     |
| visit_id        | BIGINT   | Foreign Key -> Visits(id), NOT NULL     |
| service_id      | BIGINT   | Foreign Key -> Procedures(id), NOT NULL |

## **13. VisitMedicine Table**

Medications prescribed during visits.

| **Column Name** | **Type** | **Constraints**                        |
| --------------- | -------- | -------------------------------------- |
| id              | BIGINT   | Primary Key, Auto-Increment            |
| clinic_id       | BIGINT   | Foreign Key -> Clinic(id), NOT NULL    |
| visit_id        | BIGINT   | Foreign Key -> Visits(id), NOT NULL    |
| medicine_id     | BIGINT   | Foreign Key -> Medicines(id), NOT NULL |

## **14. VisitPayment Table**

Payments linked to visits.

| **Column Name** | **Type** | **Constraints**                       |
| --------------- | -------- | ------------------------------------- |
| id              | BIGINT   | Primary Key, Auto-Increment           |
| clinic_id       | BIGINT   | Foreign Key -> Clinic(id), NOT NULL   |
| visit_id        | BIGINT   | Foreign Key -> Visits(id), NOT NULL   |
| payment_id      | BIGINT   | Foreign Key -> Payments(id), NOT NULL |

# Entity Relationship Details

## 1. **User → Payment**

**Relationship:** One-to-Many  
**Description:**

- A **User** (with role `Admin`, `Doctor`, or `Assistant`) can record **multiple Payments** (`recorded_by` foreign key in `Payments` table).
- Each **Payment** is recorded by **exactly one User**.

## 2. **Patient → Visit**

**Relationship:** One-to-Many  
**Description:**

- A **Patient** can have **multiple Visits** (`patient_id` foreign key in `Visits` table).
- Each **Visit** belongs to **exactly one Patient**.

## 3. **Visit ↔ Services/Medicines/Payments**

**Relationship:** Many-to-Many (via junction tables)  
**Description:**

- **Visit ↔ Procedures**:
  - A **Visit** can include **multiple Procedures** (via `VisitProcedure` junction table).
  - A **Procedure** can be part of **multiple Visits**.
- **Visit ↔ Medicines**:
  - A **Visit** can prescribe **multiple Medicines** (via `VisitMedicine` junction table).
  - A **Medicine** can be prescribed in **multiple Visits**.
- **Visit ↔ Payments**: <!-- todo: One to One -->
  - A **Visit** can be linked to **multiple Payments** (via `VisitPayment` junction table).
  - A **Payment** can be linked to **multiple Visits** (e.g., partial payments for a single visit).

## 4. **Patient → Files**

**Relationship:** One-to-Many  
**Description:**

- A **Patient** can have **multiple Files** (`patient_id` foreign key in `PatientFiles` table).
- Each **File** belongs to **exactly one Patient**.

## 5. **Doctor (User) → Queue**

**Relationship:** One-to-Many  
**Description:**

- A **Doctor** (a `User` with role `Doctor`) can manage **multiple Queue entries** (`doctor_id` foreign key in `Queue` table).
- Each **Queue entry** is assigned to **exactly one Doctor**.

---

### Additional Key Relationships:

- **Clinic → All Tables**:
  - One-to-Many (e.g., a Clinic has multiple Users, Patients, Visits, etc.).
- **Assistant (User) → Queue**:
  - One-to-Many (an `Assistant` can assist in multiple Queue entries via `assistant_id`).
- **Patient → Queue**:
  - One-to-Many (a Patient can be in the Queue multiple times).

## Entity Relationship Diagram

```mermaid
erDiagram
CLINIC ||--o{ CLINIC_LIMITS : has
CLINIC ||--o{ CLINIC_SETTINGS : has
CLINIC ||--o{ USERS : has
CLINIC ||--o{ PATIENTS : has
CLINIC ||--o{ PROCEDURES : has
CLINIC ||--o{ MEDICINES : has
CLINIC ||--o{ VISITS : has
CLINIC ||--o{ PAYMENTS : has
CLINIC ||--o{ QUEUE : has

PATIENTS ||--o{ PATIENT_FILES : has
PATIENTS ||--o{ VISITS : has
PATIENTS ||--o{ PAYMENTS : has
PATIENTS ||--o{ QUEUE : has

USERS ||--o{ VISITS : "doctor"
USERS ||--o{ VISITS : "assistant"
USERS ||--o{ PAYMENTS : "recorded_by"
USERS ||--o{ QUEUE : "doctor"
USERS ||--o{ QUEUE : "assistant"

VISITS ||--o{ VISIT_PROCEDURE : has
VISITS ||--o{ VISIT_MEDICINE : has
VISITS ||--o{ VISIT_PAYMENT : has

PROCEDURES }o--|| VISIT_PROCEDURE : included_in
MEDICINES }o--|| VISIT_MEDICINE : prescribed_in
PAYMENTS }o--|| VISIT_PAYMENT : linked_to

CLINIC {
   bigint id PK
   varchar(100) name
   text address
   varchar(20) phone_number
   varchar(100) email
   varchar(255) logo_url
   text working_hours
   boolean phone_supports_whatsapp
   timestamp created_at
   timestamp updated_at
}

CLINIC_LIMITS {
   bigint id PK
   bigint clinic_id FK
   int max_users
   int max_file_storage_mb
   int max_patient_records
   boolean allow_file_upload
   boolean allow_multiple_branches
   boolean allow_billing_feature
}

CLINIC_SETTINGS {
   bigint id PK
   bigint clinic_id FK
   varchar(100) doctor_name
   varchar(100) doctor_title
   varchar(100) doctor_qualification
   text backup_db_path
   text backup_images_path
   text healing_message
   text print_footer_notes
   varchar(10) language
   boolean backup_enabled
   varchar(20) backup_frequency_cron
   timestamp created_at
   timestamp updated_at
}

USERS {
   bigint id PK
   bigint clinic_id FK
   varchar(20) username
   varchar(255) password
   varchar(200) name
   varchar(20) phone
   varchar(10) role
   varchar(255) profile_picture
   timestamp created_at
}

PATIENTS {
   bigint id PK
   bigint clinic_id FK
   varchar(200) full_name
   int age
   text notes
   varchar(20) phone
   text address
   varchar(500) medical_history
   timestamp created_at
}

PATIENT_FILES {
   bigint id PK
   bigint clinic_id FK
   bigint patient_id FK
   varchar(50) file_type
   varchar(200) description
   varchar(300) file_path
   timestamp created_at
}

PROCEDURES {
   bigint id PK
   bigint clinic_id FK
   varchar(150) service_name
   varchar(150) arabic_name
   varchar(1000) description
   double cost
}

MEDICINES {
   bigint id PK
   bigint clinic_id FK
   varchar(150) medicine_name
   varchar(50) dosage
   varchar(50) frequency
   int duration
   text instructions
   timestamp created_at
}

VISITS {
   bigint id PK
   bigint clinic_id FK
   bigint patient_id FK
   bigint doctor_id FK
   bigint assistant_id FK
   int wait
   int duration
   text doctor_notes
   timestamp created_at
}

PAYMENTS {
   bigint id PK
   bigint clinic_id FK
   bigint patient_id FK
   bigint recorded_by FK
   double amount
   timestamp created_at
}

QUEUE {
   bigint id PK
   bigint clinic_id FK
   bigint patient_id FK
   bigint doctor_id FK
   bigint assistant_id FK
   int position
   varchar status
   int estimated_wait_time
   timestamp created_at
   timestamp updated_at
}

VISIT_PROCEDURE {
   bigint id PK
   bigint clinic_id FK
   bigint visit_id FK
   bigint service_id FK
}

VISIT_MEDICINE {
   bigint id PK
   bigint clinic_id FK
   bigint visit_id FK
   bigint medicine_id FK
}

VISIT_PAYMENT {
   bigint id PK
   bigint clinic_id FK
   bigint visit_id FK
   bigint payment_id FK
}
```

---

# **Doctor Controls**

1. **User Management:**
   Full control over assistant accounts

2. **Service Management:**
   Add/update dental procedures with bilingual names

3. **Queue Management:**
   Monitor and update patient queue status

4. **Patient Records:**
   Access to complete medical history and files

# **Assistants Controls**

1. **Patient Registration:**
   Add new patients and update information

2. **Queue Management:**
   Add patients to queue and update basic status

3. **Payment Recording:**
   Record payments with doctor oversight

4. **Limited Access:**
   Restricted access based on doctor's settings

---

# **Sequence Diagrams**

## **1. Authentication Flow (Refresh Token API)**

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant AuthDB

    User->>Frontend: Logs in (username/password)
    Frontend->>Backend: POST /login
    Backend->>AuthDB: Validate credentials
    AuthDB-->>Backend: User data
    Backend->>Frontend: HTTP/1.1 200 OK
    Backend->>Frontend: Set-Cookie: refresh_token=xyz
    Backend->>Frontend: Body: {access_token: abc, expires_in: 3600}

    loop Every API call
        Frontend->>Backend: API request (Bearer abc)
        alt Token valid
            Backend-->>Frontend: 200 OK (data)
        else Token expired
            Backend-->>Frontend: 401 Unauthorized
            Frontend->>Backend: POST /refresh (Cookie: refresh_token=xyz)
            Backend->>AuthDB: Validate refresh token
            AuthDB-->>Backend: Valid
            Backend->>Frontend: HTTP/1.1 200 OK
            Backend->>Frontend: Body: {new_access_token: def, expires_in: 3600}
            Frontend->>Backend: Retry request (Bearer def)
        end
    end
```

## Patient Creation Flow:

Comprehensive sequence diagram for patient creation flow across all layers:

```mermaid
sequenceDiagram
    actor Client as Client (Frontend/Browser)
    participant Controller as PatientController
    participant Service as PatientService
    participant Auth as AuthContext
    participant Repository as PatientRepo
    participant Entity as Patient Entity
    participant DTO as PatientResDTO

    Client->>Controller: POST /api/v1/patients (PatientReqDTO)
    activate Controller

    Controller->>Service: create(req)
    activate Service

    Service->>Auth: getClinicId()
    activate Auth
    Auth-->>Service: clinicId
    deactivate Auth

    Service->>Repository: existsByFullNameAndClinicId(fullName, clinicId)
    activate Repository
    alt Patient exists
        Repository-->>Service: true
        Service-->>Controller: throws IllegalArgumentException
        Controller-->>Client: 400 Bad Request (Error in ApiRes)
    else Patient doesn't exist
        Repository-->>Service: false
        deactivate Repository

        Service->>DTO: toEntity(new Clinic(clinicId))
        activate DTO
        DTO-->>Service: Patient entity
        deactivate DTO

        Service->>Repository: save(patient)
        activate Repository
        Repository->>Entity: persist()
        activate Entity
        Entity-->>Repository: saved patient
        deactivate Entity
        Repository-->>Service: saved patient
        deactivate Repository

        Service->>DTO: fromEntity(patient)
        activate DTO
        DTO-->>Service: PatientResDTO
        deactivate DTO
        Service-->>Controller: PatientResDTO
    end

    deactivate Service

    Controller->>ApiRes: new ApiRes<>(createdPatient)
    activate ApiRes
    ApiRes-->>Controller: response object
    deactivate ApiRes

    Controller-->>Client: 200 OK (ApiRes<PatientResDTO>)
    deactivate Controller
```

### Key components illustrated:

1. Flow Initiation:

   - Client makes POST request to PatientController

2. Validation Layer:

   - AuthContext provides clinicId for tenant isolation

   - Repository checks for existing patient name

3. Business Logic:

   - PatientReqDTO converts to Entity

   - Service handles uniqueness validation

4. Persistence:

   - PatientRepo saves the entity

   - Database-level constraints enforced

5. Response Formation:

   - Entity converts to PatientResDTO

   - Wrapped in standardized ApiRes format

6. Error Handling:

   - Duplicate name case shown in alt path

   - Returns 400 with error message

7. Success Flow:

   - Returns 200 with created patient data

The diagram shows:

- Clear layer separation (Controller → Service → Repository)

- DTO transformations

- Auth context integration

- Database interaction

- Response formatting
