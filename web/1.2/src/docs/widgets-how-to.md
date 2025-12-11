# Widgets How-To Guide

## What is a Widget?

A widget is a reusable, self-contained UI component that appears in a modal-like overlay panel in the application. Widgets provide a consistent way to display forms, lists, and other interactive content to users. They are typically triggered by navigation or user actions and can be used for:

- **Entity Editing**: Forms for creating or editing entities (e.g., user profile, settings)
- **Lists**: Displaying lists of items with actions (e.g., account menu, project list)
- **Custom Components**: Any custom React component that needs to appear in a widget panel

Widgets are registered in the application and can be opened by navigating to their associated `pathname`. They support features like:

- Custom width and sizing
- Header actions
- Save/abort handlers
- Custom styling
- Data hooks for dynamic content

## How to Create a Widget

### Step 1: Choose a Widget Type

The application provides several built-in widget types:

- **`EntityEditWidget`**: For forms that edit/create entities with fields
- **`ListWidget`**: For displaying lists of items with actions
- **Custom Widget**: Create your own React component

### Step 2: Create Widget Files

Create a new directory for your widget following this structure:

```
src/modules/{module-name}/widgets/{widget-name}/
  ├── index.ts          # Widget schema definition
  ├── useWidget.ts      # Optional: Hook for dynamic data
  ├── save-{entity}.ts  # Optional: Save handler function
  └── style.css         # Optional: Custom styles
```

### Step 3: Define the Widget Schema

Create the `index.ts` file with your widget schema. The schema must satisfy one of the widget schema types (`EntityEditWidgetSchema`, `ListWidgetSchema`, or `WidgetComponentProps`).

#### Example: Entity Edit Widget

```typescript
import { PATH_ACCOUNT_SETTINGS } from '@src/constants'
import { $t } from '@src/i18n'
import { closeWidget, EntityEditWidget, EntityEditWidgetSchema } from '@src/modules'
import { saveSettings } from './save-settings'
import { useWidget } from './useWidget'

export default {
  title: $t.SETTINGS,
  width: 'sm',
  onSave: saveSettings,
  pathname: PATH_ACCOUNT_SETTINGS,
  widgetHook: useWidget,
  widgetType: EntityEditWidget,

  header: [],
  onAbort: closeWidget,

  fields: [
    {
      name: 'color',
      title: 'Color',
      type: 'select',
      options: [
        { id: 'green', title: 'Green' },
        { id: 'blue', title: 'Blue' },
      ],
    },
    {
      name: 'email',
      title: $t.EMAIL,
      type: 'text',
      required: true,
      editState: 'readonly',
    },
  ],
} satisfies EntityEditWidgetSchema
```

#### Example: List Widget

```typescript
import { PATH_ACCOUNT } from '@src/constants'
import { $t } from '@src/i18n'
import { ListWidget, ListWidgetSchema } from '@src/modules'
import { useWidget } from './useWidget'

export default {
  title: $t.ACCOUNT,
  width: 'sm',
  pathname: PATH_ACCOUNT,
  widgetType: ListWidget,
  widgetHook: useWidget,

  header: [],

  items: [
    {
      id: 'profile',
      title: 'Profile',
      icon: 'badge',
      url: PATH_ACCOUNT_PROFILE,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      url: PATH_ACCOUNT_SETTINGS,
    },
    {
      id: 'signout',
      title: 'Sign out',
      icon: 'logout',
      handler: logout,
    },
  ],
} satisfies ListWidgetSchema
```

### Step 4: Create Optional Hook (useWidget.ts)

If your widget needs dynamic data or state management, create a `useWidget.ts` file:

```typescript
import { useAppSelector } from '@src/hooks'
import type { EntityEditWidgetSchema } from '@src/modules'

export function useWidget(props: EntityEditWidgetSchema): EntityEditWidgetSchema {
  const settings = useAppSelector((state) => state.general.settings)
  return { ...props, entity: settings }
}
```

The hook receives the widget props and returns modified props. This is useful for:

- Loading data from Redux state
- Transforming data before display
- Adding conditional fields based on state

### Step 5: Create Save Handler (Optional)

For entity edit widgets, create a save handler function:

```typescript
import { closeWidget, setSettings } from '@src/modules'
import type { AppContext } from '@src/types'

export async function saveSettings(cn: AppContext, { entity }: { entity: GeneralStateSettings }) {
  setSettings(cn, entity)
  closeWidget(cn)
}
```

The save handler receives:

- `cn`: The application context
- An object with the entity data (for EntityEditWidget)

## Where to Put Files

Widgets should be organized by module in the following structure:

```
src/modules/
  └── {module-name}/
      └── widgets/
          ├── {widget-name-1}/
          │   ├── index.ts
          │   ├── useWidget.ts
          │   ├── save-{entity}.ts
          │   └── style.css
          └── {widget-name-2}/
              └── index.ts
```

**Examples:**

- Account widgets: `src/modules/account/widgets/`
- Project widgets: `src/modules/project/widgets/`
- General widgets: `src/modules/general/widgets/`

## How to Register Widgets in core/widgets

After creating your widget, you need to register it in `src/core/widgets.ts`:

1. **Import your widget** at the top of the file:

```typescript
import myNewWidget from '../modules/{module-name}/widgets/{widget-name}'
```

2. **Add it to the `widgetSchemas` array**:

```typescript
export const widgetSchemas: WidgetComponentProps[] = [
  account,
  accountProfile,
  accountSettings,
  myNewWidget, // Add your widget here
  // ... other widgets
]
```

**Complete Example:**

```typescript
import { WidgetComponentProps } from '@src/modules'
import account from '../modules/account/widgets/account'
import accountProfile from '../modules/account/widgets/account-profile'
import myNewWidget from '../modules/my-module/widgets/my-widget'

export const widgetSchemas: WidgetComponentProps[] = [account, accountProfile, myNewWidget]

export const compositeWidgets: Record<string, WidgetComponentProps[]> = {}
```

Once registered, your widget will be available and can be opened by navigating to its `pathname`.

## How to Add Styles

There are several ways to add custom styles to your widget:

### Method 1: Widget-Level CSS File (Recommended)

Create a `style.css` file in your widget directory and import it in `index.ts`:

**style.css:**

```css
/* Widget: Account Settings */
.widget[data-name='account-settings'] {
  .entity-item[data-name='color'] {
    /* Custom styles for the color field */
    select {
      border-radius: 8px;
    }
  }
}

/* Widget: Account */
.widget[data-name='account'] {
  .account-brand {
    height: inherit;
    img {
      padding: 2rem;
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  }

  .separator {
    margin-top: 2rem;
    border-top: 1px solid var(--gray-200);
  }

  html.dark .separator {
    border-bottom: 1px solid var(--neutral-600);
  }
}
```

**index.ts:**

```typescript
import './style.css'
// ... rest of widget definition
```

**Important:** Always scope your styles using the widget's `pathname` attribute selector: `.widget[data-name='your-pathname']` to avoid style conflicts.

### Method 2: Inline CSS Property

You can add inline CSS using the `css` property in the widget schema:

```typescript
export default {
  // ... other properties
  css: 'custom-widget-class',
  // ...
} satisfies EntityEditWidgetSchema
```

Then add styles in your global CSS or widget CSS file:

```css
.widget.custom-widget-class {
  /* Your styles */
}
```

### Method 3: Field-Level CSS

For entity edit widgets, you can add CSS classes to individual fields:

```typescript
fields: [
  {
    name: 'photo',
    title: '',
    type: 'image',
    css: 'custom-photo-field', // Add CSS class
  },
]
```

Then style it:

```css
.widget[data-name='account-profile'] {
  .entity-item[data-name='photo'] {
    align-items: center;

    img {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
}
```

### Method 4: Item-Level CSS (List Widgets)

For list widgets, you can add CSS classes to individual items:

```typescript
items: [
  {
    id: 'brand',
    css: 'account-brand', // Add CSS class
    handler() {
      // ...
    },
  },
  {
    id: 'separator',
    css: 'separator', // Add CSS class
    title: 'Section',
  },
]
```

### Styling Best Practices

1. **Always scope styles** using `[data-name='your-pathname']` to prevent conflicts
2. **Use CSS variables** for colors to support dark mode:
   ```css
   color: var(--gray-500);
   border-color: var(--gray-200);
   ```
3. **Support dark mode** by using the `html.dark` selector:
   ```css
   html.dark .your-class {
     /* Dark mode styles */
   }
   ```
4. **Keep styles modular** - each widget should have its own CSS file
5. **Use semantic class names** that describe the purpose, not the appearance

## Widget Schema Properties

### Common Properties (All Widgets)

- `title`: The widget title displayed in the header
- `pathname`: Unique pathname used to identify and open the widget
- `widgetType`: The React component to render (e.g., `EntityEditWidget`, `ListWidget`)
- `widgetHook`: Optional function to transform widget props
- `width`: Widget width (`'sm'`, `'md'`, `'lg'`, `'xl'`, `'2xl'`, `'full'`)
- `minWidth`: Minimum widget width
- `fullHeight`: Whether the widget should take full height
- `header`: Array of header actions
- `actions`: Array of widget actions
- `messages`: Array of messages to display
- `css`: Custom CSS class for the widget container
- `onAbort`: Function called when widget is closed/cancelled

### EntityEditWidget Specific

- `fields`: Array of form fields
- `entity`: The entity data to edit
- `onSave`: Function called when form is saved
- `onChange`: Optional function called when form values change

### ListWidget Specific

- `items`: Array of list items
- `selectable`: Whether items can be selected
- `selectedItems`: Array of selected item IDs
- `onActivateItem`: Function called when an item is activated
- `onSelectChange`: Function called when selection changes
- `emptyListImage`: Image to show when list is empty
- `emptyListMessage`: Message to show when list is empty

## Opening Widgets

Widgets are opened by navigating to their `pathname`. You can do this:

1. **Via URL navigation**: Navigate to the pathname in your app
2. **Via programmatic navigation**: Use your routing system to navigate to the pathname
3. **Via item URLs** (in ListWidget): Set the `url` property on list items

## Examples

See the following widgets for reference:

- **Entity Edit Widget**: `src/modules/account/widgets/account-settings/`
- **List Widget**: `src/modules/account/widgets/account/`
- **Widget with Hook**: `src/modules/account/widgets/account-profile/`
