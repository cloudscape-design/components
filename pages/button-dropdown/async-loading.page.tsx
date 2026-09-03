// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import { useOptionsLoader } from '../common/options-loader';

// Source data

const flatSourceItems: ButtonDropdownProps.Item[] = Array.from({ length: 25 }, (_, i) => ({
  id: `action-${i + 1}`,
  text: `Action ${i + 1}`,
  secondaryText: i % 3 === 0 ? `Description for action ${i + 1}` : undefined,
}));

const groupSourceItems: Record<string, ButtonDropdownProps.Item[]> = {
  'group-files': Array.from({ length: 8 }, (_, i) => ({ id: `file-${i + 1}`, text: `File action ${i + 1}` })),
};

function fetchGroupItems(groupId: string): Promise<ButtonDropdownProps.Item[]> {
  if (groupId === 'group-files') {
    return new Promise(resolve => setTimeout(() => resolve(groupSourceItems['group-files']), 600));
  }
  if (groupId === 'group-edit') {
    return new Promise((_, reject) => setTimeout(() => reject(new Error('Server error')), 800));
  }
  // group-view: never resolves - shows a permanent loading spinner
  return new Promise(() => {});
}

export default function ButtonDropdownAsyncLoadingPage() {
  const [expandToViewport, setExpandToViewport] = useState(false);

  const onItemClick = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log(event.detail);

  // Flat async loading
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
    return `${matchesCount} out of ${totalCount} results`;
  };

  // Per-group async loading
  const [groupItems, setGroupItems] = useState<Record<string, ButtonDropdownProps.Item[]>>({});
  const [groupStatuses, setGroupStatuses] = useState<Record<string, ButtonDropdownProps.AsyncLoadingStatusType>>({});

  const expandableItems: ButtonDropdownProps.Items = [
    { id: 'group-files', text: 'File (loads successfully)', items: groupItems['group-files'] ?? [] },
    { id: 'group-edit', text: 'Edit (always errors)', items: groupItems['group-edit'] ?? [] },
    { id: 'group-view', text: 'View (loading forever)', items: groupItems['group-view'] ?? [] },
  ] as ButtonDropdownProps.Items;

  // Error state example
  const [errorStatus, setErrorStatus] = useState<ButtonDropdownProps.AsyncLoadingStatusType>('error');
  const [errorItems, setErrorItems] = useState<ButtonDropdownProps.Items>([]);
  const manualSourceItems = flatSourceItems.slice(0, 8);

  return (
    <SimplePage
      title="ButtonDropdown async loading"
      subtitle="Async loading, per-group loading, error recovery"
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
          <h2>Flat async loading (paginated)</h2>
          <p>Items are loaded on open and on scroll. Supports server-side filtering.</p>
          <ButtonDropdown
            items={flatItems as ButtonDropdownProps.Items}
            filteringType="manual"
            filteringPlaceholder="Filter actions"
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

        <div>
          <h2>Per-expandable-group async loading</h2>
          <p>
            Each group loads items independently on expand. File: loads in 600 ms. Edit: always errors (retry to see).
            View: loads forever.
          </p>
          <ButtonDropdown
            items={expandableItems}
            expandableGroups={true}
            asyncLoadingProps={{
              loadingText: (groupId?: string) => `Loading ${groupId ?? 'items'}...`,
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

        <div>
          <h2>Error state with recovery</h2>
          <p>Initial load fails. Clicking Retry simulates a successful recovery after 1 s.</p>
          <ButtonDropdown
            items={errorItems}
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
