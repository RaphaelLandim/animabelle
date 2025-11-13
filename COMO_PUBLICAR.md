# 🌐 Como Publicar o Site Gratuitamente

## Opção 1: Netlify (MAIS FÁCIL - 2 minutos)

1. Acesse: https://www.netlify.com
2. Clique em "Sign up" e crie uma conta (pode usar Google/GitHub)
3. Arraste a pasta inteira do projeto para a área de "Deploy"
4. Pronto! Seu site estará no ar em segundos
5. Você receberá um link tipo: `seu-site.netlify.app`

## Opção 2: Vercel (Também muito fácil)

1. Acesse: https://vercel.com
2. Clique em "Sign up" e crie uma conta
3. Clique em "Add New Project"
4. Arraste a pasta do projeto ou conecte ao GitHub
5. Pronto! Link tipo: `seu-site.vercel.app`

## Opção 3: GitHub Pages (Gratuito e profissional)

### Passo a passo:

1. **Criar conta no GitHub:**
   - Acesse: https://github.com
   - Clique em "Sign up" e crie sua conta

2. **Criar repositório:**
   - Clique no "+" no canto superior direito
   - Escolha "New repository"
   - Nome: `anima-belle` (ou qualquer nome)
   - Marque "Public"
   - Clique em "Create repository"

3. **Fazer upload dos arquivos:**
   - No repositório criado, clique em "uploading an existing file"
   - Arraste TODOS os arquivos da pasta do projeto:
     - index.html
     - pasta css/
     - pasta imagens/
     - Flavia.JPG
   - Clique em "Commit changes"

4. **Ativar GitHub Pages:**
   - Vá em "Settings" (Configurações)
   - Role até "Pages" no menu lateral
   - Em "Source", escolha "main" branch
   - Clique em "Save"
   - Seu site estará em: `seu-usuario.github.io/anima-belle`

## Opção 4: Surge.sh (Via terminal)

1. Instale Node.js: https://nodejs.org
2. Abra o terminal na pasta do projeto
3. Digite:
   ```bash
   npm install -g surge
   surge
   ```
4. Siga as instruções

---

## 📝 Dica Importante

Antes de publicar, verifique se:
- ✅ Todas as imagens estão na pasta `imagens/`
- ✅ O arquivo CSS está em `css/style.css`
- ✅ Todos os caminhos estão corretos (relativos)

## 🎯 Recomendação

**Use Netlify** - É o mais rápido e fácil! Apenas arraste e solte a pasta.

