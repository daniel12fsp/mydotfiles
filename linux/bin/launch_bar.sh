#!/bin/bash
set -x # Uncomment for debugging

# Configuration
PROJECT_DIR="/mnt/6e55b6e6-2f8f-4cf8-9f04-e2e2cfb28569/home/code/personal/ui_toolkit_v1"
APP_SOURCE="./apps/bar"
BINARY_PATH="/tmp/my_bar_bin"
PID_FILE="/tmp/my_bar.pid"
LOG_FILE="/tmp/my_bar.log"

# --- 1. Kill Logic with Timeout ---
kill_process() {
    local target_pid=$1
    if kill -0 "$target_pid" 2>/dev/null; then
        kill -TERM "$target_pid" 2>/dev/null
        
        # Wait up to 3 seconds for it to die
        for i in {1..6}; do
            if ! kill -0 "$target_pid" 2>/dev/null; then
                return 0 # Process is gone
            fi
            sleep 0.5
        done
        
        # Still alive? Force it.
        echo "Process $target_pid hanging. Using SIGKILL."
        kill -9 "$target_pid" 2>/dev/null
    fi
}

# Clean up PID file process
if [[ -f "$PID_FILE" ]]; then
    kill_process $(cat "$PID_FILE")
    rm "$PID_FILE"
fi

# Safety: Kill any stray instances of the binary name
# (Sometimes the binary changes PID or orphans itself)
pkill -9 -f "my_bar_bin" 2>/dev/null

# --- 2. Build Logic ---
if ! go build -C "$PROJECT_DIR" -o "$BINARY_PATH" "$APP_SOURCE"; then
    echo "Build failed! Exiting to avoid hanging."
    exit 1
fi

# --- 3. Asset Copy ---
# Framework resolves relative AssetDir against exe dir as fallback.
# Binary is in /tmp, so copy assets to /tmp/apps/bar/assets/icons.
ASSET_DEST="/tmp/apps/bar/assets/icons"
mkdir -p "$ASSET_DEST"
cp -r "$PROJECT_DIR/apps/bar/assets/icons/." "$ASSET_DEST/"

# --- 4. Execution Logic ---
# Ensure log file exists and is writable
rm "$LOG_FILE"
touch "$LOG_FILE"

# Start the process in a new session (setsid) to prevent it 
# from dying if the script terminal closes
GOACT_OPTIONS='--diagnostic' setsid "$BINARY_PATH"  >> "$LOG_FILE" 2>&1 &

NEW_PID=$!
echo $NEW_PID > "$PID_FILE"
echo "Bar started with PID: $NEW_PID"