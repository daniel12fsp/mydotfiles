#!/usr/bin/env bash
set -x

LOCKFILE="/tmp/launch_mailspring.lock"

if [ -f "$LOCKFILE" ] && kill -0 $(cat "$LOCKFILE") 2>/dev/null; then
    echo "Already running"
    exit 1
fi

echo $$ > "$LOCKFILE"

# Terminate already running bar instances
killall -wq mailspring 

# Wait until the processes have been shut down
while pgrep -u $UID -x mailspring >/dev/null; do sleep 1; done


mailspring -b --password-store="gnome-libsecret" &

trap 'rm -f "$LOCKFILE"' EXIT

