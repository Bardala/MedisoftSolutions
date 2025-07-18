**System Logs Table** for tracking application events, errors, and user actions. This table can be used by developers to monitor and debug the system effectively. Below is the suggested design for the **Logs Table**:

---

### **9. System Logs Table**

Tracks important system events and actions for debugging and monitoring.

| **Column Name** | **Type**                         | **Constraints**                    |
| --------------- | -------------------------------- | ---------------------------------- |
| id              | INT                              | Primary Key, Auto-Increment        |
| timestamp       | TIMESTAMP                        | DEFAULT CURRENT_TIMESTAMP          |
| user_id         | INT                              | NULLABLE, Foreign Key -> Users(id) |
| action          | VARCHAR(255)                     | NOT NULL                           |
| details         | TEXT                             | NULLABLE                           |
| ip_address      | VARCHAR(45)                      | NULLABLE (IPv6 compatible)         |
| log_level       | ENUM('INFO', 'WARNING', 'ERROR') | DEFAULT 'INFO'                     |
| stack_trace     | TEXT                             | NULLABLE (for errors)              |

---

### **Column Explanations**

1. **`id`**  
   Unique identifier for each log entry.

2. **`timestamp`**  
   Automatically records the date and time of the event.

3. **`user_id`**  
   Links the log to a user, if applicable (e.g., assistant/doctor actions). Nullable for system-level events.

4. **`action`**  
   A brief description of the action (e.g., "Login Success", "Payment Added", "System Error").

5. **`details`**  
   Additional information about the action or event. For example:

   - For a successful login: `{ "username": "assistant1", "method": "password" }`
   - For payment: `{ "patient_id": 123, "amount": 500 }`

6. **`ip_address`**  
   Captures the IP address of the client making the request, useful for tracking suspicious activity.

7. **`log_level`**  
   Defines the severity of the log entry:

   - **INFO**: Normal operation (e.g., "User logged in").
   - **WARNING**: Potential issues (e.g., "Failed login attempt").
   - **ERROR**: System errors or exceptions.

8. **`stack_trace`**  
   Stores the stack trace for debugging purposes in case of errors.

---

### **Use Cases**

1. **User Activity Monitoring:**

   - Tracks actions performed by the doctor or assistants (e.g., adding payments, editing records).

2. **Error Tracking:**

   - Logs application-level errors with stack traces for debugging.

3. **Audit Trail:**

   - Provides an audit trail for changes made to sensitive data.

4. **Security Monitoring:**
   - Detects failed login attempts or unusual IP addresses.

---

### **Relationships**

- **Logs ↔ Users:**
  - Many logs can be associated with a single user (`user_id`).

---

### **Example Log Entries**

| **id** | **timestamp**       | **user_id** | **action**                    | **details**                            | **ip_address** | **log_level** | **stack_trace**  |
| ------ | ------------------- | ----------- | ----------------------------- | -------------------------------------- | -------------- | ------------- | ---------------- |
| 1      | 2025-01-01 10:00:00 | 1           | "Login Success"               | `{ "username": "assistant1" }`         | 192.168.1.100  | INFO          | NULL             |
| 2      | 2025-01-01 10:05:00 | NULL        | "Database Connection Error"   | `{ "error": "Connection refused" }`    | NULL           | ERROR         | Full stack trace |
| 3      | 2025-01-01 10:10:00 | 2           | "Payment Added"               | `{ "patient_id": 123, "amount": 500 }` | 192.168.1.105  | INFO          | NULL             |
| 4      | 2025-01-01 10:20:00 | 1           | "Unauthorized Access Attempt" | `{ "resource": "reports" }`            | 203.0.113.10   | WARNING       | NULL             |

---

```sql
CREATE TABLE Log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  userId INTEGER,
  action TEXT NOT NULL,
  details TEXT,
  ipAddress TEXT,
  logLevel TEXT NOT NULL,
  stackTrace TEXT
);
```
