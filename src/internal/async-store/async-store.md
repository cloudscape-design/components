# Async store

The async store is a pattern and a simple publish/subscribe mechanism to organize reactive state together and encapsulate the related getters, setters, and effects. The pattern is abstract, React-agnostic, and is optimized for performance. A UI component can make use of multiple async stores.

The pattern consists of the three main elements: Store, Model, and React binding.

## Store

The store defines the reactive state structure and all related getters, setters, and effects. For example:

```typescript
class ColumnWidthsStore extends AsyncStore<ColumnWidthsState> {
  // Internal, non-reactive state to hold references, caches, observers, etc.
  private cells: Record<PropertyKey, HTMLElement> = {};
  private lastVisible: null | (PropertyKey | undefined)[] = null;

  // The reactive state initialization.
  constructor() {
    super({ visibleColumns: [], columnWidths: {}, totalWidth: 0 });
  }

  // A custom lifecycle method to initialize state on mount.
  initWidths = (visibleColumns: readonly ColumnWidthDefinition[]) => {
    // Reads column widths from props if available.
    // Accesses DOM to read the actual rendered widths otherwise.
  };

  // A custom lifecycle method to sync React state/props with the store.
  syncWidths = (visibleColumns: readonly ColumnWidthDefinition[]) => {
    // Transforms visibleColumns to the internal representation.
    // Uses cache to only update the reactive state if necessary.
  };

  // A model method to be called when the user alters column width with a resize handle.
  updateColumnWidth = (columnId: PropertyKey, newWidth: number) => {
    // Checks if the new width satisfies the constraints.
    // Updates the reactive state if necessary.
  };

  // A model method to attach the cell reference.
  setCell = (columnId: PropertyKey, node: null | HTMLElement) => {
    // Updates this.cells for the given column.
  };
}
```

The store encapsulates all state transitions and effects and can be tested in isolation. The store should have no dependencies on the component(s) that use it.

## Binding

The store needs to be bound to the React properties, state, and/or other stores. It might or might not need to have initialization, properties sync, and cleanup methods. For example:

```typescript
// The store binding hook.
export function useColumnWidths({ visibleColumns, resizableColumns }: ColumnWidthsProps): ColumnWidthsModel {
  // Create a stable store instance with default state.
  // Here it can be parametrized with stable arguments if needed.
  const store = useMemo(() => new ColumnWidthsStore(), []);

  // Initialize store when the component mounts. This can be done in an effect or synchronously if needed.
  useEffect(() => {
    if (!resizableColumns) {
      return;
    }
    store.initWidths(visibleColumns);

    // Execute cleanup code if needed e.g. to detach event handlers or observers, example:
    // return () => store.cleanup();
  }, []);

  // Notify store when component properties change.
  useEffect(() => {
    if (!resizableColumns) {
      return;
    }
    store.syncWidths(visibleColumns);
  }, [store, resizableColumns, visibleColumns]);

  // The store can be bound to other stores, example:
  // useEffect(() => {
  //   const unsubscribe = virtualizer.subscribe(state => state.virtualColumns, store.updateVirtualColumns);
  //   return unsubscribe;
  // }, [store, virtualizer]);

  // Return a stable store instance with public APIs only.
  return store as ColumnWidthsModel;
}
```

## Model

Store model is the API available to the store consumers. It includes the reactive state and might include arbitrary methods to update the state, trigger related effects, or assign element references. The model is stable and does not force any renders unless the component explicitly subscribes to its reactive state.

```typescript
export interface ColumnWidthsModel extends ReadonlyAsyncStore<ColumnWidthsState> {
  updateColumnWidth(columnId: PropertyKey, newWidth: number): void;
  setCell(columnId: PropertyKey, node: null | HTMLElement): void;
}
```

From `ReadonlyAsyncStore` the model inherits `get`, `subscribe` and `unsubscribe` methods to fetch the reactive state synchronously or subscribe to its updates. Here is how the model is used:

```typescript
function Table({ ... }: TableProps) {
  // Create store model and pass it to the required components.
  const columnWidths = useColumnWidths({ visibleColumns, resizableColumns });
  const thead = <Thead columnWidths={columnWidths} {...}></Thead>;
  // ...
}

function Thead({ columnWidths, ... }: TheadProps) {
  // Subscribe to model's reactive state to trigger re-renders whenever state changes.
  const widthsByColumnId = useSelector(columnWidths, state => state.columnWidths);
  const totalWidth = useSelector(columnWidths, state => state.totalWidth);
  // ...
  // Use model methods to assign a reference and trigger a state update on user interaction.
  const th = <TableHeaderCell
    ref={node => columnWidths.setCell(columnId, node)}
    updateColumn={columnWidths.updateColumnWidth}
    {...}
  />
  // ...
}
```

## Performance

While it is possible to achieve proper separation of concerns when using React state primitives it usually comes with a performance penalty as passing down state and/or non-stable state handlers causes the components tree to re-render unnecessarily unless memoization is diligently applied.

The React contexts require less memoization as of the state being distributed to the right components. However, making any context state update forces all consumers to re-render which is also unnecessary. Consider the following example:

```typescript
function Table({ ... }: TableProps) {
  const cellEditing = useCellEditing({ ... });
  return (
    <table>
      <Thead {...} />
      <tbody>
        {items.map(item => (
          <tr>
            {column.map(column => (
              <TableCell cellEditing={cellEditing} item={item} column={column} {...} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TableCell({ cellEditing, column, ... }: TableCellProps) {
  const isEditing = useSelector(cellEditing, state => state.editingCell === column.id);
  return isEditing ? <CellEditor {...} /> : <TdElement {...} />;
}
```

The `isEditing` property only transitions from `false` to `true` for a single table cell when inline editing activates. Every other table cell stays unchanged. Achieving the same with React contexts is only possible if `TdElement` is a pure component and all properties are stable which is difficult to achieve in practice.

## Advanced use

### Manual subscriptions

The `useSelector` util creates a copy of the reactive store state and updates that copy the React way using subscription mechanism. Alternatively, the subscription can be created manually, for instance, to avoid its creation for collection elements when the feature is not active:

```typescript
function DemoManualSubscription({ isActive, cellId, cellEditing, ... }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    const unsubscribe = cellEditing.subscribe(state => state.editingCell === cellId, setIsEditing);
    return unsubscribe;
  }, [isActive, cellEditing, columnId]);

  // ...
}
```

## Instant state read

The reactive state is meant to trigger component renders when updated but the same state can be accessed instantly if needed, for example in event handlers:

```typescript
function DemoInstanceStateRead({ modelGreen, modelRed, ... }: Props) {
  function onMouseMove(event: MouseEvent) {
    if (modelGreen.get().active && modelRed.get().active) {
      throw new Error('Invariant violation: only one model is allowed to be active at a time.');
    }
    if (modelGreen.get().active) {
      modelGreen.updateMousePosition(event.clientX, event.clientY);
    }
    if (modelRed.get().active) {
      modelRed.updateMousePosition(event.clientX, event.clientY);
    }
  }
  // ...
}
```
