-- This assumes POSTGRES_USER=postgres from docker-compose env

CREATE DATABASE "VEHICLE_AUTH_DB";
CREATE DATABASE "VEHICLE_DISPATCH_DB";
CREATE DATABASE "VEHICLE_VEHICLE_DB";

-- No need to create user 'postgres' because it's created by the image with superuser rights.
-- If you want other users, create them here, but make sure postgres exists.

GRANT ALL PRIVILEGES ON DATABASE "VEHICLE_AUTH_DB" TO postgres;
GRANT ALL PRIVILEGES ON DATABASE "VEHICLE_DISPATCH_DB" TO postgres;
GRANT ALL PRIVILEGES ON DATABASE "VEHICLE_VEHICLE_DB" TO postgres;
