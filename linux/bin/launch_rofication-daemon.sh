#!/bin/bash
set -euo pipefail

PROJECT_DIR="/mnt/6e55b6e6-2f8f-4cf8-9f04-e2e2cfb28569/home/code/personal/ui_toolkit_v1"
APP_SOURCE="./apps/notification/cmd/notification-daemon"
BINARY_PATH="/tmp/go-notification-daemon"
LOG_FILE="/tmp/go-notification-daemon.log"
SOCKET_PATH="/tmp/rofi_notification_daemon"

notification_count() {
    if [[ ! -S "$SOCKET_PATH" ]] || ! command -v socat >/dev/null 2>&1; then
        return 1
    fi
    local response
    response="$(printf 'num\n' | socat -t 1 - UNIX-CONNECT:"$SOCKET_PATH" 2>/dev/null || true)"
    [[ "$response" =~ ^[0-9]+,[0-9]+$ ]]
}

if notification_count; then
    echo "notification daemon already running."
    exit 0
fi

if pgrep -f "$BINARY_PATH" >/dev/null; then
    echo "notification daemon process exists but socket is not ready; restarting."
    pkill -f "$BINARY_PATH"
    while pgrep -f "$BINARY_PATH" >/dev/null; do
        sleep 1
    done
else
    echo "notification daemon is not running."
fi

go build -C "$PROJECT_DIR" -o "$BINARY_PATH" "$APP_SOURCE"

"$BINARY_PATH" "$@" >"$LOG_FILE" 2>&1 &

for _ in {1..20}; do
    if notification_count; then
        echo "notification daemon started."
        exit 0
    fi
    sleep 0.25
done

echo "notification daemon failed to become ready; see $LOG_FILE" >&2
exit 1
