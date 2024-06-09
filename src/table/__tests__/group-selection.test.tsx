// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render } from '@testing-library/react';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/dom';

interface Item {
  id: string;
  children?: Item[];
}

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [{ header: 'id', cell: item => item.id }];

const items: Item[] = [
  {
    id: '1',
    children: [
      { id: '1.1' },
      { id: '1.2' },
      {
        id: '1.3',
        children: [{ id: '1.3.1' }, { id: '1.3.2' }],
      },
    ],
  },
  {
    id: '2',
    children: [{ id: '2.1' }, { id: '2.2' }],
  },
  { id: '3', children: [{ id: '3.1' }] },
];

function SelectableTable(tableProps: TableProps<Item>) {
  const [selectionInverted, setSelectionInverted] = useState(tableProps.selectionInverted ?? false);
  const [selectedItems, setSelectedItems] = useState(tableProps.selectedItems ?? []);
  return (
    <Table
      {...tableProps}
      selectionInverted={selectionInverted}
      selectedItems={selectedItems}
      onSelectionChange={event => {
        setSelectionInverted(!!event.detail.selectionInverted);
        setSelectedItems(event.detail.selectedItems);
        tableProps.onSelectionChange?.(event);
      }}
      renderLoaderPending={({ item }) => (item ? `${item.id}-loader` : 'root-loader')}
      renderLoaderLoading={({ item }) => (item ? `${item.id}-loader` : 'root-loader')}
      renderLoaderError={({ item }) => (item ? `${item.id}-loader` : 'root-loader')}
    />
  );
}

function renderTable(tableProps: Partial<TableProps>, selectedItems: string[], expandedItems?: string[]) {
  const props: TableProps = {
    items,
    columnDefinitions,
    selectionType: 'group',
    trackBy: 'id',
    selectionInverted: selectedItems.includes('ALL'),
    selectedItems: selectedItems.filter(id => id !== 'ALL').map(id => ({ id })),
    expandableRows: expandedItems
      ? {
          getItemChildren: item => item.children ?? [],
          isItemExpandable: item => !!item.children,
          expandedItems: expandedItems.map(id => ({ id })),
          onExpandableItemToggle: () => {},
        }
      : undefined,
    ...tableProps,
  };
  const { container, rerender } = render(<SelectableTable {...props} />);
  const wrapper = createWrapper(container).findTable()!;
  return {
    wrapper,
    rerender: (extraProps: Partial<TableProps>) => rerender(<SelectableTable {...props} {...extraProps} />),
  };
}

function getTableSelection(tableWrapper: TableWrapper) {
  const selectionState: Record<string, 'empty' | 'indeterminate' | 'checked'> = {};
  const getInputState = (input: HTMLInputElement): 'empty' | 'indeterminate' | 'checked' => {
    return input.indeterminate ? 'indeterminate' : input.checked ? 'checked' : 'empty';
  };

  const selectAllInput = tableWrapper.findSelectAllTrigger()!.find<HTMLInputElement>('input')!.getElement();
  selectionState.ALL = getInputState(selectAllInput);

  for (let i = 0; i < tableWrapper.findRows().length; i++) {
    const key = tableWrapper.findBodyCell(i + 1, 2)!.getElement().textContent!;
    const input = tableWrapper
      .findRowSelectionArea(i + 1)!
      .find<HTMLInputElement>('input')!
      .getElement();
    selectionState[key] = getInputState(input);
  }

  return selectionState;
}

function clickRow(tableWrapper: TableWrapper, index: number) {
  tableWrapper.findRowSelectionArea(index)?.find('input')!.click();
}
function shiftClickRow(tableWrapper: TableWrapper, index: number) {
  const input = tableWrapper.findRowSelectionArea(index)?.find('input');
  input?.fireEvent(new MouseEvent('mousedown', { shiftKey: true, bubbles: true }));
  input?.fireEvent(new MouseEvent('click', { shiftKey: true, bubbles: true }));
  input?.fireEvent(new MouseEvent('mouseup', { shiftKey: false, bubbles: true }));
}

test('selects all items one by one and makes select-all indeterminate and then checked', () => {
  const { wrapper } = renderTable({}, []);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'empty',
    '1': 'empty',
    '2': 'empty',
    '3': 'empty',
  });

  wrapper.findRowSelectionArea(1)!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'indeterminate',
    '1': 'checked',
    '2': 'empty',
    '3': 'empty',
  });

  wrapper.findRowSelectionArea(2)!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'indeterminate',
    '1': 'checked',
    '2': 'checked',
    '3': 'empty',
  });

  wrapper.findRowSelectionArea(3)!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'checked',
    '1': 'checked',
    '2': 'checked',
    '3': 'checked',
  });
});

test('selects all items using select-all when no items selected', () => {
  const { wrapper } = renderTable({}, []);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'empty',
    '1': 'empty',
    '2': 'empty',
    '3': 'empty',
  });

  wrapper.findSelectAllTrigger()!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'checked',
    '1': 'checked',
    '2': 'checked',
    '3': 'checked',
  });
});

test('selects all items using select-all when some items selected', () => {
  const { wrapper } = renderTable({}, ['2', '3']);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'indeterminate',
    '1': 'empty',
    '2': 'checked',
    '3': 'checked',
  });

  wrapper.findSelectAllTrigger()!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'checked',
    '1': 'checked',
    '2': 'checked',
    '3': 'checked',
  });
});

test('unselects all items using select-all when all items selected', () => {
  const { wrapper } = renderTable({}, ['ALL']);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'checked',
    '1': 'checked',
    '2': 'checked',
    '3': 'checked',
  });

  wrapper.findSelectAllTrigger()!.click();
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'empty',
    '1': 'empty',
    '2': 'empty',
    '3': 'empty',
  });
});

test.each([false, true])('shift selection on top level, selectionInverted=%s', selectionInverted => {
  const items = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }];
  const { wrapper } = renderTable({ items }, selectionInverted ? ['ALL'] : []);
  const empty = !selectionInverted ? 'empty' : 'checked';
  const checked = !selectionInverted ? 'checked' : 'empty';

  clickRow(wrapper, 3);
  shiftClickRow(wrapper, 5);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'indeterminate',
    '1': empty,
    '2': empty,
    '3': checked,
    '4': checked,
    '5': checked,
    '6': empty,
    '7': empty,
  });

  clickRow(wrapper, 5);
  shiftClickRow(wrapper, 7);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'indeterminate',
    '1': empty,
    '2': empty,
    '3': checked,
    '4': checked,
    '5': checked,
    '6': checked,
    '7': checked,
  });

  clickRow(wrapper, 1);
  shiftClickRow(wrapper, 4);
  expect(getTableSelection(wrapper)).toEqual({
    ALL: 'indeterminate',
    '1': empty,
    '2': empty,
    '3': empty,
    '4': empty,
    '5': checked,
    '6': checked,
    '7': checked,
  });
});

test.each(['pending', 'loading', 'error'] as const)(
  'progressive loader with status=%s selection state is derived from parent selection choice',
  status => {
    const { wrapper } = renderTable({ getLoadingStatus: () => status }, []);
    expect(getTableSelection(wrapper)).toEqual({
      ALL: 'empty',
      '1': 'empty',
      '2': 'empty',
      '3': 'empty',
      'root-loader': 'empty',
    });

    wrapper.findRowSelectionArea(1)!.click();
    expect(getTableSelection(wrapper)).toEqual({
      ALL: 'indeterminate',
      '1': 'checked',
      '2': 'empty',
      '3': 'empty',
      'root-loader': 'empty',
    });

    wrapper.findSelectAllTrigger()!.click();
    expect(getTableSelection(wrapper)).toEqual({
      ALL: 'checked',
      '1': 'checked',
      '2': 'checked',
      '3': 'checked',
      'root-loader': 'checked',
    });

    wrapper.findRowSelectionArea(1)!.click();
    expect(getTableSelection(wrapper)).toEqual({
      ALL: 'indeterminate',
      '1': 'empty',
      '2': 'checked',
      '3': 'checked',
      'root-loader': 'checked',
    });
  }
);

test.each([false, true])(
  'selection is lifted when progressive loading status="finished", selectionInverted=%s',
  selectionInverted => {
    const { wrapper } = renderTable({ getLoadingStatus: () => 'finished' }, selectionInverted ? ['ALL'] : []);
    const empty = !selectionInverted ? 'empty' : 'checked';
    const checked = !selectionInverted ? 'checked' : 'empty';

    expect(getTableSelection(wrapper)).toEqual({
      ALL: empty,
      '1': empty,
      '2': empty,
      '3': empty,
    });

    wrapper.findRowSelectionArea(1)!.click();
    wrapper.findRowSelectionArea(2)!.click();
    wrapper.findRowSelectionArea(3)!.click();
    expect(getTableSelection(wrapper)).toEqual({
      ALL: checked,
      '1': checked,
      '2': checked,
      '3': checked,
    });
  }
);

test.each([false, true])(
  'selection is not lifted when progressive loading status!="finished", selectionInverted=%s',
  selectionInverted => {
    const status = (['pending', 'loading', 'error'] as const)[Math.floor(Math.random() * 3)];
    const { wrapper } = renderTable({ getLoadingStatus: () => status }, selectionInverted ? ['ALL'] : []);
    const empty = !selectionInverted ? 'empty' : 'checked';
    const checked = !selectionInverted ? 'checked' : 'empty';

    expect(getTableSelection(wrapper)).toEqual({
      ALL: empty,
      '1': empty,
      '2': empty,
      '3': empty,
      'root-loader': empty,
    });

    wrapper.findRowSelectionArea(1)!.click();
    wrapper.findRowSelectionArea(2)!.click();
    wrapper.findRowSelectionArea(3)!.click();
    expect(getTableSelection(wrapper)).toEqual({
      ALL: 'indeterminate',
      '1': checked,
      '2': checked,
      '3': checked,
      'root-loader': empty,
    });
  }
);

// TODO: test with expandable rows
