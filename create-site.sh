# Paso 1: Crear base de datos (solo si es database)
if [ "$STORAGE_TYPE" = "database" ]; then
    echo "=== PASO 1: Verificando y Configurando Base de Datos ==="

    # Verificar PostgreSQL primero
    ./check-postgres.sh $DB_PORT
    if [ $? -ne 0 ]; then
        echo "❌ Error verificando PostgreSQL"
        exit 1
    fi

    # Configurar base de datos
    ./setup-database.sh $PROJECT_NAME $DB_PORT
fi