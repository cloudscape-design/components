// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Table from '~components/table';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { columnsConfig } from './shared-configs';
import { Instance, generateItems } from './generate-data';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { Box, Checkbox, FormField, Select } from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import pseudoRandom from '../utils/pseudo-random';

type DemoContext = React.Context<
  AppContextType<{
    loading: boolean;
    resizableColumns: boolean;
    stickyHeader: boolean;
    sortingDisabled: boolean;
    selectionType: undefined | 'single' | 'multi';
  }>
>;

const selectionTypeOptions = [{ value: 'none' }, { value: 'single' }, { value: 'multi' }];

interface Node {
  item: Instance;
  children: Node[];
}

const itemsTree = generateItems(10).map(l1 => ({
  item: l1,
  children: generateItems(Math.floor(pseudoRandom() * 10)).map(l2 => ({
    item: l2,
    children: generateItems(Math.floor(pseudoRandom() * 3)).map(l3 => ({
      item: l3,
      children: [],
    })),
  })),
}));

const allItems: (Instance & { parentId: null | string })[] = [];

function traverse(node: Node, parentId: null | string = null) {
  allItems.push({ ...node.item, parentId });
  node.children.forEach(child => traverse(child, node.item.id));
}

itemsTree.forEach(item => traverse(item, null));

export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [selectedItems, setSelectedItems] = useState<any>([]);

  const { items, collectionProps } = useCollection(allItems, {
    pagination: { pageSize: 999 },
    sorting: {},
    treeProps: {
      getId: item => item.id,
      getParentId: item => item.parentId,
    },
  });

  if (collectionProps.getItemExpandable) {
    // console.log(collectionProps.getItemExpandable(items[0]));
  }

  return (
    <ScreenshotArea>
      <Box variant="h1">Table with expandable groups</Box>
      <SpaceBetween size="xl">
        <SpaceBetween direction="horizontal" size="m">
          <FormField label="Table flags">
            <Checkbox checked={urlParams.loading} onChange={event => setUrlParams({ loading: event.detail.checked })}>
              Loading
            </Checkbox>

            <Checkbox
              checked={urlParams.resizableColumns}
              onChange={event => setUrlParams({ resizableColumns: event.detail.checked })}
            >
              Resizable columns
            </Checkbox>

            <Checkbox
              checked={urlParams.stickyHeader}
              onChange={event => setUrlParams({ stickyHeader: event.detail.checked })}
            >
              Sticky header
            </Checkbox>

            <Checkbox
              checked={urlParams.sortingDisabled}
              onChange={event => setUrlParams({ sortingDisabled: event.detail.checked })}
            >
              Sorting disabled
            </Checkbox>
          </FormField>

          <FormField label="Selection type">
            <Select
              selectedOption={
                selectionTypeOptions.find(option => option.value === urlParams.selectionType) ?? selectionTypeOptions[0]
              }
              options={selectionTypeOptions}
              onChange={event =>
                setUrlParams({
                  selectionType:
                    event.detail.selectedOption.value === 'single' || event.detail.selectedOption.value === 'multi'
                      ? event.detail.selectedOption.value
                      : undefined,
                })
              }
            />
          </FormField>
        </SpaceBetween>

        <Table
          {...collectionProps}
          {...urlParams}
          columnDefinitions={columnsConfig}
          selectedItems={selectedItems}
          onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
          items={items}
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
}
