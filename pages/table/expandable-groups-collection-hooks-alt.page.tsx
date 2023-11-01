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

const l1items = generateItems(20) as (Instance & { parentId: null | string })[];
const l2items = generateItems(100) as (Instance & { parentId: null | string })[];
const l3items = generateItems(400) as (Instance & { parentId: null | string })[];

for (const l3 of l3items) {
  l3.parentId = l2items[Math.floor(pseudoRandom() * l2items.length)].id;
}
for (const l2 of l2items) {
  l2.parentId = l1items[Math.floor(pseudoRandom() * l1items.length)].id;
}
for (const l1 of l1items) {
  l1.parentId = null;
}

const allItems = [...l1items, ...l2items, ...l3items];

export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [selectedItems, setSelectedItems] = useState<any>([]);

  const { items, collectionProps } = useCollection(allItems, {
    pagination: { pageSize: 999 },
    sorting: {},
    treeProps: {
      getId: item => item.id,
      getParentId: item => item.parentId,
      alternativeAPI: true,
    },
  });

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
