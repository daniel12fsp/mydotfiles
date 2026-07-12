#!/bin/bash
set -euo pipefail

# Configuration
PROJECT_DIR="/mnt/6e55b6e6-2f8f-4cf8-9f04-e2e2cfb28569/home/code/personal/ui_toolkit_v1"
APP_SOURCE="./apps/notification"
BINARY_PATH="/tmp/notification_bin"
LOG_FILE="/tmp/notification.log"

MODE="${1:-full}"

build_binary() {
    if ! go build -C "$PROJECT_DIR" -o "$BINARY_PATH" "$APP_SOURCE"; then
        echo "Build failed! Exiting." >&2
        return 1
    fi
}

run_binary() {
    if [ ! -x "$BINARY_PATH" ]; then
        echo "Binary not found at $BINARY_PATH, attempting build..." >&2
        build_binary || exit 1
    fi
    GOACT_OPTIONS='--diagnostic' setsid "$BINARY_PATH" >> "$LOG_FILE" 2>&1 &
    echo "searchtower started with PID: $!"
}

case "$MODE" in
    build)
        build_binary
        ;;
    run)
        run_binary
        ;;
    full)
        build_binary || exit 1
        rm "$LOG_FILE"
        touch "$LOG_FILE"
        run_binary
        ;;
    *)
        echo "Usage: $0 {build|run|full}" >&2
        exit 1
        ;;
esac