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

### Widget cells

Widget cells are those including one or multiple elements that utilize arrow keys interaction model such is segmented control, radio group, slider, etc. The widget cells are not determined automatically and must be explicitly specified.

Same as for the multi-element cells the focus is not automatically moved inside when a cell is navigated to. The `Enter`, `F2` and `Escape` commands work the same way. The difference is that when the focus is inside a widget cell the navigation commands are not intercepted. Besides, the default focusing behavior is restored so that the elements inside can be navigated with `Tab` and `Shift + Tab` commands.

When the focus is within a widget cell all table cells become focusable so that pressing `Tab` and `Shift + Tab` also restores table navigation by moving the focus to the cell itself or the cell next to it (if available).
