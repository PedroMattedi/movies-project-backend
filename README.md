# Movie API - Sistema Completo de Gerenciamento de Filmes

API REST desenvolvida em NestJS para gerenciar filmes com autenticação segura, upload de imagens e notificações por e-mail.

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js com arquitetura modular e injeção de dependências
- **Prisma ORM** - Migrations e acesso ao PostgreSQL
- **JWT Authentication** - Autenticação segura com guards
- **Swagger** - Documentação automática da API
- **Multer + AWS S3** - Upload de imagens para cloud storage
- **Nodemailer** - Envio de e-mails
- **node-cron** - Agendamento de tarefas
- **class-validator** - Validação robusta de DTOs
- **bcrypt** - Hash seguro de senhas

## 📋 Funcionalidades

### Autenticação
- ✅ Registro de usuários com validação
- ✅ Login com JWT tokens
- ✅ Proteção de rotas com guards

### Gerenciamento de Filmes
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validação de permissões (usuário só edita seus próprios filmes)
- ✅ Listagem paginada (10 itens por página)
- ✅ Busca por título
- ✅ Filtros avançados:
  - Duração (mínima e máxima)
  - Período de lançamento (data início e fim)
  - Gênero
- ✅ Detalhes completos do filme

### Upload e Mídias
- ✅ Upload de imagens para AWS S3
- ✅ Validação de tipos de arquivo

### Notificações
- ✅ Sistema de agendamento automático
- ✅ E-mail de lembrete para filmes com estreia no dia
- ✅ Execução diária às 8h da manhã

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database (já configurado automaticamente no Replit)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Email Configuration (Ethereal para testes ou Resend para produção)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-user
SMTP_PASS=your-ethereal-pass
SMTP_FROM=noreply@movieapp.com
```

### 2. Instalação

```bash
# Instalar dependências
npm install

# Executar migrations do Prisma
npx prisma migrate dev

# Gerar Prisma Client
npx prisma generate
```

### 3. Executar a Aplicação

```bash
# Desenvolvimento (com hot-reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A aplicação estará disponível em:
- **API**: http://localhost:5000
- **Documentação Swagger**: http://localhost:5000/api/docs

## 📚 Documentação da API

### Autenticação

#### POST /auth/register
Registrar novo usuário

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "Senha123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2025-10-19T...",
    "updatedAt": "2025-10-19T..."
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

#### POST /auth/login
Login de usuário

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "Senha123!"
}
```

### Filmes (Requer Autenticação)

Todas as rotas de filmes requerem o header:
```
Authorization: Bearer <token>
```

#### POST /movies
Criar novo filme

**Body:**
```json
{
  "title": "The Matrix",
  "originalTitle": "The Matrix",
  "releaseDate": "1999-03-31",
  "description": "A computer hacker learns about the true nature of reality...",
  "budget": 63000000,
  "duration": 136,
  "genre": "Action",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### GET /movies
Listar filmes com filtros e paginação

**Query Parameters:**
- `search` - Buscar por título
- `genre` - Filtrar por gênero
- `minDuration` - Duração mínima em minutos
- `maxDuration` - Duração máxima em minutos
- `releaseDateFrom` - Data de lançamento inicial (YYYY-MM-DD)
- `releaseDateTo` - Data de lançamento final (YYYY-MM-DD)
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)

**Exemplo:**
```
GET /movies?search=Matrix&genre=Action&page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "The Matrix",
      "originalTitle": "The Matrix",
      "releaseDate": "1999-03-31T00:00:00.000Z",
      "description": "...",
      "budget": 63000000,
      "duration": 136,
      "genre": "Action",
      "imageUrl": "https://...",
      "userId": "uuid",
      "user": {
        "id": "uuid",
        "name": "João Silva",
        "email": "joao@example.com"
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### GET /movies/:id
Obter detalhes de um filme específico

#### PATCH /movies/:id
Atualizar filme (apenas o criador pode atualizar)

#### DELETE /movies/:id
Deletar filme (apenas o criador pode deletar)

### Upload

#### POST /upload/image
Upload de imagem para S3

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` - Arquivo de imagem

**Response:**
```json
{
  "url": "https://bucket.s3.amazonaws.com/movies/uuid.jpg"
}
```

## 🗄️ Estrutura do Banco de Dados

### User
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  movies    Movie[]
}
```

### Movie
```prisma
model Movie {
  id            String   @id @default(uuid())
  title         String
  originalTitle String?
  releaseDate   DateTime
  description   String
  budget        Float?
  duration      Int
  genre         String
  imageUrl      String?
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## 📧 Sistema de Notificações

O sistema verifica automaticamente todos os dias às 8h da manhã se há filmes com estreia no dia atual. Quando encontrado, envia um e-mail de lembrete para o usuário que cadastrou o filme.

Para testar manualmente, ajuste o cron expression em `src/scheduler/scheduler.service.ts`.

## 🔒 Segurança

- Senhas são criptografadas com bcrypt (10 rounds)
- JWT tokens com expiração configurável
- Validação de permissões em todas as operações
- Guards para proteção de rotas
- Validação de DTOs em todos os endpoints

## 📖 Swagger

Acesse a documentação interativa completa em `/api/docs` para:
- Ver todos os endpoints disponíveis
- Testar requests diretamente no navegador
- Ver schemas de request/response
- Autenticar com JWT token

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Testes
npm run test

# Prisma
npx prisma studio        # Interface visual do banco
npx prisma migrate dev   # Criar nova migration
npx prisma generate      # Gerar Prisma Client
```

## 📁 Estrutura do Projeto

```
src/
├── auth/                 # Módulo de autenticação
│   ├── dto/             # DTOs de login e registro
│   ├── strategies/      # JWT Strategy
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # Módulo de usuários
│   ├── dto/
│   ├── users.service.ts
│   └── users.module.ts
├── movies/              # Módulo de filmes
│   ├── dto/             # DTOs de CRUD e filtros
│   ├── movies.controller.ts
│   ├── movies.service.ts
│   └── movies.module.ts
├── upload/              # Módulo de upload S3
│   ├── upload.controller.ts
│   ├── upload.service.ts
│   └── upload.module.ts
├── mail/                # Módulo de e-mail
│   ├── mail.service.ts
│   └── mail.module.ts
├── scheduler/           # Módulo de agendamento
│   ├── scheduler.service.ts
│   └── scheduler.module.ts
├── prisma/              # Configuração do Prisma
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── common/              # Compartilhado
│   ├── guards/          # JWT Guard
│   └── decorators/      # Current User Decorator
├── app.module.ts
└── main.ts
```

## 📝 Notas Importantes

1. **AWS S3**: Configure suas credenciais AWS no `.env` para que o upload funcione
2. **E-mail**: Para testes, use Ethereal Email (https://ethereal.email/) para gerar credenciais de teste
3. **JWT Secret**: Altere o `JWT_SECRET` para uma chave forte em produção
4. **CORS**: Habilitado por padrão - ajuste em `main.ts` conforme necessário

## 🤝 Contato

Para dúvidas ou sugestões, entre em contato através do repositório.
