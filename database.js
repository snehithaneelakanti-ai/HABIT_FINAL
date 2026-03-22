const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let dbPromise = null;

async function getDb() {
    if (!dbPromise) {
        dbPromise = open({
            filename: process.env.DB_PATH || './habitgarden.db',
            driver: sqlite3.Database
        });
    }
    return dbPromise;
}

const pool = {
    query: async (sql, params) => {
        const db = await getDb();
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            const rows = await db.all(sql, params);
            return [rows];
        } else if (sql.trim().toUpperCase().startsWith('INSERT')) {
            if (sql.includes('ON DUPLICATE KEY UPDATE')) {
                sql = sql.replace('ON DUPLICATE KEY UPDATE completed = ?', 'ON CONFLICT(habit_id, user_id, log_date) DO UPDATE SET completed = excluded.completed');
                if (params && params.length === 5) {
                    params = params.slice(0, 4);
                }
            }
            const result = await db.run(sql, params);
            return [{ insertId: result.lastID }];
        } else {
            const result = await db.run(sql, params);
            return [result];
        }
    }
};

async function initDB() {
    try {
        const db = await getDb();
        
        await db.exec(`
            CREATE TABLE IF NOT EXISTS Users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await db.exec(`
            CREATE TABLE IF NOT EXISTS Habits (
                habit_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                habit_name TEXT NOT NULL,
                frequency TEXT DEFAULT 'daily',
                start_date DATE NOT NULL,
                status TEXT DEFAULT 'active',
                icon_key TEXT DEFAULT 'leaf',
                FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
            )
        `);
        
        await db.exec(`
            CREATE TABLE IF NOT EXISTS HabitLogs (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                habit_id INTEGER,
                user_id INTEGER,
                log_date DATE NOT NULL,
                completed BOOLEAN DEFAULT 0,
                FOREIGN KEY (habit_id) REFERENCES Habits(habit_id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
                UNIQUE (habit_id, user_id, log_date)
            )
        `);
        
        await db.exec(`
            CREATE TABLE IF NOT EXISTS Streaks (
                streak_id INTEGER PRIMARY KEY AUTOINCREMENT,
                habit_id INTEGER,
                user_id INTEGER,
                current_streak INTEGER DEFAULT 0,
                longest_streak INTEGER DEFAULT 0,
                last_updated DATE,
                FOREIGN KEY (habit_id) REFERENCES Habits(habit_id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
                UNIQUE (habit_id, user_id)
            )
        `);
        
        console.log("[HabitGarden] SQLite schema initialized successfully.");
    } catch (err) {
        console.error("[HabitGarden] Database initialization failed:", err);
    }
}

initDB();

module.exports = pool;
