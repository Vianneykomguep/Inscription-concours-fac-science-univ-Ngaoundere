# Plateforme d'Inscription en Ligne aux Concours
## Faculté des Sciences — Université de Ngaoundéré

### Prérequis
- Node.js 18+
- PostgreSQL 15+

### Installation
```bash
npm install
cp .env.example .env   # Configurer les variables
npx prisma generate
npx prisma db push
npm run dev
```

### Créer un admin
```bash
npx prisma db seed
# Ou manuellement dans la base: UPDATE users SET role='SUPER_ADMIN' WHERE email='admin@univ-ndere.cm';
```

### Structure
- `src/app/` — Pages et API routes (Next.js App Router)
- `src/components/` — Composants réutilisables
- `src/lib/` — Utilitaires (auth, prisma, email, upload, validations)
- `prisma/schema.prisma` — Schéma de la base de données

### Fonctionnalités
- ✅ Authentification candidat (email + OTP)
- ✅ Formulaire de candidature multi-étapes (wizard 6 étapes)
- ✅ Upload de documents et quitus de paiement
- ✅ Dashboard candidat avec suivi des candidatures
- ✅ Dashboard admin avec gestion des dossiers
- ✅ Validation/rejet/demande de complément
- ✅ Notifications email automatiques
- ✅ Gestion des concours (CRUD admin)
- ✅ Système de rôles (Candidat, Agent, Responsable, Super Admin)
