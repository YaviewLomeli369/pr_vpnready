
#!/bin/bash

# Central multi-site deployment manager
PROJECT_NAME=$1
PORT=$2
STORAGE_TYPE=${3:-"memory"}  # memory or database

if [ -z "$PROJECT_NAME" ] || [ -z "$PORT" ]; then
    echo "Usage: ./central-deploy.sh <project_name> <port> [storage_type]"
    echo "Example: ./central-deploy.sh proyecto_3 3002 memory"
    echo "Storage types: memory (default) | database"
    exit 1
fi

PROJECT_DIR="/root/www/$PROJECT_NAME"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "Project directory $PROJECT_DIR does not exist!"
    exit 1
fi

cd $PROJECT_DIR

# Stop existing container if it exists
echo "Stopping existing containers for $PROJECT_NAME..."
docker-compose down 2>/dev/null || true

# Create .env only if it doesn't exist, otherwise preserve it
if [ ! -f ".env" ]; then
    echo "Creating new .env file..."
    if [ "$STORAGE_TYPE" = "memory" ]; then
        cat > .env << EOF
NODE_ENV=production
PORT=3000
STORAGE_TYPE=memory
# Add other env vars as needed
EOF
    else
        cat > .env << EOF
NODE_ENV=production
PORT=3000
STORAGE_TYPE=database
DATABASE_URL=postgresql://user:password@localhost:5432/db_${PROJECT_NAME}
# Add other env vars as needed
EOF
    fi
else
    echo "✅ Using existing .env file (not overwriting)"
    echo "Current .env contents:"
    cat .env
fi

# Create docker-compose.yml
cat > docker-compose.yml << EOF
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: ${PROJECT_NAME}_app
    restart: unless-stopped
    ports:
      - "${PORT}:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - STORAGE_TYPE=${STORAGE_TYPE}
    env_file:
      - .env
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - ${PROJECT_NAME}_network

networks:
  ${PROJECT_NAME}_network:
    driver: bridge
EOF

echo "Deploying $PROJECT_NAME on port $PORT with $STORAGE_TYPE storage..."
docker-compose up --build -d

echo "✅ $PROJECT_NAME deployed successfully!"
echo "🌐 Access at: http://localhost:$PORT"
echo "📋 Container name: ${PROJECT_NAME}_app"

# Show status
docker ps --filter "name=${PROJECT_NAME}_app" --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
