# =======================
# 🏗 Stage 1: Build stage
# =======================
FROM gradle:8.8-jdk21 AS build
WORKDIR /app

# Use a dedicated Gradle cache directory
ENV GRADLE_USER_HOME=/gradle_cache

# 1️⃣ Copy only build files first (for dependency caching)
COPY build.gradle settings.gradle /app/
COPY gradle /app/gradle/

# 2️⃣ Download dependencies (cached unless build.gradle changes)
RUN gradle dependencies --no-daemon || true

# 3️⃣ Copy source code
COPY src /app/src

# 4️⃣ Build the app (skip tests for speed)
RUN gradle build --no-daemon -x test

# ==============================
# 🏃 Stage 2: Runtime environment
# ==============================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy only the built jar
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8103

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
