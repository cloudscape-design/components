// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BasicTable from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';

import { DataBody, DataHeader, DATA_COLUMNS, makeItems } from './common';

type State = 'loaded' | 'loading' | 'empty';

// Loading / empty states, ported from table/empty-state (+ the loading/empty permutations in
// table/simple-permutations). Non-sticky, matching the reference: the Header is composed before the
// table, and the loading text / empty slot render inside the grid with the column-header row still
// shown. Sticky-header parity is covered separately by sticky-header.page.tsx.
export default function BasicTableLoadingEmptyPage() {
  const [state, setState] = useState<State>('loaded');
  const items = state === 'loaded' ? makeItems(20) : [];

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — loading & empty states</Box>
        <SegmentedControl
          selectedId={state}
          onChange={e => setState(e.detail.selectedId as State)}
          label="Data state"
          options={[
            { id: 'loaded', text: 'Loaded' },
            { id: 'loading', text: 'Loading' },
            { id: 'empty', text: 'Empty' },
          ]}
        />
        <SpaceBetween size="s">
          <Header counter={`(${items.length})`}>Resources</Header>
          <BasicTable
            columns={DATA_COLUMNS}
            totalRowCount={items.length}
            loading={state === 'loading'}
            loadingText="Loading resources"
            empty={
              <Box textAlign="center" color="inherit">
                <b>No resources</b>
                <Box variant="p" color="inherit">
                  No resources to display.
                </Box>
              </Box>
            }
            i18nStrings={{ tableLabel: 'Resources' }}
          >
            <DataHeader />
            <DataBody items={items} />
          </BasicTable>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
