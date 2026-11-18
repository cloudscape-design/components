// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';

import scrollbarStyles from '../../../lib/components/internal/components/sticky-scrollbar/styles.css.js';
import styles from '../../../lib/components/table-root/styles.css.js';

function Fixture({ columnSize = 600 }: { columnSize?: number }) {
  return (
    <TableRoot
      ariaLabel="Resources"
      columnLayout={{ type: 'grid', columns: [{ size: columnSize }, { size: columnSize }] }}
    >
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableBodyCell>a</TableBodyCell>
          <TableBodyCell>ok</TableBodyCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
}

const findScroller = (container: HTMLElement) => container.querySelector<HTMLElement>(`.${styles['body-scroller']}`)!;
const findScrollbar = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(`.${scrollbarStyles['sticky-scrollbar']}`)!;

function mockWidths(element: HTMLElement, { client, scroll }: { client: number; scroll: number }) {
  element.getBoundingClientRect = () => ({ width: client }) as DOMRect;
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: client });
  Object.defineProperty(element, 'scrollWidth', { configurable: true, value: scroll });
}

describe('TableRoot sticky scrollbar', () => {
  test('sizes the scrollbar content from the scroller, which grid rows overflow', () => {
    const { container } = render(<Fixture />);
    const scroller = findScroller(container);
    mockWidths(scroller, { client: 500, scroll: 1200 });
    mockWidths(scroller.querySelector('table')!, { client: 500, scroll: 500 });
    fireEvent(window, new Event('resize'));

    const scrollbar = findScrollbar(container);
    expect(scrollbar).toHaveClass(scrollbarStyles['sticky-scrollbar-visible']);
    expect(scrollbar.style.inlineSize).toBe('500px');
    expect((scrollbar.firstElementChild as HTMLElement).style.inlineSize).toBe('1200px');
  });

  test('stays hidden when the content fits a fractional-width scroller', () => {
    const { container } = render(<Fixture />);
    const scroller = findScroller(container);
    mockWidths(scroller, { client: 501, scroll: 501 });
    scroller.getBoundingClientRect = () => ({ width: 500.75 }) as DOMRect;
    fireEvent(window, new Event('resize'));

    expect(findScrollbar(container)).not.toHaveClass(scrollbarStyles['sticky-scrollbar-visible']);
  });

  test('re-measures when the grid columns change without resizing the table or scroller', () => {
    const { container, rerender } = render(<Fixture columnSize={200} />);
    // The scrollbar reads its wrapper on the render after mount; settle that before changing columns.
    rerender(<Fixture columnSize={200} />);
    const scroller = findScroller(container);
    mockWidths(scroller, { client: 500, scroll: 500 });
    fireEvent(window, new Event('resize'));
    const scrollbar = findScrollbar(container);
    expect(scrollbar).not.toHaveClass(scrollbarStyles['sticky-scrollbar-visible']);

    mockWidths(scroller, { client: 500, scroll: 1200 });
    rerender(<Fixture columnSize={600} />);

    expect(scrollbar).toHaveClass(scrollbarStyles['sticky-scrollbar-visible']);
    expect((scrollbar.firstElementChild as HTMLElement).style.inlineSize).toBe('1200px');
  });

  test('scrolls the body with the scrollbar, and the scrollbar with the body', () => {
    jest.useFakeTimers();
    try {
      const { container } = render(<Fixture />);
      const scroller = findScroller(container);
      const scrollbar = findScrollbar(container);

      scrollbar.scrollLeft = 40;
      fireEvent.scroll(scrollbar);
      jest.runAllTimers();
      expect(scroller.scrollLeft).toBe(40);

      scroller.scrollLeft = 90;
      fireEvent.scroll(scroller);
      jest.runAllTimers();
      expect(scrollbar.scrollLeft).toBe(90);
    } finally {
      jest.useRealTimers();
    }
  });
});
