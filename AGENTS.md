# AGENTS.md

## Setup

```bash
npm run dev
```

Requires Firebase env vars in `.env.local` (not tracked in git):
- `NEXT_PUBLIC_API_KEY`, `NEXT_PUBLIC_AUTH_DOMAIN`, `NEXT_PUBLIC_PROJECT_ID`, `NEXT_PUBLIC_STORAGE_BUCKET`, `NEXT_PUBLIC_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_APP_ID`, `NEXT_PUBLIC_MESSUREMANT_ID`

## Commands

- `npm run dev` - Development server (http://localhost:3000)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - ESLint check

## Architecture

- **Framework**: Next.js 15 (App Router), React 19 RC, TypeScript
- **Styling**: Tailwind CSS + custom CSS modules
- **Auth**: Firebase Auth
- **Database**: Cloud Firestore (configured in firebase.json)
- **Icons**: FontAwesome (bundled in `src/app/awesome/`)

## Key Files

- Entry point: `src/app/page.tsx`
- Auth pages: `src/app/login/page.tsx`, `src/app/sign-in/page.tsx`
- Firebase config: `src/lib/firebaseconfig.js`

## Routes

- `/` - Home (wallpaper gallery)
- `/login` - Login page
- `/sign-in` - Sign-in page

## Notes

- No test suite configured
- No pre-commit hooks set up
- Firebase Hosting configured for `public/` directory