# Module 4 — Session 6: Streak Rules & Logic

## Rule-Based Streak System

The streak engine processes habit logs daily to determine current streaks, classify user consistency, and generate motivational feedback.

---

### Rule 1: Streak Increases

A streak increments by 1 when:
- The user marks a habit as **completed** for today
- The previous day also has a `completed = TRUE` log (no gap)
- So: `current_streak = current_streak + 1`

```
IF habit was completed today
   AND habit was completed yesterday (or this is the first day):
       current_streak += 1
       IF current_streak > longest_streak:
           longest_streak = current_streak
```

---

### Rule 2: Streak Resets

A streak resets to **0** when:
- The user **misses a day** (no log or `completed = FALSE` for that date)
- The next time they complete the habit, the streak restarts at **1**

```
IF today's date - last_completed_date > 1 day:
    current_streak = 0

IF habit completed today AND streak was reset:
    current_streak = 1
```

---

### Rule 3: Consistency Classification

Consistency is calculated as a **percentage** over the last 7 days:

```
consistency = (completed_days / 7) × 100
```

| Consistency % | Classification | Colour |
|---|---|---|
| 80–100% | Excellent | 🟢 Green |
| 60–79% | Good | 🔵 Blue |
| 40–59% | Needs Improvement | 🟡 Yellow |
| 0–39% | At Risk | 🔴 Red |

**Java Implementation:**
```java
public float compute(int userId) {
    // Count days with at least 1 completion in last 7 days
    int activeDays = countActiveDays(userId, 7);
    return (float) activeDays / 7.0f;
}
```

---

### Rule 4: Motivational Message Generation

Messages are selected based on the user's **completion ratio** for the day:

```
ratio = habits_done_today / total_active_habits
```

| Ratio | Message Category | Example |
|---|---|---|
| 100% | Celebration | *"Perfect day! Every seed you planted has bloomed."* |
| 70–99% | Encouragement | *"Almost there — just a few habits left to water."* |
| 40–69% | Gentle nudge | *"Halfway through — keep the momentum going!"* |
| 1–39% | Supportive | *"Small steps count. You've already started today."* |
| 0% | Compassionate | *"It's okay to have quiet days. One habit at a time."* |

**Java Implementation:**
```java
public String getMessage(int done, int total) {
    if (total == 0) return "Plant your first habit to get started.";
    float ratio = (float) done / total;
    if (ratio >= 1.0f) return "Perfect day! Every seed has bloomed.";
    if (ratio >= 0.7f) return "Almost there — a few habits left to water.";
    if (ratio >= 0.4f) return "Halfway! Keep the momentum going.";
    if (ratio >  0.0f) return "Small steps count. You've started today.";
    return "It's okay to have quiet days. One habit at a time.";
}
```

---

### Streak Processing Flow

```
User opens dashboard
       │
       ▼
DashboardServlet loads
       │
       ├── StreakEngine.compute(userId)
       │     │
       │     ├── Query all habit logs ordered by date DESC
       │     ├── Walk backward from today
       │     ├── Count consecutive completed days → current_streak
       │     └── Track maximum → longest_streak
       │
       ├── ConsistencyCalculator.compute(userId)
       │     └── Count active days in last 7 → percentage
       │
       └── MotivationEngine.getMessage(done, total)
             └── Select message based on completion ratio
```
