# Painel de edição do site

O painel fica em **`/#/painel`** (ex.: `https://seusite.com.br/#/painel`). Nenhum link do site
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

No primeiro **Salvar alterações** do painel, o conteúdo atual do site é gravado no banco. A partir
daí, tudo que ela editar aparece no site na hora, sem precisar publicar de novo.

## Limites do plano gratuito

- Arquivos de até 50 MB por envio (vídeos curtos, em MP4).
- 1 GB de armazenamento para fotos e vídeos.
