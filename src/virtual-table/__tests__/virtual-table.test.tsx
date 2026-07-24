// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import VirtualTable, { VirtualTableProps } from '../../../lib/components/virtual-table';

import styles from '../../../lib/components/virtual-table/styles.css.js';

interface Item {
  id: string;
  name: string;
}

const makeItems = (n: number): Item[] => Array.from({ length: n }, (_, i) => ({ id: String(i), name: `row ${i}` }));

const columnDefinitions: VirtualTableProps<Item>['columnDefinitions'] = [
  { id: 'name', header: 'Name', cell: item => item.name },
  { id: 'index', header: 'Index', cell: (item, context) => String(context.rowIndex) },
];

function renderTable(props: Partial<VirtualTableProps<Item>> & { items: Item[] }) {
  const { container } = render(
    <VirtualTable trackBy={item => item.id} columnDefinitions={columnDefinitions} {...props} />
  );
  const wrapper = createWrapper(container).findVirtualTable()!;
  return { container, wrapper };
}

describe('VirtualTable', () => {
  test('renders the root element and is discoverable via the test-utils wrapper', () => {
    const { container, wrapper } = renderTable({ items: makeItems(2) });
    expect(container.firstChild).toHaveClass(styles.root);
    expect(wrapper).not.toBeNull();
    expect(wrapper.findColumnHeaders()).toHaveLength(columnDefinitions.length);
  });

  test('windows a large dataset: renders only a subset and returns null for rows outside the window', () => {
    const { wrapper } = renderTable({ items: makeItems(500), estimatedRowHeight: 20, overscan: 10 });
    const rendered = wrapper.findRows().length;
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(500);
    expect(wrapper.findRowByIndex(0)).not.toBeNull();
    expect(wrapper.findRowByIndex(499)).toBeNull();
  });

  test('exposes full-dataset grid semantics (aria-rowcount counts the header once, aria-colcount the data columns)', () => {
    const { container } = renderTable({ items: makeItems(500) });
    const grid = container.querySelector('[role="grid"]')!;
    expect(grid.getAttribute('aria-rowcount')).toBe('501');
    expect(grid.getAttribute('aria-colcount')).toBe(String(columnDefinitions.length));
  });

  test('adds the materialised disclosure column only when getExpandedContent is supplied', () => {
    const withoutExpansion = renderTable({ items: makeItems(10) });
    expect(withoutExpansion.wrapper.findExpandToggle(0)).toBeNull();

    const withExpansion = renderTable({
      items: makeItems(10),
      getExpandedContent: item => <div>detail {item.id}</div>,
    });
    const grid = withExpansion.container.querySelector('[role="grid"]')!;
    expect(grid.getAttribute('aria-colcount')).toBe(String(columnDefinitions.length + 1));
    expect(withExpansion.wrapper.findExpandToggle(0)).not.toBeNull();
  });

  test('toggling the disclosure control (uncontrolled) reveals the expanded region and fires onExpandChange', () => {
    const onExpandChange = jest.fn();
    const { wrapper } = renderTable({
      items: makeItems(10),
      getExpandedContent: item => <div className="detail">detail {item.id}</div>,
      onExpandChange,
    });
    expect(wrapper.findExpandedRegion(0)).toBeNull();
    fireEvent.click(wrapper.findExpandToggle(0)!.getElement());
    expect(onExpandChange).toHaveBeenCalled();
    expect(wrapper.findExpandedRegion(0)).not.toBeNull();
  });

  test('controlled expandedItems renders the labeled expanded region for the given row', () => {
    const { wrapper } = renderTable({
      items: makeItems(500),
      expandedItems: ['2'],
      getExpandedContent: item => <div>detail {item.id}</div>,
      ariaLabels: { expandedRegionLabel: item => `Details for ${item.id}` },
    });
    const region = wrapper.findExpandedRegion(2);
    expect(region).not.toBeNull();
    expect(region!.getElement().getAttribute('role')).toBe('region');
    expect(region!.getElement().getAttribute('aria-label')).toBe('Details for 2');
  });

  test('exposes the imperative handle (scrollToEnd / scrollToItem / isPinnedToEnd)', () => {
    const ref = React.createRef<VirtualTableProps.Ref>();
    render(
      <VirtualTable
        items={makeItems(100)}
        trackBy={item => item.id}
        columnDefinitions={columnDefinitions}
        imperativeRef={ref}
      />
    );
    expect(typeof ref.current!.scrollToEnd).toBe('function');
    expect(typeof ref.current!.scrollToItem).toBe('function');
    expect(typeof ref.current!.isPinnedToEnd()).toBe('boolean');
  });

  test('renders a polite live-append region', () => {
    const { wrapper } = renderTable({ items: makeItems(2) });
    const live = wrapper.findLiveRegion();
    expect(live).not.toBeNull();
    expect(live!.getElement().getAttribute('aria-live')).toBe('polite');
  });

  test('renders the empty slot when there are no items', () => {
    const { wrapper, container } = renderTable({ items: [], empty: <span>No logs</span> });
    expect(wrapper.findRows()).toHaveLength(0);
    expect(container.textContent).toContain('No logs');
  });

  test('renders a status region while loading', () => {
    const { container } = renderTable({ items: [], loading: true, loadingText: 'Loading logs' });
    const status = container.querySelector('[role="status"]');
    expect(status).not.toBeNull();
    expect(status!.textContent).toContain('Loading logs');
  });
});
