# Module 1 — Session 1: Core Entities

## Habit Tracker System — Entity Overview

A Habit Tracker system is built around **4 core entities** that work together to track user behaviour, log daily progress, and compute streaks.

---

### 1. User
The person using the system. Each user has their own set of habits and logs.

| Attribute | Type | Description |
|---|---|---|
| `user_id` | INT (PK) | Unique identifier |
| `name` | VARCHAR(100) | User's display name |
| `email` | VARCHAR(150) | Login credential (unique) |
| `password` | VARCHAR(255) | Hashed password (SHA-256) |
| `reg_date` | DATE | Account creation date |

---

### 2. Habit
A recurring activity the user wants to build into a routine.

| Attribute | Type | Description |
|---|---|---|
| `habit_id` | INT (PK) | Unique identifier |
| `user_id` | INT (FK) | Owner of the habit |
| `habit_name` | VARCHAR(100) | e.g. "Morning Meditation" |
| `frequency` | VARCHAR(10) | `daily` or `weekly` |
| `start_date` | DATE | When the habit was created |
| `status` | VARCHAR(10) | `active` or `deleted` |

---

### 3. HabitLog
A single daily record of whether a habit was completed.

| Attribute | Type | Description |
|---|---|---|
| `log_id` | INT (PK) | Unique identifier |
| `habit_id` | INT (FK) | Which habit was logged |
| `user_id` | INT (FK) | Who logged it |
| `log_date` | DATE | The date of the log entry |
| `completed` | BOOLEAN | `TRUE` if done, `FALSE` if missed |

---

### 4. Streak
Tracks consecutive days of completion for a specific habit.

| Attribute | Type | Description |
|---|---|---|
| `streak_id` | INT (PK) | Unique identifier |
| `habit_id` | INT (FK) | Which habit the streak belongs to |
| `current_streak` | INT | Consecutive days completed (resets on miss) |
| `longest_streak` | INT | All-time best streak |
| `last_updated` | DATE | Last date the streak was recalculated |

---

### Entity Relationships

```
User ──┬── has many ──→ Habit
       │                  │
       │                  ├── tracked in ──→ HabitLog
       │                  │
       │                  └── streak for ──→ Streak
       │
       ├── logs ──→ HabitLog
       └── belongs to ──→ Streak
```

> Each **User** creates multiple **Habits**. Every day, a **HabitLog** records whether each habit was completed. The **Streak** entity is updated based on consecutive completions.
