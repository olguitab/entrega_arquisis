#!/bin/bash

echo "Stop Application"
echo "Current directory is: $(pwd)"
echo "Listing contents:"
ls -la

# Use the absolute path to docker-compose.production.yml
if [ -f /home/ubuntu/docker-compose.production.yml ]; then
    echo "Found docker-compose file."
    docker compose --file /home/ubuntu/docker-compose.production.yml down
else
    echo "docker-compose.production.yml not found!"
    exit 1
fi
