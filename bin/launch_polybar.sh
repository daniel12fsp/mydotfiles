#!/usr/bin/env bash
set -x

# Add this script to your wm startup file.

DIR="$HOME/.config/polybar/forest"


IMAGES=`~/.nvm/versions/node/v16.14.2/bin/node  ~/me/mydotfiles/bin/wallpaper.js`

IMAGES=`echo "pathA;pathB"`

for i in $(echo $IMAGES | tr ";" "\n")
do
  echo $i;
done

# # Terminate already running bar instances
# killall -q polybar

# # Wait until the processes have been shut down
# while pgrep -u $UID -x polybar >/dev/null; do sleep 1; done

# # Launch the bar

# xrandr --listmonitors | awk '{print $4}'| xargs --no-run-if-empty  -P 0 -n 1 -I{} sh -c 'MONITOR={} polybar'