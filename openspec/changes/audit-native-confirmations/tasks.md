## 1. Audit du Codebase

- [ ] 1.1 Rechercher `confirm()` dans tout le projet
  ```bash
  grep -r "confirm(" --include="*.tsx" --include="*.ts" app/ widgets/ shared/
  ```
- [ ] 1.2 Rechercher `alert()` dans tout le projet
  ```bash
  grep -r "alert(" --include="*.tsx" --include="*.ts" app/ widgets/ shared/
  ```
- [ ] 1.3 Rechercher `prompt()` dans tout le projet
  ```bash
  grep -r "prompt(" --include="*.tsx" --include="*.ts" app/ widgets/ shared/
  ```
- [ ] 1.4 Lister tous les fichiers concernés
- [ ] 1.5 Prioriser par criticité (admin > public)

## 2. Sections à Auditer

### 2.1 Admin Events
- [ ] `app/(admin)/admin/events/events-list-client.tsx` - ✅ Déjà corrigé (bulk archive)
- [ ] `app/(admin)/admin/events/[id]/page.tsx` - Vérifier si dialogs natifs utilisés
- [ ] `app/(admin)/admin/events/[id]/edit/page.tsx` - Vérifier formulaire édition

### 2.2 Admin Songs  
- [ ] `app/(admin)/admin/songs/songs-list-client.tsx` - Vérifier bulk actions
- [ ] `app/(admin)/admin/songs/[id]/page.tsx` - Vérifier page détail
- [ ] `app/(admin)/admin/songs/[id]/edit/page.tsx` - Vérifier formulaire édition

### 2.3 Admin Playlists
- [ ] `app/(admin)/admin/playlists/playlists-list-client.tsx` - Vérifier bulk actions
- [ ] `app/(admin)/admin/playlists/[id]/page.tsx` - Vérifier page détail
- [ ] `app/(admin)/admin/playlists/[id]/edit/page.tsx` - Vérifier formulaire édition

### 2.4 Admin Photos
- [ ] `app/(admin)/admin/photos/photo-list.tsx` - Vérifier suppressions
- [ ] `app/(admin)/admin/photos/photo-upload.tsx` - Vérifier confirmations upload

### 2.5 Widgets et Composants Partagés
- [ ] `shared/ui/action-buttons.tsx` - Vérifier ArchiveButton/DeleteButton
- [ ] `widgets/**/*.tsx` - Vérifier composants interactifs

## 3. Remplacements à Effectuer

### 3.1 Pattern : Confirmation avant action destructrice
**À remplacer :**
```typescript
if (confirm("Delete this item?")) {
  await deleteItem();
}
```

**Par :**
```typescript
const [showDialog, setShowDialog] = useState(false);

// ...

<AlertDialog open={showDialog} onOpenChange={setShowDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete item?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction 
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 3.2 Pattern : Notification de succès/erreur
**À remplacer :**
```typescript
alert("Item saved successfully");
```

**Par :**
```typescript
toast.success("Item saved successfully");
```

## 4. Fichiers Spécifiques à Vérifier

Basé sur une recherche rapide, vérifier ces fichiers :

- [ ] `app/(admin)/admin/photos/photo-list.tsx` - Lignes 58, 103
- [ ] Autres fichiers identifiés lors de l'audit complet

## 5. Standardisation

### 5.1 Créer un composant ConfirmDialog réutilisable (optionnel)
- [ ] Composant générique pour confirmations
- [ ] Props : title, description, onConfirm, onCancel, confirmLabel, cancelLabel
- [ ] Placer dans `shared/ui/confirm-dialog.tsx`

### 5.2 Mettre à jour la documentation
- [ ] Ajouter section dans `AGENTS.md` ou `project.md`
- [ ] Documenter le pattern à suivre
- [ ] Exemples de code corrects

## 6. Tests

- [ ] 6.1 Tester tous les dialogs remplacés
  - [ ] Desktop
  - [ ] Mobile
  - [ ] Dark mode
- [ ] 6.2 Vérifier l'accessibilité (tab navigation, focus)
- [ ] 6.3 Tester les cas d'erreur

## 7. Documentation

- [ ] 7.1 Mettre à jour les specs concernées
- [ ] 7.2 Documenter les breaking changes (aucun)
- [ ] 7.3 Créer guide de contribution (pattern à suivre)

## Notes

**Fichiers déjà corrigés :**
- ✅ `app/(admin)/admin/events/events-list.tsx` - Bulk archive (AlertDialog)

**À vérifier en priorité :**
- Les formulaires avec actions destructrices (delete, archive)
- Les uploads avec confirmations
- Les bulk actions

**N'oubliez pas :**
- Gérer l'état de chargement (disabled buttons pendant l'action)
- Fermer le dialog après succès
- Afficher toast notification après action
- Gérer les erreurs avec toast.error()
