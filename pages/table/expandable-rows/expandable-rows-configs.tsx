// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import {
  CollectionPreferences,
  CollectionPreferencesProps,
  Input,
  Link,
  Popover,
  PropertyFilterProps,
  SpaceBetween,
  StatusIndicator,
  TableProps,
} from '~components';

import { contentDisplayPreferenceI18nStrings } from '../../common/i18n-strings';
import { columnLabel } from '../shared-configs';
import { Instance } from './common';

export function createColumns(): TableProps.ColumnDefinition<Instance>[] {
  return [
    {
      id: 'name',
      header: 'DB Name',
      cell: item => <Link href={`#${item.name}`}>{item.name}</Link>,
      ariaLabel: columnLabel('DB Name'),
      sortingField: 'name',
      minWidth: 220,
      isRowHeader: true,
    },
    {
      id: 'role',
      header: 'Role',
      cell: item => (item.type === 'instance' ? item.role : item.role),
      ariaLabel: columnLabel('Role'),
      sortingField: 'role',
    },
    {
      id: 'activity',
      header: 'Activity',
      cell: item => (item.selectsPerSecond !== null ? `${item.selectsPerSecond} Selects/Sec` : '-'),
      ariaLabel: columnLabel('Activity'),
      sortingField: 'selectsPerSecond',
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
        if (item.type === 'instance') {
          return selfState;
        }
        return (
          <Popover
            dismissButton={false}
            position="top"
            size="small"
            content={
              <SpaceBetween size="s" direction="horizontal">
                <StatusIndicator type="success">{item.stateGrouped.RUNNING}</StatusIndicator>
                <StatusIndicator type="stopped">{item.stateGrouped.STOPPED}</StatusIndicator>
                <StatusIndicator type="error">{item.stateGrouped.TERMINATED}</StatusIndicator>
              </SpaceBetween>
            }
          >
            {selfState}
          </Popover>
        );
      },
      ariaLabel: columnLabel('State'),
      sortingField: 'state',
    },
    {
      id: 'engine',
      header: 'Engine',
      cell: item => item.engine,
      ariaLabel: columnLabel('Engine'),
      sortingField: 'engine',
    },
    {
      id: 'size',
      header: 'Size',
      cell: item => item.sizeGrouped || '-',
      ariaLabel: columnLabel('Size'),
      sortingField: 'sizeGrouped',
    },
    {
      id: 'region',
      header: 'Region & AZ',
      cell: item => item.regionGrouped,
      ariaLabel: columnLabel('Region & AZ'),
      sortingField: 'regionGrouped',
    },
    {
      id: 'termination-reason',
      header: 'Termination reason',
      cell: item => item.terminationReason || '-',
      editConfig: {
        ariaLabel: 'Edit termination reason',
        editIconAriaLabel: 'editable',
        errorIconAriaLabel: 'Edit cell error',
        editingCell: (item, { currentValue, setValue }) => (
          <Input
            autoFocus={true}
            value={currentValue ?? item.terminationReason}
            onChange={event => setValue(event.detail.value)}
          />
        ),
        disabledReason: item =>
          item.terminationReason?.includes('automatically') ? 'Cannot edit automatically added description' : '',
      },
      minWidth: 250,
    },
  ];
}

export function createPreferences({
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
        description: 'Customize the columns visibility and order.',
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
            id: 'termination-reason',
            label: 'Termination reason',
          },
          {
            id: 'actions',
            label: 'Actions',
          },
        ],
        ...contentDisplayPreferenceI18nStrings,
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

export const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  {
    key: 'path',
    propertyLabel: 'DB Name',
    groupValuesLabel: 'DB Name values',
    // Use custom matchers so that when filtering item by name all its children are matched as well.
    operators: [
      {
        operator: '=',
        match: (path: unknown, token: null | string) => Array.isArray(path) && path.includes(token),
      },
      // The contains operator is listed to support free-text matching.
      {
        operator: ':',
        match: (path: unknown, token: null | string) =>
          Array.isArray(path) && path.some(entry => entry.includes(token)),
      },
    ],
  },
  {
    key: 'role',
    propertyLabel: 'Role',
    groupValuesLabel: 'Role values',
    operators: ['='],
  },
  {
    key: 'state',
    propertyLabel: 'State',
    groupValuesLabel: 'State values',
    operators: ['=', '!='],
  },
  {
    key: 'engine',
    propertyLabel: 'Engine',
    groupValuesLabel: 'Engine values',
    operators: ['=', '!=', ':'],
  },
  {
    key: 'size',
    propertyLabel: 'Size',
    groupValuesLabel: 'Size values',
    operators: ['=', '!=', ':'],
  },
  {
    key: 'region',
    propertyLabel: 'Region',
    groupValuesLabel: 'Region values',
    operators: ['=', '!=', ':'],
  },
  {
    key: 'terminationReason',
    propertyLabel: 'Termination reason',
    groupValuesLabel: 'Termination reason values',
    operators: [':', '!;'],
  },
];
