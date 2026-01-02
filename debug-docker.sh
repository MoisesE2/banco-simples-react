#!/bin/bash
# Script de debug para verificar o container Docker

echo "=== Verificando Container ==="
docker ps | grep banco-simples-react

echo ""
echo "=== Verificando Logs ==="
docker logs banco-simples-react --tail 50

echo ""
echo "=== Verificando Arquivos no Container ==="
docker exec banco-simples-react ls -la /usr/share/nginx/html

echo ""
echo "=== Verificando Configuração do Nginx ==="
docker exec banco-simples-react nginx -t

echo ""
echo "=== Testando Health Check ==="
docker exec banco-simples-react wget -q -O - http://localhost/health

