const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const engine = require('./engine');
const pool = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Setup Session
app.use(session({
    secret: 'habitgarden_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));

// Setup Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set EJS as view engine, but map .jsp extensions to EJS renderer
app.engine('jsp', require('ejs').renderFile);
app.set('view engine', 'jsp');
app.set('views', path.join(__dirname));

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware to check authentication
function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/entry.html');
    }
}

// ==========================================
// ROUTES (Replacing Java Servlets)
// ==========================================

// Entry Page (Static HTML)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'entry.html'));
});
app.get('/entry.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'entry.html'));
});


// Login Servlet
app.post('/LoginServlet', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ ok: false, error: "Email and password are required." });
    }
    
    try {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ? AND password_hash = ?', [email, password]);
        if (rows.length > 0) {
            req.session.user = rows[0];
            res.json({ ok: true });
        } else {
            res.status(401).json({ ok: false, error: "Invalid email or password." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Server error." });
    }
});

// Register Servlet
app.post('/RegisterServlet', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ ok: false, error: "All fields are required." });
    }
    
    try {
        const [existing] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ ok: false, error: "An account with this email already exists." });
        }
        
        const [result] = await pool.query('INSERT INTO Users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, password]);
        
        req.session.user = {
            user_id: result.insertId,
            name: name,
            email: email
        };
        res.status(201).json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Registration failed." });
    }
});

// Logout Servlet
app.get('/LogoutServlet', (req, res) => {
    req.session.destroy();
    res.redirect('/entry.html');
});

// OAuth Mock Servlet
app.get('/OAuthServlet', async (req, res) => {
    const provider = req.query.provider || 'demo';
    const email = `${provider}_user@oauth.mock`;
    const name = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
    
    try {
        const [existing] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existing.length > 0) {
            req.session.user = existing[0];
        } else {
            const [result] = await pool.query('INSERT INTO Users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, 'oauth_mock_pass']);
            req.session.user = {
                user_id: result.insertId,
                name: name,
                email: email
            };
        }
        res.redirect('/DashboardServlet');
    } catch (err) {
        console.error("OAuth Mock Error:", err);
        res.redirect('/entry.html?error=oauth_failed');
    }
});

// Admin Login
app.get('/admin_login.jsp', (req, res) => {
    res.render('admin_login.jsp', { error: req.query.error });
});

app.post('/AdminLoginServlet', (req, res) => {
    const { admin_id, admin_pass } = req.body;
    if (admin_id === 'admin@habitgarden.com' && admin_pass === 'admin123') {
        req.session.admin = admin_id;
        res.redirect('/admin.jsp');
    } else {
        res.redirect('/admin_login.jsp?error=1');
    }
});

app.get('/admin.jsp', async (req, res) => {
    if (req.session.admin) {
        try {
            const [users] = await pool.query('SELECT * FROM Users');
            const [habits] = await pool.query('SELECT * FROM Habits');
            const [logs] = await pool.query('SELECT * FROM HabitLogs ORDER BY log_date DESC LIMIT 100');
            const [streaks] = await pool.query('SELECT * FROM Streaks');
            
            res.render('admin.jsp', { users, habits, logs, streaks });
        } catch (err) {
            console.error(err);
            res.status(500).send("Database error");
        }
    } else {
        res.redirect('/admin_login.jsp');
    }
});

// Dashboard Servlet
app.get('/DashboardServlet', requireAuth, async (req, res) => {
    const userId = req.session.user.user_id;
    const today = new Date().toISOString().split('T')[0];

    try {
        // Active habits
        const [habits] = await pool.query('SELECT * FROM Habits WHERE user_id = ? AND status = "active"', [userId]);
        
        // Logs for today
        const [logs] = await pool.query('SELECT habit_id, completed FROM HabitLogs WHERE user_id = ? AND log_date = ?', [userId, today]);
        const todayLogs = {};
        let doneToday = 0;
        logs.forEach(log => {
            todayLogs[log.habit_id] = !!log.completed;
            if (log.completed) doneToday++;
        });

        // Streaks & Consistency
        let totalStreak = 0;
        for (const h of habits) {
            const out = await engine.evaluateStreak(h.habit_id, userId);
            totalStreak += out.currentStreak;
        }

        // 7-day consistency
        const [consRows] = await pool.query(`
            SELECT 
                COUNT(CASE WHEN completed = TRUE THEN 1 END) AS completed_count,
                COUNT(*) AS total_logs
            FROM HabitLogs
            WHERE user_id = ? AND log_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
        `, [userId]);
        
        let consistency = 0;
        if (consRows.length > 0 && consRows[0].total_logs > 0) {
            consistency = (consRows[0].completed_count / consRows[0].total_logs) * 100;
        }

        res.render('dashboard.jsp', {
            username: req.session.user.name,
            done: doneToday,
            total: habits.length,
            streak: totalStreak,
            consistency: consistency.toFixed(1)
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Habit Servlet (GET/POST)
app.get('/HabitServlet', requireAuth, async (req, res) => {
    const userId = req.session.user.user_id;
    const today = new Date().toISOString().split('T')[0];

    try {
        const [habits] = await pool.query('SELECT * FROM Habits WHERE user_id = ? AND status = "active"', [userId]);
        const [logs] = await pool.query('SELECT habit_id, completed FROM HabitLogs WHERE user_id = ? AND log_date = ?', [userId, today]);
        
        const todayLogs = {};
        logs.forEach(log => todayLogs[log.habit_id] = !!log.completed);

        const responseData = [];
        for (const h of habits) {
            const [streakRows] = await pool.query('SELECT current_streak FROM Streaks WHERE habit_id = ?', [h.habit_id]);
            const currentStreak = streakRows.length > 0 ? streakRows[0].current_streak : 0;
            
            const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM HabitLogs WHERE habit_id = ? AND completed = TRUE', [h.habit_id]);
            const totalCompletions = totalRows[0].count;

            responseData.push({
                habit_id: h.habit_id,
                habit_name: h.habit_name,
                icon_key: h.icon_key,
                frequency: h.frequency,
                start_date: h.start_date.toISOString().split('T')[0],
                status: h.status,
                completed_today: todayLogs[h.habit_id] || false,
                current_streak: currentStreak,
                total_completions: totalCompletions,
                egg_type: "plant"
            });
        }
        res.json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json([]);
    }
});

app.post('/HabitServlet', requireAuth, async (req, res) => {
    const userId = req.session.user.user_id;
    const { name, icon_key } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ ok: false, error: "Habit name required" });
    }

    try {
        await pool.query(
            'INSERT INTO Habits (user_id, habit_name, frequency, icon_key, start_date) VALUES (?, ?, "daily", ?, CURRENT_DATE)',
            [userId, name.trim(), icon_key || 'leaf']
        );
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Failed to add habit" });
    }
});

app.delete('/HabitServlet/:id', requireAuth, async (req, res) => {
    const userId = req.session.user.user_id;
    const habitId = req.params.id;

    try {
        await pool.query('UPDATE Habits SET status = "archived" WHERE habit_id = ? AND user_id = ?', [habitId, userId]);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Failed to delete habit" });
    }
});

// Habit Log Servlet
app.post('/HabitLogServlet', requireAuth, async (req, res) => {
    const userId = req.session.user.user_id;
    const { habit_id, completed } = req.body;
    
    if (!habit_id || completed === undefined) {
        return res.status(400).json({ ok: false, error: "Missing parameters." });
    }
    
    const isCompleted = completed === 'true' || completed === true;
    const today = new Date().toISOString().split('T')[0];

    try {
        await pool.query(`
            INSERT INTO HabitLogs (habit_id, user_id, log_date, completed) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE completed = ?
        `, [habit_id, userId, today, isCompleted, isCompleted]);
        
        await engine.evaluateStreak(habit_id, userId);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Failed to log habit" });
    }
});

// Report Servlet
app.get('/ReportServlet', requireAuth, async (req, res) => {
    const userId = req.session.user.user_id;

    try {
        const [consRows] = await pool.query(`
            SELECT 
                COUNT(CASE WHEN completed = TRUE THEN 1 END) AS completed_count,
                COUNT(*) AS total_logs
            FROM HabitLogs
            WHERE user_id = ? AND log_date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
        `, [userId]);
        
        let consistency = 0;
        if (consRows.length > 0 && consRows[0].total_logs > 0) {
            consistency = consRows[0].completed_count / consRows[0].total_logs;
        }

        const [habits] = await pool.query('SELECT habit_id, habit_name FROM Habits WHERE user_id = ? AND status = "active"', [userId]);
        let longestStreak = 0;
        let topHabit = "";

        for (const h of habits) {
            const [streaks] = await pool.query('SELECT longest_streak FROM Streaks WHERE habit_id = ?', [h.habit_id]);
            if (streaks.length > 0 && streaks[0].longest_streak > longestStreak) {
                longestStreak = streaks[0].longest_streak;
                topHabit = h.habit_name;
            }
        }

        const message = engine.generateMotivationalMessage(longestStreak);
        
        res.json({ message, consistency, longestStreak, topHabit });
    } catch (err) {
        console.error(err);
        res.json({ message: "Your garden is quietly resting.", consistency: 0, longestStreak: 0, topHabit: "" });
    }
});

// Progress Servlet
app.get('/ProgressServlet', requireAuth, async (req, res) => {
    const isAjax = req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1);
    const userId = req.session.user.user_id;

    try {
        // Option A: Breakdown by habit. Get all active habits for this user.
        const [habits] = await pool.query('SELECT * FROM Habits WHERE user_id = ? AND status = "active"', [userId]);
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

        // Fetch logs for the last 30 days for this user
        const [logs] = await pool.query(`
            SELECT habit_id, log_date, completed
            FROM HabitLogs 
            WHERE user_id = ? AND log_date >= ?
        `, [userId, thirtyDaysAgoStr]);

        const responseData = [];
        
        for (const h of habits) {
            // Get streaks and total completions for this specific habit (needed for plant generation)
            const [streakRows] = await pool.query('SELECT current_streak FROM Streaks WHERE habit_id = ?', [h.habit_id]);
            const currentStreak = streakRows.length > 0 ? streakRows[0].current_streak : 0;
            
            const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM HabitLogs WHERE habit_id = ? AND completed = TRUE', [h.habit_id]);
            const totalCompletions = totalRows[0].count;

            // Gather 30-day log history for this specific habit
            const habitLogs = logs.filter(log => log.habit_id === h.habit_id);
            const historyObj = {};
            habitLogs.forEach(log => {
                const dateObj = new Date(log.log_date);
                const dateStr = [
                    dateObj.getFullYear(),
                    String(dateObj.getMonth() + 1).padStart(2, '0'),
                    String(dateObj.getDate()).padStart(2, '0')
                ].join('-');
                historyObj[dateStr] = !!log.completed;
            });

            // Reconstruct a full 30-day array (filling missing dates as false)
            const history30Days = [];
            for (let i = 29; i >= 0; i--) {
                 const d = new Date();
                 d.setDate(d.getDate() - i);
                 const dateKey = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
                 history30Days.push({
                     date: dateKey,
                     completed: historyObj[dateKey] || false
                 });
            }

            responseData.push({
                habit_id: h.habit_id,
                habit_name: h.habit_name,
                icon_key: h.icon_key,
                current_streak: currentStreak,
                total_completions: totalCompletions,
                history: history30Days
            });
        }
        
        if (isAjax) {
            res.json(responseData);
        } else {
            res.render('progress.jsp', { 
                historyJson: JSON.stringify(responseData),
                points: null // EJS rendering removed for heatmap, purely JS driven now
            });
        }
    } catch (err) {
        console.error(err);
        if (isAjax) {
            res.json([]);
        } else {
            res.render('progress.jsp', { historyJson: '[]', points: null });
        }
    }
});


// Start server
app.listen(PORT, () => {
    console.log("[HabitGarden] Server running on http://localhost:" + PORT);
});
