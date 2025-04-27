# Stage 1: Build with Gradle
FROM gradle:jdk21-alpine AS builder
WORKDIR /app

# Copy only the Gradle files first to cache dependencies
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon

# Copy source files after dependencies
COPY src ./src

# Build the application and clean up
RUN gradle build --no-daemon && \
    rm -rf ~/.gradle /app/build/tmp

# Stage 2: Distroless Runtime
FROM gcr.io/distroless/java21-debian11
WORKDIR /app

# Copy only the compiled JAR
COPY --from=builder /app/build/libs/*.jar /app/app.jar

# Expose your app's port
EXPOSE 8103

# Run the app with Java explicitly
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
