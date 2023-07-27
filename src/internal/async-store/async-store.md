# Async store

The async store is a simple mechanism of state manipulation in React similar to React contexts. Same as React contexts, it features a publish/subscribe model to make state changes scoped to particular components. Unlike React contexts, the async store does not require a provider and can be instantiated and used outside of the React scope.

Example of using async store similar to React contexts:

```
function Demo({ state }) {
    const store = useMemo(() => new AsyncStore<State>(state), [state])
    return (
        <Container>
            <Widget store={store} />
        </Container>
    )
}

function Widget({ store }) {
    const state = useSelector(store, state => state)
    return <div>...</div>
}
```

A custom store can be used to encapsulate state and actions to define a model:

```
// Public interface to be used by components
export interface ResizableColumnsModel extends AsyncStore<ResizableColumnsState> {
  updateColumnWidth(columnId: PropertyKey, newWidth: number): void;
  setCell(columnId: PropertyKey, node: null | HTMLElement): void;
}

// A model factory to attach the store to the React lifecycle
export function useColumnWidths({ visibleColumns, resizableColumns }: ColumnWidthsProps): ColumnWidthsModel {
  // Creating a model which reference never changes.
  const store = useMemo(() => new ColumnWidthsStore(), []);

  // Update model state when component's props change.
  useEffect(() => {
    if (!resizableColumns) {
      return;
    }
    store.syncWidths(visibleColumns);
  }, [store, resizableColumns, visibleColumns]);

  // Init model state when the component first renders.
  useEffect(() => {
    if (!resizableColumns) {
      return;
    }
    store.initWidths(visibleColumns);
  }, []);

  return store;
}

// Internal representation of the model that encapsulates everything needed for the particular feature.
class ResizableColumnsStore extends AsyncStore<ResizableColumnsState> {
    // The internal state can define element references, counters, caches, etc.
    private columnHeaderRefs: Record<PropertyKey, HTMLElement> = {};

    constructor() {
        super({ visibleColumns: [], columnWidths: {}, totalWidth: 0 })
    }

    // A method to pass to the element's ref callback to update the model's column headers state.
    setCell(columnId: PropertyKey, node: null | HTMLElement): void {...}

    // A method to provide to update the specific bit of state.
    updateColumnWidth(columnId: PropertyKey, newWidth: number): void {...}

    // "Private" methods to attach the model to the React lifecycle.
    initWidths(visibleColumns: readonly ColumnWidthDefinition[]): void {...}
    syncWidths(visibleColumns: readonly ColumnWidthDefinition[]): void {...}
}
```
