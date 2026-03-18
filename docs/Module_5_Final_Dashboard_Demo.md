# Module 5 — Session 8: Final Output / Demo

## Dashboard — The Final Product

The HabitGarden dashboard brings together all system components into a single, elegant view. Here is what the user sees after logging in:

---

### Dashboard Layout (Bento Grid)

The dashboard uses a **bento-style grid** with glass-effect cards:

```
┌─────────────────────┬──────────────┬──────────────┐
│                     │  CURRENT     │ CONSISTENCY  │
│  Good evening,      │  STREAK      │              │
│  Snehitha.          │    3         │   🔵 72%     │
│                     │  days in     │   WEEKLY     │
│  "Saturn would      │  a row       │  (ring chart)│
│  float if you       │              │              │
│  could find a       ├──────────────┤              │
│  bathtub big        │ WEEKLY TREND │              │
│  enough."           │ Mon ████░ 5  │              │
│                     │ Tue ███░░ 3  │              │
│  9 of 9 habits done │ Wed █████ 7  │              │
│                     │ Thu ████░ 6  │              │
│  [+ New Habit]      │ Fri ███░░ 4  │              │
│                     │ Sat █████ 8  │              │
│                     │ Sun ██░░░ 2  │              │
├─────────────────────┴──────────────┴──────────────┤
│  THE GARDEN                            ━━━━━━━━   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │ 🧘 ✓   │ │ 💧 ✓   │ │ 📖 ✓   │ │ 🏃 ✓   │ │
│  │ Morning │ │ Drink 8 │ │ Read 20 │ │ Evening │ │
│  │Meditati.│ │ Glasses │ │ Minutes │ │  Walk   │ │
│  │ ☆ 3d   │ │ ☆ 3d   │ │ ☆ 2d   │ │ ☆ 2d   │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
├───────────────────────────────────────────────────┤
│  GARDEN REPORT                                     │
│  ⭐ "Perfect day! Every seed has bloomed."         │
│  Longest streak: Morning Meditation  15 days       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░ 72%        │
└───────────────────────────────────────────────────┘
```

---

### Feature Breakdown

| Section | What It Shows | Data Source |
|---|---|---|
| **Greeting** | Personalised greeting + quirky fact | Session name + JS fact array |
| **Streak** | Current consecutive days | `StreakEngine.compute()` |
| **Consistency Ring** | Animated percentage arc | `ConsistencyCalculator` |
| **Weekly Trend** | 7-day bar chart | `ProgressServlet` (last 7 days) |
| **The Garden** | Habit tiles with icons + checkmarks | `HabitServlet` GET |
| **Hover Overlay** | Current streak, longest, start date, today's log | `HabitDAO.getStreaksForHabit()` |
| **Garden Report** | Motivational message + longest streak | `MotivationEngine` + `ReportServlet` |
| **Progress Bar** | Overall completion percentage | Computed from done/total |

---

### Habit Tile Details (on hover)

When the user hovers over any habit tile, a stat overlay slides up:

```
┌─────────────────┐
│  Current: 3 days│
│  Best:   15 days│
│  Start: Jan 15  │
│  Today: ✓ Done  │
└─────────────────┘
```

---

### History Page (Heatmap)

Clicking **History** in the sidebar shows a **30-day heatmap**:

```
Growth History — Last 30 days of habit completions

  ░ ░ ▒ ▓ █ █ █ ▓ ▒ ░
  ░ ▒ ▓ █ █ █ ▓ ▒ ░ ░
  ▒ ▓ █ █ █ ▓ ▒ ░ ░ ░

  Less ░ ▒ ▓ █ More

Each cell = one day, colour intensity = completions count
```

---

### Screenshots

![Dashboard with ring chart, bar chart, greeting, and habit tiles](file:///Users/snehithaneelakanti/.gemini/antigravity/brain/4a775e86-7b59-4314-995e-a062c44d1469/dashboard_full_view_1773236706344.png)

![Scrolled view showing all habit tiles and garden report](file:///Users/snehithaneelakanti/.gemini/antigravity/brain/4a775e86-7b59-4314-995e-a062c44d1469/scrolled_dashboard_view_1773236710367.png)

---

### How Data Flows to the Dashboard

```
Browser Request → DashboardServlet
                       │
          ┌────────────┼────────────────┐
          ▼            ▼                ▼
     StreakEngine  ConsistencyCalc  MotivationEngine
     (computes    (7-day active    (selects message
      current &    day ratio)       by done/total)
      longest)
          │            │                │
          └────────────┼────────────────┘
                       ▼
              Set JSP attributes
              (username, done, total,
               streak, consistency)
                       │
                       ▼
              dashboard.jsp renders
              HTML + server data
                       │
                       ▼
              JS modules initialise:
              greeting.js → greeting + fact
              garden.js   → fetch habits, build tiles
              graphs.js   → ring chart + bar chart
              report.js   → star face + message
```
