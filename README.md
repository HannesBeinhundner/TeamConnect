# To run in localhost do
- `npm install`
- `npm run dev`  

# Commands used in development for Teamconnect

## When sucessfully cloned do
- `npm install`
- `npx prisma generate`

## dokku
- `git remote add dokku ssh://dokku@projects.multimediatechnology.at:5412/teamconnect` -> add remote repository for dokku server
- `git push dokku main` -> deploy the **latest remote repository** on dokku
- `dokku logs` -> show logs on the dokku server
- `dokku config:set VAR=VAL` -> sets Environment Variable on the server. For Example: `dokku config:set NEXT_PUBLIC_SUPABASE_URL=https://obzkgvlivaejqetvdrjk.supabase.co`
- `dokku cache:clear` -> clear the cache and ENV Varbiales on the server

## prisma
- `npx prisma migrate dev` ->  applies pending database migrations to synchronize the database schema with changes in your Prisma schema
- `npx prisma generate` -> Once you have saved your schema, use the Prisma CLI to generate the Prisma
- `npx prisma db pull` -> connects to your database and adds Prisma models to your Prisma schema that reflect the current database schema
- `npx prisma db push` -> pushes the state of your Prisma schema file to the database without using migrations. It creates the database if the database does not exist.
- `npx prisma db seed` -> seeds the database with dummy data
- `npx prisma format` -> reformats the migration file.

## create project
- `npx create-next-app@14.01 -e with-supabase`

## npm packages
- `npm install next-auth`
- `npm install @mui/material-nextjs @emotion/cache`
- `npm install @mui/material @emotion/react @emotion/styled --save`
- `npm install @mui/icons-material`
- `npm install prisma@5.9 --save-dev`
- `npm install @prisma/client @auth/prisma-adapter`

## Maybe tools/packages
- kqselq -> Querry builder
- Resend -> for emails
- trcp

