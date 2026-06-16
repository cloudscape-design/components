// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import CollectionPreferences, {
  CollectionPreferencesProps,
} from '@cloudscape-design/components/collection-preferences';
import Link from '@cloudscape-design/components/link';
import Popover from '@cloudscape-design/components/popover';
import { PropertyFilterProps } from '@cloudscape-design/components/property-filter';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { TableProps } from '@cloudscape-design/components/table';

import { formatReadOnlyRegion } from '../../common/aws-region-utils';
import { enumOperators } from '../../common/property-filter-operators';
import { Instance } from '../../resources/related-instances';

export const tableAriaLabels: TableProps<{ name: string }>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  itemSelectionLabel: ({ selectedItems }, item) => {
    const isItemSelected = selectedItems.filter(i => i.name === item.name).length;
    return `${item.name} is ${isItemSelected ? '' : 'not'} selected`;
  },
  tableLabel: 'Instances table',
};

export function createColumns({
  getInstanceProps,
}: {
  getInstanceProps: (instance: Instance) => {
    children: number;
    actions: ReadonlyArray<{
      id: string;
      text: string;
      disabled?: boolean;
      hidden?: boolean;
      onClick: () => void;
    }>;
  };
}): TableProps.ColumnDefinition<Instance>[] {
  return [
    {
      id: 'name',
      header: 'DB Name',
      cell: item => <Link href={`#${item.name}`}>{item.name}</Link>,
      sortingField: 'name',
      minWidth: 300,
      isRowHeader: true,
    },
    {
      id: 'state',
      header: 'State',
      cell: item => {
        const selfState = (() => {
          switch (item.state) {
            case 'RUNNING':
              return <StatusIndicator type="success">Running</StatusIndicator>;
            case 'STOPPED':
              return <StatusIndicator type="stopped">Stopped</StatusIndicator>;
            case 'TERMINATED':
              return <StatusIndicator type="error">Terminated</StatusIndicator>;
          }
        })();
        return item.type === 'instance' ? (
          selfState
        ) : (
          <Popover
            dismissButton={false}
            position="top"
            size="small"
            content={
              <SpaceBetween size="s" direction="horizontal">
                <StatusIndicator type="success">{item.stateGrouped.RUNNING} Running</StatusIndicator>
                <StatusIndicator type="stopped">{item.stateGrouped.STOPPED} Stopped</StatusIndicator>
                <StatusIndicator type="error">{item.stateGrouped.TERMINATED} Terminated</StatusIndicator>
              </SpaceBetween>
            }
          >
            {selfState}
          </Popover>
        );
      },
      sortingField: 'state',
    },
    {
      id: 'region',
      header: 'Region & AZ',
      cell: item => formatReadOnlyRegion(item.regionGrouped),
      sortingField: 'regionGrouped',
    },
    {
      id: 'role',
      header: 'Role',
      cell: item => (item.type === 'instance' ? item.role : `${item.role} (${getInstanceProps(item).children})`),
      sortingField: 'role',
    },
    {
      id: 'activity',
      header: 'Activity',
      cell: item => (item.selectsPerSecond !== null ? `${item.selectsPerSecond} Selects/Sec` : '-'),
      sortingField: 'selectsPerSecond',
    },
    {
      id: 'engine',
      header: 'Engine',
      cell: item => item.engine,
      sortingField: 'engine',
    },
    {
      id: 'size',
      header: 'Size',
      cell: item => item.sizeGrouped || '-',
      sortingField: 'sizeGrouped',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: item => {
        const actions = getInstanceProps(item).actions.filter(action => !action.hidden);
        return actions.length > 0 ? (
          <ButtonDropdown
            expandToViewport={true}
            items={actions.filter(action => !action.hidden)}
            variant="inline-icon"
            ariaLabel={`Instance ${item.name} actions`}
            onItemClick={event => actions.find(action => action.id === event.detail.id)!.onClick()}
          />
        ) : null;
      },
    },
  ];
}

export const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  {
    key: 'name',
    propertyLabel: 'DB Name',
    groupValuesLabel: 'DB Name values',
    operators: ['=', ':'],
  },
  {
    key: 'path',
    propertyLabel: 'DB Path',
    groupValuesLabel: 'DB Path values',
    // Every instance or cluster includes self name and all parent cluster names in the path field.
    // To match filtering token against the path a custom matcher is needed.
    // The result includes a sub-tree of elements having the specified cluster as parent.
    operators: [
      {
        operator: '=',
        match: (path: unknown, token: null | string) => Array.isArray(path) && path.includes(token),
      },
    ],
  },
  {
    key: 'role',
    propertyLabel: 'Role',
    groupValuesLabel: 'Role values',
    operators: enumOperators,
  },
  {
    key: 'state',
    propertyLabel: 'State',
    groupValuesLabel: 'State values',
    operators: enumOperators,
  },
  {
    key: 'engine',
    propertyLabel: 'Engine',
    groupValuesLabel: 'Engine values',
    operators: enumOperators,
  },
  {
    key: 'size',
    propertyLabel: 'Size',
    groupValuesLabel: 'Size values',
    operators: enumOperators,
  },
  {
    key: 'region',
    propertyLabel: 'Region',
    groupValuesLabel: 'Region values',
    operators: enumOperators,
  },
];

export function TablePreferences({
  preferences,
  setPreferences,
}: {
  preferences: CollectionPreferencesProps.Preferences;
  setPreferences: (next: CollectionPreferencesProps.Preferences) => void;
}) {
  return (
    <CollectionPreferences
      title="Preferences"
      confirmLabel="Confirm"
      cancelLabel="Cancel"
      onConfirm={({ detail }) => setPreferences(detail)}
      preferences={preferences}
      contentDisplayPreference={{
        title: 'Column preferences',
        description: 'Customize the visibility and order of the columns.',
        options: [
          {
            id: 'name',
            label: 'DB Name',
            alwaysVisible: true,
          },
          {
            id: 'role',
            label: 'Role',
          },
          {
            id: 'activity',
            label: 'Activity',
          },
          {
            id: 'state',
            label: 'State',
          },
          {
            id: 'engine',
            label: 'Engine',
          },
          {
            id: 'size',
            label: 'Size',
          },
          {
            id: 'region',
            label: 'Region & AZ',
          },
          {
            id: 'actions',
            label: 'Actions',
          },
        ],
      }}
      wrapLinesPreference={{
        label: 'Wrap lines',
        description: 'Wrap lines description',
      }}
      stickyColumnsPreference={{
        firstColumns: {
          title: 'First column(s)',
          description: 'Keep the first column(s) visible while horizontally scrolling table content.',
          options: [
            { label: 'None', value: 0 },
            { label: 'First column', value: 1 },
            { label: 'First two columns', value: 2 },
          ],
        },
        lastColumns: {
          title: 'Stick last visible column',
          description: 'Keep the last column visible when tables are wider than the viewport.',
          options: [
            { label: 'Last column', value: 1 },
            { label: 'Last two columns', value: 2 },
          ],
        },
      }}
    />
  );
}
