// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { GridNavigationProvider } from '../../../../lib/components/table/table-role';
import { KeyCode } from '../../../../lib/components/internal/keycode';

const mockObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback: (mutationRecords: MutationRecord[]) => {},
};
const originalMutationObserver = global.MutationObserver;

beforeEach(() => {
  global.MutationObserver = function MutationObserver(callback: (mutationRecords: MutationRecord[]) => void) {
    mockObserver.callback = callback;
    return mockObserver;
  } as any;
});

afterEach(() => {
  global.MutationObserver = originalMutationObserver;
});

function TestTable<T extends object>({
  tableRole = 'grid',
  columns,
  items,
  startIndex = 0,
  pageSize = 2,
}: {
  tableRole?: 'grid' | 'table';
  columns: { header: React.ReactNode; cell: (item: T) => React.ReactNode }[];
  items: T[];
  startIndex?: number;
  pageSize?: number;
}) {
  const tableRef = useRef<HTMLTableElement>(null);
  return (
    <GridNavigationProvider
      keyboardNavigation={tableRole === 'grid'}
      pageSize={pageSize}
      getTable={() => tableRef.current}
    >
      <table role={tableRole} ref={tableRef}>
        <thead>
          <tr aria-rowindex={1}>
            {columns.map((column, columnIndex) => (
              <th key={columnIndex} aria-colindex={columnIndex + 1}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, itemIndex) => (
            <tr key={itemIndex} aria-rowindex={startIndex + itemIndex + 1 + 1}>
              {columns.map((column, columnIndex) => (
                <td key={columnIndex} aria-colindex={columnIndex + 1}>
                  {column.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </GridNavigationProvider>
  );
}

interface Item {
  id: string;
  name: string;
  value: number;
}

const idColumn = { header: 'ID', cell: (item: Item) => item.id };
const nameColumn = {
  header: (
    <span>
      Name <button aria-label="Sort by name" />
    </span>
  ),
  cell: (item: Item) => item.name,
};
const valueColumn = {
  header: (
    <span>
      Value <button aria-label="Sort by value" />
    </span>
  ),
  cell: (item: Item) => <ValueCell item={item} />,
};
const actionsColumn = {
  header: 'Actions',
  cell: (item: Item) => (
    <span>
      <button aria-label={`Delete item ${item.id}`} />
      <button aria-label={`Copy item ${item.id}`} />
    </span>
  ),
};

const items: Item[] = [
  { id: 'id1', name: 'First', value: 1 },
  { id: 'id2', name: 'Second', value: 2 },
  { id: 'id3', name: 'Third', value: 3 },
  { id: 'id4', name: 'Fourth', value: 4 },
];

function ValueCell({ item }: { item: Item }) {
  const [active, setActive] = useState(false);

  return !active ? (
    <span>
      {item.value ?? 0} <button aria-label={`Edit value ${item.value}`} onClick={() => setActive(true)} />
    </span>
  ) : (
    <span role="dialog">
      <input value={item.value} autoFocus={true} aria-label="Value input" tabIndex={0} />
      <button aria-label="Save" onClick={() => setActive(false)} />
      <button aria-label="Discard" onClick={() => setActive(false)} />
    </span>
  );
}

function getActiveElement() {
  return [
    document.activeElement?.tagName.toLowerCase(),
    document.activeElement?.textContent || document.activeElement?.getAttribute('aria-label'),
  ];
}

test('not activated for "table" role', () => {
  const { container } = render(<TestTable tableRole="table" columns={[idColumn, nameColumn]} items={items} />);
  expect(container.querySelectorAll('td[tabIndex],th[tabIndex]')).toHaveLength(0);
});

test('updates interactive elements tab indices', () => {
  const { container } = render(<TestTable columns={[nameColumn, valueColumn]} items={items} />);
  const mutedButtons = container.querySelectorAll('button[tabIndex="-999"]');
  const userFocusableButtons = container.querySelectorAll('button[tabIndex="0"]');

  // Value header button and value cell buttons are muted.
  expect(mutedButtons).toHaveLength(1 + 4);
  expect(userFocusableButtons).toHaveLength(1);
  expect(userFocusableButtons[0]).toHaveAccessibleName('Sort by name');
});

test.each([0, 5])('supports arrow keys navigation for startIndex=%s', startIndex => {
  const { container, rerender } = render(
    <TestTable columns={[idColumn, nameColumn]} items={items} startIndex={startIndex} />
  );
  const table = container.querySelector('table')!;

  container.querySelector('th')!.focus();
  expect(getActiveElement()).toEqual(['th', 'ID']);

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['td', 'First']);

  fireEvent.keyDown(table, { keyCode: KeyCode.left });
  expect(getActiveElement()).toEqual(['td', 'id1']);

  fireEvent.keyDown(table, { keyCode: KeyCode.up });
  expect(getActiveElement()).toEqual(['th', 'ID']);

  rerender(<TestTable columns={[idColumn, actionsColumn]} items={items} startIndex={startIndex} />);

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['th', 'Actions']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['button', 'Delete item id1']);

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['button', 'Copy item id1']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['button', 'Copy item id2']);
});

test('supports key combination navigation', () => {
  const { container } = render(<TestTable columns={[nameColumn, valueColumn, actionsColumn]} items={items} />);
  const table = container.querySelector('table')!;

  container.querySelector('button')!.focus();
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);

  fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
  expect(getActiveElement()).toEqual(['td', 'Second']);

  fireEvent.keyDown(table, { keyCode: KeyCode.pageUp });
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);

  fireEvent.keyDown(table, { keyCode: KeyCode.end });
  expect(getActiveElement()).toEqual(['th', 'Actions']);

  fireEvent.keyDown(table, { keyCode: KeyCode.home });
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);

  fireEvent.keyDown(table, { keyCode: KeyCode.end, ctrlKey: true });
  expect(getActiveElement()).toEqual(['button', 'Delete item id4']);

  fireEvent.keyDown(table, { keyCode: KeyCode.home, ctrlKey: true });
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);

  fireEvent.keyDown(table, { keyCode: KeyCode.backspace }); // Unsupported key
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);
});

test('suppresses grid navigation when focusing on dialog element', () => {
  const { container } = render(<TestTable columns={[nameColumn, valueColumn]} items={items} />);
  const table = container.querySelector('table')!;

  (container.querySelector('button[aria-label="Sort by value"]') as HTMLElement).focus();
  expect(getActiveElement()).toEqual(['button', 'Sort by value']);
  expect(container.querySelectorAll('button[tabIndex="-999"]')).toHaveLength(5);

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['button', 'Edit value 1']);

  (document.activeElement as HTMLElement).click();
  expect(getActiveElement()).toEqual(['input', 'Value input']);
  expect(container.querySelectorAll('button[tabIndex="-999"]')).toHaveLength(0);

  (container.querySelector('button[aria-label="Save"]') as HTMLElement).click();
  (container.querySelector('button[aria-label="Sort by value"]') as HTMLElement).focus();
  expect(container.querySelectorAll('button[tabIndex="-999"]')).toHaveLength(5);
});

test('updates page size', () => {
  const { container, rerender } = render(<TestTable columns={[idColumn, nameColumn]} items={items} pageSize={3} />);
  const table = container.querySelector('table')!;

  container.querySelector('th')!.focus();
  expect(getActiveElement()).toEqual(['th', 'ID']);

  fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
  expect(getActiveElement()).toEqual(['td', 'id3']);

  rerender(<TestTable columns={[idColumn, nameColumn]} items={items} pageSize={1} />);

  fireEvent.keyDown(table, { keyCode: KeyCode.pageUp });
  expect(getActiveElement()).toEqual(['td', 'id2']);
});

test('does not throw errors if table is null', () => {
  function TestTable() {
    return (
      <GridNavigationProvider keyboardNavigation={true} pageSize={2} getTable={() => null}>
        {null}
      </GridNavigationProvider>
    );
  }
  expect(() => render(<TestTable />)).not.toThrow();
});

test('ensures table always has a user-focusable element', () => {
  const { container } = render(<TestTable columns={[idColumn, valueColumn]} items={items} />);
  const table = container.querySelector('table')!;
  const row1 = table.querySelector('tr[aria-rowindex="2"]')!;
  const sortButton = table.querySelector('button[aria-label="Sort by value"]') as HTMLElement;
  const editButton = table.querySelector('button[aria-label="Edit value 1"]') as HTMLElement;

  expect(table.querySelectorAll('[tabIndex="0"]')).toHaveLength(1);

  sortButton.focus();
  expect(table.querySelectorAll('[tabIndex="0"]')).toHaveLength(1);

  sortButton.remove();
  mockObserver.callback([
    { type: 'childList', addedNodes: [], removedNodes: [sortButton] } as unknown as MutationRecord,
  ]);
  expect(table.querySelectorAll('[tabIndex="0"]')).toHaveLength(1);

  editButton.focus();
  expect(table.querySelectorAll('[tabIndex="0"]')).toHaveLength(1);

  row1.remove();
  mockObserver.callback([{ type: 'childList', addedNodes: [], removedNodes: [row1] } as unknown as MutationRecord]);
  expect(table.querySelectorAll('[tabIndex="0"]')).toHaveLength(1);
});

test('ensures new interactive table elements are muted', () => {
  const { container, rerender } = render(<TestTable columns={[idColumn, valueColumn]} items={items.slice(0, 3)} />);

  expect(container.querySelectorAll('[tabIndex="-999"]')).toHaveLength(4);
  expect(container.querySelectorAll('[tabIndex="0"]')).toHaveLength(1);

  rerender(<TestTable columns={[idColumn, valueColumn]} items={items} />);
  const lastRow = container.querySelector('[aria-rowindex="5"]')!;
  mockObserver.callback([{ type: 'childList', addedNodes: [lastRow], removedNodes: [] } as unknown as MutationRecord]);

  expect(container.querySelectorAll('[tabIndex="-999"]')).toHaveLength(5);
  expect(container.querySelectorAll('[tabIndex="0"]')).toHaveLength(1);
});

test('ignores keydown modifiers other than ctrl', () => {
  const { container } = render(<TestTable columns={[nameColumn, valueColumn]} items={items} />);
  const table = container.querySelector('table')!;

  container.querySelector('button')!.focus();
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down, altKey: true });
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down, shiftKey: true });
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down, metaKey: true });
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down, ctrlKey: true });
  expect(getActiveElement()).toEqual(['button', 'Sort by name']);

  fireEvent.keyDown(table, { keyCode: KeyCode.end, ctrlKey: true });
  expect(getActiveElement()).toEqual(['button', 'Edit value 4']);
});

test('cell or cell element is re-focused after the focus target got removed', () => {
  const { container } = render(<TestTable columns={[nameColumn, valueColumn]} items={items} />);
  const table = container.querySelector('table')!;
  const row1 = table.querySelector('tr[aria-rowindex="2"]')!;
  const row2 = table.querySelector('tr[aria-rowindex="3"]')!;
  const row3 = table.querySelector('tr[aria-rowindex="4"]')!;

  expect(document.body).toHaveFocus();

  row1.remove();
  mockObserver.callback([{ type: 'childList', addedNodes: [], removedNodes: [row1] } as unknown as MutationRecord]);

  expect(document.body).toHaveFocus();

  table.querySelector('button')!.focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['td', 'Second']);

  row2.remove();
  mockObserver.callback([{ type: 'childList', addedNodes: [], removedNodes: [row2] } as unknown as MutationRecord]);

  expect(getActiveElement()).toEqual(['td', 'Third']);

  table.querySelector('button')!.focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['button', 'Edit value 3']);

  row3.remove();
  mockObserver.callback([{ type: 'childList', addedNodes: [], removedNodes: [row3] } as unknown as MutationRecord]);

  expect(getActiveElement()).toEqual(['button', 'Edit value 4']);
});

test('cell navigation works when the table is mutated between commands', () => {
  const { container } = render(<TestTable columns={[idColumn, nameColumn, valueColumn]} items={items.slice(0, 1)} />);
  const table = container.querySelector('table')!;

  const button = (container.querySelectorAll('button') as NodeListOf<HTMLElement>)[0];
  button.focus();

  Array.from(table.querySelectorAll('[aria-colindex="3"]')).forEach(node => node.remove());

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(button).toHaveFocus();

  Array.from(table.querySelectorAll('[aria-rowIndex="2"]')).forEach(node => node.remove());

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(button).toHaveFocus();

  Array.from(table.querySelectorAll('th')).forEach(node => node.remove());

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(document.body).toHaveFocus();

  Array.from(table.querySelectorAll('[aria-rowIndex="1"]')).forEach(node => node.remove());

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(document.body).toHaveFocus();
});

test('throws no error when focusing on incorrect target', () => {
  function TestComponent() {
    const tableRef = useRef<HTMLTableElement>(null);
    return (
      <GridNavigationProvider keyboardNavigation={true} pageSize={2} getTable={() => tableRef.current}>
        <table role="grid" ref={tableRef}>
          <tbody>
            <button>action</button>
            <tr aria-rowindex={1}>
              <td aria-colindex={1}>cell-1-1</td>
              <td aria-colindex={2}>cell-1-2</td>
              <td aria-colindex={3}>cell-1-3</td>
            </tr>
            <svg>
              <g tabIndex={0}>graphic</g>
            </svg>
          </tbody>
        </table>
      </GridNavigationProvider>
    );
  }

  const { container } = render(<TestComponent />);
  const button = container.querySelector('button')!;
  const g = container.querySelector('g')!;

  button.focus();
  expect(button).toHaveFocus();

  g.focus();
  expect(g).toHaveFocus();
});

test('elements focus is restored if table changes role after being rendered as grid', () => {
  const { container, rerender } = render(<TestTable columns={[valueColumn, idColumn]} items={items} />);
  const getTabIndices = () => Array.from(container.querySelectorAll('button')).map(button => button.tabIndex);

  expect(getTabIndices()).toEqual([0, -999, -999, -999, -999]);

  rerender(<TestTable tableRole="table" columns={[idColumn, valueColumn]} items={items} />);

  expect(getTabIndices()).toEqual([0, 0, 0, 0, 0]);
});

test('does not override tab index for programmatically focused elements', () => {
  function TestComponent() {
    const tableRef = useRef<HTMLTableElement>(null);
    return (
      <GridNavigationProvider keyboardNavigation={true} pageSize={10} getTable={() => tableRef.current}>
        <table role="grid" ref={tableRef}>
          <tbody>
            <tr aria-rowindex={1}>
              <td aria-colindex={1}>cell-1-1</td>
              <td aria-colindex={2}>cell-1-2</td>
              <td aria-colindex={3}>
                cell-1-3 <button tabIndex={-1}>Programmatically focusable</button>
              </td>
            </tr>
          </tbody>
        </table>
      </GridNavigationProvider>
    );
  }

  const { container } = render(<TestComponent />);
  const button = container.querySelector('button')!;
  const firstCell = container.querySelector('td')!;

  button.focus();
  expect(button).toHaveFocus();
  expect(button).toHaveAttribute('tabIndex', '-1');
  expect(firstCell).toHaveAttribute('tabIndex', '0');
});
