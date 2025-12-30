# 🔥 Lead Scoring com IA - Teste Técnico

Sistema de qualificação inteligente de leads utilizando análise de IA (Groq) para gerar scores de probabilidade de fechamento. Desenvolvido como teste técnico/desafio em Node.js, Express, TypeScript, React e Prisma.

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [API Endpoints](#-api-endpoints)
- [Arquitetura](#-arquitetura)
- [Scripts](#-scripts)

## 🎯 Sobre o Projeto

Teste técnico desenvolvido para demonstrar habilidades em desenvolvimento full-stack. Sistema de Lead Scoring que utiliza IA para analisar mensagens e comportamento, gerando:

- Score de 0-100 (probabilidade de fechamento)
- Classificação: Quente, Morno ou Frio
- Explicação do score (explicabilidade)
- Gestão visual via Kanban board
- Analytics e métricas

<!-- [SCREENSHOT: Tela inicial/Dashboard completo] -->

## 🛠️ Tecnologias

**Backend:**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL (Neon.tech)
- Groq SDK (llama-3.3-70b-versatile)

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS
- Lucide React (ícones)
- Recharts (gráficos)
- Vite

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

<!-- [SCREENSHOT: Interface principal - Sidebar e layout geral] -->

### Funcionalidades

- **Dashboard**: Estatísticas e Kanban board com drag-and-drop
- **Leads**: Tabela completa com ações rápidas
- **Análises**: Gráficos de distribuição, evolução e métricas
- **Análise IA**: Automática ao criar/atualizar leads
- **Re-análise**: Manual via botão de ação

<!-- [SCREENSHOT: Dashboard com estatísticas e Kanban board] -->
<!-- [SCREENSHOT: Tabela de leads com ações] -->
<!-- [SCREENSHOT: Página de análises com gráficos] -->

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

<!-- [SCREENSHOT: Modal de criação de lead - formulário] -->
<!-- [SCREENSHOT: Modal de visualização de lead com análise da IA] -->

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

<!-- [SCREENSHOT: Exemplo de código mostrando arquitetura - estrutura de pastas ou código] -->

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

<!-- [SCREENSHOT: Kanban board em ação - drag and drop] -->
<!-- [SCREENSHOT: Detalhes de um lead com score e classificação] -->

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
- **Hot Reload**: Habilitado em desenvolvimento

<!-- [SCREENSHOT: Gráficos de análise - distribuições e evolução] -->
<!-- [SCREENSHOT: TimePicker customizado em ação] -->

---