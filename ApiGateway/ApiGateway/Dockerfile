# Stage 1: Build with Gradle
FROM gradle:jdk21-alpine AS builder
WORKDIR /app

# 1. Copy build configs first for layer caching
COPY build.gradle .
COPY settings.gradle .

# 2. Download dependencies (cache this layer)
RUN gradle dependencies --no-daemon

# 3. Copy source code
COPY src src

# 4. Build (will use cached dependencies)
RUN gradle build --no-daemon

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built artifact
COPY --from=builder /app/build/libs/*.jar /app/app.jar

# Non-root user for security
RUN addgroup --system javauser && \
    adduser --system --ingroup javauser javauser
USER javauser

EXPOSE 8102
ENTRYPOINT ["java", "-jar", "/app/app.jar"]