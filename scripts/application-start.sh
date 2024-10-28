#!/bin/bash

echo "Aplication starting"
cd /home/ubuntu/
docker compose --file docker-compose.production.yml up -d