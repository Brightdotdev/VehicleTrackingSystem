# =======================
# 🏗 Stage 1: Build stage
# =======================
FROM gradle:8.8-jdk21 AS build
WORKDIR /app

# Copy Gradle wrapper and config first (cache-friendly)
COPY gradlew gradlew.bat build.gradle settings.gradle /app/
COPY gradle/wrapper/ /app/gradle/wrapper/

# Copy rest of the app and build
COPY . /app/
RUN gradle build --no-daemon -x test


# ===========================
# 🏃 Stage 2: Runtime stage
# ===========================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 🟢 Copy built jar from previous stage
COPY --from=build /app/build/libs/*.jar app.jar


EXPOSE 8102

# ✅ Set memory-friendly JVM options
# -Xms128m = start with 128MB
# -Xmx256m = max 256MB
# -XX:+UseContainerSupport is default in Java 21, but kept here for clarity

ENV JAVA_OPTS="-Xms128m -Xmx256m"

# ✅ Run Spring Boot with custom memory limits
ENTRYPOINT exec java $JAVA_OPTS -jar app.jar
