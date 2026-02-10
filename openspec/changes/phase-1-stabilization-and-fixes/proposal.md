# Change: Phase 1 - Stabilisation et Corrections Critiques

## Why

Le projet "Les Chanteurs" a atteint son état MVP avec deux applications fonctionnelles (public + admin). Cependant, une analyse approfondie révèle plusieurs bugs critiques, incohérences UX/UI, et lacunes de qualité de code qui doivent être corrigés avant d'ajouter de nouvelles fonctionnalités ou de déployer en production.

**Problèmes Identifiés:**

1. **Bugs Critiques Navigation** (Bloquant UX)
   - Breadcrumbs incorrects sur `/playlist/[id]` et `/song/[id]` (pointent vers "/events" au lieu de "/playlists" et "/songs")
   - Footer dupliqué sur la page `/events` (conflit avec PublicFooter du layout)
   - Lien d'ancre cassé dans CtaSection (`href="#events"` ne mène nulle part)

2. **Incohérences UX/UI** (Gênant mais non-bloquant)
   - Opérations en masse disponibles uniquement sur Songs (pas sur Playlists ni Events)
   - Vues de liste différentes: Songs/Playlists utilisent DataTable, Events utilise des Cards custom
   - Flux de création inconsistants: Playlists redirige vers /edit après création, Songs/Events retournent à la liste
   - Couleurs dark mode variables (`dark:bg-black`, `dark:bg-zinc-950`, `dark:bg-zinc-900`) selon les pages

3. **Qualité du Code** (Dette technique)
   - Types `any` dans plusieurs server actions (exemple: `createSongAction(data: any)`)
   - Code dupliqué dans les trois `archive-list-client.tsx` (songs/playlists/events)
   - Validation dispersée entre client et serveur sans schéma unifié
   - Pas de documentation JSDoc sur les fonctions publiques
   - Magic numbers/strings non documentés (exemple: 14 jours auto-archive)

4. **Lacunes Architecturales** (Bloque la scalabilité)
   - Pas de gestion d'erreurs globale (error boundary)
   - Pas de tests automatisés (unit, integration, e2e)
   - Pas de validation unifiée avec schéma (Zod recommandé)
   - Pas de logging structuré pour le debugging production

**Impact Utilisateur:**
- Admins: Confusion navigation, incohérence d'expérience, difficulté à apprendre le système
- Visiteurs publics: Frustration avec breadcrumbs incorrects, footer dupliqué visuellement bizarre
- Développeurs: Dette technique ralentit les évolutions futures, risque de régression

**Urgence:**
Ces problèmes doivent être résolus **avant** d'ajouter de nouvelles fonctionnalités (analytics, search, multi-users) car ils représentent des fondations instables.

---

## What Changes

Cette phase se concentre sur **4 piliers de stabilisation**:

### 1. Corrections de Bugs Critiques

**1.1 Navigation Publique**
- Corriger breadcrumbs sur `/playlist/[id]` (doit montrer "Playlists" -> nom)
- Corriger breadcrumbs sur `/song/[id]` (doit montrer "Songs" -> nom)
- Supprimer footer dupliqué dans `app/(public)/events/page.tsx` (lignes 71-77)
- Corriger ou supprimer ancre `#events` dans CtaSection

**1.2 Cohérence Dark Mode**
- Standardiser toutes les pages sur `dark:bg-zinc-950` (background principal)
- Documenter la palette dark mode dans `openspec/project.md`
- Créer des classes Tailwind personnalisées si nécessaire (exemple: `bg-page-main`)

**1.3 Headers de Pages**
- Créer un composant `PageHeader` unifié dans `shared/ui/`
- Migrer Events, Playlists, Songs pour utiliser ce composant
- Standardiser: Icon + Title + Description optionnelle

### 2. Harmonisation UX/UI

**2.1 Vues de Liste**
- Décider: Est-ce que Events devrait utiliser DataTable ou garder les Cards?
  - **Recommandation**: Garder Cards pour Events (contenu riche: date, lieu, badge "current")
  - **Action**: Documenter la décision dans design.md
- Si Cards pour Events: Créer un composant `EventCard` réutilisable
- Ajouter une note dans la spec expliquant pourquoi Events diffère

**2.2 Opérations en Masse**
- Décider: Ajouter bulk actions à Playlists/Events ou documenter pourquoi Songs-only?
  - **Recommandation**: Ajouter à Playlists (archive, toggle visibility)
  - **Recommandation**: NE PAS ajouter à Events (cas d'usage rare, risque d'erreur bulk)
- Si ajout: Créer composant générique `BulkActionsBar<T>` typé
- Documenter les décisions dans `specs/back-office/spec.md`

**2.3 Flux de Création**
- Décider: Uniformiser les redirections après création
  - **Option A**: Tout vers /edit (permet d'ajouter relations immédiatement)
  - **Option B**: Tout vers liste (flux simple, modifier après si besoin)
  - **Option C**: Contextuel (Songs -> liste, Playlists/Events -> edit)
- Implémenter le flux choisi de manière cohérente
- Documenter dans design.md

### 3. Amélioration Qualité du Code

**3.1 Type Safety**
- Remplacer tous les `any` types par des interfaces explicites
- Créer types pour tous les server action payloads
- Utiliser `ActionResponse<T>` pour typer les retours actions

**3.2 Validation Unifiée avec Zod**
- Installer Zod: `bun add zod`
- Créer schémas de validation dans `shared/lib/validation/`
- Utiliser dans server actions ET client-side forms
- Remplacer les fonctions `validateSong`, `validatePlaylist`, etc. par schémas Zod

**3.3 Refactoring Code Dupliqué**
- Créer un composant générique `ArchiveListClient<T>` dans `shared/ui/`
- Paramétrer avec: entity type, columns, restore action
- Migrer songs/playlists/events/archive pour utiliser ce composant
- Supprimer les 3 fichiers dupliqués

**3.4 Documentation Code**
- Ajouter JSDoc sur toutes les fonctions exportées de `shared/lib/`
- Documenter les constantes magiques
- Ajouter commentaires explicatifs sur logique complexe (reordering, auto-archive)

### 4. Infrastructure Qualité

**4.1 Gestion d'Erreurs Globale**
- Créer un `ErrorBoundary` React dans `shared/ui/error-boundary.tsx`
- Ajouter dans root layout `app/layout.tsx`
- Logger les erreurs de manière structurée (console en dev, service externe en prod)
- Afficher une UI gracieuse aux utilisateurs

**4.2 Tests de Base**
- Configurer Bun test pour les tests unitaires
- Ajouter tests pour les schémas Zod
- Ajouter tests pour les fonctions de validation critiques
- Ajouter tests pour les server actions (success + error cases)
- **Objectif**: 30% de couverture minimale sur `shared/lib/`

**4.3 Linting & Formatting**
- Configurer ESLint strict mode (si pas déjà fait)
- Ajouter Prettier pour formatting automatique
- Créer scripts: `npm run lint:fix`, `npm run format`
- Documenter dans README.md

**4.4 Pre-commit Hooks**
- Installer Husky: `bun add -D husky lint-staged`
- Configurer pre-commit hooks:
  - Lint staged files
  - Run type-check
  - Run tests on affected files
- Documenter dans README.md

---

## Impact

### Affected Specs

- **public-website** - Corrections breadcrumbs, footer, dark mode
- **back-office** - Harmonisation UX, bulk actions, types
- **ui-library** - Nouveaux composants (PageHeader, ErrorBoundary, ArchiveListClient)
- **testing** - Nouvelle capability (ajout tests)

### Affected Code

**Corrections:**
- `/app/(public)/playlist/[id]/playlist-display.tsx` (breadcrumbs)
- `/app/(public)/song/[id]/lyrics-display.tsx` (breadcrumbs)
- `/app/(public)/events/page.tsx` (footer dupliqué)
- `/widgets/public-cta-section/cta-section.tsx` (ancre)
- Multiple pages (dark mode standardization)

**Nouveaux Composants:**
- `/shared/ui/page-header.tsx`
- `/shared/ui/error-boundary.tsx`
- `/shared/ui/archive-list-client.tsx` (générique)
- `/shared/ui/bulk-actions-bar.tsx` (amélioration si générique)

**Validation:**
- `/shared/lib/validation/song.ts` (nouveau)
- `/shared/lib/validation/playlist.ts` (nouveau)
- `/shared/lib/validation/event.ts` (nouveau)
- `/shared/types/actions.ts` (nouveau)

**Tests:**
- `/shared/lib/validation/*.test.ts` (nouveaux)
- `/shared/lib/songs.test.ts` (nouveau)
- `/shared/lib/playlists.test.ts` (nouveau)
- `/shared/lib/events.test.ts` (nouveau)

**Archive Refactoring:**
- Supprimer: `app/(admin)/admin/songs/archive/archive-list-client.tsx`
- Supprimer: `app/(admin)/admin/playlists/archive/archive-list-client.tsx`
- Supprimer: `app/(admin)/admin/events/archive/archive-list-client.tsx`
- Remplacer par: `shared/ui/archive-list-client.tsx` (générique)

### Database Changes

**Aucun** - Pas de changement de schéma nécessaire pour cette phase.

### Dependencies Added

- `zod` - Schema validation
- `husky` (dev) - Git hooks
- `lint-staged` (dev) - Pre-commit linting
- `prettier` (dev) - Code formatting (optionnel)

### User Impact

**Admins:**
- Navigation plus cohérente et prévisible
- Expérience unifiée entre Songs/Playlists/Events
- Moins de confusion sur les flux de création
- Meilleure gestion d'erreurs (messages clairs)

**Visiteurs Publics:**
- Breadcrumbs corrects (navigation intuitive)
- Pas de footer dupliqué (visuel propre)
- Dark mode cohérent sur toutes les pages
- Moins de bugs visuels

**Développeurs:**
- Code plus maintenable (moins de duplication)
- Types stricts (moins de bugs runtime)
- Tests automatisés (confiance dans les changements)
- Documentation claire (onboarding facilité)

### Breaking Changes

**Aucun** - Tous les changements sont rétro-compatibles ou corrigent des bugs.

---

## Success Criteria

Cette phase est considérée **réussie** quand:

**Bugs Critiques:**
- [ ] Tous les breadcrumbs naviguent correctement
- [ ] Aucun footer dupliqué visible
- [ ] Tous les liens/ancres fonctionnent
- [ ] Dark mode cohérent sur 100% des pages

**Qualité Code:**
- [ ] Aucun type `any` dans le code (0 occurrences)
- [ ] Tous les server actions utilisent Zod validation
- [ ] Couverture de tests >= 30% sur `shared/lib/`
- [ ] Aucune duplication de code dans archive clients

**Infrastructure:**
- [ ] ErrorBoundary installé et testé
- [ ] Pre-commit hooks fonctionnent
- [ ] `npm run lint` passe sans erreur
- [ ] `npm run test` passe sans erreur

**Documentation:**
- [ ] Design.md documente toutes les décisions UX
- [ ] JSDoc sur 100% des fonctions exportées de `shared/lib/`
- [ ] README.md mis à jour avec nouveaux scripts
- [ ] openspec/project.md documente palette dark mode

---

## Migration Risk

**Faible** - Tous les changements sont additifs ou correctifs
**Pas de breaking changes** pour les utilisateurs
**Tests** valident les régressions
