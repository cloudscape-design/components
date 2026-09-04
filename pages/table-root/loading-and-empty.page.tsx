// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Header from '~components/header';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import TableBody from '~components/table-body';
import TableRoot from '~components/table-root';
import TableRow from '~components/table-row';

import { DataBody, DataHeader, makeItems } from './common';

type State = 'loaded' | 'loading' | 'empty';

const COLUMN_COUNT = 4;

// Loading and empty states are composed by the consumer. In auto layout the table is a native
// `<table>`, so a single full-width status row is a plain `<td colSpan>` the consumer renders inside
// a `TableRow`. The consumer owns the data and the state; the status content is wrapped in a `Box`
// so its centered padding comes from spacing design tokens, not a standard data `TableCell`.
export default function TableLoadingEmptyPage() {
  const [state, setState] = useState<State>('loaded');
  const items = state === 'loaded' ? makeItems(20) : [];

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Box variant="h1">Table atomics — loading & empty states</Box>

        <SegmentedControl
          selectedId={state}
          onChange={event => setState(event.detail.selectedId as State)}
          label="Data state"
          options={[
            { id: 'loaded', text: 'Loaded' },
            { id: 'loading', text: 'Loading' },
            { id: 'empty', text: 'Empty' },
          ]}
        />

        <SpaceBetween size="s">
          <Header counter={`(${items.length})`}>Resources</Header>
          <TableRoot ariaLabel="Resources">
            <DataHeader />
            {state === 'loaded' ? (
              <DataBody items={items} />
            ) : (
              <TableBody>
                <TableRow>
                  <td colSpan={COLUMN_COUNT}>
                    <Box padding="m" textAlign="center" color="inherit">
                      {state === 'loading' ? (
                        <StatusIndicator type="loading">Loading resources</StatusIndicator>
                      ) : (
                        <SpaceBetween size="xxs">
                          <b>No resources</b>
                          <Box variant="p" color="inherit">
                            No resources to display.
                          </Box>
                        </SpaceBetween>
                      )}
                    </Box>
                  </td>
                </TableRow>
              </TableBody>
            )}
          </TableRoot>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
