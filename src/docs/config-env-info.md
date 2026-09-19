# Variáveis de Ambiente

```env
DB_HOST=localhost
DB_NAME=terrafarr
DB_USER=root
DB_PASSWORD=root
DB_PORT=3306

PORT=3000

JWT_SECRET=suasenhaaqui
JWT_EXPIRES_IN=86400

ADMIN_TOKEN=suasenhaaqui
```

---

## Gere senhas seguras

Para `JWT_SECRET` e `ADMIN_TOKEN`, gere valores aleatórios e criptografados usando um dos comandos abaixo:

**Bash / Linux / macOS:**

```bash
openssl rand -base64 32
```

**PowerShell / CMD / Bash (via Node.js):**

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> ⚠️ **Importante:** use senhas **diferentes** para `JWT_SECRET` e `ADMIN_TOKEN`. Não reutilize o mesmo valor em variáveis distintas.

---

### Referência rápida

| Variável         | Descrição                                 | Exemplo             |
| ---------------- | ----------------------------------------- | ------------------- |
| `DB_HOST`        | Host do banco de dados                    | `localhost`         |
| `DB_NAME`        | Nome do banco                             | `terrafarr`         |
| `DB_USER`        | Usuário do banco                          | `root`              |
| `DB_PASSWORD`    | Senha do banco                            | `root`              |
| `DB_PORT`        | Porta do banco                            | `3306`              |
| `PORT`           | Porta da aplicação                        | `3000`              |
| `JWT_SECRET`     | Chave secreta para assinar tokens JWT     | *(gerar aleatório)* |
| `JWT_EXPIRES_IN` | Tempo de expiração do token (em segundos) | `86400` (24h)       |
| `ADMIN_TOKEN`    | Token de autenticação administrativa      | *(gerar aleatório)* |