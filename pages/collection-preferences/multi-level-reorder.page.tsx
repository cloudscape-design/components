// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';

import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';
import {
  baseProperties,
  contentDensityPreference,
  customPreference,
  pageSizePreference,
  wrapLinesPreference,
} from './shared-configs';

const columnOptions: CollectionPreferencesProps.ContentDisplayOption[] = [
  // ungroupdd
  { id: 'name', label: 'Name', alwaysVisible: true },
  { id: 'status', label: 'Status' },

  // performance
  { id: 'cpuUtilization', label: 'CPU (%)', groupId: 'performance' },
  { id: 'memoryUtilization', label: 'Memory (%)', groupId: 'performance' },
  { id: 'networkIn', label: 'Network In (MB/s)', groupId: 'performance' },
  { id: 'networkOut', label: 'Network Out (MB/s)', groupId: 'performance' },

  // config
  { id: 'instanceType', label: 'Instance Type', groupId: 'configuration' },
  { id: 'availabilityZone', label: 'Availability Zone', groupId: 'configuration' },
  { id: 'region', label: 'Region', groupId: 'configuration' },

  // cost
  { id: 'monthlyCost', label: 'Monthly Cost ($)', groupId: 'cost' },
  { id: 'spotPrice', label: 'Spot Price ($/hr)', groupId: 'cost' },
  {
    id: 'reservedCost',
    label:
      'Reserved Instance Cost - Long text to verify wrapping behavior and ensure the reordering feature works correctly with extended content',
    groupId: 'cost',
  },
];

const columnGroups: CollectionPreferencesProps.ContentDisplayOptionGroup[] = [
  { id: 'performance', label: 'Performance' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'cost', label: 'Cost' },
];

export default function App() {
  return (
    <>
      <h1>Multi-level Reorder Preferences</h1>
      <CollectionPreferences
        {...baseProperties}
        pageSizePreference={pageSizePreference}
        wrapLinesPreference={wrapLinesPreference}
        contentDensityPreference={contentDensityPreference}
        customPreference={customPreference}
        contentDisplayPreference={{
          title: 'Column preferences',
          description: 'Customize the columns visibility and order.',
          options: columnOptions,
          groups: columnGroups,
          ...contentDisplayPreferenceI18nStrings,
        }}
      />
    </>
  );
}
