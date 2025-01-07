# Dental Clinic Management System

A dental clinic management system that allows a single doctor to manage multiple assistants, patients, services, payments and materials. The system tracks patient visits, prescriptions, and payments, providing a comprehensive solution for dental clinics.

# **Table of Contents**

1. [**Key Features and Explanations**](#key-features-and-explanations)
2. [**Database Design**](#database-design)

   - [**Users Table**](#1-users-table)
   - [**Patients Table**](#2-patients-table)
   - [**Services Table**](#3-services-table)
   - [**Medicines Table**](#4-medicines-table)
   - [**Visits Table**](#5-visits-table)
   - [**Payments Table**](#6-payments-table)
   - [**Visit Payments Table**](#7-visit-payments-table)
   - [**Visit Services Table**](#8-visit-services-table)
   - [**Visit Medicines Table**](#9-visit-medicines-table)

3. [**Relationships**](#relationships)
4. [**Doctor Controls**](#doctor-controls)
5. [**Assistants Controls**](#assistants-controls)

# **Key Features and Explanations**

1. **Single Doctor with Multiple Assistants**

   - Assistants have controlled permissions, managed by the doctor. Permissions can include access to reports, patient details, payments...

2. **Service Management**

   - The system includes a list of dental services (e.g., cleaning, root canal, etc.), which can be associated with patient visits.

3. **Prescription Auto-Generation**

   - When a doctor prescribes medicine, the system can automatically generate a prescription with details like dosage, frequency, and duration.

4. **Patient arrival synchronization**

   - When a patient arrives, the assistant can mark the patient as arrived, and the doctor can see the patient's arrival status.

   - The system can track the time the patient waited before the visit and the duration of the visit.

5. **Patient Tracking**

   - Track patient details, including medical history, address, and notes.

6. **Medicine Tracking**

   - Track all medicines prescribed to patients during visits.

7. **Payment Tracking**

   - Payments are linked to the user (doctor/assistant) who recorded them.

8. **Visit Tracking**
   - Each patient visit includes details like the patient, services provided, payment (if any), and visit date.

---

# **Database Design**

## **1. Users Table**

Stores all system users (doctor and assistants).

| **Column Name** | **Type**                    | **Constraints**               |
| --------------- | --------------------------- | ----------------------------- |
| id              | INT                         | Primary Key, Auto-Increment   |
| username        | VARCHAR(100)                | NOT NULL, UNIQUE              |
| phone           | VARCHAR(20)                 | NOT NULL, UNIQUE              |
| name            | VARCHAR(200)                | NOT NULL, UNIQUE              |
| password        | VARCHAR(255)                | NOT NULL                      |
| role            | ENUM('Doctor', 'Assistant') | NOT NULL                      |
| profile_picture | VARCHAR(255)                | NULLABLE                      |
| ~~permissions~~ | ~~JSON~~                    | ~~NULLABLE (for assistants)~~ |
| created_at      | TIMESTAMP                   | DEFAULT CURRENT_TIMESTAMP     |

### **Explanation:**

- **`role`**: Specifies whether the user is a doctor or an assistant.
- **`profile_picture`**: Stores the URL of the user's profile picture.
- **`phone`**: Unique, as it can be used for login.
- **`password`**: Encrypted using a secure hashing algorithm.
- **`username`**: Unique, as it can be used for login.
- **`name`**: The user's full name.
- **`permissions`**: The doctor can control these permissions, it have been removed from the table, but we can create a separate table for it.

### **Questions:**

- <span style="color: red;"> Should we add another fields or details about the user?</span>

## **2. Patients Table**

Stores patient information.

| **Column Name** | **Type**     | **Constraints**             |
| --------------- | ------------ | --------------------------- |
| id              | INT          | Primary Key, Auto-Increment |
| full_name       | VARCHAR(200) | NOT NULL, UNIQUE            |
| date_of_birth   | DATE         | NULLABLE                    |
| age             | INT          | NULLABLE                    |
| notes           | TEXT         | NULLABLE                    |
| phone           | VARCHAR(20)  | NOT NULL                    |
| address         | TEXT         | NULLABLE                    |
| medical_history | TEXT         | NULLABLE                    |
| created_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   |

### **Explanation:**

- **`medical_history`**: Can include details like previous treatments, allergies, etc.
- **`phone`**: Not Unique, as some patients don't have a phone, so we can add it's family member's phone number.
- **`address`**: Can store the patient's address for future reference.
- **`notes`**: Can include any additional notes about the patient.

### **Questions:**

- <span style="color: red;">Should we add another fields or details about the patient?</span>
- <span style="color: red;">Do all patients have a phone number? </span> to ensure that it's not null.

## **3. Services Table**

Stores dental services provided by the clinic.

| **Column Name** | **Type**      | **Constraints**             |
| --------------- | ------------- | --------------------------- |
| id              | INT           | Primary Key, Auto-Increment |
| service_name    | VARCHAR(150)  | NOT NULL, UNIQUE            |
| description     | TEXT          | NULLABLE                    |
| cost            | DECIMAL(10,2) | NOT NULL                    |

### **Explanation:**

- **`cost`**: Stores the cost of each service.
- **`description`**: Can include details about the service.
- **`service_name`**: Unique, as it can be used to identify the service.

### **Questions:**

- <span style="color: red;">Should we add another fields or details about the service?</span>

## **4. Medicines Table**

Stores all medicines prescribed by the doctor.

| **Column Name** | **Type**     | **Constraints**             |
| --------------- | ------------ | --------------------------- |
| id              | INT          | Primary Key, Auto-Increment |
| medicine_name   | VARCHAR(150) | NOT NULL, UNIQUE            |
| dosage          | VARCHAR      | NULLABLE                    |
| frequency       | VARCHAR      | NULLABLE                    |
| duration        | INT          | NULLABLE                    |
| instructions    | TEXT         | NULLABLE                    |
| created_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   |

### **Explanation:**

- **`dosage`**: Specifies the amount of medicine to be taken each time (e.g., "500 mg").
- **`frequency`**: Specifies how often the medicine should be taken (e.g., "Twice a day").
- **`duration`**: Specifies the number of days the medicine should be taken (e.g., "7" days).
- **`instructions`**: Provides additional instructions for taking the medicine (e.g., "Take after meals").

<span style="color: green;">**For automatic Prescription creation.**</span>

### **Questions:**

- <span style="color: red;">Should we add another fields or details about the medicine?</span>

## **5. Visits Table**

Tracks patient visits.

| **Column Name** | **Type**  | **Constraints**                      |
| --------------- | --------- | ------------------------------------ |
| id              | INT       | Primary Key, Auto-Increment          |
| patient_id      | INT       | Foreign Key -> Patients(id) NOT NULL |
| visit_date      | DATETIME  | NOT NULL                             |
| doctor_id       | INT       | Foreign Key -> Users(id) NOT NULL    |
| Assistant_id    | INT       | Foreign Key -> Users(id) NULLABLE    |
| wait            | INT       | NULLABlE                             |
| duration        | INT       | NULLABlE                             |
| doctor_notes    | TEXT      | NULLABLE                             |
| created_at      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP            |

### **Explanation:**

- **`wait`**: The time the patient waited before the visit.
- **`duration`**: The duration of the visit.
- **`doctor_notes`**: Any additional notes the doctor wants to add about the visit.

### **Questions:**

- <span style="color: red;">Should we add another fields or details about the visit?</span>

## **6. Payments Table**

Tracks payments made by patients.

| **Column Name** | **Type**                       | **Constraints**                                          |
| --------------- | ------------------------------ | -------------------------------------------------------- |
| id              | INT                            | Primary Key, Auto-Increment                              |
| patient_id      | INT                            | Foreign Key -> Patients(id) NOT NULL                     |
| user_id         | INT                            | Foreign Key -> Users(id) NOT NULL (who recorded payment) |
| amount          | DECIMAL(10,2)                  | NOT NULL                                                 |
| payment_date    | DATETIME                       | DEFAULT CURRENT_TIMESTAMP                                |
| payment_method  | ENUM('Cash', 'Card', 'Online') | NOT NULL                                                 |

### **Explanation:**

- **`amount`**: The amount paid by the patient.
- **`payment_date`**: The date and time of the payment.
- **`payment_method`**: The method used for payment (e.g., Cash, Card, Online).

### **Questions:**

- <span style="color: red;">Should we add another fields or details about the payment?</span>

## **7. Visit Payments Table**

Tracks payments made during a visit.

| **Column Name** | **Type** | **Constraints**                      |
| --------------- | -------- | ------------------------------------ |
| id              | INT      | Primary Key, Auto-Increment          |
| visit_id        | INT      | Foreign Key -> Visits(id) NOT NULL   |
| payment_id      | INT      | Foreign Key -> Payments(id) NOT NULL |

## **8. Visit Services Table**

Tracks services provided during a visit.

| **Column Name** | **Type** | **Constraints**                      |
| --------------- | -------- | ------------------------------------ |
| id              | INT      | Primary Key, Auto-Increment          |
| visit_id        | INT      | Foreign Key -> Visits(id) NOT NULL   |
| service_id      | INT      | Foreign Key -> Services(id) NOT NULL |

## **9. Visit Medicines Table**

Tracks medicines prescribed during a visit.

| **Column Name** | **Type** | **Constraints**                       |
| --------------- | -------- | ------------------------------------- |
| id              | INT      | Primary Key, Auto-Increment           |
| visit_id        | INT      | Foreign Key -> Visits(id) NOT NULL    |
| medicine_id     | INT      | Foreign Key -> Medicines(id) NOT NULL |

---

# **Relationships**

1. **Users ↔ Payments:**  
   Payments track the user (doctor/assistant) who recorded them.

2. **Patients ↔ Visits:**  
   Each visit belongs to a patient.

3. **Visits ↔ Services & Medicines:**  
   Services and medicines provided during a visit are stored in respective tables.

4. **Doctor ↔ Assistants:**  
   The doctor can control permissions for assistants through the `permissions` column.

---

# **Doctor Controls**

1. **Permission Management:**  
   The doctor can enable/disable assistant permissions (e.g., view reports, add payments).

2. **Audit Logs:**  
   Add a `Logs` table to track assistant actions for accountability.

3. **Service Management:**  
   The doctor can manage the list of services (add, update, delete).

4. **Report Access:**  
   Assistants can access reports only with specific permissions.

---
