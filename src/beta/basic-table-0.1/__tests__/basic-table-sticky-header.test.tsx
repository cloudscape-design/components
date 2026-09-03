// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import styles from '../../../../lib/components/beta/basic-table-0.1/basic-table/styles.css.js';
import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableProps,
  BasicTableRow,
} from '../../../../lib/components/beta/basic-table-0.1';

// Sticky-header overlay (unbounded / body-scroll mode). The root `stickyHeader` prop pins the
// column-header row — and, for a real element, a title band above it — as a page-sticky overlay
// while the body scrolls beneath it. The overlay is an aria-hidden, INERT duplicate of the
// consumer's Header children (Fork #1): it carries the header's visual layout but none of its
// interactive chrome (no grid columnheaders, no roving tab stop, no ResizeHandle), so the real
// in-flow header stays the single interactive one. Bounded mode (height/maxHeight) pins the in-flow
// header directly and renders NO overlay.
//
// jsdom has no layout, but the overlay is rendered from the synchronous render condition
// (`stickyHeader && !bounded && headerElement`), not from a layout effect, so its DOM structure and
// the inert invariants are all assertable here.

interface Item {
  id: string;
  name: string;
  status: string;
}

const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, index) => ({
    id: `row-${index}`,
    name: `Resource ${index}`,
    status: index % 2 === 0 ? 'Available' : 'Pending',
  }));

const COLUMNS: ReadonlyArray<BasicTableProps.ColumnDefinition> = [{ id: 'name', width: 200 }, { id: 'status' }];

interface RenderOptions {
  stickyHeader?: React.ReactNode;
  stickyHeaderVerticalOffset?: number;
  height?: number;
  resizableColumns?: boolean;
  count?: number;
}

function StickyHeaderHarness({ options }: { options: RenderOptions }) {
  const items = makeItems(options.count ?? 6);
  return (
    <BasicTable
      columns={COLUMNS}
      totalRowCount={items.length}
      stickyHeader={options.stickyHeader}
      stickyHeaderVerticalOffset={options.stickyHeaderVerticalOffset}
      height={options.height}
      resizableColumns={options.resizableColumns}
      i18nStrings={{ tableLabel: 'Resources' }}
    >
      <BasicTableHeader>
        <BasicTableHeaderCell columnId="name">Name</BasicTableHeaderCell>
        <BasicTableHeaderCell columnId="status">Status</BasicTableHeaderCell>
      </BasicTableHeader>
      <BasicTableBody>
        {items.map((item, index) => (
          <BasicTableRow key={item.id} index={index} id={item.id}>
            <BasicTableCell columnId="name">{item.name}</BasicTableCell>
            <BasicTableCell columnId="status">{item.status}</BasicTableCell>
          </BasicTableRow>
        ))}
      </BasicTableBody>
    </BasicTable>
  );
}

function renderTable(options: RenderOptions = {}) {
  const { container } = render(<StickyHeaderHarness options={options} />);
  const grid = container.querySelector('[role="grid"]') as HTMLElement;
  const overlay = container.querySelector(`.${styles['sticky-header-overlay']}`) as HTMLElement | null;
  const slot = container.querySelector(`.${styles['sticky-header-slot']}`) as HTMLElement | null;
  // The real, in-flow column-header rowgroup (the one inside the grid table — never the overlay copy,
  // which lives in an aria-hidden sibling outside the grid).
  const realHeader = grid?.querySelector('thead') as HTMLElement | null;
  // The synthetic bottom sticky-scrollbar (P4.5) is the only element in this tree that renders a
  // `data-stuck` attribute (Table's StickyScrollbar), so it uniquely identifies it.
  const scrollbar = container.querySelector('[data-stuck]') as HTMLElement | null;
  return { container, grid, overlay, slot, realHeader, scrollbar };
}

describe('BasicTable sticky header', () => {
  describe('render conditions', () => {
    test('renders neither the sticky slot nor the overlay when stickyHeader is not set', () => {
      const { slot, overlay } = renderTable();
      expect(slot).toBeNull();
      expect(overlay).toBeNull();
    });

    test('stickyHeader={true} renders an empty sticky slot (no title band) plus the column-header overlay', () => {
      const { slot, overlay } = renderTable({ stickyHeader: true });
      expect(slot).not.toBeNull();
      // React renders the boolean `true` as nothing → a sticky, title-less slot.
      expect(slot!.textContent).toBe('');
      expect(overlay).not.toBeNull();
    });

    test('stickyHeader={element} puts the title-band content in the slot and still renders the overlay', () => {
      const { slot, overlay } = renderTable({ stickyHeader: <div data-testid="title-band">Resources (6)</div> });
      expect(slot).not.toBeNull();
      expect(slot!.textContent).toContain('Resources (6)');
      expect(slot!.querySelector('[data-testid="title-band"]')).not.toBeNull();
      expect(overlay).not.toBeNull();
    });

    test('bounded mode (height set) pins the in-flow header and renders no duplicate overlay', () => {
      const { slot, overlay, realHeader } = renderTable({ stickyHeader: true, height: 300 });
      // The slot still renders (it pins inside the bounded scroll box)…
      expect(slot).not.toBeNull();
      // …but there is no aria-hidden duplicate: bounded mode pins the real in-flow header directly…
      expect(overlay).toBeNull();
      // …via the sticky-header class on the real column-header rowgroup (position:sticky against the
      // bounded scroll container).
      expect(realHeader!.classList.contains(styles['sticky-header'])).toBe(true);
    });

    test('unbounded mode does NOT put sticky-header on the in-flow header (the overlay pins instead)', () => {
      const { overlay, realHeader } = renderTable({ stickyHeader: true });
      // The out-of-flow overlay does the pinning in body-scroll mode…
      expect(overlay).not.toBeNull();
      // …so the real in-flow header must NOT also be sticky (it is tucked under the overlay).
      expect(realHeader!.classList.contains(styles['sticky-header'])).toBe(false);
    });

    test('no stickyHeader → the in-flow header is not sticky', () => {
      const { realHeader } = renderTable();
      expect(realHeader!.classList.contains(styles['sticky-header'])).toBe(false);
    });
  });

  describe('inert-overlay invariants (Fork #1)', () => {
    test('the overlay is aria-hidden', () => {
      const { overlay } = renderTable({ stickyHeader: true });
      expect(overlay!.getAttribute('aria-hidden')).toBe('true');
    });

    test('the duplicate is not part of the grid accessibility tree — the grid keeps exactly one set of columnheaders', () => {
      const { container, grid, overlay } = renderTable({ stickyHeader: true });
      // Only the real header cells are inside [role="grid"].
      expect(grid.querySelectorAll('[role="columnheader"]')).toHaveLength(2);
      // The duplicate columnheaders exist in the DOM but live inside the aria-hidden overlay, which
      // carries no role="grid" of its own (it is a plain presentational table).
      expect(overlay!.querySelectorAll('[role="columnheader"]')).toHaveLength(2);
      expect(overlay!.querySelector('[role="grid"]')).toBeNull();
      // Two real + two duplicate = four columnheaders total across the whole tree.
      expect(container.querySelectorAll('[role="columnheader"]')).toHaveLength(4);
    });

    test('the overlay adds no extra tab stop — the single roving tabindex=0 stays in the real header', async () => {
      const { grid, overlay } = renderTable({ stickyHeader: true, resizableColumns: true });
      // The roving tab stop is assigned asynchronously by the grid-navigation model after mount.
      await waitFor(() => expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1));
      // The inert overlay never carries the roving stop…
      expect(overlay!.querySelectorAll('[tabindex="0"]')).toHaveLength(0);
      // …and every duplicated columnheader is forced out of the roving order.
      overlay!.querySelectorAll('[role="columnheader"]').forEach(th => {
        expect(th.getAttribute('tabindex')).toBe('-1');
      });
    });

    test('the overlay renders no ResizeHandle — resize controls live only in the real header', () => {
      const { grid, overlay } = renderTable({ stickyHeader: true, resizableColumns: true });
      // The real header carries the resize toggle buttons + slider separators.
      expect(grid.querySelectorAll('button').length).toBeGreaterThan(0);
      // The inert duplicate carries neither.
      expect(overlay!.querySelectorAll('button')).toHaveLength(0);
      expect(overlay!.querySelectorAll('[role="slider"]')).toHaveLength(0);
    });

    test('the real in-flow header stays interactive while only the duplicate is aria-hidden', () => {
      const { grid, overlay } = renderTable({ stickyHeader: true, resizableColumns: true });
      // No real (grid) columnheader sits inside an aria-hidden subtree.
      grid.querySelectorAll('[role="columnheader"]').forEach(th => {
        expect(th.closest('[aria-hidden="true"]')).toBeNull();
      });
      // Every duplicated columnheader does.
      overlay!.querySelectorAll('[role="columnheader"]').forEach(th => {
        expect(th.closest('[aria-hidden="true"]')).not.toBeNull();
      });
    });

    test('a consumer-composed focusable control is neutralized (tabindex -1) in the overlay but not in the real header', async () => {
      // A composed sort control (a native <button>) in a header cell is duplicated into the
      // aria-hidden overlay. Left alone it would be a keyboard tab stop inside an aria-hidden
      // subtree (focusable-in-aria-hidden anti-pattern); the overlay must force it out of the tab
      // order while keeping it in the DOM (still mouse-clickable, so a composed sort control fires
      // when the header is stuck). The real header's copy stays keyboard-reachable.
      const { container } = render(
        <BasicTable columns={COLUMNS} totalRowCount={2} stickyHeader={true} i18nStrings={{ tableLabel: 'Resources' }}>
          <BasicTableHeader>
            <BasicTableHeaderCell columnId="name">
              <button type="button" data-testid="sort-btn">
                Name
              </button>
            </BasicTableHeaderCell>
            <BasicTableHeaderCell columnId="status">Status</BasicTableHeaderCell>
          </BasicTableHeader>
          <BasicTableBody>
            {makeItems(2).map((item, index) => (
              <BasicTableRow key={item.id} index={index} id={item.id}>
                <BasicTableCell columnId="name">{item.name}</BasicTableCell>
                <BasicTableCell columnId="status">{item.status}</BasicTableCell>
              </BasicTableRow>
            ))}
          </BasicTableBody>
        </BasicTable>
      );
      const grid = container.querySelector('[role="grid"]') as HTMLElement;
      const overlay = container.querySelector(`.${styles['sticky-header-overlay']}`) as HTMLElement;
      const buttons = container.querySelectorAll('[data-testid="sort-btn"]');
      // Two copies exist: one in the real header, one in the overlay duplicate.
      expect(buttons).toHaveLength(2);
      const overlayButton = overlay.querySelector('[data-testid="sort-btn"]') as HTMLElement;
      const realButton = grid.querySelector('[data-testid="sort-btn"]') as HTMLElement;
      // The overlay copy is forced out of the tab order (neutralized in a useLayoutEffect).
      await waitFor(() => expect(overlayButton.getAttribute('tabindex')).toBe('-1'));
      // The real header copy is not neutralized by the overlay logic (it stays keyboard-reachable;
      // its tabindex is managed by grid navigation, never forced to -1 by the overlay effect).
      expect(realButton.closest('[aria-hidden="true"]')).toBeNull();
    });
  });
});

describe('BasicTable sticky scrollbar (P4.5)', () => {
  // In unbounded (body-scroll) mode the real horizontal scrollbar lives at the table's natural
  // bottom, which scrolls off-screen on a tall table. A synthetic bottom-pinned scrollbar (Table's
  // StickyScrollbar, reused verbatim) is rendered so the table can still be scrolled horizontally
  // from the viewport bottom. Bounded mode already exposes a persistent bottom scrollbar on the
  // scroll container, so no synthetic one is rendered there. The render gate (`!bounded`) is
  // synchronous, so its presence/absence is assertable in jsdom even without layout.
  test('renders the synthetic sticky-scrollbar in unbounded (body-scroll) mode', () => {
    const { scrollbar } = renderTable();
    expect(scrollbar).not.toBeNull();
  });

  test('does not render the synthetic sticky-scrollbar in bounded mode (height set)', () => {
    const { scrollbar } = renderTable({ height: 300 });
    expect(scrollbar).toBeNull();
  });

  test('the synthetic sticky-scrollbar is independent of the sticky header (renders without stickyHeader)', () => {
    const { scrollbar, overlay } = renderTable();
    // No stickyHeader → no header overlay, but the h-scrollbar still renders (it is gated only on
    // unbounded mode, not on the sticky-header feature).
    expect(overlay).toBeNull();
    expect(scrollbar).not.toBeNull();
  });
});
