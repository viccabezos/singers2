# Change: Admin Loading States V2

## Why

L'interface admin actuelle manque d'indicateurs de chargement visuels cohérents. Quand une action est en cours (chargement de données, sauvegarde, suppression), l'utilisateur n'a pas de feedback visuel immédiat, ce qui crée de l'incertitude.

**Problèmes identifiés:**
- Pas de skeleton loaders pendant le chargement initial des listes
- Pas d'indicateurs sur les boutons pendant les actions
- Pas de feedback lors des opérations bulk
- Expérience utilisateur dégradée sur connexions lentes

## What Changes

### 1. Skeleton Loaders pour les Listes
- **Events List**: Skeleton cards pendant le chargement initial
- **Songs List**: Skeleton rows dans le DataTable
- **Playlists List**: Skeleton cards similaires aux events
- **Dashboard**: Skeleton pour le calendrier et la liste d'activités

### 2. Loading States sur les Boutons
- **Boutons d'action**: Spinner + texte "Loading..." pendant l'action
- **Boutons bulk**: État de chargement pendant l'archivage
- **Boutons CRUD**: Feedback immédiat sur create/update/delete

### 3. Loading States sur les Formulaires
- **Submit buttons**: État disabled + spinner pendant la soumission
- **Chargement de données**: Skeleton pendant le fetch des données d'édition
- **Uploads**: Barre de progression pour les uploads de photos

### 4. Transitions et Animations
- **Fade in**: Apparition progressive du contenu chargé
- **Pulse effect**: Sur les skeletons pour indiquer l'activité
- **Smooth transitions**: Entre les états loading et loaded

## Impact

### Affected Specs
- **ui-library**: Nouveaux composants de loading
- **back-office**: Toutes les pages admin concernées
- **events**: Skeleton loaders pour la liste
- **songs**: Skeleton pour le DataTable
- **playlists**: Skeleton pour les cards

### Affected Code
- `/app/(admin)/admin/events/page.tsx` - Loading state initial
- `/app/(admin)/admin/events/events-list-client.tsx` - Skeletons
- `/app/(admin)/admin/songs/page.tsx` - Loading state
- `/app/(admin)/admin/songs/songs-list-client.tsx` - Skeleton rows
- `/app/(admin)/admin/playlists/page.tsx` - Loading state
- `/app/(admin)/admin/dashboard/page.tsx` - Skeleton calendrier
- `/shared/ui/skeleton.tsx` - Composants skeleton réutilisables

### User Impact
- **Feedback immédiat**: L'utilisateur sait que l'application répond
- **Meilleure UX**: Moins d'incertitude pendant les opérations
- **Perception de performance**: L'application semble plus rapide
- **Accessibilité**: Screen readers annoncent les états de chargement

## Acceptance Criteria

- [ ] Skeleton loaders pour toutes les listes admin
- [ ] Loading states sur tous les boutons d'action
- [ ] Transitions fluides entre états
- [ ] Support dark mode pour tous les skeletons
- [ ] Accessibilité: aria-busy, aria-live annoncés
- [ ] Responsive: Skeletons adaptés mobile/desktop

## Priority

**Medium** - Améliore l'UX mais pas bloquant pour le MVP

## Estimated Effort

- Skeleton components: 2-3 heures
- Events list: 1 heure
- Songs list: 1 heure  
- Playlists list: 1 heure
- Dashboard: 1 heure
- Formulaires: 2 heures
- **Total**: 8-10 heures

## Dependencies

- Aucune - peut être développé en parallèle
- S'appuie sur le composant Skeleton de shadcn/ui (déjà disponible)

## Notes

**Pattern à suivre:**
```tsx
// Avant
{events.map(event => <EventCard key={event.id} event={event} />)}

// Après
{isLoading ? (
  <>
    <EventSkeleton />
    <EventSkeleton />
    <EventSkeleton />
  </>
) : (
  events.map(event => <EventCard key={event.id} event={event} />)
)}
```

**Bouton avec loading:**
```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    "Save Changes"
  )}
</Button>
```

## Related Changes

- `improve-events-management` - Contient déjà des TODOs pour loading states
- À appliquer sur toute l'admin V2
