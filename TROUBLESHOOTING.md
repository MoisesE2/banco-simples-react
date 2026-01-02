# 🔧 Troubleshooting - Bad Gateway

## Problema: Bad Gateway 502

Este erro geralmente ocorre quando o Nginx não consegue servir os arquivos ou há um problema na configuração.

## ✅ Soluções

### 1. Verificar se o Build foi Bem-Sucedido

No Dockploy, verifique os logs de build:

```bash
# Verifique se a pasta dist foi criada
# O build deve mostrar: "dist/index.html" criado
```

### 2. Verificar Arquivos no Container

Execute no Dockploy ou via SSH:

```bash
docker exec banco-simples-react ls -la /usr/share/nginx/html
```

**Deve mostrar:**
- `index.html`
- `assets/` (pasta com JS e CSS)

### 3. Verificar Configuração do Nginx

```bash
docker exec banco-simples-react nginx -t
```

**Deve retornar:** `nginx: configuration file /etc/nginx/nginx.conf test is successful`

### 4. Verificar Logs do Nginx

```bash
docker logs banco-simples-react
```

Procure por erros como:
- `Permission denied`
- `File not found`
- `Connection refused`

### 5. Verificar Porta

No Dockploy, certifique-se de que:
- **Porta Interna:** 80
- **Porta Externa:** Qualquer porta disponível (ex: 3000, 8080)

### 6. Rebuild Completo

Se o problema persistir, faça um rebuild completo:

1. No Dockploy, pare o container
2. Remova a imagem antiga
3. Faça um novo build
4. Inicie o container novamente

### 7. Verificar Variáveis de Ambiente

Certifique-se de que as variáveis estão configuradas no Dockploy:

```env
VITE_API_URL=https://sua-api.com
VITE_API_BASE_PATH=/api
VITE_ENV=production
```

## 🔍 Comandos Úteis

### Entrar no Container
```bash
docker exec -it banco-simples-react sh
```

### Verificar Processos
```bash
docker exec banco-simples-react ps aux
```

### Testar Nginx Manualmente
```bash
docker exec banco-simples-react wget -O - http://localhost
```

### Verificar Permissões
```bash
docker exec banco-simples-react ls -la /usr/share/nginx/html
```

## 📝 Checklist

- [ ] Build completou sem erros
- [ ] Arquivos estão em `/usr/share/nginx/html`
- [ ] Nginx está rodando (`ps aux | grep nginx`)
- [ ] Configuração do Nginx está válida (`nginx -t`)
- [ ] Porta está mapeada corretamente
- [ ] Variáveis de ambiente estão configuradas
- [ ] Logs não mostram erros críticos

## 🆘 Se Nada Funcionar

1. **Verifique os logs completos:**
   ```bash
   docker logs banco-simples-react --tail 100
   ```

2. **Reconstrua a imagem:**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Teste localmente primeiro:**
   ```bash
   docker build -t banco-simples-react .
   docker run -p 3000:80 banco-simples-react
   ```

4. **Verifique se o problema é no Dockploy:**
   - Teste o container localmente
   - Se funcionar localmente, o problema pode ser na configuração do Dockploy

