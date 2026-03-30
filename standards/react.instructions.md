---
applyTo: "**/*.tsx,**/*.jsx"
---

# React & TypeScript Style Guide

This guide defines how to write React and TypeScript code. Follow these rules exactly. When in doubt, choose the simpler, smaller, more modular approach.

---

## Hard Rules (Non-Negotiable)

These rules are absolute. Never violate them.

1. **No inline functions in JSX** — extract handlers above the `return`. Exceptions: one-liner setters on simple form inputs, and `.map()` callbacks (but the map body itself should not define further functions).
2. **No complex ternaries in JSX.** If a ternary involves objects, multi-line expressions, or calculations, extract it to a variable or function above the `return`.
3. **No logic in JSX.** JSX should read like a template. All computed values, boolean flags, and derived state must be extracted to named variables above the `return`.
4. **Component size limits.** Presentational components: max 80 lines. Container/feature components: max 200 lines. If you exceed these, extract subcomponents.
5. **JSX return max depth.** If JSX nesting exceeds 4 levels, extract inner sections to subcomponents.
6. **One responsibility per component.** If a component does loading AND data fetching AND rendering, split it.
7. **No prop drilling past 2 levels.** Use Context instead.

---

## File & Directory Organization

### Feature Directory Structure

Every feature gets its own directory. Complex components within a feature get subdirectories.

```
feature-name/
├── FeatureName.tsx            # Main/entry component
├── FeatureName.module.scss    # Styles for main component
├── FeatureNameWrapper.tsx     # Optional: provider wrapper
├── FeatureName.context.tsx    # Optional: feature context
├── index.ts                   # Barrel exports (public API only)
├── types.ts                   # Types and interfaces
├── api.ts                     # API functions
├── utils.ts                   # Data transforms, helpers
├── constants.ts               # Constants, enums, defaults
├── components/                # Subcomponents
│   ├── SubComponent/
│   │   ├── SubComponent.tsx
│   │   ├── SubComponent.module.scss
│   │   └── index.ts
│   └── SimpleComponent.tsx    # Simple components don't need a dir
├── hooks/                     # Custom hooks
│   └── use-feature-data.ts
└── __tests__/                 # Tests mirror component structure
    └── FeatureName.test.tsx
```

### What Goes Where

| File | Contains | Does NOT contain |
|------|----------|-----------------|
| `types.ts` | Interfaces, types, enums | Component code, logic |
| `api.ts` | API call functions, response types | State management, UI logic |
| `utils.ts` | Data transforms, formatters, mappers | API calls, React hooks |
| `constants.ts` | Enums, default configs, static arrays | Functions with logic |
| `FeatureName.context.tsx` | Context definition, Provider component | Rendering UI |

### Index Files (Barrel Exports)

Only export the public API. Hide implementation details.

```tsx
// index.ts
export { FeatureName } from './FeatureName'
export { FeatureNameWrapper } from './FeatureNameWrapper'
// Do NOT export internal components, hooks, or utils
```

---

## Component Structure

### Declaration Patterns

**Use arrow functions for all components** — both main and subcomponents.

```tsx
// Main component
export const SiteBios = () => {
  return <div>...</div>
}

// Subcomponent
export const BiosTableRow = ({ bio }: BiosTableRowProps) => {
  return <Row>...</Row>
}
```

**Exception:** `function` declarations are acceptable for generic components where the syntax is cleaner.

```tsx
// Generic component - function declaration avoids awkward arrow syntax
export function DataGrid<RowData>({
  columns,
  data,
}: DataGridProps<RowData>): JSX.Element {
  return <div>...</div>
}
```

### File Structure Order

```tsx
// 1. Imports (React → external libs → internal absolute → relative → styles → types)
// 2. Constants / default configs
// 3. Types/Interfaces (if not in types.ts)
// 4. Helper functions (pure, not hooks)
// 5. Component
// 6. Unexported subcomponents (if small and only used here)
```

### Component Size Guidelines

| Component Type | Max Lines | If Exceeded |
|----------------|-----------|-------------|
| Presentational (renders UI) | 80 | Extract subcomponents |
| Container (orchestrates logic) | 200 | Split into container + children |
| Context Provider | 100 | Move logic to custom hooks |
| Modal | 150 | Extract form/content to subcomponent |

### When to Extract a Component

Extract when:
- A JSX block is > 30 lines
- A ternary branch contains more than a single component/element
- You're mapping with local variables inside the map callback
- The same UI pattern appears twice
- A section has its own state or event handlers
- You need to describe what a block does (the description becomes the component name)
- A form field is visually complex (multiselect, rich editor, large radio group)
- Fields within a section have dependent validation or interact with each other

**Component extraction is driven by complexity, not just length.** A 20-line section with interdependent fields should be extracted. A 40-line section of flat, simple inputs might be fine in place.

### When a Component Gets Its Own Directory

A component gets a subdirectory (with `index.ts`) when:
- It's in a shared/design system package
- It has its own stylesheet (`.module.scss`)
- It has subcomponents of its own

Simple components that are just a single `.tsx` file can live flat in a parent `components/` directory.

---

## Whitespace & Readability

Code that has no breathing room is hard to read. Use blank lines intentionally to separate logical sections.

### Component Body Spacing

Separate each logical section with a blank line. The sections, in order:

```tsx
export const MyComponent = () => {
  // 1. Hooks (grouped together)
  const { id } = useParams<{ id: string }>()
  const school = useSelector(schoolSelector)
  const { showModal, hideModal } = useContext(ModalContext)
  const toast = useToast()
  const { data, loading, actions } = useCustomRoles()

  // 2. State (grouped together)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<Option>()

  // 3. Derived values
  const currentItem = useMemo(
    () => data.find((item) => item.id === selectedOption?.value),
    [data, selectedOption]
  )

  // 4. Data fetching (useCallback)
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    const result = await fetchSomething(id)
    setIsLoading(false)
  }, [id])

  // 5. Handlers (blank line between EACH handler)
  const handleChange = (option: Option) => {
    setSelectedOption(option)
  }

  const handleSave = async () => {
    if (!currentItem) return
    await actions.onSave(currentItem.id)
  }

  const handleDelete = async () => {
    await actions.onRemove(currentItem.id)
  }

  // 6. Computed flags
  const isDisabled = useMemo(
    () => !selectedOption || isLoading,
    [selectedOption, isLoading]
  )

  // 7. Effects
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 8. Render
  return (
    <div>...</div>
  )
}
```

### JSX Spacing

- When a JSX element has a long `className` or multiple props, break to multiple lines with closing `>` on its own line:

```tsx
// Good — breathes
<div
  className={cx('col-12-xs dsp-flex-xs flex-wrap uni-mb-60', cl.container)}
>

// Bad — scrunched
<div className={cx('col-12-xs dsp-flex-xs flex-wrap uni-mb-60', cl.container)}>
```

- Multi-prop elements: one prop per line when there are 3+ props, or when any prop value is complex:

```tsx
// Good
<SelectDropdown
  className={cx('col-12-xs uni-mb-32', cl.selectDropdown)}
  placeholder="Select Role"
  options={customRoleOptions}
  selectedValue={currentRoleOption?.value}
  onChange={handleCustomRoleChange}
  name="customRole"
/>

// Bad — too dense
<SelectDropdown className={cx('col-12-xs uni-mb-32', cl.selectDropdown)} placeholder="Select Role" options={customRoleOptions} selectedValue={currentRoleOption?.value} onChange={handleCustomRoleChange} name="customRole" />
```

### Type/Interface Spacing

Blank line after type or interface definitions, before the component export:

```tsx
type Props = {
  name: string
  disabled: boolean
}

export const MyComponent = ({ name, disabled }: Props) => {
```

---

## TypeScript & Types

### Interface vs Type

- **`interface`** for component props, context types, and object shapes
- **`type`** for unions, intersections, mapped types, and utility types

```tsx
// Interface for object shapes
interface UserCardProps {
  user: User
  onSelect: (userId: string) => void
}

// Type for unions and utilities
type RecipientParams = AllUsersParams | UsersParams | CourseParams
type FormFields = Pick<User, 'name' | 'email'>
```

### Props Interface Naming

**Exported interfaces:** Use descriptive name matching the component.

```tsx
export interface DataGridProps<RowData> { ... }
export interface CreateBioModalProps { ... }
```

**Internal/non-exported interfaces:** `Props` is fine.

```tsx
interface Props {
  label: string
  value: number
}
```

### Generics

Use generics when a component or hook handles multiple data shapes.

```tsx
// Generic hook
export function usePaginatedFetch<Input, Output>(
  props: UsePaginatedFetchProps<Input, Output>,
): UsePaginatedFetch<Input, Output> { ... }

// Generic component
export const DataGridRow = <RowData extends Record<string, unknown>>({
  row,
}: DataGridRowProps<RowData>) => { ... }
```

### Enums

Use enums for finite sets of string constants. **Never write raw string values for an enum outside the enum definition itself.**

```tsx
export enum RecipientTypes {
  ALL_USERS = 'all_users',
  USERS = 'users',
  COURSE = 'course',
  CUSTOM = 'custom',
}

// GOOD - reference the enum
if (recipientType === RecipientTypes.ALL_USERS) { ... }

// BAD - raw string
if (recipientType === 'all_users') { ... }
```

### Enum-to-Style Mapping

When an enum controls visual styling, map it to CSS class names. Either use an explicit map or derive the class name directly from the enum value.

```tsx
// Option A: derive class from enum value (when enum values are valid CSS class names)
<div className={cx(cl.card, cl[status])} />

// Option B: explicit map (when you need different class names)
const statusClassMap: Record<ItemStatus, string> = {
  [ItemStatus.ACTIVE]: cl.active,
  [ItemStatus.PENDING]: cl.pending,
  [ItemStatus.INACTIVE]: cl.inactive,
}

<div className={cx(cl.card, statusClassMap[status])} />
```

### Separate Request Types from Entity Types

```tsx
// Entity (what you display)
interface Bio {
  id: string
  name: string
  bio: string
  profile_image_url: string
}

// Request (what you send to API)
interface BioRequest {
  name: string
  bio: string
  profile_image_url?: string
}
```

### Using Library Types Directly

Prefer using library types directly for internal subcomponents rather than creating wrapper types.

```tsx
// Good - use library types directly
import { Cell, Row } from '@tanstack/react-table'

export interface DataGridCellProps<RowData> {
  cell: Cell<RowData, unknown>
}

// Avoid - unnecessary wrapper types
interface OurCellType<TData> {
  id: string
  value: unknown
}
```

---

## Props

- Destructure in function signature: `function Foo({ bar, baz }: Props)`
- Spread props to native elements when wrapping: `<button {...rest}>`
- Provide explicit types — no implicit `any`
- JSDoc comments on exported interface props for documentation

```tsx
export interface StatsCardProps {
  /** Numeric value to display */
  value: number | undefined
  /** Label shown below the value */
  label: string
  /** Whether to show a % suffix */
  isPercent?: boolean
  /** Loading state */
  isLoading?: boolean
}
```

---

## JSX Rules

**JSX must read like a template.** If you have to pause to understand what's happening, extract it.

### Extract All Computed Values Before Return

```tsx
// BAD - logic in JSX
return (
  <BulkSelectionRow
    colSpan={
      tableInstance.getHeaderGroups()[0]?.headers.length +
      (enableSelectAllOnPage ? 1 : 0)
    }
  />
)

// GOOD - semantic variables before return
const headerColumnCount = tableInstance.getHeaderGroups()[0]?.headers.length ?? 0
const checkboxColumnCount = enableSelectAllOnPage ? 1 : 0
const bulkRowColSpan = headerColumnCount + checkboxColumnCount

return <BulkSelectionRow colSpan={bulkRowColSpan} />
```

### No Inline Functions in JSX

```tsx
// BAD
return <button onClick={() => { doThing(); doOtherThing() }}>Toggle</button>

// GOOD
const handleToggle = () => { doThing(); doOtherThing() }
return <button onClick={handleToggle}>Toggle</button>
```

**Exceptions:**

1. Simple one-liner setters on form inputs:

```tsx
<InputText
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
/>
```

2. `.map()` callbacks in JSX (these are inherently inline). But the map body **must not define further functions** inside it — if you need handlers per item, extract a row component.

```tsx
// OK - map is an exception
{tabs.map(({ key, label, route }) => (
  <Tab key={key} label={label} onClick={() => navigate(route)} />
))}

// BAD - map body defines a function
{items.map((item) => {
  const handleClick = () => selectItem(item.id)  // Don't do this
  return <div onClick={handleClick}>{item.name}</div>
})}

// GOOD - extract a component instead
{items.map((item) => (
  <ItemRow key={item.id} item={item} onSelect={selectItem} />
))}
```

### Ternary Rules

**Allowed inline:**
- Simple value switching: `{isPaid ? 'Paid' : 'Unpaid'}`
- Single prop switching: `variant={isActive ? 'success' : 'default'}`
- Simple component switching: `{isEnabled ? <ActiveState /> : <InactiveState />}`

**Must extract to variable:**
- Object creation: `style={condition ? { height: 100 } : undefined}` — NO
- Multi-line expressions
- Calculations or method chains
- Anything with nested ternaries

```tsx
// BAD - object in ternary
<div style={enableVirtualization ? { height: tableHeight } : undefined}>

// GOOD
const containerStyle = enableVirtualization ? { height: tableHeight } : undefined
return <div style={containerStyle}>
```

**Must extract to subcomponent:**
- Ternary branches with > 5 lines of JSX
- Branches containing `.map()` calls
- Branches with their own local variables

```tsx
// BAD - complex ternary branches
<tbody>
  {enableVirtualization
    ? virtualRows.map((vr) => {
        const row = rows[vr.index]
        return <VirtualRow key={row.id} row={row} />
      })
    : rows.map((row) => <StandardRow key={row.id} row={row} />)}
</tbody>

// GOOD - extract to subcomponents
{enableVirtualization ? (
  <VirtualizedTableBody virtualRows={virtualRows} rows={rows} />
) : (
  <StandardTableBody rows={rows} />
)}
```

### Conditional Rendering with `&&`

Conditions must be **semantic booleans** — named variables that describe what the condition means.

```tsx
// BAD - raw conditions in JSX
{meta && <PaginationInfo meta={meta} />}
{selectedCount > 0 && <BulkActions />}
{meta && pagination && onPaginationChange && <PaginationControls />}

// GOOD - semantic boolean names
const hasPaginationInfo = !!meta
const showBulkActions = selectedCount > 0
const hasPaginationControls = !!(meta && pagination && onPaginationChange)

return (
  <>
    {hasPaginationInfo && <PaginationInfo meta={meta} />}
    {showBulkActions && <BulkActions />}
    {hasPaginationControls && <PaginationControls />}
  </>
)
```

### Early Returns vs Wrapper Loading

**Use `LoaderSkeleton` as a wrapper** when the page header/shell should remain visible during loading. This is the primary pattern.

```tsx
// PREFERRED - LoaderSkeleton wrapper keeps page header visible
export const FeaturePage = () => {
  const { items, isLoading } = useContext(FeatureContext)

  const hasItems = items.length > 0

  return (
    <div>
      <PageHeader title="Feature">
        <Button onClick={handleAdd}>Add Item</Button>
      </PageHeader>
      <LoaderSkeleton
        active={isLoading}
        dataTestAttribute="feature-loader"
        widthRatio={4}
        lines
      >
        {hasItems ? (
          <Table rows={items.map((item) => <ItemRow key={item.id} item={item} />)} />
        ) : (
          <EmptyState />
        )}
      </LoaderSkeleton>
    </div>
  )
}
```

**Use early returns** only in entry/wrapper components for permission gates, or when the entire page should be replaced.

```tsx
// Early returns for permission/feature gates in wrapper components
export const FeatureWrapper = () => {
  const { schoolPlan, isLoading } = useCurrentSchoolPlan()
  const isEnabled = schoolPlan?.isPermissionEnabled(Permission.FEATURE)

  if (isLoading) return <Loader overlay="container" />
  if (!isEnabled) return <Upsell />

  return (
    <FeatureProvider>
      <FeaturePage />
    </FeatureProvider>
  )
}
```

### Map Rendering

Keep map callbacks simple. If you need local variables, extract a row component.

```tsx
// BAD - logic inside map
{items.map((item) => {
  const isDisabled = disabledIds.has(item.id)
  const label = isDisabled ? `${item.name} (disabled)` : item.name
  return (
    <div key={item.id} className={cx(cl.row, isDisabled && cl.disabled)}>
      <span>{label}</span>
      <button disabled={isDisabled} onClick={() => handleSelect(item.id)}>
        Select
      </button>
    </div>
  )
})}

// GOOD - extract row component
{items.map((item) => (
  <ItemRow key={item.id} item={item} onSelect={handleSelect} />
))}
```

---

## State Management

### useState Patterns

Always destructure hooks from the React import. Do not use `React.useState`, `React.useEffect`, etc.

```tsx
// GOOD
import { useState, useEffect, useCallback } from 'react'

const [items, setItems] = useState<Item[]>([])
const [isLoading, setIsLoading] = useState(false)
const [selectedId, setSelectedId] = useState<string | null>(null)
const [errorMessage, setErrorMessage] = useState<string | undefined>()

// BAD
const [items, setItems] = React.useState<Item[]>([])
```

### When to Use What

| State Type | Tool | Example |
|------------|------|---------|
| Local UI state | `useState` | `isOpen`, `selectedTab` |
| Feature-scoped shared state | React Context | Form state across wizard steps |
| Server/entity data cache | Redux | User entities, integrations |
| URL-derived state | `useSearchParams` | Pagination page, filters |
| Form state | Formik | Form fields, validation |

### Derived State

Compute derived values as `const` variables, not additional state.

```tsx
// BAD - derived state in useState
const [isDisabled, setIsDisabled] = useState(false)
useEffect(() => {
  setIsDisabled(blockSend || sendLoading || !confirmedAt)
}, [blockSend, sendLoading, confirmedAt])

// GOOD - computed variable
const isDisabled = blockSend || sendLoading || !confirmedAt
```

---

## Hooks

### useContext — Direct Usage

Use `useContext` directly. Do not create custom hooks that just wrap `useContext`.

```tsx
// GOOD
const { bios, isLoading, loadBios } = useContext(SiteBiosContext)

// BAD - unnecessary wrapper
const useSiteBios = () => useContext(SiteBiosContext) // Don't do this
```

### Custom Hooks — When to Use

Create custom hooks for **reusable logic**, not context wrappers.

**Good use cases for custom hooks:**
- Data fetching with loading/error state (`useWorkflows`, `usePaginatedFetch`)
- Form section helpers that return validation + state (`useUserSelection`)
- Complex derived logic shared across components (`useLookupField`)

```tsx
// Good custom hook - reusable data fetching logic
export const useWorkflows = (): UseWorkflows => {
  const [isLoading, setIsLoading] = useState(false)
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  const fetchWorkflows = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await getWorkflows()
      setWorkflows(data.workflows)
    } catch {
      setWorkflows([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkflows()
  }, [])

  return { isLoading, workflows, fetchWorkflows }
}
```

### useCallback

Use `useCallback` for:
- Async functions passed as dependencies to `useEffect`
- Functions passed to child components that affect their rendering
- Functions used in context provider `value`

Do NOT use `useCallback` for:
- Simple event handlers that are only used in the same component
- Functions that aren't dependencies of anything

```tsx
// Good - async function used as effect dependency
const loadBios = useCallback(async () => {
  const bios = await fetchPaginatedBios()
  setBios(bios)
  setIsLoading(false)
}, [fetchPaginatedBios])

useEffect(() => {
  loadBios()
}, [loadBios])
```

### useEffect — Acceptable Uses

1. **Data fetching on mount**
2. **URL param sync** (updating URL when state changes)
3. **Reacting to error state** (showing toast on error)
4. **External library integration** (setting up refs for third-party code)

```tsx
// 1. Data fetch on mount
useEffect(() => {
  loadBios()
}, [])

// 2. URL param sync
useEffect(() => {
  setSearchParams((params) => {
    params.set('page', page.toString())
    return params
  })
}, [page, setSearchParams])

// 3. Error toast
useEffect(() => {
  if (isError) {
    toast?.add({ type: 'error', content: errorMessage })
  }
}, [isError])
```

**Do NOT use useEffect for:**
- Derived state (use computed variables instead)
- Transforming props into state
- Anything that can be a simple variable assignment

### useEffect Dependency Arrays & exhaustive-deps

Be intentional about dependency arrays. A mount-only effect should have `[]` — do not add dependencies just to satisfy the linter if the intent is "run once on mount."

- **Mount-only effects:** Use `[]` and suppress the lint rule if needed. Adding deps "to be safe" makes you responsible for ensuring none of them change unexpectedly, which is harder to reason about.
- **Sync effects** (URL params, error toasts): Include the specific values you're reacting to.
- **Suppress with `// eslint-disable-next-line react-hooks/exhaustive-deps`** when the intent is clear and adding deps would cause unwanted re-runs.

```tsx
// Mount-only fetch — empty deps, suppress lint if needed
useEffect(() => {
  loadItems()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

// Sync effect — include the value being synced
useEffect(() => {
  setSearchParams((params) => {
    params.set('page', page.toString())
    return params
  })
}, [page, setSearchParams])
```

### useMemo

Use `useMemo` for genuinely expensive computations or objects passed to memoized children. Don't use it for simple derivations.

```tsx
// Good - expensive or referentially stable object
const htmlEditorProps = useMemo(() => ({
  width: '100%',
  value: message,
  onChange,
}), [message, onChange])

// Bad - simple derivation doesn't need useMemo
const fullName = useMemo(() => `${first} ${last}`, [first, last]) // Just use const
```

---

## Event Handlers

### Naming

- **`handle` prefix** — use when a user action triggers **multiple things** (the action + side effects like toasts, reloads, closing modals). Common for form submit, save, delete.
- **Direct semantic name** — use when the action is a **simple 1:1 mapping** to a single result. The name describes the action or outcome.

```tsx
// handle — multiple things happen (delete + toast + reload + close modal)
const handleDelete = async () => {
  const { data, errors } = await deleteItem(item.id)
  if (errors || !data) {
    setErrorMessage(errors)
  } else {
    toast?.add({ type: 'success', content: 'Deleted.' })
    await loadItems()
    onRequestClose?.()
  }
}

// direct semantic name — simple 1:1 action
const resetFilters = () => {
  setSelectedUserId(null)
}

const openPreview = () => {
  window.open(previewUrl, '_blank')
}
```

- Be specific: `handleToggleActive` not `handleClick`

### Structure

Define handlers above the return statement. **Always use `async`/`await` for async operations**, not `.then()` chains. Use try/catch/finally when the operation can throw.

```tsx
// Standard async handler pattern:
// 1. Call API with await
// 2. Check for errors
// 3. On success: toast, reload data, close modal/notify parent
// 4. On error: set error state
const handleDelete = async () => {
  const { data, errors } = await deleteItem(item.id)
  if (errors || !data) {
    setErrorMessage(errors)
  } else {
    toast?.add({ type: 'success', content: 'Item deleted.' })
    await loadItems()
    onRequestClose?.()
  }
}

// For operations that can throw (e.g., network errors):
const fetchData = async () => {
  try {
    setIsLoading(true)
    const { data } = await getItems()
    setItems(data)
  } catch {
    setItems([])
  } finally {
    setIsLoading(false)
  }
}

const handleAdd = () => {
  showModal(CreateUpdateModal, { loadItems })
}

return (
  <Button onClick={handleAdd}>Add</Button>
)
```

### Formik Integration

Use Formik's `handleChange` directly for simple inputs. Extract handlers for complex logic.

```tsx
<Formik<CreateFormState>
  initialValues={initialValues}
  onSubmit={handleSubmit}
  validationSchema={validationSchema}
>
  {({ values, errors, handleChange, submitCount }) => (
    <Form>
      <InputText
        id="fullName"
        name="fullName"
        value={values.fullName}
        onChange={handleChange}
        error={submitCount > 0 ? errors.fullName : ''}
      />
    </Form>
  )}
</Formik>
```

### Optional Callback Props

Use optional chaining to call callback props that may not be provided.

```tsx
// GOOD - clean optional chaining
onSave?.()
onRequestClose?.()
onChange?.(newValue)

// AVOID - verbose null checks
if (onSave) { onSave() }
onSave && onSave()
```

### Validation Before Action

Validate in the handler, not in JSX. Show toasts for each validation error.

```tsx
const handleSend = () => {
  const isValid = validateFields()
  if (!isValid) return
  showModal(ConfirmationModal, { onConfirm: sendMessage })
}

const validateFields = (): boolean => {
  if (!subject.trim()) {
    toast?.add({ type: 'error', content: 'Subject is required.' })
    return false
  }
  if (!message.trim()) {
    toast?.add({ type: 'error', content: 'Message is required.' })
    return false
  }
  return true
}
```

---

## Context & Providers

### Context File Structure

```tsx
// FeatureName.context.tsx

// 1. Interface for context value (NOT exported — keep internal)
interface FeatureNameContextType {
  items: Item[]
  isLoading: boolean
  setItems: (items: Item[]) => void
  loadItems: () => Promise<void>
  paginationProps: PaginationProps
}

// 2. Create context with explicit default values
const defaultContext: FeatureNameContextType = {
  items: [],
  isLoading: false,
  setItems: () => {},
  loadItems: async () => {},
  paginationProps: {} as PaginationProps,
}

const FeatureNameContext = createContext<FeatureNameContextType>(defaultContext)

// 3. Export context for consumers
export { FeatureNameContext }

// 4. Provider component
export const FeatureNameProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadItems = useCallback(async () => {
    const data = await fetchItems()
    setItems(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadItems()
  }, [])

  return (
    <FeatureNameContext.Provider
      value={{ items, isLoading, setItems, loadItems, paginationProps }}
    >
      {children}
    </FeatureNameContext.Provider>
  )
}
```

**Context value rules:**
- Expose both processed functions (`loadItems`) AND raw state setters (`setItems`) when child components need direct state control
- Use explicit default values in `createContext`, not `{} as Type` casts
- Keep the context type interface non-exported (internal to the context file)

### Wrapper Component Pattern

Separate the provider wrapper from the main component. Wrappers can be **thin** (provider-only) or **gatekeeper** (loading/permissions/providers). Choose based on whether gating is needed.

**Thin wrapper — provider mount only:**

```tsx
// FeatureWrapper.tsx - just mounts the provider
export const FeatureWrapper = () => {
  return (
    <FeatureProvider>
      <FeaturePage />
    </FeatureProvider>
  )
}
```

**Gatekeeper wrapper — handles loading/permissions before mounting:**

```tsx
// FeatureWrapper.tsx - gates on permissions, then mounts provider
export const FeatureWrapper = () => {
  const { schoolPlan, isLoading } = useCurrentSchoolPlan()
  const isEnabled = schoolPlan?.isPermissionEnabled(Permission.FEATURE)

  if (isLoading) return <Loader overlay="container" />
  if (!isEnabled) return <Upsell />

  return (
    <FeatureProvider>
      <FeaturePage />
    </FeatureProvider>
  )
}
```

The main component consumes context and handles its own loading via `LoaderSkeleton`.

### Nested Providers

When multiple contexts are needed, nest providers in the wrapper.

```tsx
<WebhooksDataProvider>
  <FeatureDataProvider>
    <Dashboard />
  </FeatureDataProvider>
</WebhooksDataProvider>
```

---

## Forms

### Multi-Section Forms

For forms with multiple visible sections (not wizard steps):
- **Simple flat form:** Keep in one component, even with section headings.
- **Complex fields or dependent validation:** Break sections into subcomponents. Manage state with Formik (or Context if Formik doesn't fit). Subcomponents access form state via `useFormikContext()` — never prop-drill form state.
- **Prefer a single generic onChange** that updates a key-value object by field identifier. Formik does this automatically via `handleChange` and field `name` attributes.

### Formik with Typed Generics

```tsx
<Formik<CreateFormState>
  initialValues={initialValues}
  onSubmit={handleSubmit}
  validationSchema={validationSchema}
>
```

### Error Display After First Submit

Only show field errors after the user has attempted to submit.

```tsx
{({ errors, values, handleChange, submitCount }) => (
  <InputText
    error={submitCount > 0 ? errors.fieldName : ''}
    value={values.fieldName}
    onChange={handleChange}
  />
)}
```

### Form State vs Entity Type

Form state interfaces are separate from entity interfaces when field names differ or fields are optional.

```tsx
// Entity (from API)
interface Bio {
  id: string
  name: string
  bio: string
}

// Form state (what user fills in)
interface CreateBioFormState {
  fullName: string  // Maps to 'name'
  bio: string
  profileImageUrl: string
}
```

### Async Search with Debounce

```tsx
const loadOptions = (input: string, callback: (options: Option[]) => void) => {
  searchUsers(input)
    .then((options) => callback(options))
    .catch((error) => console.error(error))
}
const debouncedLoadOptions = debounce(loadOptions, 300)
```

---

## Data & API Layer

### API File Structure

Each feature has an `api.ts` with async functions that return `{ data, errors }`.

```tsx
// api.ts
export async function fetchBios(
  pageInfo: PaginationParams,
): Promise<ResolvedPaginatedResponse<Bio>> {
  const queryString = querystring.stringify({ ...pageInfo })
  return resolveData(
    api(`/api/v1/bios?${queryString}`, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
    })
  )
}

export async function createBio(
  params: BioRequest,
): Promise<ResolvedResponse<Bio>> {
  return resolveData(
    api('/api/v1/bios', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  )
}

export async function deleteBio(
  bioId: string,
): Promise<ResolvedResponse<void>> {
  const { data, errors } = await resolveData(
    api(`/api/v1/bios/${bioId}`, { method: 'DELETE' })
  )
  if (errors) {
    return {
      data,
      errors: getErrorResponse(errors, 'Problem deleting bio').errors,
    }
  }
  return { data, errors }
}
```

### Transform Functions in Utils

Data transformations belong in `utils.ts`, not in components.

```tsx
// utils.ts
export const transformFileMetadata = (file: ApiFile): AppFile => ({
  filename: file.name,
  url: file.cdn_url,
  size: file.size,
})

// Enum-to-enum mapping
const sourceMap: Record<OurSource, LibrarySource> = {
  [OurSource.LOCAL]: LibrarySource.LOCAL_FILES,
  [OurSource.DROPBOX]: LibrarySource.DROPBOX,
}

export const mapSources = (sources: OurSource[]): LibrarySource[] => {
  return sources.reduce<LibrarySource[]>((acc, source) => {
    const mapped = sourceMap[source]
    return mapped ? [...acc, mapped] : acc
  }, [])
}
```

### Error Handling in Components

Check both `errors` AND `!data` for complete error handling.

```tsx
const { data, errors } = await deleteItem(item.id)
if (errors || !data) {
  setErrorMessage(errors)
} else {
  toast?.add({ type: 'success', content: 'Deleted successfully.' })
  await loadItems()
  onRequestClose()
}
```

---

## Modals

### showModal Pattern

Open modals via `showModal` from `useModalContext()`. Pass data as the second argument.

```tsx
const { showModal } = useModalContext()

const handleEdit = () => {
  showModal(CreateUpdateBioModal, { bio, loadBios })
}

const handleDelete = () => {
  showModal(DeleteBioModal, { bio, loadBios })
}
```

### Modal Component Structure

Modals receive `onRequestClose` automatically. They manage their own local state.

```tsx
export function DeleteBioModal({ bio, loadBios, onRequestClose }: DeleteBioModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const toast = useToast()

  const handleDelete = async () => {
    const { errors } = await deleteBio(bio.id)
    if (errors) {
      setErrorMessage(errors)
    } else {
      toast?.add({ type: 'success', content: 'Bio deleted.' })
      await loadBios()
      onRequestClose()
    }
  }

  return (
    <Modal onRequestClose={onRequestClose}>
      <h2>Delete Bio</h2>
      {errorMessage && (
        <Notification type="error">{errorMessage}</Notification>
      )}
      <p>Are you sure you want to delete {bio.name}?</p>
      <Button onClick={handleDelete} disabled={!!errorMessage}>Delete</Button>
    </Modal>
  )
}
```

### Create/Update Modal Pattern

Use a single modal for both create and update. Determine mode from props.

```tsx
export function CreateUpdateBioModal({ bio, loadBios, onRequestClose }: Props) {
  const isCreate = !bio?.id
  const successMessage = isCreate ? 'Bio created.' : 'Bio updated.'

  const handleSubmit = async (values: FormState) => {
    const apiCall = isCreate ? createBio : updateBio
    const { errors } = await apiCall(values)
    if (errors) {
      setHasError(true)
    } else {
      toast?.add({ type: 'success', content: successMessage })
      await loadBios()
      onRequestClose()
    }
  }

  // ...
}
```

---

## Toast Notifications

```tsx
const toast = useToast()

// Success
toast?.add({
  type: 'success',
  content: 'Changes saved.',
  position: 'bottomCenter',
})

// Error — include dataTestAttribute for testability
toast?.add({
  type: 'error',
  content: errorMessage,
  dataTestAttribute: 'feature-error-toast',
  position: 'bottomCenter',
})
```

---

## Test Attributes

Add `dataTestAttribute` props to key interactive and loading elements for testability.

```tsx
// On loaders
<LoaderSkeleton
  active={isLoading}
  dataTestAttribute="feature-loader"
  widthRatio={4}
  lines
>

// On action buttons
<IconButton
  icon={Delete}
  onClick={handleDelete}
  dataTestAttribute="delete-item-button"
/>

// On toast notifications
toast?.add({
  type: 'error',
  content: errorMessage,
  dataTestAttribute: 'feature-error-toast',
})
```

**Which to use:**
- `dataTestAttribute` — on UI library components that accept it as a prop (e.g., `LoaderSkeleton`, `Button`, `IconButton`, toast)
- `data-testid` — on native HTML elements (`<div>`, `<span>`, `<section>`)

Name them descriptively: `feature-name-element-purpose` (e.g., `site-bios-loader`, `delete-bio-button`).

---

## Loading & Error States

### LoaderSkeleton Wrapper

```tsx
<LoaderSkeleton active={isLoading} widthRatio={4} lines>
  <MainContent />
</LoaderSkeleton>
```

### Inline Error Notifications

```tsx
{hasError && (
  <Notification type="error">
    Something went wrong, please try again later.
  </Notification>
)}
```

### Multiple Loading States

Track loading states separately when they're independent.

```tsx
const [isInitialLoading, setIsInitialLoading] = useState(true)
const [isLoadingReceipts, setIsLoadingReceipts] = useState(false)
const [isLoadingStats, setIsLoadingStats] = useState(false)
```

---

## Styling

- **CSS Modules** for scoped component styles. **Always import as `cl`:**

```tsx
import cl from './Component.module.scss'

<div className={cl.container} />
```

- **`cx` (classnames)** for conditional classes — not array.filter.join:

```tsx
import cx from 'classnames'

<div className={cx(cl.container, isActive && cl.active, className)} />
```

- **Spacing/type modules** from the UI library for typography and spacing:

```tsx
import sc from '@usefedora/ui/public/spacing-modules'
import tc from '@usefedora/ui/public/type-modules'
```

- **Utility classes** for simple one-off spacing (`uni-mb-16`, `m-r-2-xs`, `p-t-2-xs`). Use CSS modules for component-specific or complex styles. Use utility classes for standard spacing between elements.

---

## Imports

### Ordering

```tsx
// 1. React and core libraries
import React, { useContext, useState, useEffect, useCallback } from 'react'

// 2. Router/navigation
import { useNavigate, useSearchParams } from 'react-router-dom'

// 3. UI library
import { Button, Modal, useToast } from '@usefedora/ui'

// 4. External utilities
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { get, reduce } from 'lodash'

// 5. Internal absolute imports (store, routes, containers)
import { schoolPlanSelector } from 'store/config/selectors'
import { Site404 } from 'containers/site-404'

// 6. Relative imports (components, hooks)
import { ItemRow } from './components/ItemRow'
import { useFeatureData } from './hooks/use-feature-data'

// 7. Styles
import cl from './FeaturePage.module.scss'

// 8. Types (if not imported alongside their source)
import type { FeatureItem } from './types'
```

### Library Aliasing

Alias third-party imports when the name conflicts with your code or is ambiguous.

```tsx
// Good - clear what's from TanStack
import {
  useReactTable as useTanstackTable,
  ColumnDef as TanstackColumnDef,
} from '@tanstack/react-table'
```

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase | `UserCard`, `EmailCompose` |
| Files (components) | PascalCase | `UserCard.tsx` |
| Files (hooks) | kebab-case with `use-` prefix | `use-workflows.ts` |
| Files (utils/api/types) | kebab-case | `utils.ts`, `api.ts` |
| Directories | kebab-case | `email-compose/` |
| Props interfaces | PascalCase + `Props` | `UserCardProps` |
| Context types | PascalCase + `ContextType` | `SiteBiosContextType` |
| Event handlers (multi-step) | `handle` + verb | `handleSubmit`, `handleDelete` |
| Event handlers (direct action) | semantic verb | `resetFilters`, `openPreview` |
| Booleans | `is*`, `has*`, `show*`, `should*` | `isLoading`, `hasError`, `showModal` |
| Semantic booleans | descriptive phrase | `hasPaginationControls`, `showBulkActions` |
| State setters | `set` + state name | `setIsLoading`, `setItems` |
| Async fetchers | `fetch*` or `load*` | `fetchBios`, `loadWorkflows` |
| Transform functions | `transform*` or `map*To*` | `transformFileMetadata` |
| Config getters | `get*By*` | `getSourcesByType` |
| Constants | UPPER_SNAKE_CASE | `VIDEO_SOURCES`, `DEFAULT_PAGE_SIZE` |

---

## Comments

- **No inline comments** — code should be self-documenting
- **JSDoc only** on exported interfaces/props
- If you need a comment to explain code, the code needs refactoring (better names, extraction)

```tsx
// GOOD - JSDoc on exported interface
export interface DataGridProps<RowData> {
  /** Column definitions for the table */
  columns: ColumnDef<RowData>[]
  /** Whether data is currently loading */
  isLoading?: boolean
}

// BAD - inline comments
const handleClick = () => {
  // Check if loading before proceeding
  if (isLoading) return
  // Call the API
  fetchData()
}

// GOOD - self-documenting, no comments needed
const handleClick = () => {
  if (isLoading) return
  fetchData()
}
```

---

## Architecture Patterns

### Container/Presenter

Entry point mounts providers (and optionally gates on loading/permissions). Main component handles its own loading via `LoaderSkeleton` wrapper.

### Multi-Step Wizard

Use `useSteps` hook + Context. Define steps as data.

```tsx
const steps = [
  { key: 'event', position: 1 },
  { key: 'operation', position: 2 },
  { key: 'metadata', position: 3 },
]

const useStepsHook = useSteps({ steps })

<WizardContext.Provider value={{ formState, handleStepSubmit, ...useStepsHook }}>
  {currentStep.key === 'event' && <EventForm />}
  {currentStep.key === 'operation' && <OperationForm />}
  {currentStep.key === 'metadata' && <MetadataForm />}
</WizardContext.Provider>
```

### Tab/Route Mapping

Define tabs as config data. Render both tabs and routes from the same config.

```tsx
const tabMap: Record<TabKey, TabConfig> = {
  [TabKey.Custom]: { label: 'Custom', route: '', component: Custom },
  [TabKey.Automated]: { label: 'Automated', route: '/automated', component: Automated },
}

<Tabs>
  {Object.values(tabMap).map(({ key, label }) => (
    <Tab key={key} label={label} onClick={() => navigate(route)} />
  ))}
</Tabs>
<Routes>
  {Object.values(tabMap).map(({ key, route, component: C }) => (
    <Route key={key} path={route} element={<C />} />
  ))}
</Routes>
```

### Helper Hook per Form Section

When a form has multiple modes, create hooks that return helpers for each mode.

```tsx
const userHelpers = useUserSelection()
const courseHelpers = useCourseSelection()

const helpers: HelperMap = {
  [RecipientTypes.USERS]: userHelpers,
  [RecipientTypes.COURSE]: courseHelpers,
}

// Each helper returns: { isValid, resetSelections, getParams, ...uiState }
```

### Children Slot vs Type Switching

When a component renders different content variants:

- **Prefer `children` prop** when the parent just needs a layout/container and the content is a pure display concern.
- **Use a type-switching renderer** only when the component itself needs to own logic or state for each variant.

```tsx
// GOOD - children slot for pure display
<TableCell>{item.name}</TableCell>
<TableCell><Badge status={item.status} /></TableCell>
<TableCell><a href={item.url}>{item.linkText}</a></TableCell>

// GOOD - type-switching when the component owns logic per variant
const FieldRenderer = ({ type, ...props }: FieldRendererProps) => {
  switch (type) {
    case FieldType.LOOKUP:
      return <LookupField {...props} />
    case FieldType.ALL_OR_SOME:
      return <AllOrSome {...props} />
    default:
      return <TextField {...props} />
  }
}
```

### Page Self-Sufficiency

Every page/route component must be capable of fetching its own data independently. Users may navigate directly to a URL via bookmark or link — never rely on state carried over from a previous page.

### UI Type Switcher

Switch on an enum to render different UI variants.

```tsx
export const UppySwitcher = ({ uiType, ...props }: Props) => {
  switch (uiType) {
    case UIType.INLINE:
      return <InlineUploader {...props} />
    case UIType.MODAL:
      return <ModalTrigger {...props} />
    default:
      return null
  }
}
```

### Abstraction Layer

Thin wrapper that abstracts implementation details, allowing swaps.

```tsx
export const FileUploader = ({ type, sources, ...rest }: FileUploaderProps) => {
  const uploaderProps = {
    ...defaultProps,
    ...rest,
    sources: sources || getSourcesByType(type),
  }
  return <UppySwitcher {...uploaderProps} />
}
```

### Shared Logic: Utils vs Hooks

- **Utils** (`utils.ts`): Pure functions that transform data, compute values, or format strings. No React hooks, no state, no side effects.
- **Custom hooks** (`hooks/`): Logic that uses React APIs (useState, useEffect, useContext, etc.).

If the shared logic is a pure function (takes input, returns output, no React), it's a util. If it manages state or lifecycle, it's a hook.

### Default Configs at Module Level

```tsx
const defaultProps = {
  maxFiles: 1,
  maxFileSize: toBytesFromGB(2),
}

export const VIDEO_SOURCES = [Source.LOCAL, Source.URL, Source.DROPBOX]
```

### URL Search Params Sync

Persist URL params for any state that the user should be able to control via URL, bookmark, or that other pages may want to navigate to with a specific initial state. This is mostly driven by product requirements — pagination (`page`, `per`) is the baseline, but also filters, selected IDs, or any state that makes sense to deep-link to.

```tsx
const [searchParams, setSearchParams] = useSearchParams()
const initialPage = Number(searchParams.get('page')) || 1
const initialPer = Number(searchParams.get('per')) || 10

const { page, per, ...paginationProps } = usePaginatedFetch({
  fetch: fetchItems,
  initialPage,
  initialPer,
})

// Sync page changes to URL
useEffect(() => {
  setSearchParams((params) => {
    params.set('page', page.toString())
    return params
  })
}, [page, setSearchParams])

// Sync per (page size) changes to URL
useEffect(() => {
  setSearchParams((params) => {
    params.set('per', per.toString())
    return params
  })
}, [per, setSearchParams])
```

### Ref for Latest Callback

When passing callbacks to external libraries, use a ref to avoid stale closures.

```tsx
const latestOnSuccessRef = useRef(onSuccess)
useEffect(() => {
  latestOnSuccessRef.current = onSuccess
}, [onSuccess])

const stableCallback = (files: File[]) => latestOnSuccessRef.current?.(files)
```
