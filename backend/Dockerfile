# syntax=docker/dockerfile:1

# --- Build Stage ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first to leverage Docker layer caching for dependencies
COPY --link pom.xml ./

# Pre-fetch dependencies to speed up subsequent builds
RUN mvn -B -ntp dependency:go-offline

# Copy source code
COPY --link src ./src

# Build the application (skip tests for faster build)
RUN mvn -B -ntp package -DskipTests

# --- Runtime Stage ---
FROM eclipse-temurin:17-jre
WORKDIR /app

# Create non-root user
RUN useradd -m appuser
USER appuser

# Copy built jar from build stage
COPY --from=build /app/target/*.jar /app/app.jar

# Expose port (default for Spring Boot is 8080)
EXPOSE 8080

# JVM memory/resource flags for containers
ENV JAVA_OPTS="-XX:MaxRAMPercentage=80.0"

# Run the application
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
