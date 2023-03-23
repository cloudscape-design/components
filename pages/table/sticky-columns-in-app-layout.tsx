// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Header from '~components/header';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import { Instance, generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';
import Table from '~components/table';
export default () => {
  const [preferences, setPreferences] = React.useState<CollectionPreferencesProps.Preferences>({
    stickyColumns: { start: 1, end: 1 },
  });

  const items = generateItems(40);

  return (
    <Table<Instance>
      header={<Header variant="awsui-h1-sticky">Full-page table</Header>}
      stickyHeader={true}
      variant="full-page"
      preferences={
        <CollectionPreferences
          title="Preferences"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          onConfirm={({ detail }) => setPreferences(detail)}
          preferences={preferences}
          stickyColumnsPreference={{
            startColumns: {
              title: 'Stick first visible column(s)',
              description: 'Keep the first column(s) visible while horizontally scrolling table content.',
              options: [
                { label: 'None', value: 0 },
                { label: 'First visible column', value: 1 },
                { label: 'First two visible columns', value: 2 },
              ],
            },
            endColumns: {
              title: 'Stick last visible column',
              description: 'Keep the last column visible when tables are wider than the viewport.',
              options: [
                { label: 'None', value: 0 },
                { label: 'Last visible column', value: 1 },
              ],
            },
          }}
        />
      }
      columnDefinitions={columnsConfig}
      items={items}
    />
  );
};
