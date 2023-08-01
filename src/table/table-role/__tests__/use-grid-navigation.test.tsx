// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useGridNavigation } from '../use-grid-navigation';
import { KeyCode } from '../../../internal/keycode';

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

function InteractiveTable({ pageSize = 2 }: { actionsWidget?: boolean; pageSize?: number }) {
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
          <td aria-colindex={3}>
            <button>action-1-3-1</button> <button>action-1-3-2</button>
          </td>
        </tr>
        <tr aria-rowindex={3}>
          <td aria-colindex={1}>
            <a href="#">link-2-1</a>
          </td>
          <td aria-colindex={2}>cell-2-2</td>
          <td aria-colindex={3}>
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

  expect(focusableCells).toHaveLength(4);
  expect(userFocusableCells).toHaveLength(2);
  expect(userFocusableCells[0].textContent).toBe('header-1');
  expect(userFocusableCells[1].textContent).toBe('cell-1-3');
});

test('makes cells around focused cell user-focusable', () => {
  const { container } = render(<InteractiveTable />);
  const allCells = container.querySelectorAll('td,th') as NodeListOf<HTMLElement>;

  allCells[3].focus();

  let userFocusableCells = container.querySelectorAll('td[tabIndex="0"],th[tabIndex="0"]');
  expect(userFocusableCells).toHaveLength(4);
  expect(userFocusableCells[0].textContent).toBe('header-1 desc');
  expect(userFocusableCells[1].textContent).toBe('header-3');
  expect(userFocusableCells[2].textContent).toBe('cell-1-2');
  expect(userFocusableCells[3].textContent).toBe('action-2-3-1 action-2-3-2');

  allCells[4].focus();

  userFocusableCells = container.querySelectorAll('td[tabIndex="0"],th[tabIndex="0"]');
  expect(userFocusableCells).toHaveLength(4);
  expect(userFocusableCells[0].textContent).toBe('header-1 desc');
  expect(userFocusableCells[1].textContent).toBe('link-1-1');
  expect(userFocusableCells[2].textContent).toBe('action-1-3-1 action-1-3-2');
  expect(userFocusableCells[3].textContent).toBe('action-2-3-1 action-2-3-2');

  allCells[5].querySelectorAll('button')[1]!.focus();

  userFocusableCells = container.querySelectorAll('td[tabIndex="0"],th[tabIndex="0"]');
  expect(userFocusableCells).toHaveLength(4);
  expect(userFocusableCells[0].textContent).toBe('header-1 desc');
  expect(userFocusableCells[1].textContent).toBe('cell-1-2');
  expect(userFocusableCells[2].textContent).toBe('link-2-1');
  expect(userFocusableCells[3].textContent).toBe('action-2-3-1 action-2-3-2');
});

test('supports arrow keys navigation when focusing on cell', () => {
  const { container } = render(<InteractiveTable />);
  const table = container.querySelector('table')!;

  table.querySelector('button')!.focus();
  expect(getActiveElement()).toEqual(['button', 'desc']);

  // Not intercepted
  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['button', 'desc']);

  // Moving focus to cell
  fireEvent.keyDown(table, { keyCode: KeyCode.escape });
  expect(getActiveElement()).toEqual(['th', 'header-1 desc']);

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['th', 'header-2']);

  fireEvent.keyDown(table, { keyCode: KeyCode.down });
  expect(getActiveElement()).toEqual(['td', 'cell-1-2']);

  fireEvent.keyDown(table, { keyCode: KeyCode.left });
  expect(getActiveElement()).toEqual(['td', 'link-1-1']);

  fireEvent.keyDown(table, { keyCode: KeyCode.up });
  expect(getActiveElement()).toEqual(['th', 'header-1 desc']);

  // Moving focus back to button
  fireEvent.keyDown(table, { keyCode: KeyCode.enter });
  expect(getActiveElement()).toEqual(['button', 'desc']);
});

// test('supports key combination navigation', () => {
//   const { container } = render(<InteractiveTable />);
//   const table = container.querySelector('table')!;
//   const focusables = container.querySelectorAll('a,button,*[tabIndex="0"]') as NodeListOf<HTMLElement>;

//   focusables[0].focus();
//   expect(getActiveElement()).toEqual(['button', 'desc']);

//   fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
//   expect(getActiveElement()).toEqual(['a', 'link-2-1']);

//   fireEvent.keyDown(table, { keyCode: KeyCode.pageUp });
//   expect(getActiveElement()).toEqual(['button', 'desc']);

//   fireEvent.keyDown(table, { keyCode: KeyCode.end });
//   expect(getActiveElement()).toEqual(['th', 'header-3']);

//   fireEvent.keyDown(table, { keyCode: KeyCode.home });
//   expect(getActiveElement()).toEqual(['button', 'desc']);

//   fireEvent.keyDown(table, { keyCode: KeyCode.end, ctrlKey: true });
//   expect(getActiveElement()).toEqual(['button', 'action-2-3-1']);

//   fireEvent.keyDown(table, { keyCode: KeyCode.home, ctrlKey: true });
//   expect(getActiveElement()).toEqual(['button', 'desc']);
// });

// test('support widget cell navigation', () => {
//   const { container } = render(<InteractiveTable actionsWidget={true} />);
//   const table = container.querySelector('table')!;
//   const focusables = container.querySelectorAll('a,button,*[tabIndex="0"]') as NodeListOf<HTMLElement>;

//   focusables[0].focus();
//   fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
//   fireEvent.keyDown(table, { keyCode: KeyCode.right });
//   fireEvent.keyDown(table, { keyCode: KeyCode.right });
//   expect(getActiveElement()).toEqual(['td', 'action-2-3-1 action-2-3-2']);

//   fireEvent.keyDown(table, { keyCode: KeyCode.enter });
//   expect(getActiveElement()).toEqual(['button', 'action-2-3-1']);

//   fireEvent.keyDown(table, { keyCode: KeyCode.right });
//   expect(getActiveElement()).toEqual(['button', 'action-2-3-2']);

//   fireEvent.keyDown(table, { keyCode: KeyCode.escape });
//   expect(getActiveElement()).toEqual(['td', 'action-2-3-1 action-2-3-2']);
// });

// test('updates page size', () => {
//   const { container, rerender } = render(<InteractiveTable />);
//   const table = container.querySelector('table')!;
//   const focusables = container.querySelectorAll('a,button,*[tabIndex="0"]') as NodeListOf<HTMLElement>;

//   focusables[0].focus();
//   expect(getActiveElement()).toEqual(['button', 'desc']);

//   fireEvent.keyDown(table, { keyCode: KeyCode.pageDown });
//   expect(getActiveElement()).toEqual(['a', 'link-2-1']);

//   rerender(<InteractiveTable pageSize={1} />);

//   fireEvent.keyDown(table, { keyCode: KeyCode.pageUp });
//   expect(getActiveElement()).toEqual(['a', 'link-1-1']);
// });
