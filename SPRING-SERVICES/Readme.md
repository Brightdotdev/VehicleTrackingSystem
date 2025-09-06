# Running the Microservices (Without Docker)

This guide explains how to **build and run each microservice locally** without Docker and without setting environment variables.
Each service has its own directory and can be run independently, or you can use the provided helper scripts to launch all services at once.

---

## 🔨 Build All Services (Individually)

Navigate into each service’s directory and run:

```bash
gradle build --no-daemon -x test
```

* `--no-daemon` prevents Gradle from running in the background.
* `-x test` skips tests (remove if you want tests to run).
* JARs are created under `build/libs/`.

---

## 🚀 Running Services

By default, Spring Boot loads `application.yml`.
To run with the **dev profile**, append `--spring.profiles.active=dev` to the command.

### 1. ApiGateway

```bash
# Inside ApiGateway/
gradle build --no-daemon -x test

# Default
java -jar build/libs/ApiGateway-0.0.1-SNAPSHOT.jar

# Dev profile
java -jar build/libs/ApiGateway-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

### 2. AuthService

```bash
# Inside AuthService/
gradle build --no-daemon -x test

# Default
java -jar build/libs/AuthService-0.0.1-SNAPSHOT.jar

# Dev profile
java -jar build/libs/AuthService-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

### 3. VehicleService

```bash
# Inside VehicleService/
gradle build --no-daemon -x test

# Default
java -jar build/libs/VehicleService-0.0.1-SNAPSHOT.jar

# Dev profile
java -jar build/libs/VehicleService-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

### 4. DispatchService

```bash
# Inside DispatchService/
gradle build --no-daemon -x test

# Default
java -jar build/libs/DispatchService-0.0.1-SNAPSHOT.jar

# Dev profile
java -jar build/libs/DispatchService-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

### 5. Logging & Tracking Service

```bash
# Inside logging-tracking-service/
gradle build --no-daemon -x test

# Default
java -jar build/libs/logging-tracking-service-0.0.1-SNAPSHOT.jar

# Dev profile
java -jar build/libs/logging-tracking-service-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

---

## 🖥️ Run All Services Together (Optional)

If you’d like to start all services at once in **dev mode**, use one of the provided scripts.

### Windows (`run-all.bat`)

Save this as `run-all.bat` in the root directory:

```bat
@echo off
echo Building and starting all services in dev mode...

cd ApiGateway
gradle build --no-daemon -x test
start cmd /k java -jar build/libs/ApiGateway-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
cd ..

cd AuthService
gradle build --no-daemon -x test
start cmd /k java -jar build/libs/AuthService-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
cd ..

cd VehicleService
gradle build --no-daemon -x test
start cmd /k java -jar build/libs/VehicleService-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
cd ..

cd DispatchService
gradle build --no-daemon -x test
start cmd /k java -jar build/libs/DispatchService-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
cd ..

cd logging-tracking-service
gradle build --no-daemon -x test
start cmd /k java -jar build/libs/logging-tracking-service-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
cd ..
```

➡️ Run it by double-clicking or executing:

```bat
run-all.bat
```

Each service will start in its own terminal window.

---

### Linux/macOS (`run-all.sh`)

Save this as `run-all.sh` in the root directory:

```bash
#!/bin/bash
echo "Building and starting all services in dev mode..."

cd ApiGateway
gradle build --no-daemon -x test
gnome-terminal -- java -jar build/libs/ApiGateway-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev &
cd ..

cd AuthService
gradle build --no-daemon -x test
gnome-terminal -- java -jar build/libs/AuthService-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev &
cd ..

cd VehicleService
gradle build --no-daemon -x test
gnome-terminal -- java -jar build/libs/VehicleService-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev &
cd ..

cd DispatchService
gradle build --no-daemon -x test
gnome-terminal -- java -jar build/libs/DispatchService-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev &
cd ..

cd logging-tracking-service
gradle build --no-daemon -x test
gnome-terminal -- java -jar build/libs/logging-tracking-service-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev &
cd ..
```

➡️ Make it executable and run:

```bash
chmod +x run-all.sh
./run-all.sh
```

Each service will start in its own terminal window.

---

## ✅ Summary

* Each microservice builds and runs independently in its own directory.
* Use `--spring.profiles.active=dev` to run with `application-dev.yml`.
* Optional scripts (`run-all.bat` for Windows, `run-all.sh` for Linux/macOS) let you build and launch all services at once in **dev mode**.


## 🛑 Stopping All Services

When running multiple services, you may want to stop them all at once.

### Windows (`stop-all.bat`)

Save this as `stop-all.bat` in the root directory:

```bat
@echo off
echo Stopping all microservices...

REM Kill processes by JAR name
taskkill /F /IM java.exe /FI "WINDOWTITLE eq ApiGateway*"
taskkill /F /IM java.exe /FI "WINDOWTITLE eq AuthService*"
taskkill /F /IM java.exe /FI "WINDOWTITLE eq VehicleService*"
taskkill /F /IM java.exe /FI "WINDOWTITLE eq DispatchService*"
taskkill /F /IM java.exe /FI "WINDOWTITLE eq logging-tracking-service*"

echo All services stopped.
```

➡️ Run it by double-clicking or executing:

```bat
stop-all.bat
```

---

### Linux/macOS (`stop-all.sh`)

Save this as `stop-all.sh` in the root directory:

```bash
#!/bin/bash
echo "Stopping all microservices..."

# Kill processes matching service JAR names
pkill -f "ApiGateway-0.0.1-SNAPSHOT.jar"
pkill -f "AuthService-0.0.1-SNAPSHOT.jar"
pkill -f "VehicleService-0.0.1-SNAPSHOT.jar"
pkill -f "DispatchService-0.0.1-SNAPSHOT.jar"
pkill -f "logging-tracking-service-0.0.1-SNAPSHOT.jar"

echo "All services stopped."
```

➡️ Make it executable and run:

```bash
chmod +x stop-all.sh
./stop-all.sh
```

---

## ✅ Summary (Extended)

* Use `run-all.bat` or `run-all.sh` to **start all services in dev mode**.
* Use `stop-all.bat` or `stop-all.sh` to **stop all services at once**.

