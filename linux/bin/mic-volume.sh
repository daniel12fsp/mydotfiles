#!/bin/bash

VOLUME_MIC=`amixer get Capture | awk -F'[][]' '/%/ {print $2}' | head -n 1`
STATUS=`(amixer get Capture | grep '\[off\]' && echo "Off" || echo "On") | tail -n1`

echo "[$STATUS]$VOLUME_MIC"