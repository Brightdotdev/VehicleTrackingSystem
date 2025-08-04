# =======================
# 🏗 Stage 1: Build stage
# =======================
FROM gradle:8.8-jdk21 AS build
WORKDIR /app

# Copy wrapper files FIRST
COPY gradlew gradlew.bat build.gradle settings.gradle /app/
COPY gradle/wrapper/ /app/gradle/wrapper/




# Copy rest of app and build
COPY . /app/
RUN gradle build --no-daemon -x test

# =======================================
# 🏃 Stage 2: Runtime
# =======================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8105
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]