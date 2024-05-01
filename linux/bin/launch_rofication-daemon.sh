#!/bin/bash
set -x

if pgrep -x "rofication-daemon" > /dev/null
then
    echo "Process is running."
    pkill -f rofication-daemon; 
    while pgrep -f rofication-daemon >/dev/null; 
        do sleep 1; 
    done; 
else
    echo "Process is not running."
fi

~/code/personal/regolith-rofication/rofication-daemon