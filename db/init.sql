-- Create databases
CREATE DATABASE vehicle_auth_db;
CREATE DATABASE vehicle_dispatch_db;
CREATE DATABASE vehicle_vehicle_db;

-- Create user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD 'super_secret_password';
  END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vehicle_auth_db TO app_user;
GRANT ALL PRIVILEGES ON DATABASE vehicle_dispatch_db TO app_user;
GRANT ALL PRIVILEGES ON DATABASE vehicle_vehicle_db TO app_user;

-- Create extensions in each database
\c vehicle_auth_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c vehicle_dispatch_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c vehicle_vehicle_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";