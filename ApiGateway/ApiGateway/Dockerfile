# Stage 1: Build with Gradle
FROM gradle:jdk21-alpine AS builder
WORKDIR /app

# Copy only what's needed for dependencies
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .
COPY src src

# Build with cached dependencies
RUN ./gradlew build --no-daemon

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built artifact
COPY --from=builder /app/build/libs/*.jar /app/app.jar

# Security improvements
RUN addgroup --system javauser && \
    adduser --system --ingroup javauser javauser
USER javauser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]