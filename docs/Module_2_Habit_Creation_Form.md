# Module 2 — Session 3: Habit Creation Form

## HTML Form for Creating a New Habit

This form collects all necessary information to create a new habit in the tracker system. It includes fields for the habit name, description, category, frequency, and start date.

---

### Form Code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create New Habit</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0a0f1a;
      color: #e0e0e0;
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    .form-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 36px;
      width: 100%;
      max-width: 480px;
    }
    h2 {
      margin-bottom: 24px;
      font-weight: 300;
      font-size: 1.5rem;
    }
    label {
      display: block;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 6px;
      margin-top: 18px;
    }
    input, select, textarea {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      color: #fff;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.3s;
    }
    input:focus, select:focus, textarea:focus {
      border-color: rgba(0,255,208,0.4);
    }
    textarea { resize: vertical; min-height: 80px; }
    .btn-submit {
      margin-top: 28px;
      width: 100%;
      padding: 14px;
      border: 1px solid rgba(0,255,208,0.3);
      border-radius: 14px;
      background: rgba(0,255,208,0.1);
      color: #00ffd0;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s, transform 0.15s;
    }
    .btn-submit:hover {
      background: rgba(0,255,208,0.18);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="form-card">
    <h2>Create New Habit</h2>
    <form action="HabitServlet" method="POST">

      <label for="habit-name">Habit Name</label>
      <input type="text" id="habit-name" name="habit_name"
             placeholder="e.g. Morning Meditation" required>

      <label for="description">Description</label>
      <textarea id="description" name="description"
                placeholder="What does this habit involve?"></textarea>

      <label for="category">Category</label>
      <select id="category" name="category">
        <option value="health">Health & Fitness</option>
        <option value="mindfulness">Mindfulness</option>
        <option value="learning">Learning</option>
        <option value="productivity">Productivity</option>
        <option value="lifestyle">Lifestyle</option>
      </select>

      <label for="frequency">Frequency</label>
      <select id="frequency" name="frequency">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>

      <label for="start-date">Start Date</label>
      <input type="date" id="start-date" name="start_date">

      <button type="submit" class="btn-submit">Add to Garden</button>

    </form>
  </div>
</body>
</html>
```

---

### Form Fields Summary

| Field | Type | Purpose |
|---|---|---|
| Habit Name | `text` | Name of the habit (required) |
| Description | `textarea` | Optional details about the habit |
| Category | `select` | Categorises the habit (Health, Learning, etc.) |
| Frequency | `select` | How often: daily or weekly |
| Start Date | `date` | When to begin tracking |
| Submit | `button` | Sends data to `HabitServlet` via POST |
