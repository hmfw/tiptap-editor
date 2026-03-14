# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (http://localhost:5173)
pnpm build      # Type-check (vue-tsc) then build production bundle
pnpm preview    # Preview production build locally
```

No test runner is configured in this project.

## Architecture

This is a Vue 3 + TypeScript + Vite project implementing a Tiptap rich text editor with a custom toolbar. Uses pnpm as the package manager.

### Key Dependencies
- **Tiptap 3.20.0** (`@tiptap/core`, `@tiptap/vue-3`, `@tiptap/starter-kit`, `@tiptap/extensions`) — editor framework
- **Element Plus 2.13.3** — UI components (auto-imported via `unplugin-element-plus`)
- **Vue 3.5.25** with JSX support via `@vitejs/plugin-vue-jsx`

### Code Organization

```
src/
├── App.vue                # Root: initializes editor, renders toolbar + EditorContent
├── tiptap-utils.ts        # ~589 lines of editor utility functions (the core logic layer)
├── editor.scss            # Toolbar and editor styles
├── components/
│   └── IconButton.tsx     # Base button wrapping ElButton + ElTooltip
├── tiptap-ui/             # Toolbar button groups (5 components)
│   ├── UndoRedoButton.tsx
│   ├── TextStyleButton.tsx   # Bold, Italic, Strike, Underline, Link
│   ├── TextAlignButton.tsx
│   ├── ListButton.tsx
│   └── ImageButton.tsx
├── tiptap-icons/          # 16 SVG icon components (TSX)
└── tiptap-extension/      # Empty — prepared for custom Tiptap extensions
```

### Component Patterns
- `.vue` files use `<script setup>` with TypeScript
- Toolbar UI components (`tiptap-ui/`, `tiptap-icons/`, `components/`) use `defineComponent` with JSX render functions (`.tsx`)
- All editor operations go through utilities in `tiptap-utils.ts`

### tiptap-utils.ts Structure
Organized utility functions for:
- **Schema validation**: `isMarkInSchema()`, `isNodeInSchema()`, `isExtensionAvailable()`
- **Selection/navigation**: `focusNextNode()`, `isNodeTypeSelected()`, `getSelectedNodesOfType()`, `getSelectedBlockNodes()`
- **Node/position operations**: `findNodeAtPosition()`, `findNodePosition()`, `updateNodesAttr()`
- **URL/file handling**: `sanitizeUrl()`, `isAllowedUri()`, `handleImageUpload()` (currently mocked)
- **Keyboard shortcuts**: `isMac()`, `formatShortcutKey()`, `parseShortcutKeys()`
- `MAX_FILE_SIZE = 5MB` constant for image uploads

### TypeScript Configuration
Strict mode is enabled (`tsconfig.app.json`): unused variables/parameters are errors. Extends `@vue/tsconfig/tsconfig.dom.json`.

### Known State
- Image upload in `handleImageUpload()` is mocked (simulates progress, returns a placeholder URL)
- UI tooltip text is in Chinese (不 i18n-aware)
- `tiptap-extension/` directory is empty, reserved for future custom extensions
