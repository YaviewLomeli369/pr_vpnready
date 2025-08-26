
#!/bin/bash

# Enhanced multi-site management script

case $1 in
    "deploy")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Usage: ./manage-sites.sh deploy <project_name> <port> [storage_type]"
            echo "Example: ./manage-sites.sh deploy proyecto_3 3002 memory"
            echo "Storage types: memory (default) | database"
            echo "Available ports: 3000, 3002, 3004, 3006, 3008..."
            exit 1
        fi
        STORAGE_TYPE=${4:-"memory"}
        ./central-deploy.sh $2 $3 $STORAGE_TYPE
        ;;
    "list")
        echo "=== Active Sites ==="
        docker ps --filter "label=com.docker.compose.project" --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}\t{{.Image}}"
        echo ""
        echo "=== Port Usage ==="
        docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E ":(300[0-9]|30[1-9][0-9])->"
        ;;
    "stop")
        if [ -z "$2" ]; then
            echo "Usage: ./manage-sites.sh stop <project_name>"
            exit 1
        fi
        cd /root/www/$2 && docker-compose down
        echo "✅ $2 stopped"
        ;;
    "restart")
        if [ -z "$2" ]; then
            echo "Usage: ./manage-sites.sh restart <project_name>"
            exit 1
        fi
        cd /root/www/$2 && docker-compose restart
        echo "✅ $2 restarted"
        ;;
    "logs")
        if [ -z "$2" ]; then
            echo "Usage: ./manage-sites.sh logs <project_name>"
            exit 1
        fi
        cd /root/www/$2 && docker-compose logs -f app
        ;;
    "cleanup")
        echo "Cleaning up stopped containers..."
        docker container prune -f
        echo "Cleaning up unused images..."
        docker image prune -f
        echo "✅ Cleanup complete"
        ;;
    "ports")
        echo "=== Port Usage Report ==="
        echo "Port 3000: $(docker ps --format '{{.Names}}' --filter 'publish=3000' || echo 'Available')"
        echo "Port 3002: $(docker ps --format '{{.Names}}' --filter 'publish=3002' || echo 'Available')"
        echo "Port 3004: $(docker ps --format '{{.Names}}' --filter 'publish=3004' || echo 'Available')"
        echo "Port 3006: $(docker ps --format '{{.Names}}' --filter 'publish=3006' || echo 'Available')"
        echo "Port 3008: $(docker ps --format '{{.Names}}' --filter 'publish=3008' || echo 'Available')"
        ;;
    *)
        echo "🚀 Multi-Site Manager"
        echo "===================="
        echo "deploy <name> <port> [storage]  - Deploy a project"
        echo "list                           - List all running sites"
        echo "stop <name>                    - Stop a project"
        echo "restart <name>                 - Restart a project"
        echo "logs <name>                    - View project logs"
        echo "cleanup                        - Clean unused containers/images"
        echo "ports                          - Show port usage"
        echo ""
        echo "Examples:"
        echo "  ./manage-sites.sh deploy proyecto_3 3002 memory"
        echo "  ./manage-sites.sh deploy proyecto_4 3004 database"
        echo "  ./manage-sites.sh list"
        ;;
esac
