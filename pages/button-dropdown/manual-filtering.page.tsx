// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Checkbox } from '~components';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import { useOptionsLoader } from '../common/options-loader';

import styles from './styles.scss';

// Flat action list used to demonstrate manual (app-controlled) filtering.
const manualSourceItems: ButtonDropdownProps.Item[] = [
  { id: 'cut', text: 'Cut', labelTag: 'Ctrl+X' },
  { id: 'copy', text: 'Copy', labelTag: 'Ctrl+C' },
  { id: 'paste', text: 'Paste', labelTag: 'Ctrl+V' },
  { id: 'undo', text: 'Undo', labelTag: 'Ctrl+Z' },
  { id: 'redo', text: 'Redo', labelTag: 'Ctrl+Y' },
  { id: 'select-all', text: 'Select all', labelTag: 'Ctrl+A' },
  { id: 'find', text: 'Find and replace', secondaryText: 'Search within document', labelTag: 'Ctrl+H' },
  { id: 'preferences', text: 'Preferences', secondaryText: 'Configure editor settings' },
];

// Larger list used to demonstrate asynchronous, paginated loading.
const asyncSourceItems: ButtonDropdownProps.Item[] = Array.from({ length: 25 }, (_, index) => ({
  id: `action-${index + 1}`,
  text: `Action ${index + 1}`,
  secondaryText: index % 3 === 0 ? `Description for action ${index + 1}` : undefined,
}));

export default function ButtonDropdownManualFilteringPage() {
  const [expandToViewport, setExpandToViewport] = useState(false);

  const filteringResultsText = (matches: number, total: number) => `${matches} out of ${total} matches`;
  const onItemClick = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log(event.detail);

  // Manual filtering: the default (client-side) filtering is disabled and the app decides
  // which items to display based on the filtering text provided by `onLoadItems`.
  const [manualItems, setManualItems] = useState<ButtonDropdownProps['items']>(manualSourceItems);

  // Async loading: items are fetched (and paginated) through the shared options loader.
  const {
    items: asyncItems,
    status,
    filteringText,
    fetchItems,
  } = useOptionsLoader<ButtonDropdownProps.Item>({ pageSize: 10 });

  const showAsyncFilteredText = (matchesCount: number, totalCount: number) => {
    if (status === 'pending') {
      return `${matchesCount}+ results`;
    }
    if (status === 'finished') {
      return `${matchesCount} out of ${totalCount} results`;
    }
    return '';
  };

  // Error use case: the initial request fails deterministically, and clicking the recovery
  // button (which fires `onLoadItems`) simulates a successful retry.
  const [errorStatus, setErrorStatus] = useState<ButtonDropdownProps['statusType']>('error');
  const [errorItems, setErrorItems] = useState<ButtonDropdownProps['items']>([]);

  return (
    <SimplePage title="Button dropdown with manual filtering and async loading">
      <SpaceBetween size="xl">
        <Checkbox
          checked={expandToViewport}
          onChange={event => setExpandToViewport(event.detail.checked)}
          data-testid="expand-to-viewport"
        >
          Expand to viewport
        </Checkbox>

        <div className={styles.container}>
          <h2>Manual filtering</h2>
          <ButtonDropdown
            data-testid="filtering-manual"
            items={manualItems}
            filteringType="manual"
            filteringPlaceholder="Search actions"
            filteringAriaLabel="Filter actions"
            noMatch={<span>No actions match your search. Try a different keyword.</span>}
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { filteringText } }) => {
              const normalized = filteringText.toLowerCase();
              setManualItems(manualSourceItems.filter(item => (item.text ?? '').toLowerCase().includes(normalized)));
            }}
          >
            Actions (manual)
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Async loading (paginated)</h2>
          <ButtonDropdown
            data-testid="filtering-async"
            items={asyncItems}
            filteringType="manual"
            filteringPlaceholder="Find action"
            filteringAriaLabel="Filter actions"
            statusType={status}
            itemsLoadingText="Loading actions"
            errorText="Error fetching actions."
            recoveryText="Retry"
            finishedText={filteringText ? `End of "${filteringText}" results` : 'End of all results'}
            empty="No actions found"
            expandToViewport={expandToViewport}
            filteringResultsText={showAsyncFilteredText}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { firstPage, filteringText } }) => {
              const normalized = filteringText.toLowerCase();
              const filtered = asyncSourceItems.filter(item => (item.text ?? '').toLowerCase().includes(normalized));
              fetchItems({ firstPage, filteringText, sourceItems: filtered });
            }}
          >
            Async actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Error state with recovery</h2>
          <ButtonDropdown
            data-testid="filtering-error"
            items={errorItems}
            filteringType="manual"
            filteringPlaceholder="Find action"
            filteringAriaLabel="Filter actions"
            statusType={errorStatus}
            itemsLoadingText="Loading actions"
            errorText="Error fetching actions."
            recoveryText="Retry"
            errorIconAriaLabel="Error"
            empty="No actions found"
            expandToViewport={expandToViewport}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { samePage } }) => {
              if (samePage) {
                // Triggered by the recovery button: simulate a successful retry.
                setErrorStatus('loading');
                setTimeout(() => {
                  setErrorItems(manualSourceItems);
                  setErrorStatus('finished');
                }, 1000);
              } else {
                // Initial load (or a new filtering request) fails.
                setErrorItems([]);
                setErrorStatus('error');
              }
            }}
          >
            Actions (error)
          </ButtonDropdown>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
