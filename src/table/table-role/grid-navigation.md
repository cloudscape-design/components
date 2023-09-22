# Table grid navigation

Grid navigation is a keyboard navigation mechanism as per [Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid) recommended for tables having interactive elements such as resize handles, selection controls, or resource links.

## Basic keyboard navigation

The grid cells are navigable no matter if they have zero, one, or multiple focusable elements in the content. When there are no focusable elements in a cell the cell itself receives focus. Otherwise - one of the content elements is focused (can be the first, the last, or even the nth depending on the move direction).

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

The grid might include interactive elements such as text inputs, radio groups, etc. Such elements can conflict with the grid navigation as of listening to the same keyboard input. The conflict can be resolved by making the cell elements conditionally interactive - for example, when `Enter` or `F2` key is pressed. Once interactive, the element needs to be wrapped with `role="dialog"` or use the navigation API for the grid navigation focus and keyboard behaviors to be suppressed.

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
