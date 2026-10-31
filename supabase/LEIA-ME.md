# Painel de edição do site

O painel fica em **`/painel`** (ex.: `https://seusite.com.br/painel`). Nenhum link do site
leva até ele, mas quem protege o conteúdo é o login: sem a conta da advogada, ninguém consegue
salvar nada, mesmo que descubra o endereço.

## Configuração (uma vez só)

1. Crie uma conta gratuita em https://supabase.com e um projeto novo.
2. **SQL Editor** > New query > cole o conteúdo de `configurar.sql` > Run.
3. **Authentication > Sign In / Providers**: desative **Allow new users to sign up**.
   Assim ninguém consegue criar conta pelo site.
4. **Authentication > Users > Add user > Create new user**: e-mail e senha da advogada,
   marcando **Auto Confirm User**.
5. De volta ao **SQL Editor**, autorize essa conta a editar (troque o e-mail):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'email-da-advogada@exemplo.com';
   ```

6. **Authentication > URL Configuration**: em **Site URL** coloque o endereço do site publicado.
   É para lá que o link de "Esqueci minha senha" leva.
7. **Project Settings > API**: copie a **Project URL** e a chave **anon public** e crie o arquivo
   `.env` na pasta `siteheloa` (use `.env.example` como modelo). Na hospedagem (Vercel, Netlify
   etc.), cadastre as mesmas duas variáveis.
8. Reinicie o `npm start` (ou publique de novo) para o site ler o `.env`.
9. **SQL Editor** > New query > cole o conteúdo de `seguranca.sql` > Run. Ele libera a gravação para a
   conta autorizada e limita tamanho e formato dos arquivos. Sem esse passo, publicar pelo painel falha.

No primeiro **Salvar alterações** do painel, o conteúdo atual do site é gravado no banco. A partir
daí, tudo que ela editar aparece no site na hora, sem precisar publicar de novo.

## E-mail de recuperação de senha

O envio gratuito do Supabase só entrega para a equipe do projeto. Para o "Esqueci minha senha" chegar
à advogada, o Supabase envia pelo próprio Gmail dela, sem custo:

1. Na conta Google dela, ative a **Verificação em duas etapas** e crie uma **senha de app** em
   https://myaccount.google.com/apppasswords.
2. No Supabase, abra **Authentication > Emails > SMTP Settings**, ative **Enable custom SMTP** e preencha:
   - **Sender email** e **Username**: o Gmail dela
   - **Sender name**: Painel do site
   - **Host**: `smtp.gmail.com`
   - **Port**: `465`
   - **Password**: a senha de app (não é a senha do Gmail)

A senha de app é secreta: fica só no Supabase, nunca no código.

## Limites do plano gratuito

- Arquivos de até 50 MB por envio (vídeos curtos, em MP4).
- 1 GB de armazenamento para fotos e vídeos.
