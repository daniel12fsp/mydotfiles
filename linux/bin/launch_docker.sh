#!/bin/bash
set -x

docker ps -aq | xargs docker stop
docker compose -f /mnt/6e55b6e6-2f8f-4cf8-9f04-e2e2cfb28569/code/business/resume-io-compact-docker/docker-compose.yml up -d