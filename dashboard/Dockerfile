# Use OpenJDK image to build and run the app
FROM eclipse-temurin:17-jdk-jammy


WORKDIR /app

# Copy the built jar (make sure you built it with mvn package or gradle build)
COPY target/*.jar app.jar

# Expose backend port (e.g., 8080)
EXPOSE 9090

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]

