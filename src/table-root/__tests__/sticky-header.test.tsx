// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Checkbox from '../../../lib/components/checkbox';
import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot, { TableRootProps } from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';

import abstractSwitchStyles from '../../../lib/components/internal/components/abstract-switch/styles.selectors.js';
import styles from '../../../lib/components/table-root/styles.selectors.js';

const GRID: TableRootProps.ColumnLayout = { type: 'grid', columns: [{ size: 200 }, { size: 300 }] };
const AUTO: TableRootProps.ColumnLayout = { type: 'auto' };

function Head({ onSort }: { onSort?: () => void }) {
  return (
    <TableHead>
      <TableRow>
        <TableHeaderCell>
          <button type="button" onClick={onSort}>
            Name
          </button>
        </TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
      </TableRow>
    </TableHead>
  );
}

function Body() {
  return (
    <TableBody>
      {['a', 'b', 'c'].map(id => (
        <TableRow key={id}>
          <TableBodyCell>
            <a href={`#${id}`}>{id}</a>
          </TableBodyCell>
          <TableBodyCell>ok</TableBodyCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

interface FixtureProps {
  sticky?: boolean;
  columnLayout?: TableRootProps.ColumnLayout;
  offset?: number;
  onSort?: () => void;
}

function Fixture({ sticky = true, columnLayout = GRID, offset, onSort }: FixtureProps) {
  return (
    <TableRoot
      ariaLabel="Resources"
      columnLayout={columnLayout}
      stickyHeader={sticky ? <Head onSort={onSort} /> : undefined}
      stickyHeaderVerticalOffset={offset}
    >
      {!sticky && <Head onSort={onSort} />}
      <Body />
    </TableRoot>
  );
}

const findSlot = (container: HTMLElement) => container.querySelector<HTMLElement>(`.${styles['sticky-slot']}`);
const findScroller = (container: HTMLElement) => container.querySelector<HTMLElement>(`.${styles['body-scroller']}`)!;
const findRealTable = (container: HTMLElement) => findScroller(container).querySelector('table')!;
const headerCells = (table: HTMLTableElement) => Array.from(table.tHead!.rows).flatMap(row => Array.from(row.cells));

function mockRects(getRect: (element: HTMLElement) => Partial<DOMRect> | undefined) {
  const original = HTMLElement.prototype.getBoundingClientRect;
  const spy = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement
  ) {
    const rect = getRect(this);
    return rect ? ({ ...original.call(this), ...rect } as DOMRect) : original.call(this);
  });
  return () => spy.mockRestore();
}

describe('TableRoot sticky header', () => {
  test('renders no copy without stickyHeader', () => {
    const { container } = render(<Fixture sticky={false} />);
    expect(findSlot(container)).toBeNull();
    expect(container.querySelectorAll('thead')).toHaveLength(1);
    expect(findScroller(container).style.marginBlockStart).toBe('');
  });

  test('renders the header in the table and a hidden copy that holds only the header', () => {
    const { container } = render(<Fixture />);
    const slot = findSlot(container)!;
    expect(slot.getAttribute('aria-hidden')).toBe('true');
    expect(slot.querySelectorAll('thead')).toHaveLength(1);
    expect(slot.querySelector('tbody')).toBeNull();
    const realTable = findRealTable(container);
    expect(realTable.tHead).not.toBeNull();
    expect(realTable.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  test('keeps the copy out of the tab order but clickable', () => {
    const onSort = jest.fn();
    const { container } = render(<Fixture onSort={onSort} />);
    const slot = findSlot(container)!;
    const copyButton = slot.querySelector('button')!;
    expect(copyButton.tabIndex).toBe(-1);
    expect((slot as HTMLElement & { inert?: boolean }).inert).toBeFalsy();
    expect(findRealTable(container).querySelector('button')!.tabIndex).toBe(0);
    fireEvent.click(copyButton);
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  test('marks the copy of a focused real header control, and clears it when focus leaves the header', () => {
    const { container } = render(<Fixture />);
    const realButton = findRealTable(container).querySelector('button')!;
    const copyButton = findSlot(container)!.querySelector('button')!;

    fireEvent.focus(realButton);
    expect(copyButton).toHaveClass(styles['sticky-copy-focus']);

    fireEvent.blur(realButton);
    fireEvent.focus(findRealTable(container).tBodies[0].querySelector('a')!);
    expect(copyButton).not.toHaveClass(styles['sticky-copy-focus']);
  });

  test('hides the real header under the copy and restores it when sticky is turned off', () => {
    const restore = mockRects(element => (element.tagName === 'THEAD' ? { height: 40 } : undefined));
    try {
      const { container, rerender } = render(<Fixture />);
      expect(findScroller(container).style.marginBlockStart).toBe('-40px');
      rerender(<Fixture sticky={false} />);
      expect(findScroller(container).style.marginBlockStart).toBe('');
    } finally {
      restore();
    }
  });

  test('mirrors measured header cell widths onto the copy in auto layout and clears them in grid layout', () => {
    const widths = new Map<string, number>([
      ['Name', 120],
      ['Status', 80],
    ]);
    const restore = mockRects(element =>
      element.tagName === 'TH' && !findSlotFor(element) ? { width: widths.get(element.textContent ?? '') } : undefined
    );
    try {
      const { container, rerender } = render(<Fixture columnLayout={AUTO} />);
      const copyCells = headerCells(findSlot(container)!.querySelector('table')!);
      expect(copyCells.map(cell => cell.style.width)).toEqual(['120px', '80px']);

      rerender(<Fixture columnLayout={GRID} />);
      expect(headerCells(findSlot(container)!.querySelector('table')!).map(cell => cell.style.width)).toEqual(['', '']);
    } finally {
      restore();
    }
  });

  test('re-syncs copy widths when a real header cell resizes without a re-render', () => {
    const observers: Array<{ callback: ResizeObserverCallback; elements: Set<Element> }> = [];
    const OriginalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class {
      private entry: { callback: ResizeObserverCallback; elements: Set<Element> };
      constructor(callback: ResizeObserverCallback) {
        this.entry = { callback, elements: new Set() };
        observers.push(this.entry);
      }
      observe(element: Element) {
        this.entry.elements.add(element);
      }
      unobserve(element: Element) {
        this.entry.elements.delete(element);
      }
      disconnect() {
        this.entry.elements.clear();
      }
    } as unknown as typeof ResizeObserver;
    let nameWidth = 120;
    const restore = mockRects(element =>
      element.tagName === 'TH' && !findSlotFor(element) && element.textContent === 'Name'
        ? { width: nameWidth }
        : undefined
    );
    try {
      const { container } = render(<Fixture columnLayout={AUTO} />);
      const realNameCell = headerCells(findRealTable(container))[0];
      const copyNameCell = headerCells(findSlot(container)!.querySelector('table')!)[0];
      expect(copyNameCell.style.width).toBe('120px');

      nameWidth = 300;
      observers
        .filter(observer => observer.elements.has(realNameCell))
        .forEach(observer => observer.callback([], observer as unknown as ResizeObserver));
      expect(copyNameCell.style.width).toBe('300px');
    } finally {
      restore();
      window.ResizeObserver = OriginalResizeObserver;
    }
  });

  test('moves focus that lands in the copy to the matching real header control', () => {
    const { container } = render(<Fixture />);
    const copyButton = findSlot(container)!.querySelector('button')!;
    const realButton = findRealTable(container).querySelector('button')!;
    copyButton.focus();
    expect(document.activeElement).toBe(realButton);
  });

  test('keeps a hidden control in the copy out of the tab order', () => {
    // checkVisibility isn't defined in JSDOM, so define it to report every element as hidden.
    const proto = HTMLElement.prototype as unknown as { checkVisibility?: () => boolean };
    proto.checkVisibility = () => false;
    try {
      const { container } = render(<Fixture />);
      expect(findSlot(container)!.querySelector('button')!.tabIndex).toBe(-1);
    } finally {
      delete proto.checkVisibility;
    }
  });

  describe('focus ring of a real header checkbox', () => {
    function renderCheckboxHeader() {
      const { container } = render(
        <TableRoot
          ariaLabel="Resources"
          columnLayout={GRID}
          stickyHeader={
            <TableHead>
              <TableRow>
                <TableHeaderCell>
                  <Checkbox checked={false} ariaLabel="Select all" />
                </TableHeaderCell>
              </TableRow>
            </TableHead>
          }
        >
          <Body />
        </TableRoot>
      );
      return {
        realInput: findRealTable(container).querySelector('input')!,
        copyOutline: findSlot(container)!.querySelector(`.${abstractSwitchStyles.outline}`)!,
      };
    }
    afterEach(() => document.body.removeAttribute('data-awsui-focus-visible'));

    test('shows on the copy outline for keyboard focus', () => {
      const { realInput, copyOutline } = renderCheckboxHeader();
      document.body.setAttribute('data-awsui-focus-visible', 'true');
      fireEvent.focus(realInput);
      expect(copyOutline).toHaveClass(abstractSwitchStyles['show-outline']);

      fireEvent.blur(realInput);
      expect(copyOutline).not.toHaveClass(abstractSwitchStyles['show-outline']);
    });

    test('does not show on the copy outline for pointer focus', () => {
      const { realInput, copyOutline } = renderCheckboxHeader();
      fireEvent.focus(realInput);
      expect(copyOutline).not.toHaveClass(abstractSwitchStyles['show-outline']);
    });
  });

  test('does not measure header cells in auto layout without a sticky header', () => {
    const measured: string[] = [];
    const restore = mockRects(element => {
      measured.push(element.tagName);
      return undefined;
    });
    try {
      render(<Fixture sticky={false} columnLayout={AUTO} />);
      expect(measured).not.toContain('TH');
    } finally {
      restore();
    }
  });

  test('aligns a copy that mounts after the body has scrolled horizontally', () => {
    const { container, rerender } = render(<Fixture sticky={false} />);
    findScroller(container).scrollLeft = 75;
    rerender(<Fixture />);
    expect((findSlot(container)!.firstElementChild as HTMLElement).scrollLeft).toBe(75);
  });

  describe('scrolling a focused body row out from under the copy', () => {
    let restore: () => void;
    beforeEach(() => {
      // The row starts 30px above the copy's bottom edge.
      restore = mockRects(element =>
        element.tagName === 'THEAD' ? { bottom: 40 } : element.tagName === 'TR' ? { top: 10 } : undefined
      );
    });
    afterEach(() => restore());

    // The scroller's nearest overflow parent is what scrolls.
    function renderAndFocus(focus: (link: HTMLElement, scroller: HTMLElement) => void) {
      const { container, rerender } = render(<Fixture />);
      const scroller = findScroller(container);
      // Overflowing makes the scroller a focusable region. jsdom has no layout, so simulate the geometry.
      Object.defineProperty(scroller, 'scrollWidth', { configurable: true, value: 1200 });
      Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 400 });
      rerender(<Fixture columnLayout={{ type: 'grid', columns: [{ size: 600 }, { size: 600 }] }} />);
      const overflowParent = scroller.parentElement!;
      overflowParent.scrollTop = 100;
      focus(findRealTable(container).tBodies[0].querySelector('a')!, scroller);
      return { scrollTop: overflowParent.scrollTop, scroller };
    }

    test('scrolls when a control in the row is focused with the keyboard', () => {
      const { scrollTop } = renderAndFocus(link => {
        fireEvent.keyDown(window);
        fireEvent.focus(link);
      });
      expect(scrollTop).toBe(70);
    });

    test('does not scroll when the scroll region itself is focused', () => {
      const { scrollTop, scroller } = renderAndFocus((_link, scroller) => {
        fireEvent.keyDown(window);
        fireEvent.focus(scroller);
      });
      expect(scroller.tabIndex).toBe(0);
      expect(scrollTop).toBe(100);
    });

    test('does not scroll when a control in the row is focused by a click', () => {
      const { scrollTop } = renderAndFocus(link => {
        fireEvent.mouseDown(link);
        fireEvent.focus(link);
      });
      expect(scrollTop).toBe(100);
    });
  });

  test('copies the header cell widths after switching from grid to auto layout', () => {
    // A real observer reports newly observed cells straight away, before React runs passive effects.
    const OriginalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class {
      constructor(private callback: ResizeObserverCallback) {}
      observe(element: Element) {
        if (element.tagName === 'TH') {
          this.callback([], this as unknown as ResizeObserver);
        }
      }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    const restore = mockRects(element =>
      element.tagName === 'TH' && !findSlotFor(element)
        ? { width: element.textContent === 'Name' ? 120 : 80 }
        : undefined
    );
    try {
      const { container, rerender } = render(<Fixture columnLayout={GRID} />);
      rerender(<Fixture columnLayout={AUTO} />);
      const copyCells = headerCells(findSlot(container)!.querySelector('table')!);
      expect(copyCells.map(cell => cell.style.width)).toEqual(['120px', '80px']);
    } finally {
      restore();
      window.ResizeObserver = OriginalResizeObserver;
    }
  });

  test('pins at the given vertical offset', () => {
    const { container } = render(<Fixture offset={12} />);
    expect(findSlot(container)!.style.top).toBe('12px');
  });

  test('mirrors horizontal scroll of the body onto the copy', () => {
    jest.useFakeTimers();
    try {
      const { container } = render(<Fixture />);
      const scroller = findScroller(container);
      const copyScroller = findSlot(container)!.firstElementChild as HTMLElement;
      scroller.scrollLeft = 75;
      fireEvent.scroll(scroller);
      jest.runAllTimers();
      expect(copyScroller.scrollLeft).toBe(75);
    } finally {
      jest.useRealTimers();
    }
  });
});

function findSlotFor(element: HTMLElement) {
  return element.closest(`.${styles['sticky-slot']}`);
}
