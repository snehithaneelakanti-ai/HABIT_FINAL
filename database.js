const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'karthiksoul123#',
    database: 'habitgarden',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initDB() {
    try {
        // Create DB if not exists
        const rootPool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'karthiksoul123#'
        });
        await rootPool.query("CREATE DATABASE IF NOT EXISTS habitgarden");
        await rootPool.end();

        // Initialize tables
        const createUsers = `
            CREATE TABLE IF NOT EXISTS Users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        const createHabits = `
            CREATE TABLE IF NOT EXISTS Habits (
                habit_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                habit_name VARCHAR(100) NOT NULL,
                frequency VARCHAR(50) DEFAULT 'daily',
                start_date DATE NOT NULL,
                status VARCHAR(20) DEFAULT 'active',
                icon_key VARCHAR(50) DEFAULT 'leaf',
                FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
            )
        `;
        
        const createHabitLogs = `
            CREATE TABLE IF NOT EXISTS HabitLogs (
                log_id INT AUTO_INCREMENT PRIMARY KEY,
                habit_id INT,
                user_id INT,
                log_date DATE NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (habit_id) REFERENCES Habits(habit_id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
                UNIQUE KEY unique_log (habit_id, user_id, log_date)
            )
        `;
        
        const createStreaks = `
            CREATE TABLE IF NOT EXISTS Streaks (
                streak_id INT AUTO_INCREMENT PRIMARY KEY,
                habit_id INT,
                user_id INT,
                current_streak INT DEFAULT 0,
                longest_streak INT DEFAULT 0,
                last_updated DATE,
                FOREIGN KEY (habit_id) REFERENCES Habits(habit_id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
                UNIQUE KEY unique_streak (habit_id, user_id)
            )
        `;

        await pool.query(createUsers);
        await pool.query(createHabits);
        await pool.query(createHabitLogs);
        await pool.query(createStreaks);
        
        console.log("[HabitGarden] Database schema initialized successfully.");
    } catch (err) {
        console.error("[HabitGarden] Database initialization failed:", err);
    }
}

// Auto-initialize when required
initDB();

module.exports = pool;
