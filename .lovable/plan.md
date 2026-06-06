# Objetivo
Corrigir o `404: NOT_FOUND` no Vercel com diagnóstico preciso da causa real antes de qualquer nova mudança de código.

# Diagnóstico atual
A evidência mais forte é esta combinação:
- o deploy fica **Ready**
- o domínio abre a tela padrão de **404 do Vercel**
- o painel mostra **Function Invocations: 0**
- no repositório já existem as rotas TanStack Start (`/`, `/jogar`, `/tutorial`, `/dashboard`, `/sobre`)
- o projeto já está com Vite/Nitro configurado para TanStack Start

Isso aponta que o problema mais provável **não está nas rotas do app**, e sim no fato de o Vercel **não estar publicando/roteando a saída SSR correta**. Em outras palavras: o Vercel está tratando o projeto com uma configuração de build/output errada, então nenhuma função SSR é criada ou exposta, por isso há 0 invocações e o domínio cai no 404 nativo da plataforma.

# O que vou validar e corrigir
1. **Conferir o lado do código apenas no que impacta deploy**
   - garantir que a configuração do Vite continua na forma canônica para TanStack Start + Nitro
   - revisar bootstrap do router e boundaries para descartar 404 gerado pelo app
   - confirmar que não restou arquivo de deploy conflitante no repositório

2. **Tratar a causa mais provável no Vercel: configuração salva do projeto**
   - orientar a zerar overrides de **Build Command**, **Output Directory** e **Install Command**
   - conferir se **Root Directory** não está errado
   - confirmar o preset/framework detectado automaticamente pelo Vercel, sem forçar saída estática

3. **Validar o output esperado do deploy**
   - o Vercel precisa publicar o output SSR/Nitro, não `dist` estático puro
   - se o painel Source/Output mostrar saída incompatível, ajustar a configuração para auto-detecção correta

4. **Se ainda houver risco no código, aplicar uma rodada final de endurecimento**
   - deixar a configuração de deploy no formato mínimo e canônico
   - remover qualquer sobra que possa induzir detecção errada de framework
   - manter o app sem artefatos de Netlify/SPA rewrite indevidos

# Resultado esperado
Após isso, o deploy no Vercel deve:
- parar de cair no 404 nativo da plataforma
- passar a registrar **Function Invocations > 0** ao abrir a home
- servir as rotas SSR do TanStack Start normalmente

# Detalhe técnico
O ponto-chave aqui é: **404 do Vercel com 0 invocações** normalmente significa que a requisição **nem chegou no app SSR**. Se fosse erro de rota React/TanStack, haveria execução do app/função; aqui o sintoma indica falha de publicação/output/configuração do projeto no próprio Vercel.

# O que preciso confirmar na implementação
Quando eu entrar em modo de build, vou revisar e alinhar somente o necessário para deploy direto, com foco em:
- `vite.config.ts`
- `src/start.ts`
- `src/router.tsx`
- `src/routes/__root.tsx`
- quaisquer artefatos residuais de deploy que ainda possam confundir o Vercel