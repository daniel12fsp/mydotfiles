#!/usr/bin/env bash
set -x

# Add this script to your wm startup file.

DIR="$HOME/.config/polybar/forest"

# Terminate already running bar instances
killall -wq polybar

# Wait until the processes have been shut down
while pgrep -u $UID -x polybar >/dev/null; do sleep 1; done

# Launch the bar

# xrandr --listmonitors | awk '{print $4}'| xargs --no-run-if-empty  -P 0 -n 1 -I{} sh -c 'echo MONITOR={} polybar'
#Primary Monitor

DEFAULT_MODULES="filesystem pulseaudio mic battery memory cpu date"
DEFAULT_MODULES_TRAY="$DEFAULT_MODULES tray"
MONITOR=DP-4 RIGHT_MODULES=$DEFAULT_MODULES_TRAY polybar &
MONITOR=HDMI-0 RIGHT_MODULES=$DEFAULT_MODULES polybar &
MONITOR=DP-2 RIGHT_MODULES=$DEFAULT_MODULES polybar &
