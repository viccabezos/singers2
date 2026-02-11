## 1. Corrections Bugs Critiques Navigation

### 1.1 Breadcrumbs Playlist/Song
- [ ] 1.1.1 Lire `/app/(public)/playlist/[id]/playlist-display.tsx` et corriger breadcrumbs (ligne 20)
- [ ] 1.1.2 Changer `href: "/events"` vers `href: "/playlists"` et label "Events" vers "Playlists"
- [ ] 1.1.3 Lire `/app/(public)/song/[id]/lyrics-display.tsx` et corriger breadcrumbs (ligne 53)
- [ ] 1.1.4 Changer `href: "/events"` vers `href: "/songs"` et label "Events" vers "Songs"
- [ ] 1.1.5 Tester la navigation sur toutes les pages pour vérifier les breadcrumbs

### 1.2 Footer Dupliqué
- [ ] 1.2.1 Lire `/app/(public)/events/page.tsx` et identifier le footer dupliqué (lignes 71-77)
- [ ] 1.2.2 Supprimer le bloc footer dupliqué
- [ ] 1.2.3 Vérifier que le PublicFooter du layout s'affiche correctement
- [ ] 1.2.4 Tester visuellement sur mobile et desktop

### 1.3 Ancre CTA Section
- [ ] 1.3.1 Lire `/widgets/public-cta-section/cta-section.tsx` et identifier l'ancre #events (ligne 28)
- [ ] 1.3.2 Analyser: soit ajouter id="events" sur la section events, soit supprimer/changer l'ancre
- [ ] 1.3.3 Implémenter la solution choisie
- [ ] 1.3.4 Tester le lien au clic

### 1.4 Standardisation Dark Mode
- [ ] AVANT TOUT ajouter le bouton pour switch au dark mode sur admin et sur public projet. (il doit garder le status avec le navigateur exemple : le menu de ládmin )
- [ ] 1.4.1 Audit de toutes les pages pour lister les backgrounds dark mode utilisés
- [ ] 1.4.2 Créer liste des fichiers à modifier:
  - [ ] Event detail: changer `dark:bg-black` vers `dark:bg-zinc-950`
  - [ ] Playlist detail: changer `dark:bg-black` vers `dark:bg-zinc-950`
  - [ ] Song detail: changer `dark:bg-black` vers `dark:bg-zinc-950`
  - [ ] Events list: vérifier cohérence
  - [ ] Playlists list: vérifier cohérence
  - [ ] Songs list: vérifier cohérence
- [ ] 1.4.3 Appliquer les corrections
- [ ] 1.4.4 Tester sur tous les modes (light/dark) sur toutes les pages
- [ ] 1.4.5 Documenter la palette dans `openspec/project.md`

## 2. Harmonisation UX/UI

### 2.1 Décision UX - Events Cards vs DataTable
- [ ] 2.1.1 Analyser pourquoi Events utilise Cards et Songs/Playlists utilisent DataTable, NON , c'est fait express 
- [ ] 2.1.2 Décision: Garder Cards ou migrer vers DataTable? NON, c'est fait express
- [ ] 2.1.3 Documenter la décision dans `openspec/changes/phase-1-stabilization-and-fixes/design.md` OUI
- [ ] 2.1.4 Si migration DataTable: implémenter et tester NO
- [ ] 2.1.5 Si Cards: créer composant `EventCard` réutilisable OUI

### 2.2 Décision UX - Bulk Actions
- [ ] 2.2.1 Analyser si Playlists aurait besoin de bulk actions (archive, visibility toggle) NO pas besoin
- [ ] 2.2.2 Analyser si Events aurait besoin de bulk actions DONE check
- [ ] 2.2.3 Décision: Ajouter à Playlists? Events? Aucun? Aucun
- [ ] 2.2.4 Documenter dans design.md
- [ ] 2.2.5 Si ajout: implémenter et tester

### 2.3 Décision UX - Flux de Création
- [ ] 2.3.1 Analyser flux actuels:
  - Songs: Create -> Back to list
  - Playlists: Create -> Redirect to edit
  - Events: Create -> Back to list
- [ ] 2.3.2 Décision: Uniformiser vers quelle option?
  - Option A: Tout vers /edit
  - Option B: Tout vers liste
  - Option C: Garder contextuel
- [ ] 2.3.3 Documenter dans design.md
- [ ] 2.3.4 Implémenter la décision
- [ ] 2.3.5 Tester les flux de création pour chaque entité

### 2.4 Composant PageHeader Unifié
- [ ] 2.4.1 Analyser headers actuels sur Events, Playlists, Songs pages
- [ ] 2.4.2 Créer composant `shared/ui/page-header.tsx`
  - Props: icon?, title, description?, actions?
- [ ] 2.4.3 Migrer Events page pour utiliser PageHeader
- [ ] 2.4.4 Migrer Playlists page pour utiliser PageHeader
- [ ] 2.4.5 Migrer Songs page pour utiliser PageHeader
- [ ] 2.4.6 Tester visuellement cohérence

## 3. Type Safety & Validation

### 3.1 Installation Zod
- [ ] 3.1.1 Installer Zod: `bun add zod`
- [ ] 3.1.2 Créer structure dossiers: `shared/lib/validation/`
- [ ] 3.1.3 Créer `shared/types/actions.ts` pour types génériques

### 3.2 Remplacement Types `any`
- [ ] 3.2.1 Audit de tous les fichiers pour trouver les `any` types
- [ ] 3.2.2 Créer interfaces explicites pour server action payloads
- [ ] 3.2.3 Remplacer `any` par interfaces typées dans:
  - [ ] Songs actions
  - [ ] Playlists actions
  - [ ] Events actions
  - [ ] Settings actions
- [ ] 3.2.4 Créer type `ActionResponse<T>`
- [ ] 3.2.5 Tester compilation TypeScript (pas d'erreur)

### 3.3 Schémas Zod
- [ ] 3.3.1 Créer `shared/lib/validation/song.ts`
  - Schéma createSongSchema
  - Schéma updateSongSchema
  - Types inférés
- [ ] 3.3.2 Créer `shared/lib/validation/playlist.ts`
- [ ] 3.3.3 Créer `shared/lib/validation/event.ts`
- [ ] 3.3.4 Créer `shared/lib/validation/settings.ts`
- [ ] 3.3.5 Créer `shared/lib/validation/index.ts` (exports)
- [ ] 3.3.6 Tester validation avec cas valides et invalides

### 3.4 Intégration Zod dans Server Actions
- [ ] 3.4.1 Mettre à jour songs actions pour utiliser Zod
- [ ] 3.4.2 Mettre à jour playlists actions pour utiliser Zod
- [ ] 3.4.3 Mettre à jour events actions pour utiliser Zod
- [ ] 3.4.4 Mettre à jour settings actions pour utiliser Zod
- [ ] 3.4.5 Supprimer anciennes fonctions validateSong, etc.
- [ ] 3.4.6 Tester toutes les actions (succès et erreurs)

### 3.5 Intégration Zod dans Client Forms
- [ ] 3.5.1 Mettre à jour SongForm pour utiliser schéma Zod
- [ ] 3.5.2 Mettre à jour PlaylistForm pour utiliser schéma Zod
- [ ] 3.5.3 Mettre à jour EventForm pour utiliser schéma Zod
- [ ] 3.5.4 Mettre à jour SettingsForm pour utiliser schéma Zod
- [ ] 3.5.5 Tester validation client-side

## 4. Refactoring Code Dupliqué

### 4.1 Analyse Archive Clients
- [ ] 4.1.1 Lire `app/(admin)/admin/songs/archive/archive-list-client.tsx`
- [ ] 4.1.2 Lire `app/(admin)/admin/playlists/archive/archive-list-client.tsx`
- [ ] 4.1.3 Lire `app/(admin)/admin/events/archive/archive-list-client.tsx`
- [ ] 4.1.4 Identifier patterns communs et différences

### 4.2 Composant ArchiveListClient Générique
- [ ] 4.2.1 Créer `shared/ui/archive-list-client.tsx`
  - Props génériques: EntityType, columns, restoreAction
  - Support checkboxes pour bulk restore (si applicable)
  - Support pagination
- [ ] 4.2.2 Créer types nécessaires dans `shared/types/archive.ts`
- [ ] 4.2.3 Implémenter logique générique
- [ ] 4.2.4 Tester avec données mock

### 4.3 Migration
- [ ] 4.3.1 Mettre à jour Songs archive page pour utiliser ArchiveListClient générique
- [ ] 4.3.2 Mettre à jour Playlists archive page pour utiliser ArchiveListClient générique
- [ ] 4.3.3 Mettre à jour Events archive page pour utiliser ArchiveListClient générique
- [ ] 4.3.4 Tester fonctionnalité restore sur chaque entité
- [ ] 4.3.5 Supprimer anciens fichiers dupliqués
- [ ] 4.3.6 Vérifier qu'aucune référence aux anciens fichiers ne reste

## 5. Documentation Code

### 5.1 JSDoc sur shared/lib/
- [ ] 5.1.1 Lire tous les fichiers dans `shared/lib/`
- [ ] 5.1.2 Ajouter JSDoc sur fonctions exportées:
  - [ ] Description
  - [ ] @param tags
  - [ ] @returns tags
  - [ ] @throws tags (si applicable)
  - [ ] @example (si complexe)
- [ ] 5.1.3 Focus sur fonctions critiques:
  - [ ] getSongs, getPlaylists, getEvents
  - [ ] All server actions
  - [ ] Utility functions
- [ ] 5.1.4 Vérifier avec `npx typedoc` (optionnel)

### 5.2 Constantes Magiques
- [ ] 5.2.1 Identifier toutes les constantes magiques
  - [ ] 14 jours auto-archive
  - [ ] Limites pagination
  - [ ] Timeouts
  - [ ] Autres nombres/strings hardcodés
- [ ] 5.2.2 Créer `shared/lib/constants.ts`
- [ ] 5.2.3 Déplacer constantes avec JSDoc explicatif
- [ ] 5.2.4 Remplacer utilisations par imports
- [ ] 5.2.5 Tester qu'aucune régression

### 5.3 Design.md
- [ ] 5.3.1 Créer `openspec/changes/phase-1-stabilization-and-fixes/design.md`
- [ ] 5.3.2 Documenter décisions UX:
  - Events Cards vs DataTable
  - Bulk actions scope
  - Flux de création
- [ ] 5.3.3 Documenter choix techniques:
  - Pourquoi Zod
  - Architecture ArchiveListClient
  - ErrorBoundary pattern
- [ ] 5.3.4 Documenter constants importantes

### 5.4 Mise à jour Project.md
- [ ] 5.4.1 Ajouter section Dark Mode Palette
- [ ] 5.4.2 Documenter: `dark:bg-zinc-950` comme background principal
- [ ] 5.4.3 Documenter usage `dark:bg-zinc-900` pour sections alternées
- [ ] 5.4.4 Documenter usage `dark:bg-zinc-800` pour cards/surfaces

## 6. Infrastructure Qualité

### 6.1 ErrorBoundary
- [ ] 6.1.1 Créer `shared/ui/error-boundary.tsx`
  - Class component avec componentDidCatch
  - Fallback UI gracieuse
  - Error logging
- [ ] 6.1.2 Créer `shared/ui/error-fallback.tsx` (composant UI)
- [ ] 6.1.3 Intégrer dans `app/layout.tsx`
- [ ] 6.1.4 Tester avec erreur simulée
- [ ] 6.1.5 Vérifier fallback s'affiche correctement

### 6.2 Tests Unit Zod Schemas
- [ ] 6.2.1 Créer `shared/lib/validation/song.test.ts`
  - Test cas valides
  - Test cas invalides (titre vide, lyrics vide)
  - Test edge cases
- [ ] 6.2.2 Créer `shared/lib/validation/playlist.test.ts`
- [ ] 6.2.3 Créer `shared/lib/validation/event.test.ts`
- [ ] 6.2.4 Créer `shared/lib/validation/settings.test.ts`
- [ ] 6.2.5 Lancer tests: `bun test`
- [ ] 6.2.6 Objectif: tous les tests passent

### 6.3 Tests Fonctions Lib
- [ ] 6.3.1 Créer `shared/lib/songs.test.ts`
  - Test CRUD operations
  - Test filtres
  - Test edge cases
- [ ] 6.3.2 Créer `shared/lib/playlists.test.ts`
- [ ] 6.3.3 Créer `shared/lib/events.test.ts`
- [ ] 6.3.4 Lancer tests: `bun test`
- [ ] 6.3.5 Objectif: 30% couverture sur shared/lib/

### 6.4 Tests Server Actions
- [ ] 6.4.1 Créer tests pour songs actions
- [ ] 6.4.2 Créer tests pour playlists actions
- [ ] 6.4.3 Créer tests pour events actions
- [ ] 6.4.4 Tester cas succès et erreurs
- [ ] 6.4.5 Lancer tests: `bun test`

### 6.5 ESLint Configuration
- [ ] 6.5.1 Vérifier configuration ESLint actuelle
- [ ] 6.5.2 Si pas strict: configurer mode strict
- [ ] 6.5.3 Ajouter règles:
  - no-explicit-any
  - prefer-const
  - no-unused-vars
- [ ] 6.5.4 Créer script: `npm run lint:fix`
- [ ] 6.5.5 Lancer linting: `npm run lint`
- [ ] 6.5.6 Corriger toutes les erreurs

### 6.6 Prettier (Optionnel)
- [ ] 6.6.1 Installer Prettier: `bun add -D prettier`
- [ ] 6.6.2 Créer `.prettierrc`
- [ ] 6.6.3 Créer `.prettierignore`
- [ ] 6.6.4 Ajouter script: `npm run format`
- [ ] 6.6.5 Formatter tout le code
- [ ] 6.6.6 Vérifier pas de régression

### 6.7 Pre-commit Hooks
- [ ] 6.7.1 Installer Husky: `bun add -D husky`
- [ ] 6.7.2 Installer lint-staged: `bun add -D lint-staged`
- [ ] 6.7.3 Initialiser Husky: `bunx husky init`
- [ ] 6.7.4 Créer `.husky/pre-commit`
- [ ] 6.7.5 Configurer lint-staged dans package.json
- [ ] 6.7.6 Tester pre-commit hook
- [ ] 6.7.7 Documenter dans README.md

### 6.8 README Update
- [ ] 6.8.1 Ajouter section Testing
- [ ] 6.8.2 Ajouter section Linting
- [ ] 6.8.3 Ajouter section Pre-commit Hooks
- [ ] 6.8.4 Documenter nouveaux scripts npm

## 7. Validation Finale

### 7.1 Tests Manuels Complets
- [ ] 7.1.1 Tester navigation publique complète
  - [ ] Home -> Events -> Event Detail
  - [ ] Home -> Playlists -> Playlist Detail
  - [ ] Home -> Songs -> Song Detail
  - [ ] Vérifier breadcrumbs sur chaque page
  - [ ] Vérifier dark mode sur chaque page
- [ ] 7.1.2 Tester navigation admin
  - [ ] Login -> Dashboard -> All sections
  - [ ] CRUD operations pour Songs
  - [ ] CRUD operations pour Playlists
  - [ ] CRUD operations pour Events
  - [ ] Test archive/restore
  - [ ] Test bulk actions

### 7.2 Tests Automatisés
- [ ] 7.2.1 Lancer tout la suite de tests: `bun test`
- [ ] 7.2.2 Vérifier 30% couverture minimale
- [ ] 7.2.3 Corriger tests qui échouent

### 7.3 Lint & Type Check
- [ ] 7.3.1 Lancer ESLint: `npm run lint`
- [ ] 7.3.2 Lancer TypeScript check: `npx tsc --noEmit`
- [ ] 7.3.3 Corriger toutes les erreurs

### 7.4 Build Verification
- [ ] 7.4.1 Build production: `npm run build`
- [ ] 7.4.2 Vérifier pas d'erreurs build
- [ ] 7.4.3 Vérifier pas de warnings critiques

### 7.5 Documentation Review
- [ ] 7.5.1 Lire design.md complet
- [ ] 7.5.2 Vérifier toutes les décisions sont documentées
- [ ] 7.5.3 Lire project.md section dark mode
- [ ] 7.5.4 Vérifier README.md à jour

### 7.6 OpenSpec Validation
- [ ] 7.6.1 Valider le change: `openspec validate phase-1-stabilization-and-fixes --strict`
- [ ] 7.6.2 Corriger erreurs de validation
- [ ] 7.6.3 Final check avant archive

## 8. Livraison

### 8.1 Commit Changes
- [ ] 8.1.1 Review git status
- [ ] 8.1.2 Commit avec message descriptif
- [ ] 8.1.3 Push to remote

### 8.2 Archive OpenSpec Change
- [ ] 8.2.1 Archiver le change: `openspec archive phase-1-stabilization-and-fixes --yes`
- [ ] 8.2.2 Vérifier spec files sont mis à jour
- [ ] 8.2.3 Valider: `openspec validate --strict`

### 8.3 Communication
- [ ] 8.3.1 Documenter changements pour utilisateurs
- [ ] 8.3.2 Mettre à jour changelog si applicable
- [ ] 8.3.3 Annoncer aux stakeholders si nécessaire

---

## Notes d'Implementation

**Ordre Recommandé:**
1. Commencer par les bugs critiques (Section 1) - impact immédiat
2. Puis harmonisation UX (Section 2) - cohérence utilisateur
3. Ensuite type safety (Section 3) - fondations solides
4. Puis refactoring (Section 4) - code propre
5. En parallèle: documentation (Section 5)
6. Finir par infrastructure (Section 6) - qualité durable

**Tests Continus:**
- Tester après chaque sous-tâche majeure
- Ne pas attendre la fin pour tout tester
- Utiliser `bun test --watch` en développement

**Documentation Inline:**
- Documenter les décisions au fur et à mesure
- Pas besoin d'attendre la fin pour écrire design.md
- JSDoc pendant le coding, pas après

**Risques:**
- **Faible**: Tous les changements sont additifs ou correctifs
- **Mitigation**: Tests automatisés valident les régressions
- **Rollback**: Git history permet reversion si nécessaire
