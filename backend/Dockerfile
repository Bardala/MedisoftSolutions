# Stage 1: Build the app using Maven
FROM maven:3.9.3-eclipse-temurin-17 AS builder

WORKDIR /app
COPY . .

# Build the application and skip tests
RUN mvn clean package -DskipTests

# Stage 2: Create a lightweight runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built jar
COPY --from=builder /app/target/*.jar app.jar

# Expose the default port
EXPOSE 8080

# Limit JVM memory to avoid OOM on Railway (1 GB max RAM)
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Start the application with memory constraints
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
