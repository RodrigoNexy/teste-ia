# 🔥 Lead Scoring com IA - Teste Técnico

Sistema de qualificação inteligente de leads utilizando análise de IA (Groq) para gerar scores de probabilidade de fechamento. Desenvolvido como teste técnico/desafio em Node.js, Express, TypeScript, React e Prisma.

## 🎯 Sobre o Projeto

Teste técnico desenvolvido para demonstrar habilidades em desenvolvimento full-stack. Sistema de Lead Scoring que utiliza IA para analisar mensagens e comportamento, gerando:

- Score de 0-100 (probabilidade de fechamento)
- Classificação: Quente, Morno ou Frio
- Explicação do score (explicabilidade)
- Gestão visual via Kanban board
- Analytics e métricas

<img width="1878" height="1664" alt="image" src="https://github.com/user-attachments/assets/eedd5f69-1865-4d9a-867f-1e34b4a07055" />


## 🛠️ Tecnologias

**Backend:**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL (Neon.tech)
- Groq SDK (llama-3.3-70b-versatile)
- Jest + ts-jest (testes unitários)

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS
- Lucide React (ícones)
- Recharts (gráficos)
- Vite
- Vitest + Testing Library (testes unitários)

## 📁 Estrutura do Projeto

```
TestePraticoIa/
├── src/                    # Backend
│   ├── controllers/       # Controllers
│   ├── services/          # Lógica de negócio
│   ├── routes/            # Rotas da API
│   └── server.ts         # Servidor Express
│
├── client/src/            # Frontend
│   ├── components/        # Componentes React
│   ├── hooks/            # Custom Hooks
│   ├── services/         # Serviços de API
│   ├── types/            # Tipos TypeScript
│   └── utils/            # Utilitários
│
├── prisma/               # Prisma ORM
│   └── schema.prisma     # Schema do banco
│
└── env.example           # Variáveis de ambiente
```

## 📦 Instalação

### 1. Clone e instale dependências

```bash
git clone <url-do-repositorio>
cd TestePraticoIa
npm install
```

### 2. Configure variáveis de ambiente

Copie `env.example` para `.env` e configure:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
GROQ_API_KEY="sua_chave_groq_aqui"
PORT=3001
NODE_ENV=development
```

**Credenciais:**
- **DATABASE_URL**: Connection string do Neon.tech (ou solicite via WhatsApp/call)
- **GROQ_API_KEY**: Chave da API Groq (ou solicite via WhatsApp/call)

### 3. Configure Prisma

**⚠️ IMPORTANTE: Pare o servidor antes de executar migrations!**

```bash
npm run prisma:generate
npm run prisma:migrate
```

## 🚀 Como Usar

### Desenvolvimento

```bash
npm run dev              # Backend (3001) + Frontend (3000)
npm run dev:server      # Apenas backend
npm run dev:client      # Apenas frontend
```

Acesse: **http://localhost:3000**

### Funcionalidades

- **Dashboard**: Estatísticas e Kanban board com drag-and-drop
- **Leads**: Tabela completa com ações rápidas
- **Análises**: Gráficos de distribuição, evolução e métricas
- **Análise IA**: Automática ao criar/atualizar leads
- **Re-análise**: Manual via botão de ação

## 📡 API Endpoints

### Leads

```http
GET    /api/leads              # Listar todos (ordenado por score)
GET    /api/leads/stats        # Estatísticas agregadas
GET    /api/leads/:id          # Buscar por ID
POST   /api/leads              # Criar (análise automática)
PUT    /api/leads/:id          # Atualizar (re-análise se necessário)
DELETE /api/leads/:id          # Deletar
POST   /api/leads/:id/analyze  # Re-analisar manualmente
```

**Exemplo POST /api/leads:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "message": "Gostaria de saber mais sobre o produto",
  "origin": "WhatsApp",
  "responseTime": 2,
  "interactions": 1
}
```

<img width="1878" height="1664" alt="image" src="https://github.com/user-attachments/assets/569be429-2ad1-4b91-9f9e-8a2c0db854b1" />

### Usuários

```http
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Groq (IA)

```http
POST /api/groq/chat        # Chat completion
POST /api/groq/completion  # Completion simples
```

## 🏗️ Arquitetura

### Backend
- **Controllers**: Recebem requisições HTTP
- **Services**: Lógica de negócio
- **Routes**: Definição de endpoints
- **SOLID**: Separação de responsabilidades

### Frontend
- **Components**: Componentes React reutilizáveis
- **Hooks**: Custom hooks para lógica compartilhada
- **Services**: Comunicação com API
- **Utils**: Funções utilitárias

### Padrões
- Single Responsibility
- Dependency Inversion
- DRY (Don't Repeat Yourself)
- Component Composition

<img width="274" height="907" alt="image" src="https://github.com/user-attachments/assets/f88f1341-c30f-4ea8-aa81-0e76a068508d" />


## 🧪 Testes Unitários

O projeto possui cobertura de testes unitários para garantir a qualidade e confiabilidade do código.

### Tecnologias de Teste

**Backend:**
- **Jest** - Framework de testes para Node.js
- **ts-jest** - Suporte TypeScript para Jest
- **Mocks** - Prisma Client e serviços externos

**Frontend:**
- **Vitest** - Framework de testes rápido para Vite
- **@testing-library/react** - Utilitários para testar componentes React
- **@testing-library/user-event** - Simulação de interações do usuário

### Estrutura de Testes

```
TestePraticoIa/
├── src/__tests__/              # Testes do backend
│   ├── controllers/            # Testes de controllers
│   │   ├── groq.controller.test.ts
│   │   ├── lead.controller.test.ts
│   │   └── user.controller.test.ts
│   └── services/               # Testes de services
│       ├── groq-lead-analysis.service.test.ts
│       ├── lead.service.test.ts
│       └── user.service.test.ts
│
└── client/src/                 # Testes do frontend
    ├── hooks/__tests__/        # Testes de hooks
    ├── services/__tests__/     # Testes de serviços
    └── utils/__tests__/        # Testes de utilitários
```

### Como Executar os Testes

```bash
# Executar todos os testes (backend + frontend)
npm test

# Executar apenas testes do backend (Jest)
npm run test:backend

# Executar apenas testes do frontend (Vitest)
npm run test:frontend

# Modo watch (re-executa ao salvar arquivos)
npm run test:watch              # Backend + Frontend
npm run test:watch:backend      # Apenas backend
npm run test:watch:frontend     # Apenas frontend

# Testes com cobertura de código
npm run test:coverage
```

### O que é Testado

**Backend:**
- ✅ Controllers (validação de requisições, respostas HTTP)
- ✅ Services (lógica de negócio, integração com Prisma)
- ✅ Análise de leads com IA (Groq)
- ✅ CRUD completo de leads e usuários
- ✅ Tratamento de erros e validações

**Frontend:**
- ✅ Custom Hooks (lógica de estado, efeitos)
- ✅ Serviços de API (chamadas HTTP)
- ✅ Utilitários (formatação, cálculos)
- ✅ Componentes React (renderização, interações)

### Exemplo de Teste

```typescript
// src/__tests__/controllers/groq.controller.test.ts
describe('GroqController', () => {
  it('deve criar chat completion', async () => {
    const requestData = {
      messages: [{ role: 'user', content: 'Olá!' }],
      model: 'llama-3.3-70b-versatile',
    };

    await controller.chatCompletion(mockRequest, mockResponse);

    expect(mockGroqService.createChatCompletion).toHaveBeenCalledWith(requestData);
    expect(mockResponse.json).toHaveBeenCalled();
  });
});
```

## 📜 Scripts

```bash
# Desenvolvimento
npm run dev              # Backend + Frontend
npm run dev:server       # Apenas backend
npm run dev:client       # Apenas frontend

# Build
npm run build            # Build completo
npm run build:server     # Build backend
npm run build:client     # Build frontend

# Testes
npm test                 # Todos os testes
npm run test:backend     # Testes backend (Jest)
npm run test:frontend    # Testes frontend (Vitest)
npm run test:watch       # Modo watch
npm run test:coverage    # Com cobertura

# Prisma
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrations
npm run prisma:studio    # Abrir Prisma Studio

# Produção
npm start                # Iniciar servidor
```

## 🔧 Troubleshooting

**Prisma Client not generated:**
```bash
npm run prisma:generate
```

**EPERM ao executar Prisma:**
- Pare o servidor antes de executar comandos Prisma

**Erro de conexão com banco:**
- Verifique `DATABASE_URL` no `.env`
- Confirme SSL habilitado (`?sslmode=require`)

**Erro Groq API:**
- Verifique `GROQ_API_KEY` no `.env`
- Confirme chave ativa e créditos disponíveis

**Porta em uso:**
- Pare processos nas portas 3000/3001
- Ou altere portas em `src/server.ts` e `vite.config.ts`

<img width="1878" height="1664" alt="image" src="https://github.com/user-attachments/assets/acf11c11-ccc0-42f9-b4c3-be02375b446a" />

## 📝 Sobre o Teste Técnico

Desenvolvido para avaliação de competências em:

- Desenvolvimento Full-Stack (Node.js + React)
- Arquitetura de Software (SOLID, Clean Code)
- Integração com APIs de IA (Groq)
- Gerenciamento de Banco de Dados (Prisma + PostgreSQL)
- UI/UX Moderna (React + Tailwind CSS)
- TypeScript e tipagem estática
- Organização de código e boas práticas

### Objetivos

- ✅ Sistema de Lead Scoring com IA
- ✅ Interface visual com Kanban board
- ✅ API REST completa
- ✅ Princípios SOLID aplicados
- ✅ Código modular e escalável
- ✅ Análise automática com explicações

## 📝 Notas

- **Modelo IA**: `llama-3.3-70b-versatile` (Groq)
- **Banco**: PostgreSQL (Neon.tech)
- **Portas**: Backend (3001), Frontend (3000)

<img width="1930" height="941" alt="image" src="https://github.com/user-attachments/assets/53413a71-0975-4ece-ae16-46505a60f7f4" />
<img width="1878" height="1593" alt="image" src="https://github.com/user-attachments/assets/99b7dcd5-5560-429f-8a0f-e307aa9fce9c" />

---
