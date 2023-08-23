// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useGridNavigation } from '../../../../lib/components/table/table-role';
import { KeyCode } from '../../../../lib/components/internal/keycode';

const f2Code = 113;

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

function SimpleTable({ tableRole = 'grid' }: { tableRole?: 'grid' | 'table' }) {
  const tableRef = useRef<HTMLTableElement>(null);
  useGridNavigation({ tableRole, pageSize: 2, getTable: () => tableRef.current });
  return (
    <table role={tableRole} ref={tableRef}>
      <thead>
        <tr aria-rowindex={1}>
          <th aria-colindex={1}>header-1</th>
          <th aria-colindex={2}>header-2</th>
          <th aria-colindex={3}>header-3</th>
        </tr>
      </thead>
      <tbody>
        <tr aria-rowindex={2}>
          <td aria-colindex={1}>cell-1-1</td>
          <td aria-colindex={2}>cell-1-2</td>
          <td aria-colindex={3}>cell-1-3</td>
        </tr>
      </tbody>
    </table>
  );
}

function InteractiveTable({ actionsWidget = false, pageSize = 2 }: { actionsWidget?: boolean; pageSize?: number }) {
  const tableRef = useRef<HTMLTableElement>(null);
  useGridNavigation({ tableRole: 'grid', pageSize, getTable: () => tableRef.current });
  return (
    <table role="grid" ref={tableRef}>
      <thead>
        <tr aria-rowindex={1}>
          <th aria-colindex={1}>
            header-1 <button>desc</button>
          </th>
          <th aria-colindex={2}>header-2</th>
          <th aria-colindex={3}>header-3</th>
        </tr>
      </thead>
      <tbody>
        <tr aria-rowindex={2}>
          <td aria-colindex={1}>
            <a href="#">link-1-1</a>
          </td>
          <td aria-colindex={2}>cell-1-2</td>
          <td aria-colindex={3} data-widget-cell={actionsWidget}>
            <button>action-1-3-1</button> <button>action-1-3-2</button>
          </td>
        </tr>
        <tr aria-rowindex={3}>
          <td aria-colindex={1}>
            <a href="#">link-2-1</a>
          </td>
          <td aria-colindex={2}>cell-2-2</td>
          <td aria-colindex={3} data-widget-cell={actionsWidget}>
            <button>action-2-3-1</button> <button>action-2-3-2</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function getActiveElement() {
  return [document.activeElement?.tagName.toLowerCase(), document.activeElement?.textContent];
}

test('not activated for "table" role', () => {
  const { container } = render(<SimpleTable tableRole="table" />);
  expect(container.querySelectorAll('td[tabIndex],th[tabIndex]')).toHaveLength(0);
});

test('updates cell tab indices', () => {
  const { container } = render(<SimpleTable tableRole="grid" />);
  const focusableCells = container.querySelectorAll('td[tabIndex="-1"],th[tabIndex="-1"]');
  const userFocusableCells = container.querySelectorAll('td[tabIndex="0"],th[tabIndex="0"]');

  expect(focusableCells).toHaveLength(5);
  expect(userFocusableCells).toHaveLength(1);
  expect(userFocusableCells[0].textContent).toBe('header-1');
});

test('updates interactive elements tab indices', () => {
  const { container } = render(<InteractiveTable />);
  const mutedInteractiveElements = container.querySelectorAll('a[tabIndex=-1],button[tabIndex=-1]');

  // All elements but the first are muted.
  expect(mutedInteractiveElements).toHaveLength(6);
});

test('supports arrow keys navigation', () => {
  const { container } = render(<InteractiveTable />);
  const table = container.querySelector('table')!;

  (container.querySelectorAll('button') as NodeListOf<HTMLElement>)[0].focus();
  expect(getActiveElement()).toEqual(['button', 'desc']);

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['th', 'header-2']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['td', 'cell-1-2']);

  fireEvent.keyDown(table, { keyCode: KeyCode.left });
  expect(getActiveElement()).toEqual(['a', 'link-1-1']);

  fireEvent.keyDown(table, { keyCode: KeyCode.up });
  expect(getActiveElement()).toEqual(['button', 'desc']);
});

test('supports key combination navigation', () => {
  const { container } = render(<InteractiveTable />);
  const table = container.querySelector('table')!;

  (container.querySelectorAll('button') as NodeListOf<HTMLElement>)[0].focus();
  expect(getActiveElement()).toEqual(['button', 'desc']);

  fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
  expect(getActiveElement()).toEqual(['a', 'link-2-1']);

  fireEvent.keyDown(table, { keyCode: KeyCode.pageUp });
  expect(getActiveElement()).toEqual(['button', 'desc']);

  fireEvent.keyDown(table, { keyCode: KeyCode.end });
  expect(getActiveElement()).toEqual(['th', 'header-3']);

  fireEvent.keyDown(table, { keyCode: KeyCode.home });
  expect(getActiveElement()).toEqual(['button', 'desc']);

  fireEvent.keyDown(table, { keyCode: KeyCode.end, ctrlKey: true });
  expect(getActiveElement()).toEqual(['td', 'action-2-3-1 action-2-3-2']);

  fireEvent.keyDown(table, { keyCode: KeyCode.home, ctrlKey: true });
  expect(getActiveElement()).toEqual(['button', 'desc']);

  fireEvent.keyDown(table, { keyCode: KeyCode.backspace }); // Unsupported key
  expect(getActiveElement()).toEqual(['button', 'desc']);
});

test('supports multi-element cell navigation', () => {
  const { container } = render(<InteractiveTable actionsWidget={false} />);
  const table = container.querySelector('table')!;

  (container.querySelectorAll('button') as NodeListOf<HTMLElement>)[0].focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['td', 'action-2-3-1 action-2-3-2']);

  fireEvent.keyDown(table, { keyCode: KeyCode.enter });
  expect(getActiveElement()).toEqual(['button', 'action-2-3-1']);

  // Pressing enter when inside a cell does not move focus.
  fireEvent.keyDown(table, { keyCode: KeyCode.enter });
  expect(getActiveElement()).toEqual(['button', 'action-2-3-1']);

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['button', 'action-2-3-2']);

  fireEvent.keyDown(table, { keyCode: KeyCode.escape });
  expect(getActiveElement()).toEqual(['td', 'action-2-3-1 action-2-3-2']);

  // Pressing escape when not inside a cell does not move focus.
  fireEvent.keyDown(table, { keyCode: KeyCode.escape });
  expect(getActiveElement()).toEqual(['td', 'action-2-3-1 action-2-3-2']);

  fireEvent.keyDown(table, { keyCode: f2Code });
  expect(getActiveElement()).toEqual(['button', 'action-2-3-1']);

  fireEvent.keyDown(table, { keyCode: f2Code });
  expect(getActiveElement()).toEqual(['td', 'action-2-3-1 action-2-3-2']);
});

test('supports widget cell navigation', () => {
  const { container } = render(<InteractiveTable actionsWidget={true} />);
  const table = container.querySelector('table')!;

  (container.querySelectorAll('button') as NodeListOf<HTMLElement>)[0].focus();
  fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['td', 'action-2-3-1 action-2-3-2']);

  fireEvent.keyDown(table, { keyCode: KeyCode.enter });
  expect(getActiveElement()).toEqual(['button', 'action-2-3-1']);

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['button', 'action-2-3-1']);

  fireEvent.keyDown(table, { keyCode: KeyCode.escape });
  expect(getActiveElement()).toEqual(['td', 'action-2-3-1 action-2-3-2']);

  fireEvent.keyDown(table, { keyCode: f2Code });
  expect(getActiveElement()).toEqual(['button', 'action-2-3-1']);

  fireEvent.keyDown(table, { keyCode: f2Code });
  expect(getActiveElement()).toEqual(['td', 'action-2-3-1 action-2-3-2']);
});

test('updates page size', () => {
  const { container, rerender } = render(<InteractiveTable />);
  const table = container.querySelector('table')!;

  (container.querySelectorAll('button') as NodeListOf<HTMLElement>)[0].focus();
  expect(getActiveElement()).toEqual(['button', 'desc']);

  fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
  expect(getActiveElement()).toEqual(['a', 'link-2-1']);

  rerender(<InteractiveTable pageSize={1} />);

  fireEvent.keyDown(table, { keyCode: KeyCode.pageUp });
  expect(getActiveElement()).toEqual(['a', 'link-1-1']);
});

test('does not throw errors if table is null', () => {
  function TestComponent() {
    useGridNavigation({ tableRole: 'grid', pageSize: 2, getTable: () => null });
    return null;
  }
  expect(() => render(<TestComponent />)).not.toThrow();
});

test('keeps first cell focusable if focus inside table but not inside any of the cells', () => {
  function TestComponent() {
    const tableRef = useRef<HTMLTableElement>(null);
    useGridNavigation({ tableRole: 'grid', pageSize: 2, getTable: () => tableRef.current });
    return (
      <table role="grid" ref={tableRef}>
        <thead>
          <tr>
            <th>header-1</th>
            <th>
              header-2 <button>action</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>cell-1-1</td>
            <td>cell-1-2</td>
          </tr>
        </tbody>
      </table>
    );
  }

  const { container } = render(<TestComponent />);
  expect(container.querySelector('th')).toHaveAttribute('tabIndex', '0');

  (container.querySelectorAll('button') as NodeListOf<HTMLElement>)[0].focus();
  expect(container.querySelector('th')).toHaveAttribute('tabIndex', '0');
});

test('ignores keydown when no cell is in focus', () => {
  function TestComponent() {
    const tableRef = useRef<HTMLTableElement>(null);
    useGridNavigation({ tableRole: 'grid', pageSize: 2, getTable: () => tableRef.current });
    return (
      <table role="grid" ref={tableRef}>
        <thead>
          <tr aria-rowindex={1}>
            <th aria-colindex={1}>header-1</th>
            <th>
              header-2 <button>action</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr aria-rowindex={2}>
            <td aria-colindex={1}>cell-1-1</td>
            <td aria-colindex={2}>cell-1-2</td>
          </tr>
        </tbody>
      </table>
    );
  }

  const { container } = render(<TestComponent />);
  const table = container.querySelector('table')!;

  (container.querySelectorAll('button') as NodeListOf<HTMLElement>)[0].focus();
  expect(document.activeElement!.tagName.toLowerCase()).toBe('button');

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(document.activeElement!.tagName.toLowerCase()).toBe('button');
});

test('ignores keydown modifiers other than ctrl are used', () => {
  const { container } = render(<InteractiveTable />);
  const table = container.querySelector('table')!;

  const button = (container.querySelectorAll('button') as NodeListOf<HTMLElement>)[0];
  button.focus();

  fireEvent.keyDown(table, { keyCode: KeyCode.down, altKey: true });
  expect(button).toHaveFocus();

  fireEvent.keyDown(table, { keyCode: KeyCode.down, shiftKey: true });
  expect(button).toHaveFocus();

  fireEvent.keyDown(table, { keyCode: KeyCode.down, metaKey: true });
  expect(button).toHaveFocus();

  fireEvent.keyDown(table, { keyCode: KeyCode.down, ctrlKey: true });
  expect(button).toHaveFocus();

  fireEvent.keyDown(table, { keyCode: KeyCode.end, ctrlKey: true });
  expect(button).not.toHaveFocus();
});

test('cell is re-focused after it was mutated', () => {
  const { container } = render(<InteractiveTable />);
  const row1 = container.querySelectorAll('tr')[1]!;
  const row2 = container.querySelectorAll('tr')[2]!;
  const link1 = row1.querySelector('a')!;
  const link2 = row2.querySelector('a')!;

  expect(document.body).toHaveFocus();

  mockObserver.callback([{ type: 'childList', removedNodes: [row1] } as unknown as MutationRecord]);

  expect(document.body).toHaveFocus();

  link1.focus();
  row1.remove();

  mockObserver.callback([{ type: 'childList', removedNodes: [row1] } as unknown as MutationRecord]);

  expect(link2).toHaveFocus();
});

test('cell navigation works when the table is mutated between commands', () => {
  function TestComponent() {
    const tableRef = useRef<HTMLTableElement>(null);
    useGridNavigation({ tableRole: 'grid', pageSize: 2, getTable: () => tableRef.current });
    return (
      <table role="grid" ref={tableRef}>
        <thead>
          <tr aria-rowindex={1}>
            <th aria-colindex={1}>header-1</th>
            <th aria-colindex={2}>
              header-2 <button>action</button>
            </th>
            <th aria-colindex={3}>header-3</th>
          </tr>
        </thead>
        <tbody>
          <tr aria-rowindex={2}>
            <td aria-colindex={1}>cell-1-1</td>
            <td aria-colindex={2}>cell-1-2</td>
            <td aria-colindex={3}>cell-1-3</td>
          </tr>
        </tbody>
      </table>
    );
  }

  const { container } = render(<TestComponent />);
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
    useGridNavigation({ tableRole: 'grid', pageSize: 2, getTable: () => tableRef.current });
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
  const button = container.querySelector('button')!;
  const g = container.querySelector('g')!;

  button.focus();
  expect(button).toHaveFocus();

  g.focus();
  expect(g).toHaveFocus();
});

test('elements focus is restored if table changes role after being rendered as grid', () => {
  function TestComponent({ tableRole }: { tableRole: 'table' | 'grid' }) {
    const tableRef = useRef<HTMLTableElement>(null);
    useGridNavigation({ tableRole, pageSize: 2, getTable: () => tableRef.current });
    return (
      <table role={tableRole} ref={tableRef}>
        <tbody>
          <tr aria-rowindex={1}>
            <td aria-colindex={1}>
              <button>action 1</button>
            </td>
            <td aria-colindex={2}>
              <button>action 2</button>
            </td>
            <td aria-colindex={3}>
              <button>action 3</button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  const { container, rerender } = render(<TestComponent tableRole="grid" />);

  expect(Array.from(container.querySelectorAll('button')).map(button => button.tabIndex)).toEqual([0, -1, -1]);

  rerender(<TestComponent tableRole="table" />);

  expect(Array.from(container.querySelectorAll('button')).map(button => button.tabIndex)).toEqual([0, 0, 0]);
});

test('when focus is inside widget cell the cell and the cell next to it are focusable', () => {
  const { container } = render(<InteractiveTable actionsWidget={true} />);
  const table = container.querySelector('table')!;
  const widgetCell = container.querySelector('[aria-rowindex="2"]')!.querySelector('[aria-colindex="3"]')!;
  const nextCell = container.querySelector('[aria-rowindex="3"]')!.querySelector('[aria-colindex="1"]')!;

  widgetCell.querySelector('button')?.focus();

  expect(widgetCell).toHaveAttribute('tabIndex', '0');
  expect(nextCell).toHaveAttribute('tabIndex', '0');

  fireEvent.keyDown(table, { keyCode: KeyCode.escape });

  expect(widgetCell).toHaveAttribute('tabIndex', '0');
  expect(nextCell).toHaveAttribute('tabIndex', '-1');
});
