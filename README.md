# Status Page 2.0

Uma página de status moderna e responsiva para monitoramento de serviços em tempo real.

## Características

- 🚦 Monitoramento em tempo real
- 🔐 Autenticação segura
- 📱 Design responsivo
- 🌐 PWA (Progressive Web App)
- 🔄 Atualizações automáticas
- 📊 Histórico de incidentes
- 🌍 Suporte a múltiplos países
- 📨 Sistema de notificações

## Tecnologias

- React 18
- TypeScript
- Vite
- Supabase
- Tailwind CSS
- Shadcn/ui
- React Router
- PWA

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

## Configuração

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/statuspage-2.0.git
cd statuspage-2.0
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas credenciais do Supabase.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React
  ├── hooks/         # Custom hooks
  ├── lib/           # Bibliotecas e configurações
  ├── pages/         # Páginas da aplicação
  ├── types/         # Definições de tipos TypeScript
  └── utils/         # Funções utilitárias
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
