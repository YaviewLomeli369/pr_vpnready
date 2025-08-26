
#!/bin/bash

# Script para probar conexión a base de datos
PROJECT_NAME=$1
DB_PORT=${2:-5433}

if [ -z "$PROJECT_NAME" ]; then
    echo "Uso: ./test-database.sh <nombre_proyecto> [puerto]"
    exit 1
fi

DB_NAME="${PROJECT_NAME}_db"
DB_USER="yaviewlomeli"
DB_PASSWORD="Losy990209bn7*"
DB_HOST="209.145.57.10"

echo "🔍 Probando conexión a la base de datos..."
echo "📊 Base de datos: $DB_NAME"
echo "👤 Usuario: $DB_USER"
echo "🖥️  Host: $DB_HOST:$DB_PORT"

# Probar conexión
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 'Conexión exitosa!' as status, current_database(), current_user;"

if [ $? -eq 0 ]; then
    echo "✅ ¡Conexión exitosa!"
else
    echo "❌ Error de conexión"
    echo "Verifica que PostgreSQL esté corriendo en $DB_HOST:$DB_PORT"
fi
