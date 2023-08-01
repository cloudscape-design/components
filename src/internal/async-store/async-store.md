# Async store

The async store is a simple publish/subscribe mechanism to manipulate state and encapsulate behaviors. It is similar to React contexts but does not require a provider and can be instantiated and used outside of React. The key advantages are better discoverability (as no contexts are used) and explicit binding to the React components lifecycle.

Example:

```
function DemoTable(...) {
  const virtualizer = useTableVirtualizer(...) // Gives a custom stable async store instance
  const columnWidths = useColumnWidths(...) // Gives a custom stable async store instance
  const stickyColumns = useStickyColumns(...) // Gives a custom stable async store instance

  // This root tree is not updated when stores state change, only the target elements react
  return (
    <TableWrapper virtualizer={virtualizer} columnWidths={columnWidths} stickyColumns={stickyColumns}>
      <Thead virtualizer={virtualizer} columnWidths={columnWidths} stickyColumns={stickyColumns} />
      <Tbody virtualizer={virtualizer} columnWidths={columnWidths} stickyColumns={stickyColumns} />
    </TableWrapper>
  )
}

// Specific elements subscribe to one or many atomic state updates
function DemoTableCell(...) {
  const isSticky = useSelector(stickyColumns, state => state.sticky[columnId])
  const cellWidth = useSelector(columnWidths, state => state.widths[columnId])
  // ...
}

function useStickyColumns(...): StickyColumnsAPI {
  // Creates a stable store instance
  const store = useMemo(() => new StickyColumnsStore(), [])

  // Bind store to the component's lifecycle
  useEffect(() => {
    store.updateCellStyles(...props)
  }, [store, ...props])

  // Bind store to other stores
  useEffect(() => {
    const unsubscribe = virtualizer.subscribe(state => state.virtualColumns, store.updateVirtualColumns)
    return unsubscribe
  }, [store, virtualizer])

  // Returns store as StickyColumnsAPI with only "public" methods e.g. setCell but not updateCellStyles
  return store
}

class StickyColumnsStore extends AsyncStore<StickyColumnsState> {
  constructor() {
    super(initialState)
  }

  // Defines API methods e.g. to register elements or issue state changes
  setCell(...) {...}

  // Updates internal state as reaction to the props change, a user event etc.
  updateCellStyles(...) {...}
}
```

Not only async stores require no providers, the React binding is made simple, explicit, and separated from the domain logic. The store and its API methods are always stable, the subscriptions are done on-demand: the state update is only issued on the target component when it is necessary unlike React contexts where state updates are unavoidable:

```
// The component re-renders whenever state.sticky[columnId] changes
function DemoStateSubscription({ columnId, stickyColumns }) {
  const isSticky = useSelector(stickyColumns, state => state.sticky[columnId])
  // ...
}

// The component re-renders when isActive and state.sticky[columnId] changes
function DemoCustomSubscription({ isActive, columnId, stickyColumns }) {
  const [isSticky, setIsSticky] = useState(false)
  useEffect(() => {
    if (!isActive) {
      return
    }
    const unsubscribe = stickyColumns.subscribe(state => state.sticky[columnId], setIsSticky)
    return unsubscribe
  }, [isActive, stickyColumns, columnId])
  // ...
}

// The component re-renders whenever state changes
function DemoReactContextSubscription({ isActive, columnId }) {
  const { isSticky: contextIsSticky } = useContext(StickyColumnsContext)
  const isSticky = isActive && contextIsSticky
  // ...
}
```
