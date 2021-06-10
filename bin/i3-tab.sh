#!/bin/bash
set -xe

window_id=$1
index=`i3-msg -t get_tree | jq -e -r "recurse(.nodes[];.nodes!=null)|select(.nodes[].focused).nodes[$window_id].id"`
i3-msg "[con_id=\"$index\"] focus"

