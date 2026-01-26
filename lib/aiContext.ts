export const AI_CONTEXT_PROMPT = `Hi! I am using the BuildSmiths StarterKit. Here is my context:

Stack: Next.js 16, Postgres (pg - raw SQL, no ORM), Tailwind v4, Shadcn UI, NextAuth v4.

Installation Checkpoints I've completed:

# 1. Clone & Enter
git clone https://github.com/buildsmiths/buildsmiths-nextjs-postgres-stripe.git my-saas
cd my-saas

# 2. Install & Configure
npm install
cp .env.example .env.local

# 3. Initialize Database (ensure Postgres is running)
npm run db:schema
npm run db:seed

# 4. Start Development
npm run dev

Codebase structure:

app: Next.js App Router
blueprints: Feature specs (Markdown)
components: React components (actions in lib)
db: SQL migrations (schema.sql)
lib: Core logic (auth, db, stripe)
scripts: DB management scripts
tests: Vitest integration/unit tests

Please assist me with adding features.

I have a 'blueprints' folder with architectural specifications (Markdown).
Please review the available blueprints and suggest an implementation plan, or we can build a custom feature.`;
