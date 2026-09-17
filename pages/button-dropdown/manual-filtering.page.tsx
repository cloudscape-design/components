// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Checkbox } from '~components';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

import styles from './styles.scss';

const sourceItems: ButtonDropdownProps.Item[] = [
  { id: 'cut', text: 'Cut', labelTag: 'Ctrl+X' },
  { id: 'copy', text: 'Copy', labelTag: 'Ctrl+C' },
  { id: 'paste', text: 'Paste', labelTag: 'Ctrl+V' },
  { id: 'undo', text: 'Undo', labelTag: 'Ctrl+Z' },
  { id: 'redo', text: 'Redo', labelTag: 'Ctrl+Y' },
  { id: 'select-all', text: 'Select all', labelTag: 'Ctrl+A' },
  { id: 'find', text: 'Find and replace', secondaryText: 'Search within document', labelTag: 'Ctrl+H' },
  { id: 'preferences', text: 'Preferences', secondaryText: 'Configure editor settings' },
];

function filterLocally(filteringText: string): ButtonDropdownProps.Items {
  const normalized = filteringText.toLowerCase();
  return sourceItems.filter(item => (item.text ?? '').toLowerCase().includes(normalized));
}

// Simulates a 400ms server round-trip.
function fetchFromServer(filteringText: string): Promise<ButtonDropdownProps.Items> {
  const normalized = filteringText.toLowerCase();
  const results = sourceItems.filter(item => (item.text ?? '').toLowerCase().includes(normalized));
  return new Promise(resolve => setTimeout(() => resolve(results), 400));
}

export default function ButtonDropdownManualFilteringPage() {
  const [expandToViewport, setExpandToViewport] = useState(false);
  const onItemClick = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log(event.detail);
  const filteringResultsText = (matches: number, total: number) => `${matches} out of ${total} matches`;

  // Client-side manual filtering: the app filters synchronously in onLoadItems.
  const [clientItems, setClientItems] = useState<ButtonDropdownProps['items']>(sourceItems);

  // Server-side manual filtering: onLoadItems triggers a fake async request.
  const [serverItems, setServerItems] = useState<ButtonDropdownProps['items']>(sourceItems);
  const [serverStatus, setServerStatus] = useState<ButtonDropdownProps.AsyncLoadingStatusType>('finished');

  return (
    <SimplePage title="Button dropdown — manual filtering">
      <SpaceBetween size="xl">
        <Checkbox
          checked={expandToViewport}
          onChange={event => setExpandToViewport(event.detail.checked)}
          data-testid="expand-to-viewport"
        >
          Expand to viewport
        </Checkbox>

        <div className={styles.container}>
          <h2>Client-side manual filtering</h2>
          <p>
            The app filters the items synchronously inside <code>onLoadItems</code>. No status indicators are needed.
          </p>
          <ButtonDropdown
            data-testid="filtering-manual-client"
            items={clientItems}
            filteringType="manual"
            filteringPlaceholder="Search actions"
            filteringAriaLabel="Filter actions"
            noMatch={<span>No actions match. Try a different keyword.</span>}
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { filteringText } }) => {
              setClientItems(filterLocally(filteringText));
            }}
          >
            Actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Server-side manual filtering (fake)</h2>
          <p>
            The app calls a fake async API on every filtering change. A loading spinner appears while the request is in
            flight.
          </p>
          <ButtonDropdown
            data-testid="filtering-manual-server"
            items={serverItems}
            filteringType="manual"
            filteringPlaceholder="Search actions"
            filteringAriaLabel="Filter actions"
            asyncLoadingProps={{
              statusType: serverStatus,
              loadingText: () => 'Searching…',
              empty: () => 'No actions found',
            }}
            noMatch={<span>No actions match. Try a different keyword.</span>}
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { filteringText } }) => {
              setServerStatus('loading');
              setServerItems([]);
              fetchFromServer(filteringText).then(results => {
                setServerItems(results);
                setServerStatus('finished');
              });
            }}
          >
            Actions
          </ButtonDropdown>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
