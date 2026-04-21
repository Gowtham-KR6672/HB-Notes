# HB Notes - Component Hierarchy

## Overview

This document outlines the component structure and hierarchy of the HB Notes application, showing how components are organized and their relationships.

---

## Application Structure

```
HB Notes App
├── Authentication
│   ├── Login Page
│   └── Signup Page
│
├── Workspace (Main App)
│   ├── WorkspaceApp (Container)
│   │   ├── NoteList (Sidebar)
│   │   │   ├── Search Bar
│   │   │   ├── Filter Chips
│   │   │   ├── Note Cards
│   │   │   └── Load More Button
│   │   │
│   │   ├── EditorPanel (Main Content)
│   │   │   ├── Header
│   │   │   │   ├── Back Button (Mobile)
│   │   │   │   ├── Title Input
│   │   │   │   └── Action Buttons
│   │   │   │       ├── Preview/Edit Toggle
│   │   │   │       ├── Pin/Unpin
│   │   │   │       ├── Share
│   │   │   │       ├── Export
│   │   │   │       └── Trash/Delete
│   │   │   │
│   │   │   ├── Editor Area
│   │   │   │   ├── Textarea (Edit Mode)
│   │   │   │   └── Markdown Preview
│   │   │   │       ├── CreditCardView (Custom Component)
│   │   │   │       └── Other Markdown Elements
│   │   │   │
│   │   │   └── Sidebar (Desktop Only)
│   │   │       ├── Tags Section
│   │   │       │   ├── Tags Input
│   │   │       │   └── Tags Display
│   │   │       └── Attachments Section
│   │   │           └── AttachmentDropzone
│   │   │
│   │   ├── BottomNavigation (Mobile Only)
│   │   │   ├── Home Tab
│   │   │   ├── Search Tab
│   │   │   ├── Archive Tab
│   │   │   ├── Tags Tab
│   │   │   └── More Tab
│   │   │
│   │   ├── FloatingActionButton (Mobile Only)
│   │   │
│   │   └── TemplateModal
│   │       ├── Template Grid
│   │       └── Template Preview
│   │
│   ├── Shared Components
│   │   ├── Logo
│   │   ├── ThemeToggle
│   │   ├── UserMenu
│   │   └── Toaster
│   │
│   └── Layout
│       ├── Gradient Background
│       └── Glass Panel Container
│
└── Pages
    ├── Landing Page
    ├── Share Page
    └── Offline Page
```

---

## Component Details

### Level 1: Root Components

#### WorkspaceApp
- **File**: `components/workspace/workspace-app.tsx`
- **Purpose**: Main container for the notes application
- **Responsibilities**:
  - State management (notes, search, trash view, sidebar)
  - API integration for notes CRUD operations
  - Orchestration of child components
  - Mobile/desktop layout switching
- **Props**: `initialNotes`, `user`
- **State**:
  - `notes`: Array of Note objects
  - `selectedNoteId`: Currently selected note
  - `search`: Search query string
  - `trashView`: Boolean for trash mode
  - `sidebarOpen`: Boolean for mobile sidebar
  - `isTemplateModalOpen`: Boolean for template modal
- **Child Components**:
  - NoteList
  - EditorPanel
  - BottomNavigation
  - FloatingActionButton
  - TemplateModal

---

### Level 2: Major Components

#### NoteList
- **File**: `components/workspace/note-list.tsx`
- **Purpose**: Display and manage list of notes
- **Responsibilities**:
  - Display note cards
  - Search functionality
  - Filter by category
  - Toggle trash view
  - Load pagination
- **Props**: `notes`, `selectedNoteId`, `search`, `trashView`, `onSelect`, `onSearch`, `onCreate`, `onOpenTemplate`, `onToggleTrash`, `onLoadMore`, `hasMore`, `isLoading`
- **Child Components**:
  - Search Bar (inline)
  - Filter Chips (inline)
  - Note Cards (mapped)
  - Load More Button

#### EditorPanel
- **File**: `components/workspace/editor-panel.tsx`
- **Purpose**: Edit and preview individual notes
- **Responsibilities**:
  - Display note title and content
  - Edit mode (textarea)
  - Preview mode (markdown)
  - Tag management
  - Attachment management
  - Note actions (pin, share, export, delete)
- **Props**: `note`, `onSave`, `onDelete`, `onPermanentDelete`, `onExport`, `onCopyShare`, `onCloseMobile`
- **Child Components**:
  - CreditCardView (via markdown)
  - AttachmentDropzone
- **Custom Markdown Components**:
  - CreditCardView (for ```card blocks)

#### BottomNavigation
- **File**: `components/workspace/bottom-nav.tsx`
- **Purpose**: Mobile navigation bar
- **Responsibilities**:
  - Navigation between app sections
  - Visual feedback for active tab
- **Props**: None (internal state)
- **Tabs**: Home, Favorites, Tags, Settings
- **Visibility**: Mobile only (`xl:hidden`)

#### FloatingActionButton
- **File**: `components/workspace/fab.tsx`
- **Purpose**: Quick action button for creating notes
- **Responsibilities**:
  - Trigger template modal
  - Animated appearance
- **Props**: `onClick`
- **Visibility**: Mobile only (`xl:hidden`)

#### TemplateModal
- **File**: `components/workspace/template-modal.tsx`
- **Purpose**: Modal for selecting note templates
- **Responsibilities**:
  - Display available templates
  - Preview template content
  - Create note from template
- **Props**: `isOpen`, `onClose`, `onCreate`, `existingNotes`, `onUpdateNote`

---

### Level 3: Supporting Components

#### CreditCardView
- **File**: `components/workspace/credit-card-view.tsx`
- **Purpose**: Display credit card information in a visual format
- **Responsibilities**:
  - Parse card data from markdown
  - Render glassmorphic card design
  - Format card number with spaces
- **Props**: `data` (string with card details)
- **Data Format**:
  ```
  Name: Cardholder Name
  Type: Card Type
  Number: 1234567890123456
  Expiry: MM/YY
  CVV: 123
  ```

#### AttachmentDropzone
- **File**: `components/workspace/attachment-dropzone.tsx`
- **Purpose**: Handle file uploads for notes
- **Responsibilities**:
  - Drag and drop interface
  - File selection
  - Display uploaded files
  - Remove attachments
- **Props**: `attachments`, `isUploading`, `onFiles`, `onRemove`

#### UserMenu
- **File**: `components/workspace/user-menu.tsx`
- **Purpose**: Display user information and logout option
- **Responsibilities**:
  - Show user name and email
  - Logout functionality
- **Props**: `name`, `email`

#### ThemeToggle
- **File**: `components/theme-toggle.tsx`
- **Purpose**: Toggle between light and dark themes
- **Responsibilities**:
  - Switch theme
  - Persist theme preference
- **Props**: None

#### Logo
- **File**: `components/logo.tsx`
- **Purpose**: Display application logo
- **Responsibilities**:
  - Render logo with text
- **Props**: None

---

### Level 4: Utility Components

#### Toaster
- **File**: `components/toaster.tsx`
- **Purpose**: Display toast notifications
- **Responsibilities**:
  - Show success/error messages
  - Auto-dismiss notifications
- **Usage**: Called via `pushToast()` function

---

## Component Data Flow

### Note Creation Flow
```
1. User clicks FAB or Template button
   ↓
2. TemplateModal opens
   ↓
3. User selects template or creates blank note
   ↓
4. WorkspaceApp.createNote() called
   ↓
5. API POST /api/notes
   ↓
6. Note added to state
   ↓
7. Note selected and opened in EditorPanel
```

### Note Editing Flow
```
1. User edits note in EditorPanel
   ↓
2. EditorPanel state updates (draft)
   ↓
3. Auto-save triggers (900ms debounce)
   ↓
4. WorkspaceApp.saveNote() called
   ↓
5. API PUT /api/notes/{id}
   ↓
6. Note updated in state
   ↓
7. Toast notification shown
```

### Note Selection Flow (Mobile)
```
1. User taps note card in NoteList
   ↓
2. NoteList.onSelect() called
   ↓
3. WorkspaceApp.selectNote() called
   ↓
4. selectedNoteId state updated
   ↓
5. NoteList hidden, EditorPanel shown (full screen)
   ↓
6. BottomNavigation and FAB hidden
```

### Note Selection Flow (Desktop)
```
1. User clicks note card in NoteList
   ↓
2. NoteList.onSelect() called
   ↓
3. WorkspaceApp.selectNote() called
   ↓
4. selectedNoteId state updated
   ↓
5. Note card highlighted
   ↓
6. EditorPanel displays selected note (side-by-side)
```

---

## State Management

### Global State (Zustand Store)
- **File**: `lib/store/notes-store.ts`
- **State**:
  - `notes`: Array of all notes
  - `selectedNoteId`: ID of currently selected note
  - `isHydrated`: Boolean for initial load
- **Actions**:
  - `setNotes`: Replace notes array
  - `appendNotes`: Add more notes (pagination)
  - `selectNote`: Set selected note
  - `upsertNote`: Update or add note
  - `deleteNote`: Remove note

### Local Component State

#### WorkspaceApp
- `search`: Search query
- `page`: Current page for pagination
- `hasMore`: Boolean for more pages
- `trashView`: Boolean for trash mode
- `sidebarOpen`: Boolean for mobile sidebar
- `isTemplateModalOpen`: Boolean for template modal

#### NoteList
- `isFocused`: Search input focus state
- `selectedFilter`: Currently selected filter

#### EditorPanel
- `draft`: Local copy of note for editing
- `tagsInput`: Tags as comma-separated string
- `previewMode`: Boolean for edit/preview toggle
- `isUploading`: Boolean for file upload

---

## Component Styling Hierarchy

### Glassmorphism Classes
```
.glass-panel (Main containers)
  └── .glass-panel-top (Header bars)
  
.glass-card (Interactive cards)
  └── Hover state with shimmer
  
.glass-chip (Small tags/pills)
  
.glass-editor (Text areas)
```

### Utility Classes
```
.gradient-background (Animated gradient)
.glass-panel (Glass effect container)
.glass-card (Glass effect cards)
.glass-chip (Glass effect pills)
.glass-editor (Glass effect text areas)
.prose-preview (Markdown styling)
```

---

## Responsive Behavior

### Mobile (< 1280px)
```
WorkspaceApp
├── NoteList (Full width, visible when no note selected)
├── EditorPanel (Full screen overlay, visible when note selected)
├── BottomNavigation (Fixed bottom)
├── FloatingActionButton (Fixed bottom-right)
└── TemplateModal (Full screen overlay)
```

### Desktop (≥ 1280px)
```
WorkspaceApp
├── Grid Layout (2 columns)
│   ├── Column 1: NoteList (380px fixed)
│   └── Column 2: EditorPanel (Flex)
│       ├── Editor Area (Flex)
│       └── Tags/Attachments (380px)
├── BottomNavigation (Hidden)
├── FloatingActionButton (Hidden)
└── TemplateModal (Centered modal)
```

---

## Component Props Reference

### WorkspaceApp
```typescript
{
  initialNotes: NotesResponse;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}
```

### NoteList
```typescript
{
  notes: Note[];
  selectedNoteId: string | null;
  search: string;
  trashView: boolean;
  onSelect: (noteId: string) => void;
  onSearch: (value: string) => void;
  onCreate: (templatePayload?: object) => void;
  onOpenTemplate: () => void;
  onToggleTrash: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}
```

### EditorPanel
```typescript
{
  note: Note | null;
  onSave: (note: Note) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
  onPermanentDelete: (noteId: string) => Promise<void>;
  onExport: (note: Note) => void;
  onCopyShare: (note: Note) => void;
  onCloseMobile?: () => void;
}
```

### CreditCardView
```typescript
{
  data: string; // Card data in format: "Name: ...\nType: ...\n..."
}
```

### AttachmentDropzone
```typescript
{
  attachments: Attachment[];
  isUploading: boolean;
  onFiles: (files: FileList | File[]) => void;
  onRemove: (url: string) => void;
}
```

---

## Component Lifecycle

### Mount Order
1. **WorkspaceApp** mounts with initialNotes
2. **NoteList** renders with notes
3. **EditorPanel** renders (hidden if no note selected)
4. **BottomNavigation** mounts (mobile only)
5. **FloatingActionButton** mounts (mobile only)

### Update Triggers
- **WorkspaceApp**: Search changes, trash toggle, pagination
- **NoteList**: Notes array changes, search changes, selection changes
- **EditorPanel**: Selected note changes, draft updates
- **CreditCardView**: Data prop changes (markdown content)

---

## Component Communication

### Parent to Child
- **WorkspaceApp → NoteList**: Notes, selectedNoteId, search, callbacks
- **WorkspaceApp → EditorPanel**: Selected note, CRUD callbacks
- **EditorPanel → CreditCardView**: Card data string
- **EditorPanel → AttachmentDropzone**: Attachments, callbacks

### Child to Parent
- **NoteList → WorkspaceApp**: onSelect, onSearch, onToggleTrash
- **EditorPanel → WorkspaceApp**: onSave, onDelete, onExport
- **AttachmentDropzone → EditorPanel**: onFiles, onRemove

### Sibling Communication
- **NoteList ↔ EditorPanel**: Via WorkspaceApp state (selectedNoteId)

---

## Component Reusability

### Highly Reusable
- **CreditCardView**: Can be used anywhere card display is needed
- **AttachmentDropzone**: Generic file upload component
- **Glass Panel Classes**: CSS utility classes for any glass effect

### Context-Specific
- **NoteList**: Tightly coupled to notes data structure
- **EditorPanel**: Specific to note editing workflow
- **BottomNavigation**: Mobile-specific navigation

---

## Component Testing Strategy

### Unit Tests
- **CreditCardView**: Test data parsing and rendering
- **AttachmentDropzone**: Test file handling
- **UserMenu**: Test logout functionality

### Integration Tests
- **NoteList**: Test search, filter, selection
- **EditorPanel**: Test edit, save, preview modes
- **WorkspaceApp**: Test full note CRUD flow

### E2E Tests
- **Mobile**: Test note creation, editing, deletion
- **Desktop**: Test split layout, simultaneous editing
- **Responsive**: Test breakpoint behavior

---

## Component Performance

### Optimization Strategies
- **Memoization**: Use React.memo for Note cards
- **Virtual Scrolling**: Consider for large note lists
- **Code Splitting**: Lazy load TemplateModal
- **Image Optimization**: Lazy load attachment thumbnails

### Render Optimization
- **Debounce**: Search input (250ms)
- **Transition**: Auto-save (900ms)
- **Lazy Loading**: Pagination for notes

---

## Component Accessibility

### Keyboard Navigation
- **NoteList**: Arrow keys to navigate, Enter to select
- **EditorPanel**: Tab between fields, Escape to close (mobile)
- **Modals**: Escape to close, focus trap

### Screen Readers
- **Note Cards**: Proper ARIA labels
- **Buttons**: Clear aria-label attributes
- **Status**: Toast announcements for actions

---

## Component Future Enhancements

### Planned Components
- **NoteFolder**: For organizing notes into folders
- **RichTextEditor**: Enhanced editing with formatting
- **CollaborationCursor**: Real-time collaboration indicators
- **VoiceNoteRecorder**: Audio recording for notes
- **ImageAnnotation**: Drawing on images
- **KeyboardShortcutsModal**: Help modal for shortcuts

### Component Improvements
- **NoteList**: Drag and drop reordering
- **EditorPanel**: Split view for comparing notes
- **AttachmentDropzone**: Image preview gallery
- **TemplateModal**: Custom template creation

---

## Component Dependencies

### External Libraries
- **React**: UI framework
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **date-fns**: Date formatting
- **react-markdown**: Markdown rendering
- **remark-gfm**: GitHub Flavored Markdown
- **Zustand**: State management

### Internal Dependencies
- **@/types**: TypeScript type definitions
- **@/lib/fetch**: API fetch wrapper
- **@/lib/utils**: Utility functions
- **@/components/toaster**: Toast notifications

---

## Component File Organization

```
components/
├── workspace/
│   ├── workspace-app.tsx (Main container)
│   ├── note-list.tsx (Note list sidebar)
│   ├── editor-panel.tsx (Note editor)
│   ├── credit-card-view.tsx (Card display)
│   ├── bottom-nav.tsx (Mobile navigation)
│   ├── fab.tsx (Floating action button)
│   ├── template-modal.tsx (Template selection)
│   ├── attachment-dropzone.tsx (File upload)
│   └── user-menu.tsx (User info)
├── auth-form.tsx (Login/Signup)
├── logo.tsx (App logo)
├── theme-toggle.tsx (Theme switcher)
├── theme-provider.tsx (Theme context)
└── toaster.tsx (Toast notifications)
```

---

*This component hierarchy is a living document and will evolve as the application grows.*
