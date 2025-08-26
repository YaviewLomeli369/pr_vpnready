
#!/bin/bash

# Stop any running containers
echo "Stopping existing containers..."
docker-compose down

# Build and start the application
echo "Building and starting the application..."
docker-compose up --build -d

echo "Application deployed successfully!"
echo "Access your application at: http://localhost:3000"

# Show logs
echo "Showing application logs (press Ctrl+C to exit):"
docker-compose logs -f app
