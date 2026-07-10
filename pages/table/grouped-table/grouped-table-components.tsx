// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

import { UseCollectionResult } from '@cloudscape-design/collection-hooks';

import {
  Box,
  Button,
  Checkbox,
  FormField,
  Modal,
  Popover,
  PopoverProps,
  Select,
  SelectProps,
  SpaceBetween,
  Token,
} from '~components';

import { groupOptions, sortOptions } from './grouped-table-config';
import { GroupDefinition, isGroupRow, TransactionRow } from './grouped-table-data';
import { createWysiwygQuery } from './grouped-table-query';

import styles from './styles.scss';

export function FilterLayout({ filter, dataGrouping }: { filter: React.ReactNode; dataGrouping: React.ReactNode }) {
  return (
    <div className={styles['filter-layout']}>
      <div className={styles['filter-layout-filter']}>{filter}</div>
      <div>{dataGrouping}</div>
    </div>
  );
}

export function DataGrouping({
  groups,
  onChange,
}: {
  groups: GroupDefinition[];
  onChange: (groups: GroupDefinition[]) => void;
}) {
  const popoverRef = useRef<PopoverProps.Ref>(null);
  const propertyToGroup = new Map(groups.map(g => [g.property, g]));
  return (
    <div className={styles['grouping-wrapper']}>
      <Box fontWeight="bold">group by</Box>
      <ul aria-label="selected data groups">
        {groups.map(({ property, sorting }, groupIndex) => {
          const groupLabel = `${groupOptions.find(o => o.value === property)!.label} (${sorting})`;
          return (
            <li key={property}>
              <Token
                ariaLabel={groupLabel}
                label={
                  <Popover
                    ref={popoverRef}
                    header="Edit group"
                    content={
                      <GroupEditor
                        group={{ property, sorting }}
                        groupOptions={groupOptions.filter(o => o.value === property || !propertyToGroup.get(o.value))}
                        onDismiss={() => popoverRef.current?.dismiss()}
                        onSubmit={updated => {
                          onChange(groups.map((g, index) => (index === groupIndex ? updated : g)));
                          popoverRef.current?.dismiss();
                        }}
                      />
                    }
                  >
                    {groupLabel}
                  </Popover>
                }
                onDismiss={() => onChange(groups.filter((_, index) => index !== groupIndex))}
                dismissLabel={`Remove group ${groupLabel}`}
              />
            </li>
          );
        })}
      </ul>
      {groups.length < 5 && (
        <Popover
          ref={popoverRef}
          triggerType="custom"
          header="Add group"
          content={
            <GroupEditor
              group={{ property: undefined, sorting: undefined }}
              groupOptions={groupOptions.filter(o => !propertyToGroup.get(o.value))}
              onDismiss={() => popoverRef.current?.dismiss()}
              onSubmit={group => {
                onChange([...groups, group]);
                popoverRef.current?.dismiss();
              }}
            />
          }
        >
          <Button variant="inline-link">add group</Button>
        </Popover>
      )}
    </div>
  );
}

function GroupEditor({
  group,
  groupOptions,
  onDismiss,
  onSubmit,
}: {
  group: Partial<GroupDefinition>;
  groupOptions: SelectProps.Option[];
  onDismiss: () => void;
  onSubmit: (group: GroupDefinition) => void;
}) {
  const [selectedProperty, setSelectedProperty] = useState<null | string>(group.property ?? null);
  const [selectedSorting, setSelectedSorting] = useState<null | 'asc' | 'desc'>(group.sorting ?? null);
  return (
    <SpaceBetween size="m">
      <FormField label="Property">
        <Select
          options={groupOptions}
          selectedOption={groupOptions.find(o => o.value === selectedProperty) ?? null}
          onChange={({ detail }) => setSelectedProperty(detail.selectedOption.value!)}
        />
      </FormField>
      <FormField label="Sort by">
        <Select
          options={sortOptions}
          selectedOption={sortOptions.find(o => o.value === selectedSorting) ?? null}
          onChange={({ detail }) => setSelectedSorting(detail.selectedOption.value as 'asc' | 'desc')}
        />
      </FormField>
      <SpaceBetween size="m" direction="horizontal">
        <Button variant="link" onClick={onDismiss}>
          Cancel
        </Button>
        <Button
          disabled={!selectedProperty || !selectedSorting}
          onClick={() => onSubmit({ property: selectedProperty!, sorting: selectedSorting! })}
        >
          Apply
        </Button>
      </SpaceBetween>
    </SpaceBetween>
  );
}

export function BulkActionModal({
  collection,
  onDismiss,
  onSubmit,
}: {
  collection: UseCollectionResult<TransactionRow>;
  onDismiss: () => void;
  onSubmit: () => void;
}) {
  const [includeNew, setIncludeNew] = useState(true);
  const selectedItemsCount = collection.collectionProps.selectedItems?.length ?? 0;
  const query = createWysiwygQuery(collection.items, {
    getId: item => item.key,
    getGroup: item => [item.groupKey, item.group],
    getChildren: item => (isGroupRow(item) ? item.children : []),
    selection: collection.collectionProps.expandableRows!.groupSelection!,
    filter: collection.propertyFilterProps!.query,
  });
  return (
    <Modal
      header="Update confirmation"
      visible={true}
      onDismiss={onDismiss}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              Submit
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="s">
        <Box fontWeight="bold">You selected {selectedItemsCount} transactions for update.</Box>

        <Checkbox checked={includeNew} onChange={({ detail }) => setIncludeNew(detail.checked)}>
          Include new transactions that match the current filters.
        </Checkbox>

        <FormField label="Update query">
          <Box variant="awsui-inline-code">{query}</Box>
        </FormField>
      </SpaceBetween>
    </Modal>
  );
}
