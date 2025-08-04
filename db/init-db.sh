#!/bin/bash
set -e

# Run as the "postgres" user inside the container
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE "VEHICLE_AUTH_DB";
    CREATE DATABASE "VEHICLE_DISPATCH_DB";
    CREATE DATABASE "VEHICLE_VEHICLE_DB";
EOSQL
