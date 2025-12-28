# Spec: Form Layout Component System

## Overview

A unified form layout system providing consistent structure, styling, and feedback patterns across all admin forms.

## ADDED Requirements

### Requirement: FormLayout provides consistent form structure

The FormLayout component SHALL wrap form content with consistent styling and behavior.

#### Scenario: Form renders with sections

**Given** a FormLayout with FormSection children  
**When** the component renders  
**Then** each section is displayed as a card with proper spacing  
**And** the form element handles submit events

#### Scenario: Form displays inline error

**Given** a FormLayout with an error prop  
**When** the error is set  
**Then** an error banner is displayed at the top of the form  
**And** the banner uses consistent error styling (red background, dark mode support)

#### Scenario: Form handles pending state

**Given** a FormLayout with isPending=true  
**When** the form is in pending state  
**Then** child components can access this state  
**And** form submission is prevented while pending

---

### Requirement: FormSection groups related fields

FormSection SHALL provide visual grouping for related form fields.

#### Scenario: Section renders with title

**Given** a FormSection with a title prop  
**When** the component renders  
**Then** the title is displayed as a heading  
**And** children are rendered below the title

#### Scenario: Section renders as card

**Given** a FormSection with card=true (default)  
**When** the component renders  
**Then** content is wrapped in a card with shadow and padding  
**And** dark mode styling is applied

#### Scenario: Section renders without card

**Given** a FormSection with card=false  
**When** the component renders  
**Then** content is rendered without card styling  
**And** only spacing is applied

---

### Requirement: FormActions provides consistent action buttons

FormActions SHALL render submit, cancel, and extra action buttons.

#### Scenario: Actions render with primary and cancel

**Given** FormActions with primaryLabel and onCancel  
**When** the component renders  
**Then** primary button is displayed with the label  
**And** cancel button is displayed

#### Scenario: Primary button shows loading state

**Given** FormActions with isPending=true  
**When** the form is submitting  
**Then** primary button shows primaryLoadingLabel (or "Saving...")  
**And** all buttons are disabled

#### Scenario: Extra actions are rendered

**Given** FormActions with extraActions array  
**When** the component renders  
**Then** extra action buttons are displayed after cancel  
**And** each button has the specified variant and onClick handler

#### Scenario: Actions alignment

**Given** FormActions with align="end"  
**When** the component renders  
**Then** buttons are right-aligned  
**And** with align="start" buttons are left-aligned

---

### Requirement: useFormFeedback provides unified feedback

The hook SHALL manage success and error feedback patterns.

#### Scenario: Success triggers toast and redirect

**Given** useFormFeedback with successRedirect set  
**When** onSuccess is called  
**Then** a success toast is displayed  
**And** navigation to successRedirect occurs  
**And** router.refresh() is called

#### Scenario: Success triggers toast without redirect

**Given** useFormFeedback without successRedirect  
**When** onSuccess is called  
**Then** a success toast is displayed  
**And** no navigation occurs

#### Scenario: Error triggers toast and inline error

**Given** useFormFeedback with showInlineError=true (default)  
**When** onError is called with an error message  
**Then** an error toast is displayed  
**And** inlineError state is set

#### Scenario: Error clears on clearError

**Given** useFormFeedback with inlineError set  
**When** clearError is called  
**Then** inlineError becomes null

---

### Requirement: Forms use consistent field components

All forms SHALL use the shared FormField components.

#### Scenario: TextField is used for text inputs

**Given** a form with text input fields  
**When** the form renders  
**Then** TextField component is used  
**And** consistent styling is applied

#### Scenario: TextAreaField is used for multiline inputs

**Given** a form with multiline text fields  
**When** the form renders  
**Then** TextAreaField component is used  
**And** consistent styling is applied

#### Scenario: SelectField is used for dropdowns

**Given** a form with select fields  
**When** the form renders  
**Then** SelectField component is used  
**And** shadcn Select component is used internally

#### Scenario: CheckboxField is used for boolean fields

**Given** a form with checkbox fields  
**When** the form renders  
**Then** CheckboxField component is used  
**And** consistent styling is applied

---

### Requirement: Forms follow consistent feedback patterns

All forms SHALL provide the same feedback experience.

#### Scenario: Create success redirects to list

**Given** a form in create mode  
**When** creation succeeds  
**Then** success toast is shown  
**And** user is redirected to the entity list page

#### Scenario: Update success redirects to list

**Given** a form in edit mode  
**When** update succeeds  
**Then** success toast is shown  
**And** user is redirected to the entity list page

#### Scenario: Error shows toast and inline message

**Given** any form  
**When** an error occurs  
**Then** error toast is shown with description  
**And** inline error banner is displayed in form

---

## Visual Design

### Form Structure

```
┌─────────────────────────────────────────────┐
│ [Error Banner - if error]                   │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Section Title                           │ │
│ │ ┌─────────────────────────────────────┐ │ │
│ │ │ Label *                             │ │ │
│ │ │ [Input Field]                       │ │ │
│ │ │ Error message                       │ │ │
│ │ └─────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────┐ │ │
│ │ │ Label                               │ │ │
│ │ │ [Input Field]                       │ │ │
│ │ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Related Content Section                 │ │
│ │ [Sortable Table / Other Content]        │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Primary] [Cancel] [Extra Actions...]       │
└─────────────────────────────────────────────┘
```

### Button States

- **Default**: Normal button appearance
- **Loading**: Disabled + "Saving..." text
- **Disabled**: Reduced opacity, not clickable

### Error Banner

```
┌─────────────────────────────────────────────┐
│ ⚠ Error message text here                   │
└─────────────────────────────────────────────┘
```
- Red background (light: red-50, dark: red-900/20)
- Red text (light: red-800, dark: red-200)
- Rounded corners, padding

### Styling

- Cards: white background, shadow-sm, rounded-lg, p-6
- Dark mode: zinc-900 background
- Spacing: space-y-6 between sections
- Mobile-first responsive design

