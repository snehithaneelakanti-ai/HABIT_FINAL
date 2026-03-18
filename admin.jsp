
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HabitGarden — Admin Intelligence</title>
    <link rel="stylesheet" href="css/shell.css">
    <style>
        :root {
            --bg: #020617;
            --card-bg: rgba(30, 41, 59, 0.5);
            --border: rgba(255, 255, 255, 0.1);
            --accent: #8b5cf6;
        }
        body {
            background: var(--bg);
            color: white;
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 40px;
        }
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
        }
        .admin-nav {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 10px;
        }
        .nav-link {
            cursor: pointer;
            padding: 10px 20px;
            color: rgba(255,255,255,0.6);
            transition: all 0.2s;
        }
        .nav-link.active {
            color: var(--accent);
            border-bottom: 2px solid var(--accent);
        }
        .data-table-container {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow-x: auto;
            backdrop-filter: blur(8px);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        th {
            text-align: left;
            padding: 16px;
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.7);
            font-weight: 500;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
        }
        td {
            padding: 16px;
            border-top: 1px solid var(--border);
            color: rgba(255,255,255,0.9);
        }
        tr:hover td {
            background: rgba(255,255,255,0.02);
        }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            background: rgba(139, 92, 246, 0.2);
            color: #c4b5fd;
        }
    </style>
</head>
<body>
    <div class="admin-header">
        <h1>System Intelligence</h1>
        <a href="LogoutServlet" style="color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.9rem;">Sign Out Admin</a>
    </div>

    <div class="admin-nav">
        <div class="nav-link active" onclick="showTab('users')">Users</div>
        <div class="nav-link" onclick="showTab('habits')">Habits</div>
        <div class="nav-link" onclick="showTab('logs')">Logs</div>
        <div class="nav-link" onclick="showTab('streaks')">Streaks</div>
    </div>

    <div id="users" class="tab-content active">
        <div class="data-table-container">
            <table>
                <thead>
                    <tr>
                        <% if (locals.users && users.length > 0) { %>
                            <% Object.keys(users[0]).forEach(function(key) { %>
                                <th><%= key %></th>
                            <% }); %>
                        <% } %>
                    </tr>
                </thead>
                <tbody>
                    <% if (locals.users) { users.forEach(function(row) { %>
                        <tr>
                            <% Object.values(row).forEach(function(val) { %>
                                <td><%= val %></td>
                            <% }); %>
                        </tr>
                    <% }); } %>
                </tbody>
            </table>
        </div>
    </div>

    <div id="habits" class="tab-content">
        <div class="data-table-container">
            <table>
                <thead>
                    <tr>
                        <% if (locals.habits && habits.length > 0) { %>
                            <% Object.keys(habits[0]).forEach(function(key) { %>
                                <th><%= key %></th>
                            <% }); %>
                        <% } %>
                    </tr>
                </thead>
                <tbody>
                    <% if (locals.habits) { habits.forEach(function(row) { %>
                        <tr>
                            <% Object.values(row).forEach(function(val) { %>
                                <td><%= val %></td>
                            <% }); %>
                        </tr>
                    <% }); } %>
                </tbody>
            </table>
        </div>
    </div>

    <div id="logs" class="tab-content">
        <div class="data-table-container">
            <table>
                <thead>
                    <tr>
                        <% if (locals.logs && logs.length > 0) { %>
                            <% Object.keys(logs[0]).forEach(function(key) { %>
                                <th><%= key %></th>
                            <% }); %>
                        <% } %>
                    </tr>
                </thead>
                <tbody>
                    <% if (locals.logs) { logs.forEach(function(row) { %>
                        <tr>
                            <% Object.values(row).forEach(function(val) { %>
                                <td><%= val %></td>
                            <% }); %>
                        </tr>
                    <% }); } %>
                </tbody>
            </table>
        </div>
    </div>

    <div id="streaks" class="tab-content">
        <div class="data-table-container">
            <table>
                <thead>
                    <tr>
                        <% if (locals.streaks && streaks.length > 0) { %>
                            <% Object.keys(streaks[0]).forEach(function(key) { %>
                                <th><%= key %></th>
                            <% }); %>
                        <% } %>
                    </tr>
                </thead>
                <tbody>
                    <% if (locals.streaks) { streaks.forEach(function(row) { %>
                        <tr>
                            <% Object.values(row).forEach(function(val) { %>
                                <td><%= val %></td>
                            <% }); %>
                        </tr>
                    <% }); } %>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        function showTab(id) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            event.currentTarget.classList.add('active');
        }
    </script>
</body>
</html>
