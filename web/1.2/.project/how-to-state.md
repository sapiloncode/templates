## Managing State

The web client keeps long-lived data in two managed layers:

1. **App-level state (Redux Toolkit)** – global data that survives widget swaps and route changes.
2. **Widget-level state (React local state)** – ephemeral data bound to a single widget instance.

Understanding the responsibilities of each layer makes it easier to wire new features without accidental coupling.

---

## App-Level State (Redux)

The Redux store lives in `src/core/store.ts`, is provided to the tree in `src/main.base.tsx`, and aggregates every module slice under a single `RootState`.

```11:44:web/src/core/store.ts
const appReducer = combineReducers({
  account: accountState.reducer,
  topic: topicState.reducer,
  contact: contactState.reducer,
  file: fileState.reducer,
  message: messageState.reducer,
  timeline: timelineState.reducer,
  theme: themeState.reducer,
  general: generalState.reducer,
})
```

### When to use it

- Persisted domain entities (topics, contacts, steps, etc.).
- Data shared between widgets or pages.
- Values that need to survive navigation and re-render cycles.

### Setting up a new slice

1. **Create the slice** inside `src/modules/<domain>/state.ts`. Use `createModuleState` to bootstrap reducers with helpers like `set`, `updateItemById`, etc.
   ```15:73:web/src/modules/topic/state.ts
   export const topicState = createModuleState('topic', initialState, ({ set, updateItemById, deleteItemById }) => ({
     topicsLoaded: set('topics'),
     topicLoaded: updateItemById('topics'),
     topicDeleted: deleteItemById('topics'),
     // ...
   }))
   ```
2. **Export actions** directly from the slice so UI code and thunks can dispatch them.
3. **Register the reducer** in `src/core/store.ts`. If your module is scaffolded from a template, the addition may already exist.
4. (Optional) **Add async flows** in `src/modules/<domain>/lib/`. These functions may dispatch actions via the app context (`cn.dispatch`) or by importing the actions directly.

### Consuming app state

- React components use `useAppSelector` (`src/hooks/use-app-selector.ts`) for typed access to `RootState`.
- Widgets receive `dispatch` and `getAppState` via `AppContext` so non-React utility functions can read or mutate state.
- For complex derived data, colocate selectors next to the slice and reuse them across widgets.

### Testing & tooling tips

- `window.store` and `window.getAppState` are exposed in development/E2E (`src/core/store.ts`) for Cypress-driven scenarios.
- The serializable check already ignores persist actions; keep payloads serializable to avoid warnings.

---

## Widget-Level State

Each widget runs in isolation and can manage transient UI state by attaching values to the `AppContext.widgetState`. Hooks created for widgets set up this context-bound state and return final props for the render component.

```7:19:web/src/modules/topic/widgets/subtopics/use-widget.ts
export function useWidget({ cn, ...props }: ListWidgetSchema) {
  const [newTopicMode, setNewTopicMode] = useState(false)
  const allTopics = useAppSelector((state) => state.topic.topics)
  cn.widgetState = { setNewTopicMode }
  // ...
  return { cn, ...props, items: toListItems(items), title: topic.title, showUserInput: newTopicMode }
}
```

The associated widget metadata can then call back into that state:

```22:45:web/src/modules/topic/widgets/topics/widget.ts
async onUserInputAbort(cn: AppContext) {
  const { setNewTopicMode, setSearchMode } = cn.widgetState
  setNewTopicMode(false)
  setSearchMode(false)
},
// ...
{
  name: 'create',
  tooltip: 'Add Topic',
  icon: 'add_circle',
  async handler(cn) {
    const { setNewTopicMode } = cn.widgetState
    setNewTopicMode(true)
  },
},
```

### When to use it

- UI toggles, modals, form states that belong exclusively to a widget instance.
- Values that can be recomputed from Redux or props without needing persistence.
- Handlers triggered from widget menus (`header`, `actions`, etc.) where React hooks are unavailable.

### Setting up widget state

1. **Define a hook** (`widgetHook`) next to the widget schema. Use React state (`useState`, `useReducer`, etc.) for transient values.
2. **Expose handlers via `cn.widgetState`** so event callbacks defined on the schema can mutate the hook state.
3. **Return derived props** from the hook to drive UI components. Avoid storing data in `widgetState` that should be global—prefer selectors for that.

### Tips & conventions

- Always check `props.cn` in widget wrappers; `WithHookWidget` ensures the context exists and wires `widgetState` automatically.
- Keep `widgetState` serializable where possible to ease debugging, but it is not persisted across reloads.
- Clean up mode flags (like `setNewTopicMode(false)`) in abort handlers to avoid lingering visual state.

---

## Choosing the Right Layer

- **Need persistence or cross-widget sharing?** Use Redux.
- **Need per-widget UI toggles or interim form state?** Use `widgetState`.
- **Unsure?** Start local; if multiple widgets or async flows require the data, promote it to Redux.

Following these conventions keeps the `AppContext` predictable, ensures widgets remain portable, and makes it easier to scale new modules without breaking existing ones.
