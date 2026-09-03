// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import BasicTable, {
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableBody,
  BasicTableRow,
  BasicTableCell,
  BasicTableProps,
} from '../../../../lib/components/beta/basic-table-0.1';

// Keyboard and screen-reader tests for the column resize handle. Each HeaderCell renders its own
// resize handle when resizableColumns is set. The handle has a two-element model: a focusable toggle
// (a single roving tab stop in its header cell) plus a role="slider" separator that owns Left/Right
// while in keyboard-drag mode and is marked data-awsui-table-suppress-navigation so the grid
// navigation does not hijack those keys.
//
// jsdom has no layout (getBoundingClientRect() === 0), so width is driven off a controlled
// columnWidths map (fed back through onColumnWidthsChange), not a measured DOM width.

interface Item {
  id: string;
  name: string;
  status: string;
}

const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, i) => ({ id: `row-${i}`, name: `Resource ${i}`, status: i % 2 === 0 ? 'Up' : 'Down' }));

const i18nStrings: BasicTableProps.I18nStrings = { tableLabel: 'Resources' };

const NAME_START_WIDTH = 200;
const STATUS_WIDTH = 150;
const NAME_MIN_WIDTH = 120;

// A controlled harness that feeds onColumnWidthsChange back into columnWidths, so aria-valuenow
// and the freeze-on-resize basis track the latest width across repeated keyboard steps.
function ResizableTable({ onWidths, nameMinWidth }: { onWidths: jest.Mock; nameMinWidth?: number }) {
  const [widths, setWidths] = useState<Record<number, number>>({ 0: NAME_START_WIDTH, 1: STATUS_WIDTH });
  const columns: BasicTableProps.ColumnDefinition[] = [
    { id: 'name', minWidth: nameMinWidth },
    { id: 'status' }, // flexible (no width → shares remaining space)
  ];
  return (
    <BasicTable
      columns={columns}
      totalRowCount={20}
      resizableColumns={true}
      columnWidths={widths}
      onColumnWidthsChange={event => {
        onWidths(event.detail);
        setWidths(event.detail.widths);
      }}
      i18nStrings={i18nStrings}
    >
      <BasicTableHeader>
        <BasicTableHeaderCell columnId="name">Name</BasicTableHeaderCell>
        <BasicTableHeaderCell columnId="status">Status</BasicTableHeaderCell>
      </BasicTableHeader>
      <BasicTableBody>
        {makeItems(20).map((item, index) => (
          <BasicTableRow key={item.id} index={index} id={item.id}>
            <BasicTableCell columnId="name">{item.name}</BasicTableCell>
            <BasicTableCell columnId="status">{item.status}</BasicTableCell>
          </BasicTableRow>
        ))}
      </BasicTableBody>
    </BasicTable>
  );
}

function renderResizable(opts: { nameMinWidth?: number } = { nameMinWidth: NAME_MIN_WIDTH }) {
  const onWidths = jest.fn();
  const { container } = render(<ResizableTable onWidths={onWidths} nameMinWidth={opts.nameMinWidth} />);
  const grid = container.querySelector('[role="grid"]') as HTMLElement;
  // The declarative header renders one columnheader per column; the first is the "name" column.
  const nameHeader = grid.querySelectorAll('[role="columnheader"]')[0] as HTMLElement;
  const getToggle = () => nameHeader.querySelector('button') as HTMLButtonElement;
  const getSeparator = () => nameHeader.querySelector('[role="slider"]') as HTMLElement;
  const lastWidths = () => onWidths.mock.calls[onWidths.mock.calls.length - 1][0].widths as Record<number, number>;
  return { container, grid, nameHeader, getToggle, getSeparator, onWidths, lastWidths };
}

describe('BasicTable resize handle keyboard + SR a11y (#8)', () => {
  test('the toggle has an accessible name (aria-labelledby -> header text) and resize roledescription', () => {
    const { nameHeader, getToggle } = renderResizable();
    const toggle = getToggle();
    expect(toggle.tagName).toBe('BUTTON');
    expect(toggle.getAttribute('aria-roledescription')).toBe('resize handle');

    const labelledby = toggle.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
    const labelEl = document.getElementById(labelledby!);
    expect(labelEl).toBe(nameHeader);
    expect(labelEl!.textContent).toContain('Name');
  });

  test('the toggle is the single roving tab stop in its header cell (tabIndex 0)', async () => {
    const { grid, getToggle } = renderResizable();
    await waitFor(() => expect(getToggle().tabIndex).toBe(0));
    expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
  });

  test('the separator is a slider, suppresses grid navigation, and exposes width via ARIA (hidden until dragging)', () => {
    const { getSeparator } = renderResizable();
    const separator = getSeparator();
    expect(separator.getAttribute('role')).toBe('slider');
    expect(separator.hasAttribute('data-awsui-table-suppress-navigation')).toBe(true);
    expect(separator.getAttribute('tabindex')).toBe('-1');
    expect(separator.getAttribute('aria-valuemin')).toBe(String(NAME_MIN_WIDTH));
    expect(separator.getAttribute('aria-valuenow')).toBe(String(NAME_START_WIDTH));
    // The slider is effectively unbounded above, but VoiceOver treats a slider with no max as
    // inoperable, so it exposes a sentinel max (mirroring Table) plus a human-readable aria-valuetext.
    expect(separator.getAttribute('aria-valuemax')).toBe(String(Number.MAX_SAFE_INTEGER));
    expect(separator.getAttribute('aria-valuetext')).toBe(`${NAME_START_WIDTH} pixels`);
    expect(separator.getAttribute('aria-hidden')).toBe('true');
  });

  test.each(['Enter', ' '])('%s on the toggle enters keyboard-drag mode: separator shown + focused', key => {
    const { getToggle, getSeparator } = renderResizable();
    fireEvent.keyDown(getToggle(), { key });
    expect(getSeparator().getAttribute('aria-hidden')).toBe('false');
    expect(document.activeElement).toBe(getSeparator());
  });

  test('ArrowRight/ArrowLeft on the separator adjust the width by 10px and clamp at minWidth', () => {
    const { getToggle, getSeparator, lastWidths } = renderResizable();

    fireEvent.keyDown(getToggle(), { key: 'Enter' });

    // ArrowRight: 200 -> 210.
    fireEvent.keyDown(getSeparator(), { key: 'ArrowRight' });
    expect(lastWidths()[0]).toBe(NAME_START_WIDTH + 10);
    expect(getSeparator().getAttribute('aria-valuenow')).toBe(String(NAME_START_WIDTH + 10));

    // ArrowLeft: 210 -> 200.
    fireEvent.keyDown(getSeparator(), { key: 'ArrowLeft' });
    expect(lastWidths()[0]).toBe(NAME_START_WIDTH);

    // Repeated ArrowLeft clamps at minWidth and never goes below it.
    for (let i = 0; i < 30; i++) {
      fireEvent.keyDown(getSeparator(), { key: 'ArrowLeft' });
      expect(lastWidths()[0]).toBeGreaterThanOrEqual(NAME_MIN_WIDTH);
    }
    expect(lastWidths()[0]).toBe(NAME_MIN_WIDTH);
    // The other column is untouched by name's resize.
    expect(lastWidths()[1]).toBe(STATUS_WIDTH);
  });

  test('Escape exits keyboard-drag mode: separator hidden again + focus returns to the toggle', () => {
    const { getToggle, getSeparator } = renderResizable();
    const toggle = getToggle();

    fireEvent.keyDown(toggle, { key: 'Enter' });
    expect(getSeparator().getAttribute('aria-hidden')).toBe('false');
    expect(document.activeElement).toBe(getSeparator());

    fireEvent.keyDown(getSeparator(), { key: 'Escape' });
    expect(getSeparator().getAttribute('aria-hidden')).toBe('true');
    expect(document.activeElement).toBe(toggle);
  });

  // A column with no configured minWidth floors every resize at DEFAULT_COLUMN_WIDTH (120): the hook
  // clamps at `col.minWidth ?? DEFAULT_COLUMN_WIDTH` (use-basic-table.ts resizeFloors /
  // resizeMinWidthOf), so an un-configured column cannot collapse toward 0.
  test('R1: a column with NO configured minWidth clamps at DEFAULT_COLUMN_WIDTH (120)', () => {
    const { getToggle, getSeparator, lastWidths } = renderResizable({});
    // No configured minWidth -> the resize floor (and aria-valuemin) is the default 120, not 0.
    expect(getSeparator().getAttribute('aria-valuemin')).toBe('120');

    fireEvent.keyDown(getToggle(), { key: 'Enter' });
    // 30 ArrowLefts from 200px would reach -100 unclamped; the width clamps at the 120 default floor.
    for (let i = 0; i < 30; i++) {
      fireEvent.keyDown(getSeparator(), { key: 'ArrowLeft' });
    }
    expect(lastWidths()[0]).toBe(120);
  });
});

// Pointer-drag commit semantics (parity with Table's onWidthUpdate-per-move +
// onWidthUpdateCommit-on-release): the internal `dragWidths` state renders the live preview during
// a drag WITHOUT emitting the public event; `onColumnWidthsChange` fires exactly ONCE on
// pointer-up, and only when the dragged column's width actually changed (Table's `widthsChanged`
// guard). jsdom has no layout, but `startWidth` is read from the controlled `columnWidths` map, so
// clientX deltas drive deterministic widths.
describe('BasicTable pointer-drag resize commit semantics', () => {
  // jsdom's PointerEvent init drops clientX; a MouseEvent dispatched with a pointer type carries it
  // and still triggers the same 'pointerdown'/'pointermove'/'pointerup' listeners.
  const ptr = (type: string, clientX: number) => new MouseEvent(type, { clientX, bubbles: true, cancelable: true });

  test('a drag emits onColumnWidthsChange exactly once (on pointer-up), not per pointer-move', () => {
    const { getToggle, onWidths, lastWidths } = renderResizable();
    const handle = getToggle();

    fireEvent(handle, ptr('pointerdown', 500));
    // Several moves -> live preview only, no public event yet.
    fireEvent(document, ptr('pointermove', 520));
    fireEvent(document, ptr('pointermove', 540));
    fireEvent(document, ptr('pointermove', 560));
    expect(onWidths).not.toHaveBeenCalled();

    fireEvent(document, ptr('pointerup', 560));
    // Exactly one commit, carrying the final width (200 + (560-500) = 260).
    expect(onWidths).toHaveBeenCalledTimes(1);
    expect(lastWidths()[0]).toBe(NAME_START_WIDTH + 60);
    // Sibling (last, flexible) column is untouched by the name-column drag.
    expect(lastWidths()[1]).toBe(STATUS_WIDTH);
  });

  test('a bare click on the handle (no move / net-zero drag) emits no commit', () => {
    const { getToggle, onWidths } = renderResizable();
    const handle = getToggle();

    fireEvent(handle, ptr('pointerdown', 500));
    fireEvent(document, ptr('pointerup', 500));
    expect(onWidths).not.toHaveBeenCalled();

    // A move that returns to the origin nets zero change -> still no commit.
    fireEvent(handle, ptr('pointerdown', 500));
    fireEvent(document, ptr('pointermove', 560));
    fireEvent(document, ptr('pointermove', 500));
    fireEvent(document, ptr('pointerup', 500));
    expect(onWidths).not.toHaveBeenCalled();
  });
});
