// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Checkbox } from '~components';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import { useOptionsLoader } from '../common/options-loader';

import styles from './styles.scss';

// Source data for the flat async-loading example (25 items, paginated).
const flatSourceItems: ButtonDropdownProps.Item[] = Array.from({ length: 25 }, (_, i) => ({
  id: `action-${i + 1}`,
  text: `Action ${i + 1}`,
  secondaryText: i % 3 === 0 ? `Description for action ${i + 1}` : undefined,
}));

// Groups for the expandable async-loading example.
// group-files: loads successfully after 600ms.
// group-edit:  starts loading then fails after 800ms (error + retry button visible; retry also fails).
// group-view:  stays loading indefinitely to show a persistent loading spinner.
const groupSourceItems: Record<string, ButtonDropdownProps.Item[]> = {
  'group-files': Array.from({ length: 8 }, (_, i) => ({ id: `file-${i + 1}`, text: `File action ${i + 1}` })),
};

function fetchGroupItems(groupId: string): Promise<ButtonDropdownProps.Item[]> {
  if (groupId === 'group-files') {
    return new Promise(resolve => setTimeout(() => resolve(groupSourceItems['group-files']), 600));
  }
  if (groupId === 'group-edit') {
    // Always rejects — simulates a persistent server error.
    return new Promise((_, reject) => setTimeout(() => reject(new Error('Server error')), 800));
  }
  // group-view: never resolves — shows a permanent loading spinner.
  return new Promise(() => {});
}

export default function ButtonDropdownAsyncLoadingPage() {
  const [expandToViewport, setExpandToViewport] = useState(false);
  const onItemClick = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log(event.detail);

  // --- Flat async loading ---
  const {
    items: flatItems,
    status: flatStatus,
    filteringText: flatFilteringText,
    fetchItems,
  } = useOptionsLoader<ButtonDropdownProps.Item>({ pageSize: 10 });

  const flatFilteringResultsText = (matchesCount: number, totalCount: number) => {
    if (flatStatus === 'pending') {
      return `${matchesCount}+ results`;
    }
    if (flatStatus === 'finished') {
      return `${matchesCount} out of ${totalCount} results`;
    }
    return '';
  };

  // --- Expandable groups async loading ---
  // Track loaded items and status per group id.
  const [groupItems, setGroupItems] = useState<Record<string, ButtonDropdownProps.Item[]>>({});
  const [groupStatuses, setGroupStatuses] = useState<Record<string, ButtonDropdownProps.AsyncLoadingStatusType>>({});

  const expandableItems: ButtonDropdownProps.Items = [
    { id: 'group-files', text: 'File (loads successfully)', items: groupItems['group-files'] ?? [] },
    { id: 'group-edit', text: 'Edit (always errors)', items: groupItems['group-edit'] ?? [] },
    { id: 'group-view', text: 'View (loading forever)', items: groupItems['group-view'] ?? [] },
  ];

  // Error state example for the flat async loading.
  const [errorStatus, setErrorStatus] = useState<ButtonDropdownProps.AsyncLoadingStatusType>('error');
  const [errorItems, setErrorItems] = useState<ButtonDropdownProps['items']>([]);
  const manualSourceItems: ButtonDropdownProps.Item[] = flatSourceItems.slice(0, 8);

  return (
    <SimplePage title="Button dropdown — async loading">
      <SpaceBetween size="xl">
        <Checkbox
          checked={expandToViewport}
          onChange={event => setExpandToViewport(event.detail.checked)}
          data-testid="expand-to-viewport"
        >
          Expand to viewport
        </Checkbox>

        <div className={styles.container}>
          <h2>Async loading (flat items, paginated)</h2>
          <p>
            Items are loaded on open and on scroll using <code>useOptionsLoader</code>. Supports filtering with a fake
            server-side search.
          </p>
          <ButtonDropdown
            data-testid="async-flat"
            items={flatItems}
            filteringType="manual"
            filteringPlaceholder="Find action"
            filteringAriaLabel="Filter actions"
            asyncLoadingProps={{
              statusType: flatStatus,
              loadingText: () => 'Loading actions',
              errorText: () => 'Error fetching actions.',
              recoveryText: 'Retry',
              finishedText: () => (flatFilteringText ? `End of "${flatFilteringText}" results` : 'End of all results'),
              empty: () => 'No actions found',
            }}
            expandToViewport={expandToViewport}
            filteringResultsText={flatFilteringResultsText}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { firstPage, filteringText } }) => {
              const normalized = filteringText.toLowerCase();
              const filtered = flatSourceItems.filter(item => (item.text ?? '').toLowerCase().includes(normalized));
              fetchItems({ firstPage, filteringText, sourceItems: filtered });
            }}
          >
            Async actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Async loading per expandable group</h2>
          <p>
            Each group&apos;s items are fetched independently when the group is expanded. The per-group status is shown
            inside the group&apos;s sub-dropdown via <code>getExpandableItemsAsyncLoadingState</code>.
          </p>
          <ButtonDropdown
            data-testid="async-groups"
            items={expandableItems}
            expandableGroups={true}
            asyncLoadingProps={{
              loadingText: (groupId?: string) => `Loading ${groupId ?? 'items'}…`,
              errorText: (groupId?: string) => `Failed to load ${groupId ?? 'items'}.`,
              recoveryText: 'Retry',
              empty: (groupId?: string) => `No items in ${groupId ?? 'group'}.`,
            }}
            getExpandableItemsAsyncLoadingState={({ item }) => {
              const id = item.id;
              return id ? (groupStatuses[id] ?? null) : null;
            }}
            expandToViewport={expandToViewport}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { expandedGroupId, samePage } }) => {
              if (!expandedGroupId) {
                return;
              }
              // Both initial expand and retry go through the same fetch path.
              // For a retry (samePage=true) we keep the existing items visible while reloading.
              if (!samePage) {
                setGroupItems(prev => ({ ...prev, [expandedGroupId]: [] }));
              }
              setGroupStatuses(prev => ({ ...prev, [expandedGroupId]: 'loading' }));
              fetchGroupItems(expandedGroupId)
                .then(items => {
                  setGroupItems(prev => ({ ...prev, [expandedGroupId]: items }));
                  setGroupStatuses(prev => ({ ...prev, [expandedGroupId]: 'finished' }));
                })
                .catch(() => {
                  setGroupStatuses(prev => ({ ...prev, [expandedGroupId]: 'error' }));
                });
            }}
          >
            Instance actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Error state with recovery</h2>
          <p>
            The initial load fails deterministically. Clicking Retry simulates a successful recovery after a 1 second
            delay.
          </p>
          <ButtonDropdown
            data-testid="async-error"
            items={errorItems}
            filteringType="manual"
            filteringPlaceholder="Find action"
            filteringAriaLabel="Filter actions"
            asyncLoadingProps={{
              statusType: errorStatus,
              loadingText: () => 'Loading actions',
              errorText: () => 'Error fetching actions.',
              recoveryText: 'Retry',
              errorIconAriaLabel: 'Error',
              empty: () => 'No actions found',
            }}
            expandToViewport={expandToViewport}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { samePage } }) => {
              if (samePage) {
                setErrorStatus('loading');
                setTimeout(() => {
                  setErrorItems(manualSourceItems);
                  setErrorStatus('finished');
                }, 1000);
              } else {
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
