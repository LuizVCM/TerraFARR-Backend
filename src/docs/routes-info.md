# Documentação das Rotas da API

## Convenções

| Middleware | Descrição |
|---|---|
| `authMiddleware` | Exige usuário autenticado (cookie `token`). |
| `adminMiddleware("recurso")` | Exige autenticação e permissão administrativa para o recurso informado. |
| `adminTokenMiddleware` | Exige o header `x-admin-token`. |
| `validateXCreate` / `validateXUpdate` | Valida o corpo da requisição via Zod. |
| `:id` | Parâmetro de rota. |

## Códigos de status usados

| Código | Significado |
|---|---|
| 200 | Sucesso com corpo. |
| 201 | Recurso criado. |
| 204 | Sucesso sem corpo (delete/logout). |
| 400 | Erro de validação (`BadRequestError`). |
| 401 | Não autenticado / credenciais inválidas (`UnauthorizedError`). |
| 403 | Sem permissão administrativa (`ForbiddenError`). |
| 404 | Recurso não encontrado (`NotFoundError`). |
| 409 | Conflito de unicidade (`ConflictError`). |
| 500 | Erro interno (`InternalServerError`). |

---

## Formato de Respostas de Erro

Todas as exceções que estendem `AppError` são serializadas pelo `errorHandler` com o método `toJSON()`. A estrutura base é:

```json
{
  "success": false,
  "message": "…",
  "cause": "…"
}
```

> O campo `cause` só aparece quando a exceção define um `cause` não nulo.

### Catálogo de erros

| Classe | Status | Campos extras | Mensagem base |
|---|---|---|---|
| `BadRequestError` | 400 | `errors[]` | `Requisição incorreta` |
| `UnauthorizedError` | 401 | `info` | `Não autorizado: {info}` |
| `ForbiddenError` | 403 | `resource`, `info`, `cause` | `Acesso restrito: sem permissão para alterar e acessar {resource}` |
| `NotFoundError` | 404 | `field`, `info` | `Não encontrado: {field}` |
| `ConflictError` | 409 | `fields[]`, `info` | `O seguinte campo já está em uso: {campo}` / `Os seguintes campos já estão em uso: {campos}` |
| `InternalServerError` | 500 | — | `Erro interno do servidor` |

Erros não mapeados também retornam **500** pelo `errorHandler`:

```json
{
  "success": false,
  "message": "Erro interno do servidor"
}
```

### Exemplos por tipo

**`400 BadRequestError`** — gerado pelo middleware `validate()` a partir dos `issues` do Zod. Para enums inválidos, inclui `expected`:

```json
{
  "success": false,
  "message": "Requisição incorreta",
  "errors": [
    { "field": "email", "message": "E-mail inválido" },
    { "field": "senha", "message": "A senha deve ter pelo menos 6 caracteres" },
    { "field": "status", "message": "Valor inválido", "expected": "PLANEJADA, EM_ANDAMENTO, COLHIDA" }
  ]
}
```

**`401 UnauthorizedError`**

```json
{
  "success": false,
  "message": "Não autorizado: não autenticado",
  "info": "não autenticado"
}
```

**`403 ForbiddenError`**

```json
{
  "success": false,
  "message": "Acesso restrito: sem permissão para alterar e acessar usuários",
  "resource": "usuários",
  "info": "Acesso permitido apenas para administrador",
  "cause": "Permissão insuficiente"
}
```

**`404 NotFoundError`**

```json
{
  "success": false,
  "message": "Não encontrado: território",
  "field": "território"
}
```

**`409 ConflictError`**

```json
{
  "success": false,
  "message": "Os seguintes campos já estão em uso: email, cpf",
  "fields": ["email", "cpf"]
}
```

**`500 InternalServerError`**

```json
{
  "success": false,
  "message": "Erro interno do servidor"
}
```

---

## Prefixos registrados

| Módulo | Prefixo |
|---|---|
| Autenticação | `/auth` |
| Usuários | `/users` |
| Territórios | `/territories` |
| Plantas | `/plants` |
| Sementes | `/seeds` |
| Plantações/Cultivos | `/crops` |
| Financeiro | `/finances` |
| Estoque de insumos | `/stocks` |
| Sensores | `/sensor` |
| Dados climáticos | `/weather` |

---

## Autenticação — `/auth`

| Método | Rota | Middlewares | Validação | Ação | Descrição |
|---|---|---|---|---|---|
| POST | `/auth/login` | — | — | `AuthController.login` | Realiza login do usuário. |
| POST | `/auth/logout` | `authMiddleware` | — | `AuthController.logout` | Realiza logout do usuário autenticado. |
| POST | `/auth/checkpass` | `authMiddleware` | — | `AuthController.checkUserPassword` | Verifica a senha do usuário autenticado. |

> **Nota:** `validateUserLogin` existe em `index.validate.ts`, mas **não está aplicado** em `auth.routes.ts`. O corpo do login é validado apenas pelo service.

### `POST /auth/login`

**Request body**
```json
{
  "email": "usuario@exemplo.com",
  "senha": "Senha123!"
}
```

**Response `200 OK`** — define cookie `token` (httpOnly, secure, sameSite `none`, maxAge 1h)
```json
{
  "success": true
}
```

**Erros:** `401` (credenciais inválidas), `500`.

---

### `POST /auth/logout`

**Headers:** cookie `token` válido.

**Response `204 No Content`** — limpa o cookie `token`.

**Erros:** `401`.

---

### `POST /auth/checkpass`

**Headers:** cookie `token` válido.

**Request body**
```json
{
  "senha": "Senha123!"
}
```

**Response `200 OK`**
```json
{
  "success": true
}
```

**Erros:** `401` (`não autenticado`, `credenciais inválidas`).

---

## Usuários — `/users`

| Método | Rota | Middlewares | Validação | Ação | Descrição |
|---|---|---|---|---|---|
| POST | `/users/admin` | `adminTokenMiddleware` | `validateAdminCreate` | `UserController.createAdmin` | Cria um administrador. Requer header `x-admin-token`. |
| GET | `/users/all` | `authMiddleware`, `adminMiddleware("usuários")` | — | `UserController.listAllWithRelations` | Lista todos os usuários com relacionamentos. |
| GET | `/users/me` | `authMiddleware` | — | `UserController.getInfoUserLogged` | Retorna informações do usuário logado. |
| POST | `/users` | — | `validateUserCreate` | `UserController.create` | Cria um usuário. |
| PUT | `/users` | `authMiddleware` | `validateUserUpdate` | `UserController.update` | Atualiza usuário autenticado. |
| DELETE | `/users` | `authMiddleware` | — | `UserController.delete` | Remove usuário autenticado. |

### `POST /users/admin`

**Headers:** `x-admin-token: <ADMIN_TOKEN>`

**Request body** (`createAdminSchema`)
```json
{
  "nome": "Admin",
  "email": "admin@exemplo.com",
  "senha": "Senha123!",
  "role": "ADMIN"
}
```

**Response `201 Created`**
```json
{
  "id": 1,
  "nome": "Admin",
  "email": "admin@exemplo.com",
  "role": "ADMIN"
}
```

**Erros:** `400` (validação), `401` (`token de administrador inválido`), `500` (`Token de administrador não configurado`).

---

### `GET /users/all`

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "nome": "Admin",
    "sobrenome": "Sistema",
    "email": "admin@exemplo.com",
    "telefone": "+5551999999999",
    "cpf": "12345678901",
    "role": "ADMIN",
    "territories": [],
    "seeds": [],
    "crops": [],
    "finances": [],
    "stocks": [],
    "sensors": []
  }
]
```

**Erros:** `401`, `403` (`resource: "usuários"`).

---

### `GET /users/me`

**Response `200 OK`**
```json
{
  "id": 2,
  "nome": "Usuário",
  "sobrenome": "Exemplo",
  "email": "usuario@exemplo.com",
  "telefone": "+5551988888888",
  "cpf": "98765432100",
  "role": "USER"
}
```

**Erros:** `401`, `404`.

---

### `POST /users`

**Request body** (`createUserSchema`)
```json
{
  "nome": "Usuário",
  "sobrenome": "Exemplo",
  "email": "usuario@exemplo.com",
  "telefone": "+55 51 98888-8888",
  "cpf": "987.654.321-00",
  "senha": "Senha123!"
}
```

> **Validação externa:**
> - `telefone` é validado e normalizado para E.164 (`+5551988888888`) via `libphonenumber-js/max`.
> - `cpf` é validado e higienizado (`98765432100`) via `cpf-cnpj-validator`.
> - `senha` exige: ≥ 6 caracteres, 1 maiúscula, 1 minúscula, 1 dígito e 1 caractere especial.

**Response `201 Created`**
```json
{
  "id": 2,
  "nome": "Usuário",
  "sobrenome": "Exemplo",
  "email": "usuario@exemplo.com",
  "role": "USER"
}
```

**Erros:** `400` (validação, incluindo CPF/telefone inválidos), `409` (`email`/`cpf` já em uso).

---

### `PUT /users`

**Request body** (`updateUserSchema` — todos opcionais)
```json
{
  "nome": "NovoNome",
  "senha": "NovaSenha123!"
}
```

**Response `200 OK`**
```json
{
  "id": 2,
  "nome": "NovoNome",
  "sobrenome": "Exemplo",
  "email": "usuario@exemplo.com"
}
```

**Erros:** `400`, `401`, `404`, `409`.

---

### `DELETE /users`

**Response `204 No Content`**

**Erros:** `401`, `404`.

---

## Territórios — `/territories`

| Método | Rota | Middlewares | Validação | Ação | Descrição |
|---|---|---|---|---|---|
| GET | `/territories/all` | `authMiddleware`, `adminMiddleware("territórios")` | — | `TerritoryController.listAll` | Lista todos os territórios. |
| GET | `/territories/me` | `authMiddleware` | — | `TerritoryController.listMyTerritories` | Lista territórios do usuário logado. |
| GET | `/territories/:id` | `authMiddleware` | — | `TerritoryController.getById` | Busca território por ID. |
| POST | `/territories` | `authMiddleware` | `validateTerritoryCreate` | `TerritoryController.create` | Cria território. |
| PUT | `/territories/:id` | `authMiddleware` | `validateTerritoryUpdate` | `TerritoryController.update` | Atualiza território por ID. |
| DELETE | `/territories/:id` | `authMiddleware` | — | `TerritoryController.delete` | Remove território por ID. |

### `GET /territories/all`

**Response `200 OK`**
```json
[
  {
    "id": 10,
    "cep": "90000000",
    "area": 100,
    "unidadeArea": "HECTARE",
    "userId": 2
  }
]
```

**Erros:** `401`, `403` (`resource: "territórios"`).

---

### `GET /territories/me`

**Response `200 OK`**
```json
[
  { "id": 10, "cep": "90000000", "area": 100, "unidadeArea": "HECTARE" }
]
```

**Erros:** `401`.

---

### `GET /territories/:id`

**Response `200 OK`**
```json
{ "id": 10, "cep": "90000000", "area": 100, "unidadeArea": "HECTARE" }
```

**Erros:** `401`, `403`, `404`.

---

### `POST /territories`

**Request body** (`createTerritorySchema`)
```json
{
  "cep": "90000-000",
  "area": 100,
  "unidadeArea": "HECTARE"
}
```

> O CEP é transformado removendo não-dígitos e validado como 8 dígitos.

**Response `201 Created`**
```json
{
  "id": 10,
  "cep": "90000000",
  "area": 100,
  "unidadeArea": "HECTARE",
  "userId": 2
}
```

**Erros:** `400`, `401`.

---

### `PUT /territories/:id`

**Request body** (`updateTerritorySchema`) — todos opcionais; `area` e `unidadeArea` devem ser informadas **juntas**.
```json
{
  "area": 150,
  "unidadeArea": "HECTARE"
}
```

**Response `200 OK`**
```json
{ "id": 10, "cep": "90000000", "area": 150, "unidadeArea": "HECTARE" }
```

**Erros:** `400`, `401`, `403`, `404`.

---

### `DELETE /territories/:id`

**Response `204 No Content`**

**Erros:** `401`, `403`, `404`.

---

## Plantas — `/plants`

| Método | Rota | Middlewares | Validação | Ação | Descrição |
|---|---|---|---|---|---|
| GET | `/plants/all` | — | — | `PlantController.listAll` | Lista todas as plantas. |
| GET | `/plants/me` | `authMiddleware` | — | `PlantController.listByUserLogged` | Lista plantas do usuário logado. |
| GET | `/plants/seed/:id` | `authMiddleware` | — | `PlantController.listBySeedId` | Lista plantas por ID da semente. |
| GET | `/plants/:id` | — | — | `PlantController.getById` | Busca planta por ID. |

### `GET /plants/all`

**Response `200 OK`**
```json
[
  { "id": 1, "nome": "Soja" }
]
```

**Erros:** `500`.

---

### `GET /plants/me`

**Response `200 OK`**
```json
[
  { "id": 1, "nome": "Soja" }
]
```

**Erros:** `401`.

---

### `GET /plants/seed/:id`

**Response `200 OK`**
```json
[
  { "id": 1, "nome": "Soja", "seedId": 5 }
]
```

**Erros:** `401`, `404`.

---

### `GET /plants/:id`

**Response `200 OK`**
```json
{ "id": 1, "nome": "Soja" }
```

**Erros:** `404`.

---

## Sementes — `/seeds`

| Método | Rota | Middlewares | Validação | Ação | Descrição |
|---|---|---|---|---|---|
| GET | `/seeds/all` | `authMiddleware`, `adminMiddleware("sementes")` | — | `SeedController.listAll` | Lista todas as sementes. |
| GET | `/seeds/me` | `authMiddleware` | — | `SeedController.listMySeeds` | Lista sementes do usuário logado. |
| GET | `/seeds/:id` | `authMiddleware` | — | `SeedController.getById` | Busca semente por ID. |
| POST | `/seeds` | `authMiddleware` | `validateSeedCreate` | `SeedController.create` | Cria semente. |
| PUT | `/seeds/:id` | `authMiddleware` | `validateSeedUpdate` | `SeedController.update` | Atualiza semente por ID. |
| DELETE | `/seeds/:id` | `authMiddleware` | — | `SeedController.delete` | Remove semente por ID. |

### `GET /seeds/all`

**Response `200 OK`**
```json
[
  {
    "id": 5,
    "plantaId": 1,
    "dataCompra": "2026-08-01",
    "dataValidade": "2027-08-01",
    "quantidade": 50,
    "unidadePeso": "KG",
    "fornecedor": "Agro Ltda",
    "observacoes": null,
    "userId": 2
  }
]
```

**Erros:** `401`, `403` (`resource: "sementes"`).

---

### `GET /seeds/me`

**Response `200 OK`**
```json
[
  { "id": 5, "plantaId": 1, "quantidade": 50, "unidadePeso": "KG" }
]
```

**Erros:** `401`.

---

### `GET /seeds/:id`

**Response `200 OK`**
```json
{ "id": 5, "plantaId": 1, "quantidade": 50, "unidadePeso": "KG" }
```

**Erros:** `401`, `404`.

---

### `POST /seeds`

**Request body** (`createSeedSchema`)
```json
{
  "plantaId": 1,
  "dataCompra": "2026-08-01",
  "dataValidade": "2027-08-01",
  "quantidade": 50,
  "unidadePeso": "KG",
  "fornecedor": "Agro Ltda",
  "observacoes": "Lote A"
}
```

> Regra: `dataValidade` deve ser posterior a `dataCompra`.

**Response `201 Created`**
```json
{
  "id": 5,
  "plantaId": 1,
  "dataCompra": "2026-08-01",
  "dataValidade": "2027-08-01",
  "quantidade": 50,
  "unidadePeso": "KG",
  "fornecedor": "Agro Ltda",
  "userId": 2
}
```

**Erros:** `400` (validação, incluindo `dataValidade` ≤ `dataCompra`), `401`, `404` (`plantaId` inexistente).

---

### `PUT /seeds/:id`

**Request body** (`updateSeedSchema` — parcial)
```json
{
  "quantidade": 75
}
```

**Response `200 OK`**
```json
{ "id": 5, "quantidade": 75, "unidadePeso": "KG" }
```

**Erros:** `400`, `401`, `404`.

---

### `DELETE /seeds/:id`

**Response `204 No Content`**

**Erros:** `401`, `404`.

---

## Plantações/Cultivos — `/crops`

| Método | Rota | Middlewares | Validação | Ação | Descrição |
|---|---|---|---|---|---|
| GET | `/crops/all` | `authMiddleware`, `adminMiddleware("plantações")` | — | `CropController.listAll` | Lista todas as plantações/cultivos. |
| GET | `/crops/me` | `authMiddleware` | — | `CropController.listMyCrops` | Lista plantações/cultivos do usuário logado. |
| GET | `/crops/:id` | `authMiddleware` | — | `CropController.getById` | Busca plantação/cultivo por ID. |
| POST | `/crops/:id` | `authMiddleware` | `validateCropCreate` | `CropController.create` | Cria plantação/cultivo. `:id` = `territoryId`. |
| PUT | `/crops/:id` | `authMiddleware` | `validateCropUpdate` | `CropController.update` | Atualiza plantação/cultivo por ID. |
| DELETE | `/crops/:id` | `authMiddleware` | — | `CropController.delete` | Remove plantação/cultivo por ID. |

### `GET /crops/all`

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "nome": "Soja Safra 2026",
    "sementeId": 5,
    "variedade": "BRS 284",
    "area": 50,
    "unidadeArea": "HECTARE",
    "dataPlantio": "2026-09-01",
    "dataColheitaReal": null,
    "responsavel": "João",
    "status": "PLANEJADA",
    "observacoes": null,
    "territoryId": 10,
    "userId": 2
  }
]
```

**Erros:** `401`, `403` (`resource: "plantações"`).

---

### `GET /crops/me`

**Response `200 OK`**
```json
[
  { "id": 1, "nome": "Soja Safra 2026", "status": "PLANEJADA" }
]
```

**Erros:** `401`.

---

### `GET /crops/:id`

**Response `200 OK`**
```json
{
  "id": 1,
  "nome": "Soja Safra 2026",
  "sementeId": 5,
  "status": "PLANEJADA"
}
```

**Erros:** `401`, `403`, `404`.

---

### `POST /crops/:id`

> `:id` = `territoryId`

**Request body** (`createCropSchema`)
```json
{
  "nome": "Soja Safra 2026",
  "sementeId": 5,
  "variedade": "BRS 284",
  "area": 50,
  "unidadeArea": "HECTARE",
  "dataPlantio": "2026-09-01",
  "responsavel": "João",
  "status": "PLANEJADA",
  "observacoes": "Primeira safra"
}
```

> - `status` é opcional; padrão `PLANEJADA`.
> - `dataPlantio` deve seguir `YYYY-MM-DD`.

**Response `201 Created`**
```json
{
  "id": 1,
  "nome": "Soja Safra 2026",
  "sementeId": 5,
  "area": 50,
  "unidadeArea": "HECTARE",
  "dataPlantio": "2026-09-01",
  "status": "PLANEJADA",
  "territoryId": 10,
  "userId": 2
}
```

**Erros:** `400`, `401`, `403` (território de outro usuário), `404` (território ou semente inexistente).

---

### `PUT /crops/:id`

**Request body** (`updateCropSchema`) — todos opcionais; `area` e `unidadeArea` devem ser informadas **juntas**.
```json
{
  "area": 60,
  "unidadeArea": "HECTARE",
  "dataColheitaReal": "2027-01-20",
  "status": "COLHIDA"
}
```

**Response `200 OK`**
```json
{
  "id": 1,
  "area": 60,
  "unidadeArea": "HECTARE",
  "dataColheitaReal": "2027-01-20",
  "status": "COLHIDA"
}
```

**Erros:** `400` (validação, incl. `area`/`unidadeArea` informadas separadamente), `401`, `403`, `404`.

---

### `DELETE /crops/:id`

**Response `200 OK`** — corpo vazio (`res.status(200).send()`).

**Erros:** `401`, `403`, `404`.

---

## Financeiro — `/finances`

| Método | Rota | Middlewares | Validação | Ação | Descrição |
|---|---|---|---|---|---|
| GET | `/finances/all` | `authMiddleware`, `adminMiddleware("registros financeiros")` | — | `FinanceController.listAll` | Lista todos os registros financeiros. |
| GET | `/finances/me` | `authMiddleware` | — | `FinanceController.listMyFinances` | Lista registros financeiros do usuário logado. |
| GET | `/finances/:id` | `authMiddleware` | — | `FinanceController.getById` | Busca registro financeiro por ID. |
| POST | `/finances` | `authMiddleware` | `validateFinanceCreate` | `FinanceController.create` | Cria registro financeiro. |
| PUT | `/finances/:id` | `authMiddleware` | `validateFinanceUpdate` | `FinanceController.update` | Atualiza registro financeiro por ID. |
| DELETE | `/finances/:id` | `authMiddleware` | — | `FinanceController.delete` | Remove registro financeiro por ID. |

### `GET /finances/all`

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "tipo": "DESPESA",
    "valor": 1500.5,
    "observacoes": "Compra de sementes",
    "detalhes": "Lote A",
    "data": "2026-09-01",
    "userId": 2
  }
]
```

**Erros:** `401`, `403` (`resource: "registros financeiros"`).

---

### `GET /finances/me`

**Response `200 OK`**
```json
[
  { "id": 1, "tipo": "DESPESA", "valor": 1500.5, "data": "2026-09-01" }
]
```

**Erros:** `401`.

---

### `GET /finances/:id`

**Response `200 OK`**
```json
{ "id": 1, "tipo": "DESPESA", "valor": 1500.5, "data": "2026-09-01" }
```

**Erros:** `401`, `403`, `404`.

---

### `POST /finances`

**Request body** (`createFinanceSchema`)
```json
{
  "tipo": "RECEITA",
  "valor": 3000,
  "observacoes": "Venda de soja",
  "detalhes": "Safra 2026",
  "data": "2026-09-21"
}
```

> `valor` deve ser positivo e abaixo de 999.999,99. `data` no formato `YYYY-MM-DD`.

**Response `201 Created`**
```json
{
  "id": 2,
  "tipo": "RECEITA",
  "valor": 3000,
  "observacoes": "Venda de soja",
  "detalhes": "Safra 2026",
  "data": "2026-09-21",
  "userId": 2
}
```

**Erros:** `400`, `401`.

---

### `PUT /finances/:id`

**Request body** (`updateFinanceSchema` — parcial)
```json
{
  "valor": 3200
}
```

**Response `200 OK`**
```json
{ "id": 2, "tipo": "RECEITA", "valor": 3200, "data": "2026-09-21" }
```

**Erros:** `400`, `401`, `403`, `404`.

---

### `DELETE /finances/:id`

**Response `204 No Content`**

**Erros:** `401`, `403`, `404`.

---

## Estoques — `/stocks`

| Método | Rota | Middlewares | Validação | Ação | Descrição |
|---|---|---|---|---|---|
| GET | `/stocks/all` | `authMiddleware`, `adminMiddleware("estoques")` | — | `StockController.listAll` | Lista todos os estoques. |
| GET | `/stocks/me` | `authMiddleware` | — | `StockController.listMyStock` | Lista estoques do usuário logado. |
| GET | `/stocks/:id` | `authMiddleware` | — | `StockController.getById` | Busca estoque por ID. |
| POST | `/stocks` | `authMiddleware` | `validateStockCreate` | `StockController.create` | Cria estoque. |
| PUT | `/stocks/:id` | `authMiddleware` | `validateStockUpdate` | `StockController.update` | Atualiza estoque por ID. |
| DELETE | `/stocks/:id` | `authMiddleware` | — | `StockController.delete` | Remove estoque por ID. |

### `GET /stocks/all`

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "nome": "Fertilizante NPK",
    "categoria": "INSUMO",
    "quantidade": 50,
    "unidade": "KG",
    "dataValidade": "2027-08-01",
    "limiteMinimo": 10,
    "userId": 2
  }
]
```

**Erros:** `401`, `403` (`resource: "estoques"`).

---

### `GET /stocks/me`

**Response `200 OK`**
```json
[
  { "id": 1, "nome": "Fertilizante NPK", "quantidade": 50, "unidade": "KG" }
]
```

**Erros:** `401`.

---

### `GET /stocks/:id`

**Response `200 OK`**
```json
{ "id": 1, "nome": "Fertilizante NPK", "quantidade": 50, "unidade": "KG" }
```

**Erros:** `401`, `403`, `404`.

---

### `POST /stocks`

**Request body** (`createStockSchema`)
```json
{
  "nome": "Fertilizante NPK",
  "categoria": "INSUMO",
  "quantidade": 50,
  "unidade": "KG",
  "dataValidade": "2027-08-01",
  "limiteMinimo": 10
}
```

> `quantidade` aceita zero ou positivo. `dataValidade` e `limiteMinimo` são opcionais.

**Response `201 Created`**
```json
{
  "id": 1,
  "nome": "Fertilizante NPK",
  "categoria": "INSUMO",
  "quantidade": 50,
  "unidade": "KG",
  "dataValidade": "2027-08-01",
  "limiteMinimo": 10,
  "userId": 2
}
```

**Erros:** `400`, `401`.

---

### `PUT /stocks/:id`

**Request body** (`updateStockSchema` — parcial)
```json
{
  "quantidade": 75
}
```

**Response `200 OK`**
```json
{ "id": 1, "nome": "Fertilizante NPK", "quantidade": 75, "unidade": "KG" }
```

**Erros:** `400`, `401`, `403`, `404`.

---

### `DELETE /stocks/:id`

**Response `204 No Content`**

**Erros:** `401`, `403`, `404`.

---

## Sensores — `/sensor`

| Método | Rota | Middlewares | Validação | Ação | Descrição |
|---|---|---|---|---|---|
| GET | `/sensor/all` | `authMiddleware`, `adminMiddleware("sensores")` | — | `SensorController.listAll` | Lista todos os sensores. |
| GET | `/sensor/me` | `authMiddleware` | — | `SensorController.listMySensors` | Lista sensores do usuário logado. |
| GET | `/sensor/:id` | `authMiddleware` | — | `SensorController.getById` | Busca sensor por ID. |
| POST | `/sensor/territory/:id` | `authMiddleware` | — | `SensorController.create` | Cria sensor associado a um território. `:id` = `territoryId`. |
| PUT | `/sensor/:id` | `authMiddleware` | — | `SensorController.update` | Atualiza sensor por ID. |
| DELETE | `/sensor/:id` | `authMiddleware` | — | `SensorController.delete` | Remove sensor por ID. |

> **Nota:** `validateSensorCreate` e `validateSensorUpdate` existem em `index.validate.ts`, mas **não estão aplicados** em `sensor.routes.ts`. Sem validação Zod, não há `400` a partir do `validate()`; erros de forma podem vir do service.

### `GET /sensor/all`

**Response `200 OK`**
```json
[
  { "id": 1, "modelo": "DHT22", "tipo": "UMIDADE", "territoryId": 10, "userId": 2 }
]
```

**Erros:** `401`, `403` (`resource: "sensores"`).

---

### `GET /sensor/me`

**Response `200 OK`**
```json
[
  { "id": 1, "modelo": "DHT22", "tipo": "UMIDADE", "territoryId": 10 }
]
```

**Erros:** `401`.

---

### `GET /sensor/:id`

**Response `200 OK`**
```json
{ "id": 1, "modelo": "DHT22", "tipo": "UMIDADE", "territoryId": 10 }
```

**Erros:** `401`, `403`, `404`.

---

### `POST /sensor/territory/:id`

> `:id` = `territoryId`

**Request body** (`createSensorSchema`)
```json
{
  "modelo": "DHT22",
  "tipo": "UMIDADE"
}
```

**Response `201 Created`**
```json
{
  "id": 1,
  "modelo": "DHT22",
  "tipo": "UMIDADE",
  "territoryId": 10,
  "userId": 2
}
```

**Erros:** `401`, `403`, `404`.

---

### `PUT /sensor/:id`

**Request body** (`updateSensorSchema` — parcial)
```json
{
  "modelo": "DHT22 v2"
}
```

**Response `200 OK`**
```json
{ "id": 1, "modelo": "DHT22 v2", "tipo": "UMIDADE" }
```

**Erros:** `401`, `403`, `404`.

---

### `DELETE /sensor/:id`

**Response `204 No Content`**

**Erros:** `401`, `403`, `404`.

---

## Clima — `/weather`

| Método | Rota | Middlewares | Validação | Ação | Descrição |
|---|---|---|---|---|---|
| GET | `/weather/all` | `authMiddleware`, `adminMiddleware("registros climáticos")` | — | `WeatherController.listAll` | Lista todos os registros climáticos. |
| GET | `/weather/me` | `authMiddleware` | — | `WeatherController.listMyWeathers` | Lista registros climáticos do usuário logado. |
| GET | `/weather/territory/:id` | `authMiddleware` | — | `WeatherController.listByTerritoryId` | Lista registros climáticos por território. |
| GET | `/weather/:id` | `authMiddleware` | — | `WeatherController.getById` | Busca registro climático por ID. |
| POST | `/weather/territory/:id` | `authMiddleware` | `validateWeatherCreate` | `WeatherController.create` | Cria registro climático para um território. `:id` = `territoryId`. |

### `GET /weather/all`

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "territoryId": 10,
    "daily": {
      "time": ["2026-09-21", "2026-09-22"],
      "temperature_2m_max": [28.5, 29.1],
      "temperature_2m_min": [17.2, 18.0],
      "precipitation_sum": [0, 5.2],
      "wind_speed_10m_max": [12.3, 15.7],
      "et0_fao_evapotranspiration": [4.1, 3.8]
    },
    "userId": 2
  }
]
```

**Erros:** `401`, `403` (`resource: "registros climáticos"`).

---

### `GET /weather/me`

**Response `200 OK`**
```json
[
  { "id": 1, "territoryId": 10, "daily": { "time": ["2026-09-21"] } }
]
```

**Erros:** `401`.

---

### `GET /weather/territory/:id`

**Response `200 OK`**
```json
[
  { "id": 1, "territoryId": 10, "daily": { "time": ["2026-09-21"] } }
]
```

**Erros:** `401`, `403`, `404`.

---

### `GET /weather/:id`

**Response `200 OK`**
```json
{
  "id": 1,
  "territoryId": 10,
  "daily": {
    "time": ["2026-09-21"],
    "temperature_2m_max": [28.5]
  }
}
```

**Erros:** `401`, `403`, `404`.

---

### `POST /weather/territory/:id`

> `:id` = `territoryId`

**Request body** (`createWeatherSchema`)
```json
{
  "daily": {
    "time": ["2026-09-21", "2026-09-22"],
    "temperature_2m_max": [28.5, 29.1],
    "temperature_2m_min": [17.2, 18.0],
    "precipitation_sum": [0, 5.2],
    "wind_speed_10m_max": [12.3, 15.7],
    "et0_fao_evapotranspiration": [4.1, 3.8]
  }
}
```

> Cada array deve ter pelo menos 1 elemento. Os arrays devem ter o mesmo comprimento (regra de negócio esperada).

**Response `201 Created`**
```json
{
  "id": 1,
  "territoryId": 10,
  "daily": { "time": ["2026-09-21", "2026-09-22"] },
  "userId": 2
}
```

**Erros:** `400`, `401`, `403`, `404`.

---

## Resumo de permissões administrativas

| Recurso | Rota protegida |
|---|---|
| `usuários` | `GET /users/all` |
| `territórios` | `GET /territories/all` |
| `sementes` | `GET /seeds/all` |
| `plantações` | `GET /crops/all` |
| `registros financeiros` | `GET /finances/all` |
| `estoques` | `GET /stocks/all` |
| `sensores` | `GET /sensor/all` |
| `registros climáticos` | `GET /weather/all` |

---