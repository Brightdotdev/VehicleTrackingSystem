# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Architecture Overview

This is a **microservices-based Vehicle Tracking System** built with Spring Boot backend services and Next.js frontend applications. The system enforces vehicle safety through automated safety score calculations and dispatch blocking for unsafe vehicles.

### Core Services
- **API Gateway** (`port 8102`) - Spring Cloud Gateway routing all requests with JWT authentication
- **Auth Service** (`port 8103`) - User authentication and authorization 
- **Vehicle Service** (`port 8106`) - Vehicle management and safety score calculations
- **Dispatch Service** (`port 8105`) - Handles vehicle dispatch requests with safety validation
- **Logging Service** (`port 8104`) - Tracks system logs and notifications

### Frontend Applications
- **Admin Desk Web** (`port 3000`) - Next.js admin dashboard for fleet management
- **Auto Port Mobile** (`port 3001`) - React Native mobile app for end users

### Data Stores
- **PostgreSQL** - Multiple databases for each service (auth, vehicle, dispatch)
- **MongoDB** - Logging and notification storage
- **RabbitMQ** - Optional message queue (can use direct WebClient calls instead)

## Common Development Commands

### Environment Setup
```bash
# Copy environment template and configure
cp .env.example .env
# Edit .env with your specific configuration
```

### Docker Operations
```bash
# Build and start all services
docker compose up --build

# Start without rebuilding
docker compose up

# Stop all services
docker compose down

# View service logs
docker compose logs -f [service-name]

# Restart specific service
docker compose restart [service-name]
```

### Backend Development (Spring Boot Services)
```bash
# Navigate to specific service
cd SPRING-SERVICES/[ServiceName]

# Build service locally
./gradlew build

# Run tests
./gradlew test

# Run specific service locally (requires databases running)
./gradlew bootRun

# Clean build artifacts
./gradlew clean
```

### Frontend Development
```bash
# Admin Dashboard (Next.js)
cd views/admin_desk_web

# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

### Mobile App Development
```bash
# React Native mobile app
cd views/auto_port_mobile_js

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

## Key Configuration

### Service Communication
The system supports two communication modes via `.env`:
- `MESSAGE_TYPE=rabbitMq` - Uses RabbitMQ for async messaging
- `MESSAGE_TYPE=webClient` - Uses direct HTTP calls between services

### Safety Score Logic
- Vehicles with safety scores >= 63 are eligible for dispatch
- Vehicles with scores < 63 are automatically blocked
- Safety scores are calculated from vehicle part conditions

### Database Schema
- Each Spring service uses its own PostgreSQL database
- Database initialization is handled automatically via `db/init.sql`
- MongoDB is used specifically for logging and notifications

## Development Workflow

### Adding New Features
1. Identify which service(s) need modification
2. Update the corresponding Spring Boot service in `SPRING-SERVICES/`
3. If UI changes are needed, update the appropriate frontend in `views/`
4. Test locally using `docker compose up --build`
5. Ensure all services start successfully and health checks pass

### Testing Services
- Each Spring service includes JUnit 5 test framework
- Run tests with `./gradlew test` in the service directory
- Health check endpoints are available at `/actuator/health` for each service
- Frontend testing uses Jest (configured but tests need to be written)

### Debugging
- Service logs are available via `docker compose logs -f [service-name]`
- Database access: PostgreSQL on `localhost:5433`, MongoDB on `localhost:27018`
- RabbitMQ management UI available at `http://localhost:15672` (if enabled)
- Each service exposes actuator endpoints for monitoring

### Security Considerations
- JWT tokens are used for authentication with configurable expiration
- Internal service communication uses API keys
- Database credentials and secrets must be configured in `.env`
- Never commit `.env` files - use `.env.example` as template

### Mobile Development
- React Native app uses Expo framework
- Communicates with backend services through the API Gateway
- Location tracking and mapping features implemented with Leaflet/MapLibre

## Service Dependencies

Services must start in order due to dependencies:
1. Infrastructure (PostgreSQL, MongoDB, RabbitMQ)
2. Auth Service (required by Gateway)
3. Vehicle, Dispatch, and Logging Services
4. API Gateway (depends on all other services)
5. Frontend applications

This dependency chain is handled automatically by Docker Compose health checks.
