#!/bin/bash

echo "Stop Application"

# Log the current working directory
echo "Current directory is: $(pwd)"

# Log the contents of the current directory
echo "Listing contents:"
ls -la

# Stop the application using docker-compose
docker compose --file docker-compose.production.yml down
