# Module 3 — Session 5: SQL Queries

## Key SQL Queries in the Habit Tracker System

---

### 1. Retrieve All Active Habits for a User

```sql
SELECT habit_id, habit_name, icon_key, frequency, start_date
FROM   Habits
WHERE  user_id = ? AND status = 'active'
ORDER BY start_date ASC;
```

> Returns all habits the user is currently tracking, sorted by when they started.

---

### 2. View Daily Habit Logs for a Specific Date

```sql
SELECT h.habit_name, hl.completed, hl.log_date
FROM   HabitLogs hl
JOIN   Habits h ON hl.habit_id = h.habit_id
WHERE  hl.user_id = ? AND hl.log_date = CURRENT_DATE
ORDER BY h.habit_name;
```

> Shows which habits were completed or missed today.

**Sample Output:**

| habit_name | completed | log_date |
|---|---|---|
| Morning Meditation | TRUE | 2026-03-11 |
| Drink 8 Glasses of Water | TRUE | 2026-03-11 |
| Read for 20 Minutes | FALSE | 2026-03-11 |

---

### 3. Calculate Current Streak for a Habit

```sql
SELECT COUNT(*) AS current_streak
FROM   HabitLogs
WHERE  habit_id = ? AND user_id = ? AND completed = TRUE
  AND  log_date >= (
    SELECT COALESCE(
      MAX(log_date) + 1,
      (SELECT start_date FROM Habits WHERE habit_id = ?)
    )
    FROM HabitLogs
    WHERE habit_id = ? AND user_id = ? AND completed = FALSE
      AND log_date >= (SELECT start_date FROM Habits WHERE habit_id = ?)
  )
ORDER BY log_date DESC;
```

> Counts consecutive completed days backward from today until the first missed day.

**Simplified approach used in HabitGarden** (Java-side iteration):
```sql
SELECT log_date, completed
FROM   HabitLogs
WHERE  habit_id = ? AND user_id = ?
ORDER BY log_date DESC;
```
The application iterates backward from today, counting `completed = TRUE` until it hits a `FALSE` or a gap.

---

### 4. Compute Habit Completion Percentage (Last 7 Days)

```sql
SELECT
  COUNT(CASE WHEN completed = TRUE THEN 1 END) AS completed_count,
  COUNT(*)                                      AS total_logs,
  ROUND(
    COUNT(CASE WHEN completed = TRUE THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0),
    1
  ) AS completion_pct
FROM   HabitLogs
WHERE  user_id = ?
  AND  log_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY);
```

**Sample Output:**

| completed_count | total_logs | completion_pct |
|---|---|---|
| 18 | 28 | 64.3 |

> 18 out of 28 possible habit completions in the last 7 days = 64.3% consistency.

---

### 5. 30-Day Heatmap Data (for Progress Page)

```sql
SELECT log_date,
       COUNT(CASE WHEN completed = TRUE THEN 1 END) AS completion_count
FROM   HabitLogs
WHERE  user_id = ?
  AND  log_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP  BY log_date
ORDER  BY log_date ASC;
```

> Returns one row per day with the number of habits completed. Days with no logs are zero-filled in the Java servlet to produce exactly 30 data points.

---

### 6. Find the Habit with the Longest Streak

```sql
SELECT h.habit_name, s.longest_streak
FROM   Streaks s
JOIN   Habits h ON s.habit_id = h.habit_id
WHERE  s.user_id = ?
ORDER  BY s.longest_streak DESC
LIMIT  1;
```

**Sample Output:**

| habit_name | longest_streak |
|---|---|
| Morning Meditation | 15 |
