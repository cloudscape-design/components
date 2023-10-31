// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Table from '~components/table';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { columnsConfig } from './shared-configs';
import { generateItems } from './generate-data';
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

const tableItems = generateItems(25);
const itemLevels = tableItems.reduce(
  (levels, item) => levels.set(item.id, Math.ceil(pseudoRandom() * 3)),
  new Map<string, number>()
);

export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const { items, collectionProps } = useCollection(tableItems, { pagination: { pageSize: 25 }, sorting: {} });
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
          getItemLevel={item => itemLevels.get(item.id) ?? 1}
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
}
