#!/bin/bash
# crontab config
# 0 8,12,23 * * *  ~/bin/wallpaper.sh 

set -xe

# Original from https://gist.github.com/vojtabiberle/d46e09dc48d221adec3bbb4adc854a2f
TMP_FILE="$HOME/.wallpaper/tmp.wallpaper.png"
FILE="$HOME/.wallpaper/wallpaper.png"

[ -f $TMP_FILE] &&  rm $TMP_FILE
curl https://source.unsplash.com/1920x1200/\?stars,nature,sea,wather -o $TMP_FILE -L 

if [ -f "$TMP_FILE" ]; then
    mv $TMP_FILE $FILE
    gsettings set org.gnome.desktop.screensaver picture-uri file://$FILE
    gsettings set org.gnome.desktop.background picture-uri file://$FILE
fi
