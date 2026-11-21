// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import createWrapper from '../../../lib/components/test-utils/dom';
import VirtualTable from '../../../lib/components/virtual-table';

// Behavioural coverage for the compound-over-core VirtualTable (cell F3-A2), exercised through
// the public compound namespace + the generated wrapper — i.e. driving the headless core
// (`useVirtualGrid`) THROUGH the skin seam without touching it. Axe / keyboard / SR coverage
// lives in impl-F3-A2-tests-a11y; this suite pins windowing, the windowed row-template
// invocation, header<->body reconciliation, the materialised disclosure column, controlled/
// uncontrolled expansion, sort activation, and the imperative ref.

// warnOnce is mocked so the reconciliation dev warning can be asserted (repo dev-warnings
// convention). Built-lib component code resolves the same module specifier, so the mock
// intercepts the compiled Row reconciliation path too.
jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

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

interface RenderOptions {
  items?: Item[];
  count?: number;
  expandable?: boolean;
  controlledExpanded?: string[];
  onExpandChange?: jest.Mock;
  sortable?: boolean;
  sortingColumn?: { columnId: string };
  sortingDescending?: boolean;
  onSortingChange?: jest.Mock;
  imperativeRef?: React.Ref<any>;
  omitStatusCell?: boolean;
  ghostCell?: boolean;
  templateSpy?: jest.Mock;
  loading?: boolean;
  empty?: React.ReactNode;
}

function renderTable(options: RenderOptions = {}) {
  const items = options.items ?? makeItems(options.count ?? 5);
  const utils = render(
    <VirtualTable.Root
      items={items}
      trackBy={item => item.id}
      estimatedRowHeight={23}
      loading={options.loading}
      empty={options.empty}
      expandedItems={options.controlledExpanded}
      onExpandChange={options.onExpandChange}
      sortingColumn={options.sortingColumn}
      sortingDescending={options.sortingDescending}
      onSortingChange={options.onSortingChange}
      imperativeRef={options.imperativeRef}
      ariaLabels={{
        tableLabel: 'Resources',
        expandButtonLabel: (item, expanded) => `${expanded ? 'Collapse' : 'Expand'} ${item.name}`,
        expandedRegionLabel: item => `Details for ${item.name}`,
        activateSortLabel: columnId => `Sort by ${columnId}`,
      }}
    >
      <VirtualTable.Header>
        <VirtualTable.HeaderCell columnId="name" sortingField={options.sortable ? 'name' : undefined}>
          Name
        </VirtualTable.HeaderCell>
        <VirtualTable.HeaderCell columnId="status" stretch={true}>
          Status
        </VirtualTable.HeaderCell>
      </VirtualTable.Header>
      <VirtualTable.Body>
        {(item: Item, api) => {
          options.templateSpy?.();
          return (
            <VirtualTable.Row item={item} api={api}>
              <VirtualTable.Cell columnId="name">{item.name}</VirtualTable.Cell>
              {!options.omitStatusCell && <VirtualTable.Cell columnId="status">{item.status}</VirtualTable.Cell>}
              {options.ghostCell && <VirtualTable.Cell columnId="ghost">ghost</VirtualTable.Cell>}
              {/* ExpandedContent is declared unconditionally (not gated on api.isExpanded) per
                  the BodyProps contract; the core mounts the region only for expanded rows. */}
              {options.expandable && (
                <VirtualTable.ExpandedContent estimatedHeight={300}>
                  <div>detail-{item.id}</div>
                </VirtualTable.ExpandedContent>
              )}
            </VirtualTable.Row>
          );
        }}
      </VirtualTable.Body>
    </VirtualTable.Root>
  );
  const wrapper = createWrapper(utils.container).findVirtualTable()!;
  return { wrapper, ...utils };
}

function grid(wrapper: ReturnType<typeof renderTable>['wrapper']) {
  return wrapper.find('[role="grid"]')!.getElement();
}

describe('VirtualTable (F3-A2 compound-over-core)', () => {
  test('renders and is discoverable through the wrapper with the declared column headers', () => {
    const { wrapper } = renderTable();
    expect(wrapper).not.toBeNull();
    expect(wrapper.findColumnHeaders()).toHaveLength(2);
  });

  test('windows a large dataset and returns null for rows outside the window', () => {
    const { wrapper } = renderTable({ count: 500 });
    expect(wrapper.findRows().length).toBeGreaterThan(0);
    expect(wrapper.findRows().length).toBeLessThan(500);
    expect(wrapper.findRowByIndex(0)).not.toBeNull();
    expect(wrapper.findRowByIndex(499)).toBeNull();
  });

  test('invokes the Body row template only for windowed rows, not the whole dataset', () => {
    const templateSpy = jest.fn();
    renderTable({ count: 500, templateSpy });
    // The template runs for the windowed slice (+ one probe), never once per dataset row —
    // this is how the compound-over-core API virtualizes without the consumer materializing
    // every Row.
    expect(templateSpy.mock.calls.length).toBeGreaterThan(0);
    expect(templateSpy.mock.calls.length).toBeLessThan(200);
  });

  test('exposes full-dataset aria-rowcount and aria-colcount (no disclosure column)', () => {
    const { wrapper } = renderTable({ count: 40 });
    // Header row is counted once: aria-rowcount = items.length + 1.
    expect(grid(wrapper).getAttribute('aria-rowcount')).toBe('41');
    // No expandable rows -> no disclosure column -> two data columns.
    expect(grid(wrapper).getAttribute('aria-colcount')).toBe('2');
    expect(wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('1');
    expect(wrapper.findExpandToggle(0)).toBeNull();
  });

  test('materialises a counted leading disclosure column when the template can expand', () => {
    const { wrapper } = renderTable({ count: 40, expandable: true });
    // Disclosure column is counted at aria-colindex 1, so data columns start at 2 in the header.
    expect(grid(wrapper).getAttribute('aria-colcount')).toBe('3');
    expect(wrapper.find('[role="columnheader"][aria-colindex="1"]')).not.toBeNull();
    expect(wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('2');
    expect(wrapper.findColumnHeaders()[1].getElement().getAttribute('aria-colindex')).toBe('3');
    expect(wrapper.findExpandToggle(0)).not.toBeNull();
  });

  test('reconciles a missing body Cell into an empty gridcell so the row stays a coherent rectangle', () => {
    const { wrapper } = renderTable({ count: 5, omitStatusCell: true });
    const cells = wrapper.findRowByIndex(0)!.findAll('[role="gridcell"]');
    // Both columns are still present as gridcells (name filled, status empty), never diverging
    // from the header column count.
    expect(cells).toHaveLength(2);
    expect(cells[0].getElement().textContent).toBe('Resource 0');
    expect(cells[1].getElement().textContent).toBe('');
    // A missing (not unknown) column is a valid gap, not a misconfiguration: no dev warning.
    expect(warnOnce).not.toHaveBeenCalledWith('VirtualTable', expect.stringContaining('no matching HeaderCell'));
  });

  test('dev-warns and drops a body Cell whose columnId has no matching HeaderCell', () => {
    const { wrapper } = renderTable({ count: 5, ghostCell: true });
    // The unknown-columnId Cell is not rendered: the row still has exactly the header's columns.
    expect(wrapper.findRowByIndex(0)!.findAll('[role="gridcell"]')).toHaveLength(2);
    expect(warnOnce).toHaveBeenCalledWith('VirtualTable', expect.stringContaining('ghost'));
  });

  test('mounts an expanded region only for expanded rows (lazy), with a label', () => {
    const { wrapper, container } = renderTable({ count: 40, expandable: true, controlledExpanded: ['row-2'] });
    const region = wrapper.findExpandedRegion(2);
    expect(region).not.toBeNull();
    expect(region!.getElement().getAttribute('aria-label')).toBe('Details for Resource 2');
    // Collapsed rows do not build their detail subtree.
    expect(wrapper.findExpandedRegion(0)).toBeNull();
    expect(container.textContent).toContain('detail-row-2');
    expect(container.textContent).not.toContain('detail-row-0');
  });

  test('uncontrolled disclosure toggle expands the row and fires onExpandChange', () => {
    const onExpandChange = jest.fn();
    const { wrapper } = renderTable({ count: 10, expandable: true, onExpandChange });
    expect(wrapper.findExpandedRegion(0)).toBeNull();

    fireEvent.click(wrapper.findExpandToggle(0)!.getElement());

    expect(wrapper.findExpandedRegion(0)).not.toBeNull();
    expect(onExpandChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ expanded: true }) })
    );
  });

  test('exposes the imperative ref surface', () => {
    const ref = React.createRef<any>();
    renderTable({ count: 50, imperativeRef: ref });
    expect(typeof ref.current.scrollToEnd).toBe('function');
    expect(typeof ref.current.scrollToItem).toBe('function');
    expect(typeof ref.current.isPinnedToEnd()).toBe('boolean');
  });

  describe('sort activation', () => {
    test('renders a keyboard-operable sort trigger only for sortable columns', () => {
      const { wrapper } = renderTable({ sortable: true });
      const [nameHeader, statusHeader] = wrapper.findColumnHeaders();
      // Sortable column: a native button trigger + aria-sort. Non-sortable: neither.
      expect(nameHeader.find('button')).not.toBeNull();
      expect(statusHeader.find('button')).toBeNull();
      expect(statusHeader.getElement().getAttribute('aria-sort')).toBeNull();
    });

    test('reflects the active sort column via aria-sort and emits toggled intent on activation', () => {
      const onSortingChange = jest.fn();
      const { wrapper } = renderTable({
        sortable: true,
        sortingColumn: { columnId: 'name' },
        sortingDescending: false,
        onSortingChange,
      });
      const nameHeader = wrapper.findColumnHeaders()[0];
      expect(nameHeader.getElement().getAttribute('aria-sort')).toBe('ascending');

      // Active + ascending -> activating toggles to descending (reflect-not-sort: the event
      // carries intent, the consumer reorders the data).
      fireEvent.click(nameHeader.find('button')!.getElement());
      expect(onSortingChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { columnId: 'name', sortingDescending: true } })
      );
    });

    test('a sortable but inactive column reports aria-sort none and starts ascending on activation', () => {
      const onSortingChange = jest.fn();
      const { wrapper } = renderTable({ sortable: true, onSortingChange });
      const nameHeader = wrapper.findColumnHeaders()[0];
      expect(nameHeader.getElement().getAttribute('aria-sort')).toBe('none');

      fireEvent.click(nameHeader.find('button')!.getElement());
      expect(onSortingChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { columnId: 'name', sortingDescending: false } })
      );
    });
  });

  test('expansion is keyed by trackBy and survives a consumer re-sort (reorder) without losing windowing', () => {
    const items = makeItems(60);
    // Expand row-30: it is at dataset index 30 before the reverse and index 29 after it, so it
    // stays inside the top window (~indices 0-36) in BOTH orderings. This lets us assert that
    // expansion is keyed by the trackBy id (its detail persists even though its dataset index
    // changed), without over-asserting an off-window row's DOM that windowing legitimately unmounts.
    const { wrapper, rerender, container } = renderTable({ items, expandable: true, controlledExpanded: ['row-30'] });
    expect(container.textContent).toContain('detail-row-30');
    const windowedBefore = wrapper.findRows().length;
    expect(windowedBefore).toBeLessThan(60);

    // Consumer re-sorts (reverses) the data; expansion state is keyed by trackBy id, so the
    // expanded row stays expanded despite its dataset index changing, and windowing still holds.
    rerender(
      <VirtualTable.Root
        items={[...items].reverse()}
        trackBy={item => item.id}
        estimatedRowHeight={23}
        expandedItems={['row-30']}
        ariaLabels={{
          tableLabel: 'Resources',
          expandButtonLabel: (item, expanded) => `${expanded ? 'Collapse' : 'Expand'} ${item.name}`,
          expandedRegionLabel: item => `Details for ${item.name}`,
        }}
      >
        <VirtualTable.Header>
          <VirtualTable.HeaderCell columnId="name">Name</VirtualTable.HeaderCell>
          <VirtualTable.HeaderCell columnId="status" stretch={true}>
            Status
          </VirtualTable.HeaderCell>
        </VirtualTable.Header>
        <VirtualTable.Body>
          {(item: Item, api) => (
            <VirtualTable.Row item={item} api={api}>
              <VirtualTable.Cell columnId="name">{item.name}</VirtualTable.Cell>
              <VirtualTable.Cell columnId="status">{item.status}</VirtualTable.Cell>
              <VirtualTable.ExpandedContent estimatedHeight={300}>
                <div>detail-{item.id}</div>
              </VirtualTable.ExpandedContent>
            </VirtualTable.Row>
          )}
        </VirtualTable.Body>
      </VirtualTable.Root>
    );
    expect(container.textContent).toContain('detail-row-30');
    expect(wrapper.findRows().length).toBeLessThan(60);
  });

  test('renders a polite live-append region as a sibling of the grid', () => {
    const { wrapper } = renderTable();
    const live = wrapper.findLiveRegion();
    expect(live).not.toBeNull();
    expect(live!.getElement().getAttribute('aria-live')).toBe('polite');
  });

  test('renders the empty state when there are no items', () => {
    const { wrapper } = renderTable({ items: [], empty: 'No resources' });
    expect(wrapper.findRows()).toHaveLength(0);
    expect(wrapper.getElement().textContent).toContain('No resources');
  });

  test('renders a status role while loading', () => {
    const { wrapper } = renderTable({ loading: true });
    expect(wrapper.find('[role="status"]')).not.toBeNull();
  });
});
