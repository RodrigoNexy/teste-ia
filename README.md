# Teste Prático IA

Projeto full-stack com Node.js, Express, TypeScript, React e Prisma ORM conectado ao Neon.tech.

## 🚀 Tecnologias

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript + Tailwind CSS
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon.tech)
- **IA**: Groq API

## 📁 Estrutura do Projeto

```
├── src/              # Backend (Express + TypeScript)
│   ├── controllers/  # Controllers (camada de controle)
│   ├── services/     # Services (lógica de negócio)
│   ├── routes/       # Rotas da API
│   └── server.ts     # Servidor Express
├── client/           # Frontend (React + TypeScript)
│   └── src/
│       ├── components/
│       ├── services/
│       └── types/
├── prisma/           # Schema do Prisma
└── package.json      # Dependências unificadas
```

## 🛠️ Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
   - Copie o arquivo `env.example` para `.env`:
     - **Windows (PowerShell)**: `Copy-Item env.example .env`
     - **Linux/Mac**: `cp env.example .env`
   - Edite o arquivo `.env` e adicione suas credenciais:
     - `DATABASE_URL`: Sua connection string do Neon.tech
     - `GROQ_API_KEY`: Sua chave da API Groq

3. Configure o Prisma:
```bash
npm run prisma:generate
npm run prisma:migrate
```

## 🎯 Executar o Projeto

### Desenvolvimento (Backend + Frontend)
```bash
npm run dev
```

### Apenas Backend
```bash
npm run dev:server
```

### Apenas Frontend
```bash
npm run dev:client
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia backend e frontend simultaneamente
- `npm run dev:server` - Inicia apenas o servidor (porta 3001)
- `npm run dev:client` - Inicia apenas o frontend (porta 3000)
- `npm run build` - Build de produção
- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Executa migrations
- `npm run prisma:studio` - Abre o Prisma Studio

## 🏗️ Arquitetura

O projeto segue os princípios SOLID:

- **Single Responsibility**: Cada classe tem uma única responsabilidade
- **Dependency Inversion**: Dependências injetadas via construtor
- **Separation of Concerns**: Controllers, Services e Routes separados

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Health check

### Usuários
- `GET /api/users` - Lista todos os usuários
- `GET /api/users/:id` - Busca usuário por ID
- `POST /api/users` - Cria novo usuário
- `PUT /api/users/:id` - Atualiza usuário
- `DELETE /api/users/:id` - Deleta usuário

### Groq (IA)
- `POST /api/groq/chat` - Chat completion com múltiplas mensagens
  ```json
  {
    "messages": [
      { "role": "user", "content": "Olá!" }
    ],
    "model": "llama-3.1-70b-versatile",
    "temperature": 0.7,
    "max_tokens": 1024
  }
  ```
- `POST /api/groq/completion` - Completion simples com prompt
  ```json
  {
    "prompt": "Explique o que é TypeScript",
    "model": "llama-3.1-70b-versatile"
  }
  ```

