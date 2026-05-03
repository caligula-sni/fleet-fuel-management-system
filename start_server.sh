#!/bin/bash
# ================================================
#  Fleet Fuel Management — Debian/Linux Starter
#
#  HOW TO RUN (first time):
#    1. Open Terminal in this folder
#    2. chmod +x start_server.sh
#    3. ./start_server.sh
#
#  TO STOP THE SERVER:
#    Run: ./stop_server.sh
#    OR press CTRL+C in this terminal
#    OR run: pkill -f server.py
# ================================================

clear
echo "================================================"
echo "  FLEET FUEL CONSUMPTION MANAGEMENT"
echo "  Local Server Startup — Linux/Debian"
echo "================================================"
echo ""

# ── Go to script directory first ─────────────────
cd "$(dirname "$0")"

# ── Check if already running ─────────────────────
if [ -f ".server.pid" ]; then
    OLD_PID=$(cat .server.pid)
    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo "[WARN] Server is already running (PID $OLD_PID)."
        echo ""
        echo "  To stop it:          ./stop_server.sh"
        echo "  Open app in browser: http://localhost:5000"
        echo ""
        exit 0
    else
        rm -f .server.pid
    fi
fi

# ── Check Python 3 ───────────────────────────────
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed."
    echo ""
    echo "Install it with:"
    echo "  sudo apt update && sudo apt install python3 python3-pip -y"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "[OK] $PYTHON_VERSION found."
echo ""

# ── Check / Install Flask ─────────────────────────
echo "Checking for Flask..."
if ! python3 -c "import flask" &> /dev/null; then
    echo "Flask not found. Installing now..."
    echo "(This only happens once)"
    echo ""
    if command -v pip3 &> /dev/null; then
        pip3 install flask --break-system-packages 2>/dev/null || pip3 install flask
    else
        echo "pip3 not found. Trying apt..."
        sudo apt install python3-flask -y
    fi
    echo ""
fi

echo "[OK] Flask ready."
echo ""

# ── Start Server ──────────────────────────────────
echo "================================================"
echo "  Server starting..."
echo ""
echo "  Open your browser and go to:"
echo "  http://localhost:5000"
echo ""
echo "  TO STOP: press CTRL+C here"
echo "  OR open a new terminal and run: ./stop_server.sh"
echo "================================================"
echo ""

# Start Python and save its PID
python3 server.py &
SERVER_PID=$!
echo $SERVER_PID > .server.pid
echo "[OK] Server running (PID $SERVER_PID)"
echo ""

# ── Cleanup function ──────────────────────────────
# Runs on CTRL+C, terminal close, or kill
cleanup() {
    echo ""
    echo "Stopping server (PID $SERVER_PID)..."
    kill "$SERVER_PID" 2>/dev/null
    wait "$SERVER_PID" 2>/dev/null
    rm -f .server.pid
    echo "Server stopped. Goodbye."
    exit 0
}

# Catch CTRL+C, kill, and terminal close signals
trap cleanup SIGINT SIGTERM SIGHUP

# Keep script alive, watching the server process
while kill -0 "$SERVER_PID" 2>/dev/null; do
    sleep 2
done

# If we get here the server died on its own
echo ""
echo "[WARN] Server stopped unexpectedly."
rm -f .server.pid
