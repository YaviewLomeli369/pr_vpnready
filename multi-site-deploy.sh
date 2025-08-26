
#!/bin/bash

# Multi-site deployment script
# Usage: ./multi-site-deploy.sh <project_name> <port>

PROJECT_NAME=$1
PORT=$2

if [ -z "$PROJECT_NAME" ] || [ -z "$PORT" ]; then
    echo "Usage: ./multi-site-deploy.sh <project_name> <port>"
    echo "Example: ./multi-site-deploy.sh proyecto_3 3002"
    exit 1
fi

PROJECT_DIR="/root/www/$PROJECT_NAME"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "Project directory $PROJECT_DIR does not exist!"
    exit 1
fi

cd $PROJECT_DIR

# Create docker-compose.yml for the project
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

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    cat > .env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url_here
EOF
fi

# Create deployment script for this project
cat > deploy.sh << EOF
#!/bin/bash
echo "Deploying $PROJECT_NAME on port $PORT..."
docker-compose down
docker-compose up --build -d
echo "$PROJECT_NAME deployed successfully on port $PORT!"
echo "Access at: http://localhost:$PORT"
docker-compose logs -f app
EOF

chmod +x deploy.sh

# Deploy the project
./deploy.sh
