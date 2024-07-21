#!/bin/bash
set -x

docker ps -aq | xargs docker stop
# docker compose -f ~/code/business/resume-io-compact-docker/docker-compose.yml up -d