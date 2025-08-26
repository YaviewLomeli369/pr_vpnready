
#!/bin/bash

# Script para verificar y configurar PostgreSQL
# Uso: ./check-postgres.sh [puerto]

PORT=${1:-5433}

echo "🔍 Verificando PostgreSQL en puerto $PORT..."

# 1. Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL no está instalado"
    echo "🔧 Instalando PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
fi

# 2. Verificar si el servicio está corriendo
if ! systemctl is-active --quiet postgresql; then
    echo "🔄 Iniciando servicio PostgreSQL..."
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# 3. Verificar configuración del puerto
CONFIG_FILE="/etc/postgresql/16/main/postgresql.conf"
if [ -f "$CONFIG_FILE" ]; then
    # Verificar si el puerto está configurado
    if ! grep -q "^port = $PORT" "$CONFIG_FILE"; then
        echo "⚙️  Configurando puerto $PORT en PostgreSQL..."
        sudo sed -i "s/#port = 5432/port = $PORT/" "$CONFIG_FILE"
        sudo sed -i "s/^port = .*/port = $PORT/" "$CONFIG_FILE"
        
        # Reiniciar PostgreSQL para aplicar cambios
        echo "🔄 Reiniciando PostgreSQL..."
        sudo systemctl restart postgresql
        sleep 3
    fi
else
    echo "⚠️  No se encontró el archivo de configuración de PostgreSQL"
fi

# 4. Verificar conexión
echo "🧪 Probando conexión..."
if sudo -u postgres psql -p $PORT -c '\q' 2>/dev/null; then
    echo "✅ PostgreSQL está funcionando correctamente en puerto $PORT"
    
    # Mostrar información de conexión
    echo ""
    echo "📊 Información de PostgreSQL:"
    sudo -u postgres psql -p $PORT -c "SELECT version();" 2>/dev/null | head -3
    echo ""
    echo "📋 Bases de datos existentes:"
    sudo -u postgres psql -p $PORT -l 2>/dev/null | head -10
    
else
    echo "❌ No se puede conectar a PostgreSQL en puerto $PORT"
    echo ""
    echo "🔧 Intentos de solución:"
    echo "1. Verificar que PostgreSQL esté instalado: sudo apt install postgresql"
    echo "2. Verificar estado del servicio: sudo systemctl status postgresql"
    echo "3. Ver logs: sudo journalctl -u postgresql -f"
    echo "4. Configurar puerto en: /etc/postgresql/16/main/postgresql.conf"
    exit 1
fi
