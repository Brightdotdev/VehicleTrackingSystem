
FROM gradle:7.5-jdk17 AS builder

WORKDIR /app

COPY --chown=gradle:gradle . .


RUN gradle --no-daemon clean build --refresh-dependencies

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=builder /app/build/libs/DispatchService-0.0.1-SNAPSHOT.jar DispatchService.jar

EXPOSE 8105

ENTRYPOINT ["java", "-jar", "DispatchService.jar"]
