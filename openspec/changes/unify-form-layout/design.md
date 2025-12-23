# Design: Unify Form Layout Component

## Technical Decisions

### 1. Component Architecture

```
shared/ui/
├── form-layout/
│   ├── index.ts              # Barrel export
│   ├── form-layout.tsx       # Main layout wrapper
│   ├── form-section.tsx      # Section grouping
│   ├── form-actions.tsx      # Action buttons
│   └── use-form-feedback.ts  # Feedback hook
```

### 2. FormLayout API Design

```tsx
interface FormLayoutProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  
  // Optional error to display at form level
  error?: string;
  
  // Loading state
  isPending?: boolean;
  
  // Layout options
  className?: string;
}

// Usage:
<FormLayout onSubmit={handleSubmit} error={errors.submit} isPending={isPending}>
  <FormSection title="Event Details">
    {/* form fields */}
  </FormSection>
  
  <FormSection title="Playlists">
    {/* sortable table */}
  </FormSection>
  
  <FormActions
    primaryLabel="Save Changes"
    onCancel={() => router.back()}
    extraActions={[
      { label: "Duplicate", onClick: handleDuplicate, variant: "secondary" }
    ]}
  />
</FormLayout>
```

### 3. FormSection API Design

```tsx
interface FormSectionProps {
  children: React.ReactNode;
  
  // Optional title for the section
  title?: string;
  
  // Optional description
  description?: string;
  
  // Whether to render as a card (default: true)
  card?: boolean;
  
  // Additional styling
  className?: string;
}

// Usage:
<FormSection title="Basic Information">
  <TextField label="Name" ... />
  <TextAreaField label="Description" ... />
</FormSection>
```

### 4. FormActions API Design

```tsx
interface FormAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  disabled?: boolean;
  loading?: boolean;
}

interface FormActionsProps {
  // Primary submit button
  primaryLabel: string;
  primaryLoadingLabel?: string;  // e.g., "Saving..."
  
  // Cancel button
  onCancel?: () => void;
  cancelLabel?: string;  // default: "Cancel"
  
  // Additional actions (e.g., Duplicate, Delete)
  extraActions?: FormAction[];
  
  // Global loading state (disables all buttons)
  isPending?: boolean;
  
  // Layout: "start" | "end" | "between"
  align?: "start" | "end" | "between";
  
  // Styling
  className?: string;
}

// Usage:
<FormActions
  primaryLabel={isEditing ? "Save Changes" : "Create Event"}
  primaryLoadingLabel="Saving..."
  onCancel={() => router.back()}
  extraActions={isEditing ? [
    { label: "Duplicate", onClick: handleDuplicate, variant: "secondary" }
  ] : undefined}
  isPending={isPending}
  align="start"  // or "end" for right-aligned
/>
```

### 5. useFormFeedback Hook Design

```tsx
interface FormFeedbackOptions {
  // Success behavior
  successMessage: string;
  successRedirect?: string;  // URL to redirect after success
  
  // Error behavior
  errorMessage: string;
  showInlineError?: boolean;  // default: true
}

interface FormFeedbackResult {
  // Call on success
  onSuccess: () => void;
  
  // Call on error
  onError: (error: string) => void;
  
  // Inline error state (for display)
  inlineError: string | null;
  
  // Clear error
  clearError: () => void;
}

// Usage:
const feedback = useFormFeedback({
  successMessage: "Event saved successfully",
  successRedirect: "/admin/events",
  errorMessage: "Failed to save event",
});

// In submit handler:
if (result.error) {
  feedback.onError(result.error);
} else {
  feedback.onSuccess();
}

// In JSX:
<FormLayout error={feedback.inlineError}>
```

### 6. Standard Form Structure

All forms will follow this structure:

```tsx
export function EntityForm({ entity }: EntityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({...});
  
  const feedback = useFormFeedback({
    successMessage: entity ? "Updated successfully" : "Created successfully",
    successRedirect: "/admin/entities",
    errorMessage: "Failed to save",
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    feedback.clearError();
    
    // Validation
    const validation = validateEntity(formData);
    if (!validation.isValid) {
      // Handle field errors
      return;
    }
    
    startTransition(async () => {
      const result = entity 
        ? await updateAction(entity.id, formData)
        : await createAction(formData);
        
      if (result.error) {
        feedback.onError(result.error);
      } else {
        feedback.onSuccess();
      }
    });
  };
  
  return (
    <FormLayout 
      onSubmit={handleSubmit} 
      error={feedback.inlineError}
      isPending={isPending}
    >
      <FormSection title="Details">
        <TextField
          label="Name"
          id="name"
          value={formData.name}
          onChange={(v) => setFormData({...formData, name: v})}
          required
          error={errors.name}
        />
        {/* More fields */}
      </FormSection>
      
      {entity && (
        <FormSection title="Related Items">
          <SortableContentTable ... />
        </FormSection>
      )}
      
      <FormActions
        primaryLabel={entity ? "Save Changes" : "Create"}
        primaryLoadingLabel="Saving..."
        onCancel={() => router.back()}
        isPending={isPending}
      />
    </FormLayout>
  );
}
```

### 7. Standardized Behavior

| Behavior | Standard Implementation |
|----------|------------------------|
| **Success (create)** | Toast + redirect to list |
| **Success (update)** | Toast + redirect to list |
| **Error** | Toast + inline error banner |
| **Validation** | Per-field errors + prevent submit |
| **Loading** | Disable all buttons + show "Saving..." |
| **Cancel** | router.back() |

### 8. Button Order Convention

Adopt a consistent order (right-aligned):
1. **Extra actions** - leftmost (if any)
2. **Cancel** - before primary
3. **Primary** (Submit) - rightmost

This matches the current Event form pattern and places the primary action in the most prominent position (far right).

### 9. Migration Strategy

**Phase 1: Create Components**
- Build `FormLayout`, `FormSection`, `FormActions`
- Build `useFormFeedback` hook
- Add to `shared/ui/index.ts` exports

**Phase 2: Migrate Song Form**
- Already uses FormField components
- Add FormLayout wrapper
- Standardize feedback

**Phase 3: Migrate Playlist Form**
- Replace inline inputs with FormField components
- Add FormLayout wrapper
- Standardize feedback

**Phase 4: Migrate Event Form**
- Replace inline inputs with FormField components
- Add FormLayout wrapper
- Standardize feedback (add redirect after success)

**Phase 5: Cleanup**
- Remove duplicate styling
- Verify all forms work consistently

## File Changes Summary

### New Files
- `shared/ui/form-layout/index.ts`
- `shared/ui/form-layout/form-layout.tsx`
- `shared/ui/form-layout/form-section.tsx`
- `shared/ui/form-layout/form-actions.tsx`
- `shared/ui/form-layout/use-form-feedback.ts`

### Modified Files
- `shared/ui/index.ts` - Export new components
- `app/(admin)/admin/songs/song-form.tsx` - Use new layout
- `app/(admin)/admin/playlists/playlist-form.tsx` - Use new layout
- `app/(admin)/admin/events/event-form.tsx` - Use new layout

