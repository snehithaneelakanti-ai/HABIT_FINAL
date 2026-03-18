# HabitGarden — Final Deployment Walkthrough

## Universal Deployment (WAR File)
The entire application is packaged into a single WAR file:
**[/Users/snehithaneelakanti/apache-tomcat-9.0.115/HabitGarden.war](/Users/snehithaneelakanti/apache-tomcat-9.0.115/HabitGarden.war)**

To deploy **anywhere**:
1. Copy `HabitGarden.war` to the `webapps/` folder of any Tomcat server.
2. Ensure MySQL is running on that server.
3. Configure `WEB-INF/config.properties` inside the deployed folder if you need a different password.

## Local Development (One-Command)
```bash
cd ~/apache-tomcat-9.0.115 && bash deploy.sh
```
This stops Tomcat, cleans & recompiles all 20 classes, starts Tomcat, and runs a health check.

## 🟢 App Status: MySQL-Ready
The application code has been fully migrated from H2 to MySQL. All 19 Java source files compile cleanly with the MySQL JDBC Connector.

## Prerequisites for MySQL
Since the Homebrew installation is running in the background, you will need to finish these steps once the terminal is free:
1. **Install MySQL**: `brew install mysql`
2. **Start MySQL**: `brew services start mysql` (Root, no password)
3. **Deploy**: `bash deploy.sh`

## Login Credentials
| Email | Password |
|---|---|
| `snehithaneelakanti@gmail.com` | `bloom1234` |
| `demo@habitgarden.com` | `bloom1234` |

## File Inventory (verified)

| Layer | Files |
|---|---|
| **Java** (19 sources → 20 classes) | 3 DAOs, 3 engines, 1 filter, 2 models, 7 servlets, 2 utils |
| **Libraries** | `mysql-connector-j-8.3.0.jar` (Added), `h2-2.2.224.jar` (Kept for reference) |
| **Frontend pages** | `entry.html`, `dashboard.jsp`, `progress.jsp` |
| **CSS** (11 files) | world, shell, entry, greeting, garden, report, graphs, history, modal, whimsy, star-transition |
| **JS** (10 files) | world, entry, star-transition, shell, greeting, garden, report, graphs, history, whimsy |

## Verified Features

````carousel
### Dashboard
- Greeting with niche quirky fact
- Animated ticker counting habits done
- Current streak display
- Ring chart (animated, sample data fallback)
- 7-day bar chart (staggered animation)
- + New Habit button with pulse animation

![Dashboard](/Users/snehithaneelakanti/.gemini/antigravity/brain/4a775e86-7b59-4314-995e-a062c44d1469/dashboard_full_view_1773236706344.png)
<!-- slide -->
### The Garden & Report
- 9 habit bento tiles with SVG icons
- Hover overlay (streak, dates, log status)
- Teal glow + checkmark on completion
- Garden Report with star face + motivational message
- Flowers blend softly behind content via dark gradient scrim

![Scrolled view](/Users/snehithaneelakanti/.gemini/antigravity/brain/4a775e86-7b59-4314-995e-a062c44d1469/scrolled_dashboard_view_1773236710367.png)
<!-- slide -->
### Login Page
- Elegant serif title, glass card
- Tiny subtle pastel stars (~1px)
- Small flowers with soft glow at bottom
- Autofill override (no white backgrounds)

![Login](/Users/snehithaneelakanti/.gemini/antigravity/brain/4a775e86-7b59-4314-995e-a062c44d1469/filled_login_fields_1773237823692.png)
````

## Clean Deploy Output
```
🌱 HabitGarden — Deploy
========================
⏹  Stopping Tomcat...
🧹 Cleaning old classes...
🔨 Compiling Java sources...
   ✅ Compiled 20 class files
🚀 Starting Tomcat...
🏥 Health check...
   ✅ HabitGarden is live!
   🌐 Open: http://localhost:8080/HabitGarden/
========================
🌱 Deploy complete.
```
