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
  // ungrouped
  { id: 'name', label: 'Name', alwaysVisible: true },
  { id: 'status', label: 'Status' },

  // performance
  { id: 'cpuUtilization', label: 'CPU (%)' },
  { id: 'memoryUtilization', label: 'Memory (%)' },
  { id: 'networkIn', label: 'Network In (MB/s)' },
  { id: 'networkOut', label: 'Network Out (MB/s)' },

  // config
  { id: 'instanceType', label: 'Instance Type' },
  { id: 'availabilityZone', label: 'Availability Zone' },
  { id: 'region', label: 'Region' },

  // cost
  { id: 'monthlyCost', label: 'Monthly Cost ($)' },
  { id: 'spotPrice', label: 'Spot Price ($/hr)' },
  {
    id: 'reservedCost',
    label:
      'Reserved Instance Cost - Long text to verify wrapping behavior and ensure the reordering feature works correctly with extended content',
  },
];

const columnGroups: CollectionPreferencesProps.ContentDisplayOptionGroup[] = [
  { id: 'performance', label: 'Performance' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'cost', label: 'Cost' },
];

const defaultContentDisplay: CollectionPreferencesProps.ContentDisplayItem[] = [
  { id: 'name', visible: true },
  { id: 'status', visible: true },
  {
    type: 'group',
    id: 'performance',
    visible: true,
    children: [
      { id: 'cpuUtilization', visible: true },
      { id: 'memoryUtilization', visible: true },
      { id: 'networkIn', visible: true },
      { id: 'networkOut', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'configuration',
    visible: true,
    children: [
      { id: 'instanceType', visible: true },
      { id: 'availabilityZone', visible: true },
      { id: 'region', visible: true },
    ],
  },
  {
    type: 'group',
    id: 'cost',
    visible: true,
    children: [
      { id: 'monthlyCost', visible: true },
      { id: 'spotPrice', visible: true },
      { id: 'reservedCost', visible: true },
    ],
  },
];

export default function App() {
  const [preferences, setPreferences] = React.useState<CollectionPreferencesProps.Preferences>({
    contentDisplay: defaultContentDisplay,
  });

  return (
    <>
      <h1>Multi-level Reorder Preferences</h1>
      <CollectionPreferences
        {...baseProperties}
        pageSizePreference={pageSizePreference}
        wrapLinesPreference={wrapLinesPreference}
        contentDensityPreference={contentDensityPreference}
        customPreference={customPreference}
        preferences={preferences}
        onConfirm={({ detail }) => setPreferences(detail)}
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
