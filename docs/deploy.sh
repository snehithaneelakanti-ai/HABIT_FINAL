#!/bin/bash
# ============================================================
# HabitGarden — One-command deploy script
# Usage:  cd apache-tomcat-9.0.115 && bash deploy.sh
# ============================================================
set -e

TOMCAT_HOME="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$TOMCAT_HOME/webapps/HabitGarden"
SRC_DIR="$APP_DIR/WEB-INF/src"
CLASSES_DIR="$APP_DIR/WEB-INF/classes"
LIB_CP="$TOMCAT_HOME/lib/*:$APP_DIR/WEB-INF/lib/*"

echo ""
echo "🌱 HabitGarden — Deploy"
echo "========================"

# 1. Stop Tomcat if running
echo "⏹  Stopping Tomcat..."
"$TOMCAT_HOME/bin/shutdown.sh" 2>/dev/null || true
sleep 2

# 2. Clean compiled classes
echo "🧹 Cleaning old classes..."
rm -rf "$CLASSES_DIR"
mkdir -p "$CLASSES_DIR"

# 3. Compile all Java sources
echo "🔨 Compiling Java sources..."
find "$SRC_DIR" -name "*.java" | xargs javac --release 11 -cp "$LIB_CP" -d "$CLASSES_DIR"
echo "   ✅ Compiled $(find "$CLASSES_DIR" -name '*.class' | wc -l | tr -d ' ') class files"

# 4. Start Tomcat
echo "🚀 Starting Tomcat..."
"$TOMCAT_HOME/bin/startup.sh"
sleep 4

# 5. Health check
echo "🏥 Health check..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/HabitGarden/entry.html 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
    echo "   ✅ HabitGarden is live!"
    echo ""
    echo "   🌐 Open: http://localhost:8080/HabitGarden/"
    echo "   📧 Login: Use your registered email + password"
    echo "   📧 Demo:  demo@habitgarden.com / bloom1234"
    echo ""
else
    echo "   ⚠️  Got HTTP $STATUS — check logs/catalina.out"
fi

echo "========================"
echo "🌱 Deploy complete."
