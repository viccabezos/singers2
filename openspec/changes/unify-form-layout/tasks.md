# Tasks: Unify Form Layout Component

## Phase 1: Create Core Components

- [x] **1.1** Create `shared/ui/form-layout/` directory structure
- [x] **1.2** Create `form-layout.tsx` - Main form wrapper with error display
- [x] **1.3** Create `form-section.tsx` - Section grouping with optional card
- [x] **1.4** Create `form-actions.tsx` - Action buttons with loading states
- [x] **1.5** Create `use-form-feedback.ts` - Feedback hook for toast/redirect
- [x] **1.6** Create `shared/ui/form-layout/index.ts` barrel export
- [x] **1.7** Add exports to `shared/ui/index.ts`

## Phase 2: Migrate Song Form

- [x] **2.1** Import FormLayout, FormSection, FormActions, useFormFeedback
- [x] **2.2** Replace inline inputs with TextField, TextAreaField, CheckboxField
- [x] **2.3** Wrap form content with FormLayout
- [x] **2.4** Group fields in FormSection
- [x] **2.5** Replace action buttons with FormActions
- [x] **2.6** Use useFormFeedback for success/error handling
- [ ] **2.7** Test create flow (toast + redirect)
- [ ] **2.8** Test update flow (toast + redirect)
- [ ] **2.9** Test error handling (toast + inline error)
- [ ] **2.10** Test duplicate action

## Phase 3: Migrate Playlist Form

- [x] **3.1** Import FormLayout, FormSection, FormActions, useFormFeedback
- [x] **3.2** Replace inline inputs with TextField, TextAreaField, SelectField
- [x] **3.3** Wrap form content with FormLayout
- [x] **3.4** Create "Details" FormSection for basic fields
- [x] **3.5** Create "Songs" FormSection for sortable table (existing playlists only)
- [x] **3.6** Replace action buttons with FormActions
- [x] **3.7** Use useFormFeedback for success/error handling
- [ ] **3.8** Test create flow
- [ ] **3.9** Test update flow
- [ ] **3.10** Test error handling

## Phase 4: Migrate Event Form

- [x] **4.1** Import FormLayout, FormSection, FormActions, useFormFeedback
- [x] **4.2** Replace inline inputs with TextField, TextAreaField, CheckboxField
- [x] **4.3** Wrap form content with FormLayout
- [x] **4.4** Keep "Event Details" FormSection
- [x] **4.5** Keep "Playlists" FormSection for sortable table
- [x] **4.6** Replace action buttons with FormActions (right-aligned)
- [x] **4.7** Use useFormFeedback - ADD redirect after success
- [ ] **4.8** Test create flow (should now redirect)
- [ ] **4.9** Test update flow (should now redirect)
- [ ] **4.10** Test error handling

## Phase 5: Polish and Verify

- [x] **5.1** Verify all forms have consistent button order (Extra → Cancel → Primary, right-aligned)
- [x] **5.2** Verify all forms redirect after success
- [x] **5.3** Verify all forms show inline error + toast on error
- [ ] **5.4** Verify dark mode styling across all forms
- [x] **5.5** Run build to check for TypeScript errors
- [ ] **5.6** Test mobile responsiveness

## Dependencies

- Phase 2, 3, 4 depend on Phase 1
- Phase 5 depends on Phase 2, 3, 4

## Estimated Effort

- Phase 1: 30 min
- Phase 2: 20 min
- Phase 3: 20 min
- Phase 4: 20 min
- Phase 5: 15 min

**Total: ~1.75 hours**

## Notes

- Existing `shared/ui/form-field.tsx` already has TextField, TextAreaField, SelectField, CheckboxField
- Only need to create layout/structure components
- Server actions remain unchanged
- Validation logic remains unchanged

