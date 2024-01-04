// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { GridNavigationProvider } from '../../../../lib/components/table/table-role';
import { KeyCode } from '../../../../lib/components/internal/keycode';
import { TestTable, actionsColumn, idColumn, items, nameColumn, valueColumn } from './stubs';

function readActiveElement() {
  const tagName = document.activeElement?.tagName.toUpperCase();
  const text = document.activeElement?.textContent || document.activeElement?.getAttribute('aria-label');
  if (!tagName) {
    return null;
  }
  return `${tagName}[${text}]`;
}

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
  expect(readActiveElement()).toBe('TH[ID]');

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(readActiveElement()).toBe('BUTTON[Sort by name]');

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(readActiveElement()).toBe('TD[First]');

  fireEvent.keyDown(table, { keyCode: KeyCode.left });
  expect(readActiveElement()).toBe('TD[id1]');

  fireEvent.keyDown(table, { keyCode: KeyCode.up });
  expect(readActiveElement()).toBe('TH[ID]');

  rerender(<TestTable columns={[idColumn, actionsColumn]} items={items} startIndex={startIndex} />);

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(readActiveElement()).toBe('TH[Actions]');

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(readActiveElement()).toBe('BUTTON[Delete item id1]');

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(readActiveElement()).toBe('BUTTON[Copy item id1]');

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(readActiveElement()).toBe('BUTTON[Copy item id2]');
});

test('supports key combination navigation', () => {
  const { container } = render(<TestTable columns={[nameColumn, valueColumn, actionsColumn]} items={items} />);
  const table = container.querySelector('table')!;

  container.querySelector('button')!.focus();
  expect(readActiveElement()).toBe('BUTTON[Sort by name]');

  fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
  expect(readActiveElement()).toBe('TD[Second]');

  fireEvent.keyDown(table, { keyCode: KeyCode.pageUp });
  expect(readActiveElement()).toBe('BUTTON[Sort by name]');

  fireEvent.keyDown(table, { keyCode: KeyCode.end });
  expect(readActiveElement()).toBe('TH[Actions]');

  fireEvent.keyDown(table, { keyCode: KeyCode.home });
  expect(readActiveElement()).toBe('BUTTON[Sort by name]');

  fireEvent.keyDown(table, { keyCode: KeyCode.end, ctrlKey: true });
  expect(readActiveElement()).toBe('BUTTON[Delete item id4]');

  fireEvent.keyDown(table, { keyCode: KeyCode.home, ctrlKey: true });
  expect(readActiveElement()).toBe('BUTTON[Sort by name]');

  fireEvent.keyDown(table, { keyCode: KeyCode.backspace }); // Unsupported key
  expect(readActiveElement()).toBe('BUTTON[Sort by name]');
});

test('suppresses grid navigation when focusing on dialog element', async () => {
  const { container } = render(<TestTable columns={[nameColumn, valueColumn]} items={items} />);
  const table = container.querySelector('table')!;

  (container.querySelector('button[aria-label="Sort by value"]') as HTMLElement).focus();
  expect(readActiveElement()).toEqual('BUTTON[Sort by value]');
  expect(container.querySelectorAll('button[tabIndex="-999"]')).toHaveLength(5);

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(readActiveElement()).toEqual('BUTTON[Edit value 1]');

  (document.activeElement as HTMLElement).click();
  expect(readActiveElement()).toEqual('INPUT[Value input]');
  expect(container.querySelectorAll('button[tabIndex="-999"]')).toHaveLength(0);

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(readActiveElement()).toEqual('INPUT[Value input]');
  expect(container.querySelectorAll('button[tabIndex="-999"]')).toHaveLength(0);

  (container.querySelector('button[aria-label="Save"]') as HTMLElement).click();
  await waitFor(() => {
    expect(readActiveElement()).toEqual('BUTTON[Edit value 1]');
    expect(container.querySelectorAll('button[tabIndex="-999"]')).toHaveLength(5);
  });
});

test('updates page size', () => {
  const { container, rerender } = render(<TestTable columns={[idColumn, nameColumn]} items={items} pageSize={3} />);
  const table = container.querySelector('table')!;

  container.querySelector('th')!.focus();
  expect(readActiveElement()).toEqual('TH[ID]');

  fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
  expect(readActiveElement()).toEqual('TD[id3]');

  rerender(<TestTable columns={[idColumn, nameColumn]} items={items} pageSize={1} />);

  fireEvent.keyDown(table, { keyCode: KeyCode.pageUp });
  expect(readActiveElement()).toEqual('TD[id2]');
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

test('ignores keydown modifiers other than ctrl', () => {
  const { container } = render(<TestTable columns={[nameColumn, valueColumn]} items={items} />);
  const table = container.querySelector('table')!;

  container.querySelector('button')!.focus();
  expect(readActiveElement()).toEqual('BUTTON[Sort by name]');

  fireEvent.keyDown(table, { keyCode: KeyCode.down, altKey: true });
  expect(readActiveElement()).toEqual('BUTTON[Sort by name]');

  fireEvent.keyDown(table, { keyCode: KeyCode.down, shiftKey: true });
  expect(readActiveElement()).toEqual('BUTTON[Sort by name]');

  fireEvent.keyDown(table, { keyCode: KeyCode.down, metaKey: true });
  expect(readActiveElement()).toEqual('BUTTON[Sort by name]');

  fireEvent.keyDown(table, { keyCode: KeyCode.down, ctrlKey: true });
  expect(readActiveElement()).toEqual('BUTTON[Sort by name]');

  fireEvent.keyDown(table, { keyCode: KeyCode.end, ctrlKey: true });
  expect(readActiveElement()).toEqual('BUTTON[Edit value 4]');
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

test('restores focus when the node gets removed', async () => {
  const { container } = render(<TestTable columns={[idColumn, valueColumn]} items={items} />);

  const editButton = container.querySelector('button[aria-label="Edit value 1"]') as HTMLElement;
  const editButtonCell = editButton.closest('td');

  editButton.focus();
  expect(editButton).toHaveFocus();

  editButton.blur();
  editButton.remove();
  await waitFor(() => expect(editButtonCell).toHaveFocus());
});

test('all elements focus is restored if table changes role after being rendered as grid', () => {
  const { container, rerender } = render(<TestTable columns={[valueColumn, idColumn]} items={items} />);
  const getTabIndices = () => Array.from(container.querySelectorAll('button')).map(button => button.tabIndex);

  expect(getTabIndices()).toEqual([0, -999, -999, -999, -999]);

  rerender(<TestTable keyboardNavigation={false} columns={[idColumn, valueColumn]} items={items} />);

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

  button.focus();
  expect(button).toHaveFocus();
  expect(button).toHaveAttribute('tabIndex', '-1');
});
