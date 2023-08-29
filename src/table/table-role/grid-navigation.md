# Table grid navigation

Tables with interactive elements require ARIA role "grid" and extended keyboard navigation as per https://www.w3.org/WAI/ARIA/apg/patterns/grid.

## Basic keyboard navigation

The grid cells both text-only or even empty and those with one or multiple interactive elements are navigable. When a cell does not have interactive elements as its content the cell itself receives focus. Otherwise - one of the content elements is focused (can be the first, the last, or even the nth depending on the move direction).

The list of supported navigation commands is:

- `Right Arrow`: Moves focus one cell or element to the right. The focus does not move if it is already on the last cell/element in the row.
- `Left Arrow`: Moves focus one cell to the left. The focus does not move if it is already on the first cell/element in the row.
- `Down Arrow`: Moves focus one cell down. The focus does not move if it is already on the bottom row. When the focus is on the nth element inside a cell the element index is maintained (when possible) when moving down.
- `Up Arrow`: Moves focus one cell up. The focus does not move if it is already on the top row. When the focus is on the nth element inside a cell the element index is maintained (when possible) when moving up.
- `Page Down`: Moves focus down by one page (the page size is set as 10). The focus does not move if it is already on the bottom row. When the focus is on the nth element inside a cell the element index is maintained (when possible) when moving down.
- `Page Up`: Moves focus up by one page (the page size is set as 10). The focus does not move if it is already on the top row. When the focus is on the nth element inside a cell the element index is maintained (when possible) when moving down.
- `Home`: moves focus to the first cell or element in the row.
- `End`: moves focus to the last cell or element in the row.
- `Control + Home`: moves focus to the first cell or element in the first row.
- `Control + End`: moves focus to the last cell or element in the last row.

## Single tab stop

The grid is a composite component and has a single tab stop. The actual focused element when the focus moves into the grid is determined as:

- If the grid has not been focused by the user after the component mount the focus moves to the first cell or element (including the heading row).
- If the grid has been focused before and the focused element position is still available the focus moves to that position.
- If the grid has been focused before and the focused element position is no longer available the focus moves to the closest row/column to the one focused before.

See: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within

## Dialog cells

The grid might include interactive elements such as text inputs, radio groups, etc. Such elements can conflict with the grid navigation as of listening to the same keyboard input. To resolve the conflict a dialog pattern is employed when the content becomes interactive upon pressing `Enter` or `F2`.

When the focused element inside of a cell or one of its parents has `role="dialog"` or `awsui-table-suppress-navigation="true"` attributes the focus suppression and keyboard navigation commands no longer apply with an exception of the `Escape` and `F2` keyboard listeners that move the focus back to the cell.

For example, when the input or a button from the example below is focused the grid navigation is suppressed.

```html
<td>
  <div role="dialog">
    <input value="editable cell value" />
    <button>save</button>
    <button>discard</button>
  </div>
</td>
```
