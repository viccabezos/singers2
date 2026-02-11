## 1. Composants Skeleton de Base

- [ ] 1.1 Créer/EventSkeleton component
  - Reprend la structure visuelle des cards events
  - Pulse animation
  - Support dark mode
- [ ] 1.2 Créer SongSkeleton component
  - Structure de ligne DataTable
  - Colonnes: Title, Artist, Status, Actions
- [ ] 1.3 Créer PlaylistSkeleton component
  - Structure card playlist
  - Similaire à EventSkeleton
- [ ] 1.4 Créer DashboardSkeleton component
  - Calendrier placeholder
  - Recent activity placeholder
  - Navigation cards placeholder

## 2. Events - Loading States

- [ ] 2.1 Loading state initial sur la page
  - Suspense wrapper ou isLoading state
  - Afficher 5-6 EventSkeleton pendant le chargement
- [ ] 2.2 Loading state sur les actions bulk
  - Bouton "Archive Selected" avec spinner
  - Désactiver les checkboxes pendant l'action
- [ ] 2.3 Loading state sur le filtre
  - Indicateur subtil pendant le changement de filtre
  - Option: garder l'ancienne liste + overlay
- [ ] 2.4 Transition fluide
  - Fade in des events quand chargés
  - Pas de flash entre états

## 3. Songs - Loading States

- [ ] 3.1 Loading state initial
  - 10 lignes de SongSkeleton dans le DataTable
  - Garder la structure des headers
- [ ] 3.2 Loading sur bulk actions
  - Spinner sur le bouton d'action bulk
  - Disable sur les checkboxes
- [ ] 3.3 Loading sur pagination (si applicable)
  - Skeleton rows pendant le changement de page
- [ ] 3.4 Loading sur recherche
  - Debounce + indicateur de recherche

## 4. Playlists - Loading States

- [ ] 4.1 Loading state initial
  - 4-5 PlaylistSkeleton cards
  - Grille responsive préservée
- [ ] 4.2 Loading sur bulk actions
  - Comportement identique à Events
- [ ] 4.3 Loading sur filtres
  - Indicateur pendant le changement

## 5. Dashboard - Loading States

- [ ] 5.1 Calendrier skeleton
  - Grille de jours placeholder
  - Header mois/année
- [ ] 5.2 Recent Activity skeleton
  - Liste d'items placeholder
  - Avatars et textes
- [ ] 5.3 Navigation cards
  - Cards avec icônes placeholders
  - Compteurs en skeleton
- [ ] 5.4 Loading global
  - Layout complet en skeleton pendant initial load

## 6. Formulaires - Loading States

- [ ] 6.1 Boutons submit avec loading
  - Spinner + texte adapté ("Creating...", "Saving...")
  - État disabled pendant soumission
- [ ] 6.2 Loading des données d'édition
  - Formulaire en mode skeleton
  - Ou état "Loading..." centré
- [ ] 6.3 Upload de photos
  - Barre de progression
  - Pourcentage affiché
  - Miniature avec spinner

## 7. Composants Partagés

- [ ] 7.1 EnhancedButton avec loading state
  - Props: isLoading, loadingText
  - Spinner intégré
  - Animation smooth
- [ ] 7.2 LoadingOverlay component
  - Overlay semi-transparent
  - Spinner centré
  - Pour les opérations lourdes
- [ ] 7.3 FadeIn wrapper
  - Animation d'apparition
  - Durée configurable
  - Support reduced motion

## 8. Accessibilité

- [ ] 8.1 Attributs ARIA
  - aria-busy sur les zones en chargement
  - aria-live pour annoncer les changements
  - role="status" sur les indicateurs
- [ ] 8.2 Screen readers
  - Texte alternatif sur les spinners
  - Annonce vocale du début/fin de chargement
- [ ] 8.3 Reduced motion
  - Respect de prefers-reduced-motion
  - Animations désactivables

## 9. Dark Mode

- [ ] 9.1 Skeletons en dark mode
  - Couleurs zinc adaptées
  - Contraste suffisant
- [ ] 9.2 Spinners en dark mode
  - Couleurs adaptées au thème

## 10. Tests et Validation

- [ ] 10.1 Test visuels
  - Vérifier tous les skeletons en light mode
  - Vérifier tous les skeletons en dark mode
  - Tester sur mobile
- [ ] 10.2 Test d'accessibilité
  - Screen reader test
  - Keyboard navigation test
- [ ] 10.3 Performance
  - Pas de re-render inutile
  - Animations GPU-accelerated

## Notes d'Implémentation

**Structure type:**
```tsx
// Composant Skeleton
function EventSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border p-4">
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
    </div>
  );
}

// Utilisation
{isLoading ? (
  <>{Array.from({ length: 5 }).map((_, i) => <EventSkeleton key={i} />)}</>
) : (
  events.map(event => <EventCard key={event.id} event={event} />)
)}
```

**Priorité:**
1. Events list (haute priorité - page la plus utilisée)
2. Formulaires (haute priorité - feedback immédiat nécessaire)
3. Songs/Playlists (moyenne priorité)
4. Dashboard (moyenne priorité)

**Dépendances:**
- Aucune - peut commencer immédiatement
- Utilise les composants shadcn/ui existants
