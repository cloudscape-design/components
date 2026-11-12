// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import IconProvider from '../../../lib/components/icon-provider';
import TableBody from '../../../lib/components/table-body';
import TableBodyCell from '../../../lib/components/table-body-cell';
import TableHead from '../../../lib/components/table-head';
import TableHeaderCell from '../../../lib/components/table-header-cell';
import TableRoot from '../../../lib/components/table-root';
import TableRow from '../../../lib/components/table-row';
import TableSortButton, { TableSortButtonProps } from '../../../lib/components/table-sort-button';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderInTable(props: TableSortButtonProps, headerCellProps: { ariaSort?: 'other' } = {}) {
  const { container, rerender } = render(
    <TableRoot ariaLabel="Resources">
      <TableHead>
        <TableRow>
          <TableHeaderCell {...headerCellProps}>
            <TableSortButton {...props} />
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableBodyCell>Resource 1</TableBodyCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  );
  const wrapper = createWrapper(container);
  return {
    container,
    rerender,
    button: wrapper.findTableSortButton()!,
    headerCell: wrapper.findTableHeaderCell()!.getElement(),
  };
}

describe('TableSortButton', () => {
  test('renders the label inside a native button', () => {
    const { button } = renderInTable({ children: 'Name' });
    expect(button.getElement().tagName).toBe('BUTTON');
    expect(button.getElement()).toHaveAttribute('type', 'button');
    expect(button.findLabel().getElement()).toHaveTextContent('Name');
  });

  test.each<TableSortButtonProps.SortingState>(['sortable', 'ascending', 'descending'])(
    'shows the indicator for a %s column',
    sortingState => {
      const { button } = renderInTable({ children: 'Name', sortingState });
      expect(button.getSortingState()).toBe(sortingState);
      expect(button.findSortingIcon()).not.toBeNull();
    }
  );

  test.each<[TableSortButtonProps.SortingState, 'ascending' | 'descending']>([
    ['sortable', 'ascending'],
    ['ascending', 'descending'],
    ['descending', 'ascending'],
  ])('requests the next sort state when a %s column is clicked', (sortingState, requested) => {
    const onSortingChange = jest.fn();
    const { button } = renderInTable({ children: 'Name', sortingState, onSortingChange });
    button.click();
    expect(onSortingChange).toHaveBeenCalledTimes(1);
    expect(onSortingChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { sortingState: requested } }));
  });

  test.each<[TableSortButtonProps.SortingState, string]>([
    ['sortable', 'none'],
    ['ascending', 'ascending'],
    ['descending', 'descending'],
  ])('sets aria-sort on the header cell for a %s column', (sortingState, ariaSort) => {
    const { headerCell } = renderInTable({ children: 'Name', sortingState });
    expect(headerCell).toHaveAttribute('aria-sort', ariaSort);
  });

  test('updates aria-sort on the header cell when the sort state changes', () => {
    const { headerCell, rerender } = renderInTable({ children: 'Name', sortingState: 'sortable' });
    rerender(
      <TableRoot ariaLabel="Resources">
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <TableSortButton sortingState="descending">Name</TableSortButton>
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody />
      </TableRoot>
    );
    expect(headerCell).toHaveAttribute('aria-sort', 'descending');
  });

  test('leaves an explicit ariaSort on the header cell in place', () => {
    const { headerCell } = renderInTable({ children: 'Name', sortingState: 'ascending' }, { ariaSort: 'other' });
    expect(headerCell).toHaveAttribute('aria-sort', 'other');
  });

  test('can be disabled', () => {
    const onSortingChange = jest.fn();
    const { button } = renderInTable({ children: 'Name', sortingState: 'ascending', disabled: true, onSortingChange });
    expect(button.isDisabled()).toBe(true);
    button.click();
    expect(onSortingChange).not.toHaveBeenCalled();
    expect(button.findSortingIcon()).not.toBeNull();
  });

  test('shows no indicator for a disabled column that is not sorted', () => {
    const { button } = renderInTable({ children: 'Name', disabled: true });
    expect(button.findSortingIcon()).toBeNull();
  });

  test('applies ariaLabel', () => {
    const { button } = renderInTable({ children: 'Name', ariaLabel: 'Name, sorted ascending' });
    expect(button.getElement()).toHaveAttribute('aria-label', 'Name, sorted ascending');
  });

  test.each<TableSortButtonProps.SortingState>(['sortable', 'ascending', 'descending'])(
    'passes the %s state to a custom sorting indicator from the icon provider',
    sortingState => {
      const { container } = render(
        <IconProvider
          componentIcons={{
            table: { sortingIndicator: state => <span data-testid="custom">{state.sortingState}</span> },
          }}
        >
          <TableSortButton sortingState={sortingState}>Name</TableSortButton>
        </IconProvider>
      );
      const button = createWrapper(container).findTableSortButton()!;
      expect(button.find('[data-testid="custom"]')!.getElement()).toHaveTextContent(sortingState);
    }
  );

  test('passes a11y validation', async () => {
    const { container } = renderInTable({ children: 'Name', sortingState: 'ascending' });
    await expect(container).toValidateA11y();
  });
});
