<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HabitGarden — Admin Login</title>
    <link rel="stylesheet" href="css/entry.css">
    <style>
        .admin-login-box {
            max-width: 400px;
            margin: 100px auto;
            padding: 40px;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            backdrop-filter: blur(12px);
            text-align: center;
        }
        .error-msg { color: #f87171; margin-bottom: 20px; font-size: 0.9rem; }
    </style>
</head>
<body style="background: #020617; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0;">
    <div class="admin-login-box">
        <h1 style="color: white; font-family: sans-serif; margin-bottom: 30px;">Admin Portal</h1>
        <% if ("1".equals(request.getParameter("error"))) { %>
            <div class="error-msg">Invalid ID or password.</div>
        <% } %>
        <form action="AdminLoginServlet" method="POST">
            <div class="input-group">
                <input type="email" name="admin_id" placeholder="Admin ID" required style="width: 100%; box-sizing: border-box; margin-bottom: 20px;">
            </div>
            <div class="input-group">
                <input type="password" name="admin_pass" placeholder="Password" required style="width: 100%; box-sizing: border-box; margin-bottom: 30px;">
            </div>
            <button type="submit" class="auth-submit" style="width: 100%;">Authenticate</button>
        </form>
        <p style="margin-top: 20px;"><a href="entry.html" style="color: rgba(255,255,255,0.5); font-size: 0.8rem; text-decoration: none;">Back to Garden</a></p>
    </div>
</body>
</html>
