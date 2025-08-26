
#!/bin/bash

# Build Docker image
echo "Building Docker image..."
docker build -t nova-web-app .

echo "Docker image built successfully!"
echo "To run the container, use: docker-compose up -d"
