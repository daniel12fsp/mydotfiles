#!/usr/bin/env bash
# set -x

# Terminate already running bar instances
killall -q polybar

# Add this script to your wm startup file.

# POLYBAR_SCRIPT=`~/.nvm/versions/node/v16.14.2/bin/node  ~/me/mydotfiles/bin/launch_polybar.js`
POLYBAR_SCRIPT='MONITOR=eDP-1 polybar -c /home/dfsp/me/mydotfiles/bin/config_eDP-1.ini\nMONITOR=HDMI-2 polybar -c /home/dfsp/me/mydotfiles/bin/config_HDMI-2.ini'

echo "--"
echo $POLYBAR_SCRIPT;
IFS="\\n"
for i in $(echo $POLYBAR_SCRIPT )
do
  echo "$i &";
  # bash -c "$i &";
done