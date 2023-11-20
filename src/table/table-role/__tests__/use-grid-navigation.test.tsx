// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useGridNavigation } from '../../../../lib/components/table/table-role';
import { KeyCode } from '../../../../lib/components/internal/keycode';
import { TestTable, actionsColumn, idColumn, items, nameColumn, valueColumn } from './stubs';

function getActiveElement() {
  return [
    document.activeElement?.tagName.toLowerCase(),
    document.activeElement?.textContent || document.activeElement?.getAttribute('aria-label'),
  ];
}

test('does not listen to keyboard commands when keyboardNavigation=false', () => {
  const { container } = render(
    <TestTable columns={[idColumn, nameColumn, valueColumn]} items={items} keyboardNavigation={false} />
  );
  const table = container.querySelector('table')!;
  const button1 = table.querySelectorAll('button')[0];

  button1.focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(button1).toHaveFocus();
});

test('listens to keyboard commands when keyboardNavigation=true', () => {
  const { container } = render(<TestTable columns={[idColumn, nameColumn, valueColumn]} items={items} />);
  const table = container.querySelector('table')!;
  const button1 = table.querySelectorAll('button')[0];
  const button2 = table.querySelectorAll('button')[1];

  button1.focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(button2).toHaveFocus();
});

test('overrides forward focus', () => {
  const { container } = render(
    <TestTable columns={[idColumn, nameColumn, valueColumn]} items={items} after={<button id="after" />} />
  );
  const table = container.querySelector('table')!;
  const button1 = table.querySelectorAll('button')[0];
  const button2 = table.querySelectorAll('button')[1];
  const buttonAfter = container.querySelector('#after');

  button1.focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.tab });
  button2.focus();

  expect(buttonAfter).toHaveFocus();
});

test('focuses last table cell when no element after', () => {
  const { container } = render(<TestTable columns={[nameColumn, valueColumn, idColumn]} items={items} />);
  const table = container.querySelector('table')!;
  const button1 = table.querySelectorAll('button')[0];
  const button2 = table.querySelectorAll('button')[1];
  const allCells = table.querySelectorAll('td');
  const lastCell = allCells[allCells.length - 1];

  button1.focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.tab });
  button2.focus();

  expect(lastCell).toHaveFocus();
});

test('overrides backward focus', () => {
  const { container } = render(
    <TestTable columns={[idColumn, nameColumn, valueColumn]} items={items} before={<button id="before" />} />
  );
  const table = container.querySelector('table')!;
  const button1 = table.querySelectorAll('button')[0];
  const button2 = table.querySelectorAll('button')[1];
  const buttonBefore = container.querySelector('#before');

  button2.focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.tab, shiftKey: true });
  button1.focus();

  expect(buttonBefore).toHaveFocus();
});

test('focuses first table cell when no element before', () => {
  const { container } = render(<TestTable columns={[idColumn, nameColumn, valueColumn]} items={items} />);
  const table = container.querySelector('table')!;
  const button1 = table.querySelectorAll('button')[0];
  const button2 = table.querySelectorAll('button')[1];
  const firstCell = table.querySelectorAll('th')[0];

  button2.focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.tab, shiftKey: true });
  button1.focus();

  expect(firstCell).toHaveFocus();
});

test('refocuses previously focused element', () => {
  const { container } = render(
    <TestTable columns={[idColumn, nameColumn, valueColumn]} items={items} before={<button />} />
  );
  const table = container.querySelector('table')!;
  const button1 = table.querySelectorAll('button')[0];
  const button2 = table.querySelectorAll('button')[1];
  const buttonBefore = container.querySelectorAll('button')[0];

  button2.focus();
  expect(button2).toHaveFocus();

  buttonBefore.focus();
  expect(button2).not.toHaveFocus();

  button1.focus();
  expect(button2).toHaveFocus();
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
    useGridNavigation({ keyboardNavigation: true, pageSize: 2, getTable: () => null });
    return null;
  }
  expect(() => render(<TestTable />)).not.toThrow();
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

test('cell indices are updated when start index change', () => {
  const { container, rerender } = render(<TestTable columns={[idColumn, nameColumn, valueColumn]} items={items} />);
  const table = container.querySelector('table')!;

  (container.querySelector('button[aria-label="Sort by value"]') as HTMLElement).focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['button', 'Edit value 2']);

  rerender(<TestTable columns={[idColumn, nameColumn, valueColumn]} items={items} startIndex={5} />);

  fireEvent.keyDown(table, { keyCode: KeyCode.left });
  expect(getActiveElement()).toEqual(['td', 'Second']);
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

test('suppresses grid navigation when focusing on dialog element', () => {
  const { container } = render(<TestTable columns={[nameColumn, valueColumn]} items={items} />);
  const table = container.querySelector('table')!;

  (container.querySelector('button[aria-label="Sort by value"]') as HTMLElement).focus();
  expect(getActiveElement()).toEqual(['button', 'Sort by value']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['button', 'Edit value 1']);

  (document.activeElement as HTMLElement).click();
  expect(getActiveElement()).toEqual(['input', 'Value input']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['input', 'Value input']);

  (container.querySelector('button[aria-label="Save"]') as HTMLElement).click();
  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['button', 'Edit value 2']);
});

test('throws no error when focusing on incorrect target', () => {
  function TestComponent() {
    const tableRef = useRef<HTMLTableElement>(null);
    useGridNavigation({ keyboardNavigation: true, pageSize: 2, getTable: () => tableRef.current });
    return (
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
    );
  }

  const { container } = render(<TestComponent />);
  const table = container.querySelector('table')!;
  const button = container.querySelector('button')!;
  const g = container.querySelector('g')!;

  button.focus();
  expect(button).toHaveFocus();

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(button).toHaveFocus();

  g.focus();
  expect(g).toHaveFocus();
});
