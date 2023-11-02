// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Table from '~components/table';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { columnsConfig } from './shared-configs';
import { generateItems } from './generate-data';
import { Box, Button, Checkbox, FormField, Select } from '~components';
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

const itemsTree = generateItems(30).map(l1 => ({
  ...l1,
  level: 1,
  children: generateItems(Math.floor(pseudoRandom() * 10)).map(l2 => ({
    ...l2,
    level: 2,
    children: generateItems(Math.floor(pseudoRandom() * 4)).map(l3 => ({ ...l3, level: 3, children: [] })),
  })),
}));

const visibleItems = itemsTree;
// const visibleItems = itemsTree.flatMap(item => [item, ...item.children]).flatMap(item => [item, ...item.children]);

console.log('visible items', visibleItems.length);
console.log('expandable items', visibleItems.filter(i => i.children.length > 0).length);

export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [isActive, setIsActive] = useState(false);
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

        {isActive ? (
          <Table
            {...urlParams}
            columnDefinitions={columnsConfig}
            selectedItems={selectedItems}
            onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
            items={visibleItems}
            // getItemLevel={item => item.level}
            getItemExpandable={item => item.children.length > 0}
            getItemChildren={item => item.children}
            getItemExpanded={() => true}
          />
        ) : (
          <Button
            onClick={() => {
              setIsActive(true);
              console.time('render');
              requestAnimationFrame(() => console.timeEnd('render'));
            }}
          >
            Render Table
          </Button>
        )}
      </SpaceBetween>
    </ScreenshotArea>
  );
}
