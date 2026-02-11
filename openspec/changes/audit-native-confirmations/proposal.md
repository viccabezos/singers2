# Change: Audit des Confirmations et Notifications Natives

## Why

Actuellement, le codebase contient un mélange de deux approches pour les confirmations utilisateur :
1. **Système natif du navigateur** : `confirm()`, `alert()`, `prompt()`
2. **Composants UI cohérents** : AlertDialog de shadcn/ui, toast de sonner

Cette inconsistance crée :
- Une expérience utilisateur dégradée (dialogs natifs vs custom)
- Des problèmes de style (dialogs natifs non thémables)
- Des différences de comportement entre navigateurs
- Une dette technique (difficile à maintenir, tester)

L'objectif est de standardiser sur les composants UI cohérents partout dans l'application.

## What Changes

### Audit Complet
Vérifier tous les fichiers du projet pour identifier l'utilisation de :
- `confirm()` - Dialogs de confirmation natifs
- `alert()` - Alertes natives  
- `prompt()` - Prompts natifs

### Standard à Appliquer
Remplacer par :
- **AlertDialog** de `@/components/ui/alert-dialog` pour les confirmations
- **toast** de `sonner` pour les notifications
- **Dialog** de `@/components/ui/dialog` pour les prompts complexes

### Fichiers à Vérifier
Rechercher dans :
- `app/(admin)/admin/**/*.tsx` - Formulaires admin
- `app/(public)/**/*.tsx` - Pages publiques (si applicable)
- `widgets/**/*.tsx` - Composants widgets
- `shared/ui/**/*.tsx` - Composants UI partagés

## Impact

### Affected Specs
- **ui-library** - Standardisation des composants de feedback
- **back-office** - Formulaires admin cohérents
- **public-website** - Si applicable

### Affected Code
Potentiellement dans :
- `/app/(admin)/admin/events/` - Formulaires événements
- `/app/(admin)/admin/songs/` - Formulaires chansons
- `/app/(admin)/admin/playlists/` - Formulaires playlists
- `/app/(admin)/admin/photos/` - Gestion photos
- `/widgets/` - Composants interactifs

### User Impact
- **Consistance** : Même expérience sur toute l'application
- **Accessibilité** : Meilleure prise en charge ARIA
- **Mobile** : Dialogs adaptés aux écrans tactiles
- **Thèmes** : Support dark mode complet

## Acceptance Criteria

- [ ] Audit complet du codebase pour trouver `confirm()`, `alert()`, `prompt()`
- [ ] Liste exhaustive des fichiers concernés
- [ ] Remplacement par AlertDialog/toast cohérents
- [ ] Tests visuels sur desktop et mobile
- [ ] Documentation des patterns à suivre

## Priority

**Medium** - Pas bloquant mais améliore la qualité UX/UI

## Estimated Effort

- Audit : 30 minutes
- Remplacement : 2-4 heures selon le nombre de cas
- Tests : 30 minutes
- Documentation : 30 minutes
- **Total** : 4-6 heures

## Notes

**Exemple de code à éviter :**
```typescript
// ❌ À éviter
if (confirm("Are you sure?")) {
  await deleteItem();
}

alert("Item deleted");
```

**Exemple de code recommandé :**
```typescript
// ✅ À utiliser
const [showDialog, setShowDialog] = useState(false);

// ...

<AlertDialog open={showDialog} onOpenChange={setShowDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// Après action
toast.success("Item deleted");
```

## Related Changes

- `improve-events-management` - Correction similaire appliquée sur bulk archive
- Potentiellement d'autres formulaires à auditer
