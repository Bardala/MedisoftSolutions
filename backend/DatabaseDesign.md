Here’s an updated **database design and explanation** for your dental clinic management system, considering the new **constraints** and **approaches**:

---

### **Key Features and Explanations**

1. **Single Doctor with Multiple Assistants**
   - Assistants have controlled permissions, managed by the doctor. Permissions can include access to reports, patient details, and payments.
2. **Service Management**

   - The system includes a list of dental services (e.g., cleaning, root canal, etc.), which can be associated with patient visits.

3. **Medicine Tracking**

   - Track all medicines prescribed to patients during visits.

4. **Payment Tracking**

   - Payments are linked to the user (doctor/assistant) who recorded them.

5. **Visit Tracking**
   - Each patient visit includes details like the patient, services provided, payment (if any), and visit date.

---

### **Updated Database Design**

#### **1. Users Table**

Stores all system users (doctor and assistants).

| **Column Name** | **Type**                    | **Constraints**             |
| --------------- | --------------------------- | --------------------------- |
| id              | INT                         | Primary Key, Auto-Increment |
| username        | VARCHAR(100)                | NOT NULL, UNIQUE            |
| email           | VARCHAR(150)                | NOT NULL, UNIQUE            |
| password        | VARCHAR(255)                | NOT NULL                    |
| role            | ENUM('Doctor', 'Assistant') | NOT NULL                    |
| profile_picture | VARCHAR(255)                | NULLABLE                    |
| permissions     | JSON                        | NULLABLE (for assistants)   |
| created_at      | TIMESTAMP                   | DEFAULT CURRENT_TIMESTAMP   |

- **`permissions`**: Stored as JSON (e.g., `{ "viewReports": true, "editPayments": false }`).

---

#### **2. Patients Table**

Stores patient information.

| **Column Name** | **Type**                        | **Constraints**             |
| --------------- | ------------------------------- | --------------------------- |
| id              | INT                             | Primary Key, Auto-Increment |
| full_name       | VARCHAR(200)                    | NOT NULL                    |
| gender          | ENUM('Male', 'Female', 'Other') | NOT NULL                    |
| date_of_birth   | DATE                            | NOT NULL                    |
| phone           | VARCHAR(20)                     | UNIQUE                      |
| email           | VARCHAR(150)                    | UNIQUE                      |
| address         | TEXT                            | NULLABLE                    |
| medical_history | TEXT                            | NULLABLE                    |
| created_at      | TIMESTAMP                       | DEFAULT CURRENT_TIMESTAMP   |

---

#### **3. Services Table**

Stores dental services provided by the clinic.

| **Column Name** | **Type**      | **Constraints**             |
| --------------- | ------------- | --------------------------- |
| id              | INT           | Primary Key, Auto-Increment |
| service_name    | VARCHAR(150)  | NOT NULL, UNIQUE            |
| description     | TEXT          | NULLABLE                    |
| cost            | DECIMAL(10,2) | NOT NULL                    |

---

#### **4. Medicines Table**

Stores all medicines prescribed by the doctor.

| **Column Name** | **Type**     | **Constraints**             |
| --------------- | ------------ | --------------------------- |
| id              | INT          | Primary Key, Auto-Increment |
| medicine_name   | VARCHAR(150) | NOT NULL, UNIQUE            |
| dosage          | VARCHAR(100) | NULLABLE                    |
| created_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   |

---

#### **5. Visits Table**

Tracks patient visits.

| **Column Name** | **Type**      | **Constraints**                      |
| --------------- | ------------- | ------------------------------------ |
| id              | INT           | Primary Key, Auto-Increment          |
| patient_id      | INT           | Foreign Key -> Patients(id) NOT NULL |
| visit_date      | DATETIME      | NOT NULL                             |
| doctor_notes    | TEXT          | NULLABLE                             |
| total_cost      | DECIMAL(10,2) | NOT NULL                             |
| created_at      | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP            |

---

#### **6. Visit Services Table**

Tracks services provided during a visit.

| **Column Name** | **Type** | **Constraints**                      |
| --------------- | -------- | ------------------------------------ |
| id              | INT      | Primary Key, Auto-Increment          |
| visit_id        | INT      | Foreign Key -> Visits(id) NOT NULL   |
| service_id      | INT      | Foreign Key -> Services(id) NOT NULL |

---

#### **7. Visit Medicines Table**

Tracks medicines prescribed during a visit.

| **Column Name** | **Type** | **Constraints**                       |
| --------------- | -------- | ------------------------------------- |
| id              | INT      | Primary Key, Auto-Increment           |
| visit_id        | INT      | Foreign Key -> Visits(id) NOT NULL    |
| medicine_id     | INT      | Foreign Key -> Medicines(id) NOT NULL |
| quantity        | INT      | NOT NULL                              |

---

#### **8. Payments Table**

Tracks payments made by patients.

| **Column Name** | **Type**                       | **Constraints**                                          |
| --------------- | ------------------------------ | -------------------------------------------------------- |
| id              | INT                            | Primary Key, Auto-Increment                              |
| patient_id      | INT                            | Foreign Key -> Patients(id) NOT NULL                     |
| user_id         | INT                            | Foreign Key -> Users(id) NOT NULL (who recorded payment) |
| amount          | DECIMAL(10,2)                  | NOT NULL                                                 |
| payment_date    | DATETIME                       | DEFAULT CURRENT_TIMESTAMP                                |
| payment_method  | ENUM('Cash', 'Card', 'Online') | NOT NULL                                                 |

---

### **Relationships**

1. **Users ↔ Payments:**  
   Payments track the user (doctor/assistant) who recorded them.

2. **Patients ↔ Visits:**  
   Each visit belongs to a patient.

3. **Visits ↔ Services & Medicines:**  
   Services and medicines provided during a visit are stored in respective tables.

4. **Doctor ↔ Assistants:**  
   The doctor can control permissions for assistants through the `permissions` column.

---

### **Doctor Controls**

1. **Permission Management:**  
   The doctor can enable/disable assistant permissions (e.g., view reports, add payments).
2. **Audit Logs:**  
   Add a `Logs` table to track assistant actions for accountability.

3. **Service Management:**  
   The doctor can manage the list of services (add, update, delete).

4. **Report Access:**  
   Assistants can access reports only with specific permissions.

---
