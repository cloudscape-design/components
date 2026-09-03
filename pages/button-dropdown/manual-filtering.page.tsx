// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

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

function fetchFromServer(filteringText: string): Promise<ButtonDropdownProps.Items> {
  const normalized = filteringText.toLowerCase();
  const results = sourceItems.filter(item => (item.text ?? '').toLowerCase().includes(normalized));
  return new Promise(resolve => setTimeout(() => resolve(results), 400));
}

export default function ButtonDropdownManualFilteringPage() {
  const [expandToViewport, setExpandToViewport] = useState(false);

  const onItemClick = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log(event.detail);
  const filteringResultsText = (matches: number, total: number) => `${matches} out of ${total} matches`;

  // Client-side manual filtering
  const [clientItems, setClientItems] = useState<ButtonDropdownProps.Items>(sourceItems);

  // Server-side manual filtering
  const [serverItems, setServerItems] = useState<ButtonDropdownProps.Items>(sourceItems);
  const [serverStatus, setServerStatus] = useState<ButtonDropdownProps.AsyncLoadingStatusType>('finished');

  return (
    <SimplePage
      title="ButtonDropdown manual filtering"
      settings={
        <Checkbox
          checked={expandToViewport}
          onChange={event => setExpandToViewport(event.detail.checked)}
          data-testid="expand-to-viewport"
        >
          Expand to viewport
        </Checkbox>
      }
    >
      <SpaceBetween size="xl">
        <div>
          <h2>Client-side manual filtering</h2>
          <p>
            The app filters items synchronously inside <code>onLoadItems</code>. No status indicators needed.
          </p>
          <ButtonDropdown
            items={clientItems}
            filteringType="manual"
            filteringPlaceholder="Filter actions"
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

        <div>
          <h2>Server-side manual filtering</h2>
          <p>
            The app calls a fake async API on every filter change. A loading spinner appears while the request is in
            flight.
          </p>
          <ButtonDropdown
            items={serverItems}
            filteringType="manual"
            filteringPlaceholder="Search actions"
            asyncLoadingProps={{
              statusType: serverStatus,
              loadingText: () => 'Searching...',
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
