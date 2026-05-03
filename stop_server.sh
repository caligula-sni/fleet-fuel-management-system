#!/bin/bash
# ================================================
#  Fleet Fuel Management — Stop Server
#  Run this from any terminal to stop the server.
#
#  Usage:
#    ./stop_server.sh
# ================================================

cd "$(dirname "$0")"

echo "================================================"
echo "  FLEET FUEL MANAGEMENT — Stop Server"
echo "================================================"
echo ""

STOPPED=false

# ── Method 1: Use saved PID file ─────────────────
if [ -f ".server.pid" ]; then
    PID=$(cat .server.pid)
    if kill -0 "$PID" 2>/dev/null; then
        echo "Stopping server (PID $PID)..."
        kill "$PID"
        sleep 1
        # Force kill if still alive
        if kill -0 "$PID" 2>/dev/null; then
            kill -9 "$PID" 2>/dev/null
        fi
        rm -f .server.pid
        echo "[OK] Server stopped."
        STOPPED=true
    else
        echo "[INFO] PID file found but process already gone."
        rm -f .server.pid
        STOPPED=true
    fi
fi

# ── Method 2: Search by process name (fallback) ──
if ! $STOPPED; then
    PID=$(pgrep -f server.py)
    if [ -n "$PID" ]; then
        echo "Found server process (PID $PID). Stopping..."
        kill "$PID" 2>/dev/null
        sleep 1
        kill -9 "$PID" 2>/dev/null
        rm -f .server.pid
        echo "[OK] Server stopped."
        STOPPED=true
    fi
fi

# ── Method 3: Kill by port 5000 (last resort) ────
if ! $STOPPED; then
    PID=$(lsof -ti :5000 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "Found process on port 5000 (PID $PID). Stopping..."
        kill -9 "$PID" 2>/dev/null
        echo "[OK] Server stopped."
        STOPPED=true
    fi
fi

if ! $STOPPED; then
    echo "[INFO] No server was running."
fi

echo ""
