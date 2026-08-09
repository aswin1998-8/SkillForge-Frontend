# Honed Frontend

Next.js App Router client for Honed.

## Stack

- Next.js 15 + TypeScript (strict)
- Tailwind CSS + shadcn-style UI primitives
- Redux Toolkit + RTK Query (`credentials: "include"`)
- Monaco Editor (coding challenges)
- React Flow (architect challenges)

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Backend must be running at `NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000/api/v1`).

## AI integration

AI runs only on the Django backend. See backend `docs/AI_INTEGRATION.md` for provider abstraction, adaptive assessment, evidence, and scoring. Never put `GEMINI_API_KEY` / `CLAUDE_API_KEY` in frontend env files.

## Auth routing

- Unauthenticated → `/login`
- Authenticated, onboarding incomplete → `/onboarding`
- Onboarded → `/dashboard`

Cookies are HttpOnly JWTs set by the Django API. Do not store tokens in `localStorage`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Production

Build on the EC2 host (or CI) and run `npm run start` behind Nginx. See backend `docs/EC2_DEPLOY.md`.
