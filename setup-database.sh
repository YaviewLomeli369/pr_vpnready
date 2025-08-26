
#!/bin/bash

# Script para configurar base de datos PostgreSQL para nuevos proyectos
# Uso: ./setup-database.sh <nombre_proyecto> [puerto_postgresql]

PROJECT_NAME=$1
DB_PORT=${2:-5433}  # Puerto por defecto 5433

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Error: Debes proporcionar el nombre del proyecto"
    echo "Uso: ./setup-database.sh <nombre_proyecto> [puerto_postgresql]"
    echo "Ejemplo: ./setup-database.sh proyecto_2 5433"
    exit 1
fi

# Configuración
DB_NAME="${PROJECT_NAME}_db"
DB_USER="yaviewlomeli"
DB_PASSWORD="Losy990209bn7*"
DB_HOST="209.145.57.10"

echo "🚀 Configurando base de datos para: $PROJECT_NAME"
echo "📊 Base de datos: $DB_NAME"
echo "👤 Usuario: $DB_USER"
echo "🔌 Puerto: $DB_PORT"
echo "🖥️  Host: $DB_HOST"

# Función para ejecutar comandos SQL
execute_sql() {
    local sql_command="$1"
    echo "Ejecutando: $sql_command"
    sudo -u postgres psql -p $DB_PORT -c "$sql_command"
}

echo ""
echo "=== Configurando PostgreSQL ==="

# 1. Crear usuario si no existe (con manejo de errores)
echo "👤 Verificando/creando usuario $DB_USER..."
execute_sql "DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
        RAISE NOTICE 'Usuario $DB_USER creado exitosamente';
    ELSE
        RAISE NOTICE 'Usuario $DB_USER ya existe, actualizando permisos...';
    END IF;
END
\$\$;"

# 2. Crear base de datos si no existe
echo "🗄️  Verificando/creando base de datos $DB_NAME..."
execute_sql "SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\\gexec"

# 3. Otorgar permisos
echo "🔐 Otorgando permisos..."
execute_sql "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
execute_sql "ALTER DATABASE $DB_NAME OWNER TO $DB_USER;"

# 4. Conectar a la nueva base de datos y otorgar permisos de esquema
echo "📋 Configurando permisos de esquema..."
sudo -u postgres psql -p $DB_PORT -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
sudo -u postgres psql -p $DB_PORT -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;"
sudo -u postgres psql -p $DB_PORT -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;"
sudo -u postgres psql -p $DB_PORT -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"
sudo -u postgres psql -p $DB_PORT -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;"

# 5. Crear archivo .env para el proyecto
echo ""
echo "📝 Generando archivo .env..."
cat > "${PROJECT_NAME}.env" << EOF
# Database Configuration for $PROJECT_NAME
DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

# Basic Configuration
PORT=3000
NODE_ENV=production
JWT_SECRET=Losy_990209_bn_7
SESSION_SECRET=N8tk64rTkXPay6anfPCrYE4LAQt9/HazR8WYFenTL5B3OWlQvBUSrplN3+FdADO03iPhxbwZgeNyXhdeoRWByg

# Database Details
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT

# Object Storage
DEFAULT_OBJECT_STORAGE_BUCKET_ID=replit-objstore-dc07723e-0853-46ac-8589-6740c21eb7ab
PUBLIC_OBJECT_SEARCH_PATHS=/replit-objstore-dc07723e-0853-46ac-8589-6740c21eb7ab/public
PRIVATE_OBJECT_DIR=/replit-objstore-dc07723e-0853-46ac-8589-6740c21eb7ab/.private

# Stripe (usar las mismas keys para todos los proyectos)
STRIPE_SECRET_KEY=d1fFKaINZY2V7JG45g1wQanUpVDnU6VoYHq32GXBNVJiXMQuucN2bqDxPiHcQP2tL00WvJAHoa5
VITE_STRIPE_PUBLIC_KEY=pk_test_51RwWDrQSt5Hb0O5yrPJ6QviKDdOUxzWUIN2CybSd7Vb612XfwId3ybdj2qRJtT1w3kb60

# Storage Type
STORAGE_TYPE=database
EOF

echo ""
echo "✅ ¡Configuración completada!"
echo "📁 Archivo generado: ${PROJECT_NAME}.env"
echo "🔄 Para aplicar las migraciones de Drizzle:"
echo "   1. Copia el archivo ${PROJECT_NAME}.env a tu proyecto como .env"
echo "   2. Ejecuta: npx drizzle-kit push"
echo ""
echo "🌐 URL de conexión:"
echo "postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
