// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import Table from '../../../lib/components/table';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

function renderTable(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findTable()!;
}

describe('Sorting comparator validation', () => {
  test('does not print a warning with empty sorting state', () => {
    const wrapper = renderTable(
      <Table
        items={[]}
        columnDefinitions={[
          { header: 'id', cell: () => 'id' },
          { header: 'name', cell: () => 'name' },
        ]}
      />
    );
    expect(wrapper.findAscSortedColumn()).toBeNull();
    expect(warnOnce).not.toHaveBeenCalled();
  });

  test('does not print a warning when sortingField is used', () => {
    const wrapper = renderTable(
      <Table
        items={[]}
        columnDefinitions={[
          { header: 'id', cell: () => 'id', sortingField: 'id' },
          { header: 'name', cell: () => 'name', sortingField: 'name' },
        ]}
        sortingColumn={{ sortingField: 'name' }}
      />
    );
    expect(wrapper.findAscSortedColumn()!.getElement()).toHaveTextContent('name');
    expect(warnOnce).not.toHaveBeenCalled();
  });

  test('does not print a warning when sorting comparator matches', () => {
    const byId = () => 1;
    const byName = () => 1;
    const wrapper = renderTable(
      <Table
        items={[]}
        columnDefinitions={[
          { header: 'id', cell: () => 'id', sortingComparator: byId },
          { header: 'name', cell: () => 'name', sortingComparator: byName },
        ]}
        sortingColumn={{ sortingComparator: byName }}
      />
    );
    expect(wrapper.findAscSortedColumn()!.getElement()).toHaveTextContent('name');
    expect(warnOnce).not.toHaveBeenCalled();
  });

  test('prints a warning when sorting comparator does not match any columns', () => {
    const wrapper = renderTable(
      <Table
        items={[]}
        columnDefinitions={[
          { header: 'id', cell: () => 'id', sortingComparator: () => 1 },
          { header: 'name', cell: () => 'name', sortingComparator: () => 1 },
        ]}
        sortingColumn={{ sortingComparator: () => 1 }}
      />
    );
    expect(wrapper.findAscSortedColumn()).toBeNull();
    expect(warnOnce).toHaveBeenCalledWith(
      'Table',
      expect.stringMatching(/active sorting comparator was not found in any columns/)
    );
  });
});

describe('Sticky header validation', () => {
  test('prints a warning when stickyHeader changes', () => {
    const baseProps = {
      items: [],
      columnDefinitions: [
        { header: 'id', cell: () => 'id' },
        { header: 'name', cell: () => 'name' },
      ],
    };
    const { rerender } = render(<Table {...baseProps} stickyHeader={true} />);

    rerender(<Table {...baseProps} stickyHeader={false} />);
    expect(warnOnce).toHaveBeenCalledWith(
      'Table',
      '`stickyHeader` has changed from "true" to "false". It is not recommended to change the value of this property during the component lifecycle. Please set it to either "true" or "false" unconditionally.'
    );

    rerender(<Table {...baseProps} stickyHeader={true} />);
    expect(warnOnce).toHaveBeenCalledWith(
      'Table',
      '`stickyHeader` has changed from "false" to "true". It is not recommended to change the value of this property during the component lifecycle. Please set it to either "true" or "false" unconditionally.'
    );

    expect(warnOnce).toHaveBeenCalledTimes(2);
  });
});
