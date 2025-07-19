# Use official Maven image to build the project
FROM maven:3.9.3-eclipse-temurin-17 AS builder

WORKDIR /app
COPY . .

# Build the app (skip tests if you want faster build)
RUN mvn clean package -DskipTests

# Use a lightweight Java runtime to run the app
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
