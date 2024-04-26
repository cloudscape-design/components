// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TableProps } from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { Box, Input, Link } from '~components';
import { columnLabel } from './shared-configs';
import { range } from 'lodash';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { ariaLabels } from './expandable-rows/common';

// TODO: replace with Table once progressive loading API becomes public
import InternalTable from '~components/table/internal';

interface Instance {
  name: string;
  description: string;
  children?: Instance[];
}

const itemsDeep: Instance[] = [{ name: 'Root', description: 'Root item' }];
let current = itemsDeep[0];
for (let i = 1; i <= 10; i++) {
  const next = { name: `Nested-${i}`, description: `Nested item #${i}` };
  current.children = [next];
  current = next;
}

const itemsMixed: Instance[] = [
  {
    name: 'Root-1',
    description: 'Root item #1',
    children: [
      {
        name: 'Nested-1.1',
        description: 'Nested item #1.1',
        children: [],
      },
      {
        name: 'Nested-1.2',
        description: 'Nested item #1.2',
      },
      {
        name: 'Nested-1.3',
        description: 'Nested item #1.2',
        children: [
          { name: 'Nested-1.3.1', description: 'Nested item #1.3.1' },
          { name: 'Nested-1.3.2', description: 'Nested item #1.3.2' },
        ],
      },
    ],
  },
  {
    name: 'Root-2',
    description: 'Root item #2',
    children: [
      {
        name: 'Nested-2.1',
        description: 'Nested item #2.1',
        children: [],
      },
      {
        name: 'Nested-2.2',
        description: 'Nested item #2.2',
        children: [],
      },
    ],
  },
];

interface Permutation {
  title: string;
  items: Instance[];
  resizableColumns?: boolean;
  editableCells?: boolean;
  stickyColumns?: boolean;
  stripedRows?: boolean;
  wrapLines?: boolean;
  selectionType?: 'single' | 'multi';
  progressiveLoading?: boolean;
}

const permutations = createPermutations<Permutation>([
  {
    title: ['Deep nesting'],
    items: [itemsDeep],
    resizableColumns: [false],
    editableCells: [false],
    stickyColumns: [false],
    stripedRows: [false],
    wrapLines: [false],
    selectionType: [undefined],
  },
  {
    title: ['Sticky columns & single selection'],
    items: [itemsMixed],
    resizableColumns: [false],
    editableCells: [false],
    stickyColumns: [true],
    stripedRows: [false],
    wrapLines: [false],
    selectionType: ['single'],
  },
  {
    title: ['Wrap lines & multi selection'],
    items: [itemsMixed],
    resizableColumns: [false],
    editableCells: [false],
    stickyColumns: [false],
    stripedRows: [false],
    wrapLines: [true],
    selectionType: ['multi'],
  },
  {
    title: ['Resizable columns & striped rows'],
    items: [itemsMixed],
    resizableColumns: [true],
    editableCells: [false],
    stickyColumns: [false],
    stripedRows: [true],
    wrapLines: [false],
    selectionType: [undefined],
  },
  {
    title: ['Editable cells'],
    items: [itemsMixed],
    resizableColumns: [false],
    editableCells: [true],
    stickyColumns: [false],
    stripedRows: [false],
    wrapLines: [false],
    selectionType: [undefined],
  },
  {
    title: ['Editable cells & resizable columns & single selection'],
    items: [itemsMixed],
    resizableColumns: [true],
    editableCells: [true],
    stickyColumns: [false],
    stripedRows: [false],
    wrapLines: [false],
    selectionType: ['single'],
  },
  {
    title: ['Progressive loading with sticky columns and selection'],
    items: [itemsMixed],
    resizableColumns: [false],
    editableCells: [false],
    stickyColumns: [true],
    stripedRows: [false],
    wrapLines: [false],
    selectionType: [undefined, 'single'],
    progressiveLoading: [true],
  },
  {
    title: ['Progressive loading with striped rows and selection'],
    items: [itemsMixed],
    resizableColumns: [true],
    editableCells: [false],
    stickyColumns: [false],
    stripedRows: [true],
    wrapLines: [false],
    selectionType: [undefined, 'multi'],
    progressiveLoading: [true],
  },
]);

export default () => {
  return (
    <Box>
      <Box variant="h1" margin="m">
        Expandable rows permutations
      </Box>

      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <InternalTable
              items={permutation.items}
              header={
                <Box fontWeight="bold" color="text-status-info">
                  {permutation.title}
                </Box>
              }
              resizableColumns={permutation.resizableColumns}
              stickyColumns={permutation.stickyColumns ? { first: 1 } : undefined}
              stripedRows={permutation.stripedRows}
              wrapLines={permutation.wrapLines}
              selectionType={permutation.selectionType}
              columnDefinitions={[
                {
                  id: 'name',
                  header: 'Item name',
                  cell: item =>
                    permutation.editableCells ? item.name : <Link href={`#${item.name}`}>{item.name}</Link>,
                  ariaLabel: columnLabel('Item Name'),
                  sortingField: 'name',
                  minWidth: 200,
                  editConfig: permutation.editableCells
                    ? {
                        ariaLabel: 'Edit name',
                        editIconAriaLabel: 'editable',
                        errorIconAriaLabel: 'Edit cell error',
                        editingCell: (item, { currentValue, setValue }) => (
                          <Input
                            autoFocus={true}
                            value={currentValue ?? item.name}
                            onChange={event => setValue(event.detail.value)}
                          />
                        ),
                        disabledReason: item => (item.name?.includes('Root') ? 'Cannot edit root item name' : ''),
                      }
                    : undefined,
                },
                ...range(1, 10).map(index => ({
                  id: `description-${index}`,
                  header: `Item description ${index}`,
                  cell: (item: Instance) => item.description,
                  ariaLabel: columnLabel(`Item description ${index}`),
                  sortingField: 'description',
                  editConfig: permutation.editableCells
                    ? {
                        ariaLabel: 'Edit description',
                        editIconAriaLabel: 'editable',
                        errorIconAriaLabel: 'Edit cell error',
                        editingCell: (item: Instance, { currentValue, setValue }: TableProps.CellContext<string>) => (
                          <Input
                            autoFocus={true}
                            value={currentValue ?? item.description}
                            onChange={event => setValue(event.detail.value)}
                          />
                        ),
                      }
                    : undefined,
                })),
              ]}
              expandableRows={{
                getItemChildren: item => item.children ?? [],
                isItemExpandable: item => !!item.children,
                expandedItems: flatten(permutation.items).filter(item => item.children && item.children.length > 0),
                onExpandableItemToggle: () => {},
              }}
              getLoadingStatus={
                permutation.progressiveLoading
                  ? item => {
                      if (!item) {
                        return 'pending';
                      }
                      if (item.name === 'Root-1') {
                        return 'error';
                      }
                      if (item.name === 'Nested-1.3') {
                        return 'loading';
                      }
                      return 'finished';
                    }
                  : undefined
              }
              renderLoaderPending={({ item }) => `load more for ${item?.name ?? 'root'}`}
              renderLoaderLoading={({ item }) => `loading items for ${item?.name ?? 'root'}`}
              renderLoaderError={({ item }) => `error for ${item?.name ?? 'root'}`}
              submitEdit={permutation.editableCells ? () => {} : undefined}
              ariaLabels={{ ...ariaLabels, tableLabel: permutation.title }}
            />
          )}
        />
      </ScreenshotArea>
    </Box>
  );
};

function flatten(items: Instance[]): Instance[] {
  const allItems: Instance[] = [];
  function traverse(item: Instance) {
    allItems.push(item);
    (item.children ?? []).forEach(traverse);
  }
  items.forEach(traverse);
  return allItems;
}
