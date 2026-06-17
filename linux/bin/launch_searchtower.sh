#!/bin/bash
set -euo pipefail

# Configuration
PROJECT_DIR="/mnt/6e55b6e6-2f8f-4cf8-9f04-e2e2cfb28569/home/code/personal/ui_toolkit_v1"
APP_SOURCE="./apps/searchtower"
BINARY_PATH="/tmp/searchtower_bin"
LOG_FILE="/tmp/searchtower.log"

# --- 1. Build Logic ---
if ! go build -C "$PROJECT_DIR" -o "$BINARY_PATH" "$APP_SOURCE"; then
    echo "Build failed! Exiting." >&2
    exit 1
fi


# --- 2. Execution Logic ---
# Ensure log file exists and is writable
rm "$LOG_FILE"
touch "$LOG_FILE"

# Start the process in a new session (setsid) to prevent it 
# from dying if the script terminal closes
GOACT_OPTIONS='--diagnostic' setsid "$BINARY_PATH"  >> "$LOG_FILE" 2>&1 &

NEW_PID=$!
echo "searchtower started with PID: $NEW_PID"