// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useMemo, useState } from 'react';
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
  level: number;
  children: Node[];
}

const itemsTree = generateItems(10).map(l1 => ({
  item: l1,
  level: 1,
  children: generateItems(Math.floor(pseudoRandom() * 10)).map(l2 => ({
    item: l2,
    level: 2,
    children: generateItems(Math.floor(pseudoRandom() * 3)).map(l3 => ({ item: l3, level: 3, children: [] })),
  })),
}));

const instanceToItem = itemsTree
  .flatMap(item => [item, ...item.children])
  .flatMap(item => [item, ...item.children])
  .reduce((map, item) => map.set(item.item, item), new Map<Instance, Node>());

export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [expanded, setExpanded] = useState(new Set<string>());

  const visibleItems = useMemo(() => {
    const visible: Instance[] = [];

    function traverse(node: Node) {
      visible.push(node.item);
      if (expanded.has(node.item.id)) {
        node.children.forEach(traverse);
      }
    }

    itemsTree.forEach(traverse);

    return visible;
  }, [expanded]);

  const getTreeItem = (item: Instance) => instanceToItem.get(item)!;

  const getItemLevel = (item: Instance) => getTreeItem(item).level;

  const getItemExpandable = (item: Instance) => getTreeItem(item).children.length > 0;

  const { items, collectionProps } = useCollection(visibleItems, { pagination: { pageSize: 999 }, sorting: {} });
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
          getItemLevel={getItemLevel}
          getItemExpandable={getItemExpandable}
          onExpandableItemToggle={({ detail: { item } }) =>
            setExpanded(prev => {
              const next = new Set([...prev]);
              if (next.has(item.id)) {
                next.delete(item.id);
              } else {
                next.add(item.id);
              }
              return next;
            })
          }
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
}
