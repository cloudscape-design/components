// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useGridNavigation } from '../use-grid-navigation';
import { KeyCode } from '../../../internal/keycode';

const f2Code = 113;

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

  fireEvent.keyDown(table, { keyCode: KeyCode.right });
  expect(getActiveElement()).toEqual(['button', 'action-2-3-2']);

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
