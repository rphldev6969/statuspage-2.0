# Status Page

Uma página de status moderna e responsiva construída com React, TypeScript e Supabase.

## 🚀 Funcionalidades

- 📊 Dashboard administrativo para gerenciamento de componentes e incidentes
- 🔒 Autenticação segura com Supabase
- 🌍 Suporte a múltiplos países para Payin e Payout
- 📱 Design responsivo e moderno com Shadcn/UI
- 🔄 Atualizações em tempo real do status dos componentes
- 📝 Histórico detalhado de incidentes
- 🎨 Interface intuitiva e amigável

## 🛠️ Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- Supabase
- Shadcn/UI
- TailwindCSS
- React Router DOM
- Date-fns
- Lucide Icons

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/status-page.git
cd status-page
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

4. Execute o projeto:
```bash
npm run dev
```

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza o Supabase como banco de dados e backend. As principais tabelas são:

- `components`: Armazena os componentes do sistema
- `incidents`: Registra os incidentes
- `incident_updates`: Mantém o histórico de atualizações dos incidentes

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia o [guia de contribuição](CONTRIBUTING.md) primeiro.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- [@seu-usuario](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- [Shadcn/UI](https://ui.shadcn.com/) pela excelente biblioteca de componentes
- [Supabase](https://supabase.com/) pela plataforma de backend
- [Vite](https://vitejs.dev/) pelo excelente bundler
