#!/bin/bash
set -x

mkdir -p "/run/host-services" || { echo "Failed to create '/run/host-services'" >&2; exit 1; }

touch "/run/host-services/ssh-auth.sock" || { echo "Failed to create '${PWD}/ssh-auth.sock'" >&2; exit 1; }

chown root:"$(id -gn)" "/run/host-services/ssh-auth.sock"

chmod 666 "/run/host-services/ssh-auth.sock"

exec $SHELL -c "ssh-agent -s &> /dev/null && echo 'Socket successfully created!'"