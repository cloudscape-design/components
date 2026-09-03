// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import BasicTable, {
  BasicTableBody,
  BasicTableCell,
  BasicTableRow,
} from '~components/beta/basic-table-0.1';
import Box from '~components/box';
import Header from '~components/header';
import SegmentedControl from '~components/segmented-control';
import Skeleton from '~components/skeleton';
import SpaceBetween from '~components/space-between';

import { DataHeader, DATA_COLUMNS, makeItems } from './common';

// Skeleton loading is pure COMPOSITION — BasicTable adds no `skeleton` prop (unlike Table). The
// consumer keeps its own loading flag and, while loading, renders its own placeholder
// `BasicTableRow`s whose cells hold the public `<Skeleton />` primitive (the same aria-hidden
// element Table renders internally per skeleton cell). The header row still shows; a `role="status"`
// live region announces the loading state since the `<Skeleton />` bars are aria-hidden.
type State = 'loading' | 'loaded';

const SKELETON_ROW_COUNT = 5;

export default function BasicTableSkeletonRowsPage() {
  const [state, setState] = useState<State>('loading');
  const isLoading = state === 'loading';
  const items = isLoading ? [] : makeItems(10);

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">BasicTable — skeleton loading (composed, BYO placeholder rows)</Box>
        <SegmentedControl
          selectedId={state}
          onChange={e => setState(e.detail.selectedId as State)}
          label="Data state"
          options={[
            { id: 'loading', text: 'Loading (skeleton)' },
            { id: 'loaded', text: 'Loaded' },
          ]}
        />

        <SpaceBetween size="s">
          <Header counter={isLoading ? undefined : `(${items.length})`}>Resources</Header>
          <div role="status">{isLoading ? <Box color="text-status-inactive">Loading resources</Box> : null}</div>
          <BasicTable
            columns={DATA_COLUMNS}
            totalRowCount={isLoading ? SKELETON_ROW_COUNT : items.length}
            i18nStrings={{ tableLabel: 'Resources' }}
          >
            <DataHeader />
            {isLoading ? (
              <BasicTableBody>
                {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                  <BasicTableRow key={`skeleton-${index}`} index={index} id={`skeleton-${index}`}>
                    {DATA_COLUMNS.map((_column, colIndex) => (
                      <BasicTableCell key={colIndex}>
                        <Skeleton />
                      </BasicTableCell>
                    ))}
                  </BasicTableRow>
                ))}
              </BasicTableBody>
            ) : (
              <BasicTableBody>
                {items.map((item, index) => (
                  <BasicTableRow key={item.id} index={index} id={item.id}>
                    <BasicTableCell>{item.name}</BasicTableCell>
                    <BasicTableCell>{item.type}</BasicTableCell>
                    <BasicTableCell>{item.size}</BasicTableCell>
                    <BasicTableCell>{item.status}</BasicTableCell>
                  </BasicTableRow>
                ))}
              </BasicTableBody>
            )}
          </BasicTable>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
