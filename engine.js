const pool = require('./database');

async function evaluateStreak(habitId, userId) {
    try {
        // Query last 30 logs for this habit/user
        const [logs] = await pool.query(
            `SELECT log_date, completed 
             FROM HabitLogs 
             WHERE habit_id = ? AND user_id = ? 
             ORDER BY log_date DESC 
             LIMIT 30`,
            [habitId, userId]
        );

        let currentStreak = 0;
        let longestStreak = 0;
        let streakActive = true;
        const todayStr = new Date().toISOString().split('T')[0];

        // Ensure consecutive logic. If missing a day (other than today), streak breaks.
        // For simplicity, mimicking the Java logic: count consecutive 'completed=true' going backwards.
        
        if (logs.length > 0) {
            let lastDate = new Date(logs[0].log_date);
            let today = new Date(todayStr);
            
            // If the latest log is older than yesterday, and today isn't logged, streak is 0.
            const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays > 1) {
                streakActive = false;
            }

            if (streakActive) {
                for (let i = 0; i < logs.length; i++) {
                    if (logs[i].completed) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }

        // Get existing streak to check longest
        const [streaks] = await pool.query(
            `SELECT longest_streak FROM Streaks WHERE habit_id = ? AND user_id = ?`,
            [habitId, userId]
        );

        if (streaks.length > 0) {
            longestStreak = Math.max(streaks[0].longest_streak, currentStreak);
            await pool.query(
                `UPDATE Streaks 
                 SET current_streak = ?, longest_streak = ?, last_updated = CURRENT_DATE 
                 WHERE habit_id = ? AND user_id = ?`,
                [currentStreak, longestStreak, habitId, userId]
            );
        } else {
            longestStreak = currentStreak;
            await pool.query(
                `INSERT INTO Streaks (habit_id, user_id, current_streak, longest_streak, last_updated) 
                 VALUES (?, ?, ?, ?, CURRENT_DATE)`,
                [habitId, userId, currentStreak, longestStreak]
            );
        }

        return { currentStreak, longestStreak };
    } catch (err) {
        console.error("Error evaluating streak:", err);
        return { currentStreak: 0, longestStreak: 0 };
    }
}

function generateMotivationalMessage(longestStreak) {
    if (longestStreak === 0) return "Plant your first seed. Every garden starts small.";
    if (longestStreak < 3) return "A delicate sprout appears. Keep watering it.";
    if (longestStreak < 7) return "Your habit is growing roots. Stay consistent.";
    if (longestStreak < 14) return "A strong stem! You're building a solid routine.";
    if (longestStreak < 30) return "Your garden is blooming beautifully!";
    if (longestStreak < 60) return "A mature, resilient plant. Incredible dedication.";
    return "An ancient, unshakeable tree. You are a master gardener.";
}

module.exports = {
    evaluateStreak,
    generateMotivationalMessage
};
