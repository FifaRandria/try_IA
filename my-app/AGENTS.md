# AGENTS.md - Guide pour les agents IA

## Contexte du projet

- **Framework**: Next.js 16.2.4 avec App Router
- **Runtime**: Node.js
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL via Prisma 7.7.0 (avec adapter pg)
- **IA**: OpenRouter API (Mistral 7B)

---

## Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer le serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarrer le serveur de production |
| `npm run lint` | Lancer ESLint |

**Pas de framework de test actuellement** - Si des tests sont requis, installer Vitest ou Jest.

---

## Structure du projet

```
my-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── explain/route.js
│   ├── explain/page.js   # Page principale
│   ├── page.js           # Page d'accueil
│   ├── layout.tsx        # Layout racine
│   └── generated/prisma/ # Client Prisma généré
├── lib/
│   └── prisma.js         # Instance PrismaClient singleton
├── prisma/
│   ├── schema.prisma     # Schéma de la DB
│   └── config.ts         # Configuration Prisma
└── .env                  # Variables d'environnement
```

---

## Conventions de code

### Langue
- Tout le code et commentaires en **anglais** (excepté le contenu utilisateur final)
- Nommage en **anglais**

### Import
- **Alias `@/`** pour les imports absolus depuis la racine (`@/lib/prisma`)
- Ordre recommandé: React → Next.js → libs internes → styles

### Naming
- **Composants**: PascalCase (`ExplainPage`, `ExplainContent`)
- **Fonctions/variables**: camelCase (`handleSubmit`, `explainContent`)
- **Fichiers**: kebab-case (`route.js`, `prisma.js`)

### TypeScript/JavaScript
- Mode strict activé dans `tsconfig.json`
- Préférer `.js` pour les fichiers simples, `.tsx` si JSX besoin de types
- Typer les fonctions quand évident (params,返回值)

### React Patterns
- **Server Components** par défaut (pas de `'use client'`)
- `'use client'` uniquement si hooks React (`useState`, `useEffect`, `useSearchParams`)
- `useSearchParams` **doit** être wrapé dans un `<Suspense>` avec fallback
- Utiliser des composants séparés pour isoler les comportements client

### Gestion des erreurs
- **API Routes**: Toujours avec try/catch, retourner des `Response.json({ error: ... }, { status: ... })`
- Logger les erreurs avec `console.error`
- Ne pas exposer les détails techniques aux clients

### Prisma 7.x
- Client généré dans `app/generated/prisma/`
- Initialiser avec **adapter** (pas de `url` dans le schema):
```js
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

### Tailwind CSS
- Utiliser les classes utilitaires directement dans les composants
- Éviter les styles inline sauf cas exceptionnels

---

## Variables d'environnement requis

```
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=sk-or-v1-...
```

---

## Notes importantes

### Next.js 16.x breaking changes
Cette version a des API différentes de Next.js 14/15. Lire les docs dans `node_modules/next/dist/docs/` avant d'écrire du code.

### Erreurs communes à éviter
1. **Prisma Client** - Toujours passer l'adapter au constructeur
2. **useSearchParams** - Toujours wrappé en Suspense
3. **API routes** - Toujours gérer les erreurs explicitement
4. **.env** - Non versionné, mais nécessaire pour运行

---

## Pattern API route recommandé

```js
export async function POST(req) {
  try {
    const body = await req.json()
    // ... logique
    return Response.json(result)
  } catch (error) {
    console.error('Route error:', error)
    return Response.json({ error: 'Message' }, { status: 500 })
  }
}
```