// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../../lib/components/test-utils/dom';
import BasicTable, {
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableBody,
  BasicTableRow,
  BasicTableCell,
  BasicTableProps,
} from '../../../../lib/components/beta/basic-table-0.1';

// Tests for the BasicTable compound components (Root/Header/HeaderCell/Body/Row/Cell) over the
// headless useBasicTable hook, accessed through the generated test-utils wrapper. Columns are a
// positional width list on Root; the header is declared with Header/HeaderCell children (Root does
// not auto-render it) and the body is mapped Row/Cell children. Sorting is not part of the core; it
// is composed by the consumer and is covered by the demo-scoped sorting test.

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

// Positional layout: Name fixed 200, Status flexible (no width).
const COLUMNS: ReadonlyArray<BasicTableProps.ColumnDefinition> = [{ width: 200 }, {}];

interface RenderOptions {
  count?: number;
  items?: Item[];
  contentDensity?: 'comfortable' | 'compact';
  loading?: boolean;
  loadingText?: string;
  empty?: React.ReactNode;
}

// Stateful harness for the compound BasicTable over the headless hook.
function BasicTableHarness({ options }: { options: RenderOptions }) {
  const items = options.items ?? makeItems(options.count ?? 5);
  return (
    <BasicTable
      columns={COLUMNS}
      totalRowCount={items.length}
      contentDensity={options.contentDensity}
      loading={options.loading}
      loadingText={options.loadingText}
      empty={options.empty}
      i18nStrings={{ tableLabel: 'Resources' }}
    >
      <BasicTableHeader>
        <BasicTableHeaderCell>Name</BasicTableHeaderCell>
        <BasicTableHeaderCell>Status</BasicTableHeaderCell>
      </BasicTableHeader>
      <BasicTableBody>
        {items.map((item, index) => (
          <BasicTableRow key={item.id} index={index} id={item.id}>
            <BasicTableCell>{item.name}</BasicTableCell>
            <BasicTableCell>{item.status}</BasicTableCell>
          </BasicTableRow>
        ))}
      </BasicTableBody>
    </BasicTable>
  );
}

function renderTable(options: RenderOptions = {}) {
  const utils = render(<BasicTableHarness options={options} />);
  const wrapper = createWrapper(utils.container).findBasicTable()!;
  return { wrapper, ...utils };
}

function grid(wrapper: ReturnType<typeof renderTable>['wrapper']) {
  return wrapper.find('[role="grid"]')!.getElement();
}

describe('BasicTable (compound components over headless hook)', () => {
  test('renders the declarative header cells and they are discoverable through the wrapper', () => {
    const { wrapper } = renderTable();
    expect(wrapper).not.toBeNull();
    // The consumer declares the header; Root does NOT auto-render it from config.
    expect(wrapper.findColumnHeaders()).toHaveLength(2);
    expect(wrapper.findColumnHeaders()[0].getElement().textContent).toContain('Name');
    expect(wrapper.findColumnHeaders()[1].getElement().textContent).toContain('Status');
  });

  test('exposes full-dataset aria-rowcount + aria-colcount and 1-based header colindex', () => {
    const { wrapper } = renderTable({ count: 40 });
    // Root.totalRowCount is authoritative: aria-rowcount = totalRowCount + 1 (header).
    expect(grid(wrapper).getAttribute('aria-rowcount')).toBe('41');
    expect(grid(wrapper).getAttribute('aria-colcount')).toBe('2');
    expect(wrapper.findColumnHeaders()[0].getElement().getAttribute('aria-colindex')).toBe('1');
    expect(wrapper.findColumnHeaders()[1].getElement().getAttribute('aria-colindex')).toBe('2');
  });

  test('renders the mapped Row/Cell children with full-dataset aria-rowindex', () => {
    const { wrapper } = renderTable({ count: 5 });
    expect(wrapper.findRows()).toHaveLength(5);

    const row0 = wrapper.findRowByIndex(0)!;
    expect(row0.getElement().getAttribute('aria-rowindex')).toBe('2'); // header is 1
    const cells = row0.findAll('[role="gridcell"]');
    expect(cells).toHaveLength(2);
    expect(cells[0].getElement().textContent).toBe('Resource 0');
    expect(cells[0].getElement().getAttribute('aria-colindex')).toBe('1');
    expect(cells[1].getElement().textContent).toBe('Available');
    expect(cells[1].getElement().getAttribute('aria-colindex')).toBe('2');

    expect(wrapper.findRowByIndex(4)!.getElement().getAttribute('aria-rowindex')).toBe('6');
  });

  describe('empty / loading', () => {
    test('renders the empty state (and no data rows) when totalRowCount is 0', () => {
      const { wrapper } = renderTable({ items: [], empty: 'No resources' });
      expect(wrapper.findRows()).toHaveLength(0);
      expect(wrapper.getElement().textContent).toContain('No resources');
    });

    test('renders a loading status indicator carrying the announced loading text', () => {
      const { wrapper } = renderTable({ loading: true, loadingText: 'Loading resources' });
      expect(wrapper.findLoadingText()!.getElement()).toHaveTextContent('Loading resources');
    });
  });

  describe('presentation', () => {
    test('contentDensity="compact" applies the shared compact-table visual context', () => {
      const { wrapper } = renderTable({ contentDensity: 'compact' });
      expect(grid(wrapper).className).toMatch(/compact-table/);
    });

    test('contentDensity defaults to comfortable (no compact-table context)', () => {
      const { wrapper } = renderTable();
      expect(grid(wrapper).className).not.toMatch(/compact-table/);
    });
  });
});
