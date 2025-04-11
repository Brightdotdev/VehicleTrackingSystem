# Build stage
FROM gradle:7.5-jdk17 AS builder

WORKDIR /app

# 1. First copy only gradle files
COPY --chown=gradle:gradle build.gradle .
COPY --chown=gradle:gradle settings.gradle .
COPY --chown=gradle:gradle gradle gradle
RUN mkdir -p src && chown -R gradle:gradle .

# 2. Run initial download of dependencies
RUN gradle --no-daemon dependencies

# 3. Copy source code
COPY --chown=gradle:gradle src src

# 4. Build with cache
RUN gradle --no-daemon clean build --refresh-dependencies

# Runtime stage remains the same
FROM openjdk:17-jdk-slim

RUN adduser --system --group appuser
USER appuser

WORKDIR /app

COPY --from=builder --chown=appuser:appuser /app/build/libs/*.jar app.jar

EXPOSE 8105

ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]