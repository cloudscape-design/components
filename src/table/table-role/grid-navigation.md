# Table grid navigation

Tables with interactive elements especially those featuring row selection or inline cell editing are assigned or can be assigned the role "grid" which implies extended keyboard navigation as per https://www.w3.org/WAI/ARIA/apg/patterns/grid.

## Navigation commands

The list of supported navigation commands is:

- `Right Arrow`: Moves focus one cell to the right. If focus is on the right-most cell in the row, focus does not move.
- `Left Arrow`: Moves focus one cell to the left. If focus is on the left-most cell in the row, focus does not move.
- `Down Arrow`: Moves focus one cell down. If focus is on the bottom cell in the column, focus does not move.
- `Up Arrow`: Moves focus one cell up. If focus is on the top cell in the column, focus does not move.
- `Page Down`: Moves focus down an customer-determined number of rows. If focus is in the last row of the grid, focus does not move.
- `Page Up`: Moves focus up an customer-determined number of rows. If focus is in the first row of the grid, focus does not move.
- `Home`: moves focus to the first cell in the row.
- `End`: moves focus to the last cell in the row.
- `Control + Home`: moves focus to the first cell in the first row.
- `Control + End`: moves focus to the last cell in the last row.

## Focus control

### Single tab stop

The grid is a composite component and has a single tab stop. The actual focused element when the focus moves into the grid is determined as:

- If the grid has not been focused by the user after the component mount the focus moves to the first cell (including the heading row).
- If the grid has been focused before and the focused element position is still available the focus moves to that position.
- If the grid has been focused before and the focused element position is no longer available the focus moves to the closest row/column to the one focused before.

See: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_general_within

### Cell and element focus

When a grid cell has a single focusable element inside (a link, a row selection checkbox, an input) that element receives focus when navigating to the containing cell. When a cell has zero or multiple focusable elements - the cell itself receives focus.

To access the focusable elements inside a multi-element cell the following keyboard commands are supported:

- `Enter`: when a multi-element cell is in focus places focus to the first focusable element inside. A subsequent `Enter` command is not intercepted.
- `F2`: when a multi-element cell is in focus places focus to the first focusable element inside. A subsequent `F2` command moves focus back to the cell.
- `Escape`: when focus is inside the multi-element cell focuses the cell. A subsequent `Escape` command is not intercepted.

All navigation commands continue working when the focus is inside the multi-element cell. Besides, the `Left Arrow` and `Right Arrow` move focus between the cell elements. When using `Down Arrow`, `Up Arrow`, `Page Up` and `Page Down` the element position inside the cell is maintained if possible.

See: https://www.w3.org/WAI/ARIA/apg/patterns/grid/#gridNav_focus

### Dialog cell

The table might include interactive elements such as text inputs, radio groups, etc. Those elements might conflict with the grid navigation as of listening to the same keyboard input. To resolve the conflict a dialog pattern is employed when the content becomes interactive upon pressing `Enter` or `F2`.

When a cell is marked as a dialog or includes content with ARIA role "dialog" the focus suppression and keyboard interception mechanisms no longer apply for it with an exception of the `Escape` and `F2` key listeners that move the focus back to the cell.

### Integration with Cloudscape table

There are a few specifics when it comes to applying the grid navigation to Cloudscape table:

- When `resizableColumns` is used the header cells are set as widgets so the user needs to press `Enter` / `F2` and `Tab` / `Shift + Tab` / `Escape` / `F2` to enter and exit the header cell to reach the column sorting or resize controls. The sorting and resize controls are iterated over with `Tab` / `Shift + Tab`.
- Iterating over single-select radios no longer changes the selection: the user needs to press `Space` / `Enter` explicitly.
- Inline editing cells when activated are set as widgets so that the cell elements can be iterated with `Tab` / `Shift Tab`, The `Tab` / `Shift + Tab` / `Escape` / `F2` can be used for exiting.
