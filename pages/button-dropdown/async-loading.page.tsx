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

// Source data for the combined example: flat async items plus two expandable groups.
const combinedFlatSource: ButtonDropdownProps.Item[] = Array.from({ length: 20 }, (_, i) => ({
  id: `combined-action-${i + 1}`,
  text: `Instance action ${i + 1}`,
  secondaryText: i % 4 === 0 ? `Details for instance action ${i + 1}` : undefined,
}));

const combinedGroupSource: Record<string, ButtonDropdownProps.Item[]> = {
  'combined-file': Array.from({ length: 6 }, (_, i) => ({ id: `cf-${i + 1}`, text: `File action ${i + 1}` })),
  'combined-edit': Array.from({ length: 5 }, (_, i) => ({ id: `ce-${i + 1}`, text: `Edit action ${i + 1}` })),
};

function fetchCombinedGroupItems(groupId: string): Promise<ButtonDropdownProps.Item[]> {
  return new Promise(resolve => setTimeout(() => resolve(combinedGroupSource[groupId] ?? []), 600));
}

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

  // --- Combined: filtering + async loading + expandable groups ---
  const {
    items: combinedItems,
    status: combinedStatus,
    filteringText: combinedFilteringText,
    fetchItems: fetchCombinedItems,
  } = useOptionsLoader<ButtonDropdownProps.Item>({ pageSize: 10 });

  const [combinedGroupItems, setCombinedGroupItems] = useState<Record<string, ButtonDropdownProps.Item[]>>({});
  const [combinedGroupStatuses, setCombinedGroupStatuses] = useState<
    Record<string, ButtonDropdownProps.AsyncLoadingStatusType>
  >({});
  // Track the current filter value directly so group visibility updates immediately on input,
  // without waiting for useOptionsLoader's filteringText (which only updates after firstPage resolves).
  const [combinedFilter, setCombinedFilter] = useState('');

  // The top-level items are a mix of flat async results and expandable groups.
  // Groups themselves have their children loaded on demand.
  // When a filter is active:
  // - Groups whose text matches are kept and their already-loaded children are shown inline.
  // - Groups with no loaded children yet show a loading/pending status so they can be fetched.
  // - Groups whose text doesn't match are hidden.
  const combinedGroups: ButtonDropdownProps.ItemGroup[] = [
    { id: 'combined-file', text: 'File', items: combinedGroupItems['combined-file'] ?? [] },
    { id: 'combined-edit', text: 'Edit', items: combinedGroupItems['combined-edit'] ?? [] },
  ];
  const visibleCombinedGroups = combinedFilter
    ? combinedGroups.filter(g => (g.text ?? '').toLowerCase().includes(combinedFilter.toLowerCase()))
    : combinedGroups;
  const combinedTopLevelItems: ButtonDropdownProps.Items = [...visibleCombinedGroups, ...combinedItems];

  const combinedFilteringResultsText = (matchesCount: number, totalCount: number) => {
    if (combinedStatus === 'pending') {
      return `${matchesCount}+ results`;
    }
    if (combinedStatus === 'finished') {
      return `${matchesCount} out of ${totalCount} results`;
    }
    return '';
  };

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
        <div className={styles.container}>
          <h2>Async loading with filtering and expandable groups</h2>
          <p>
            The top-level list is loaded and filtered asynchronously. Two expandable groups also load their children on
            demand when expanded, independently of the filtering.
          </p>
          <ButtonDropdown
            data-testid="async-combined"
            items={combinedTopLevelItems}
            filteringType="manual"
            filteringPlaceholder="Find action"
            filteringAriaLabel="Filter actions"
            expandableGroups={!combinedFilter}
            asyncLoadingProps={{
              statusType: combinedStatus,
              recoveryText: 'Retry',
              finishedText: () =>
                combinedFilteringText ? `End of "${combinedFilteringText}" results` : 'End of all results',
              empty: () => 'No actions found',
              loadingText: (groupId?: string) => (groupId ? `Loading ${groupId} items…` : 'Loading actions'),
              errorText: (groupId?: string) =>
                groupId ? `Failed to load ${groupId} items.` : 'Error fetching actions.',
            }}
            getExpandableItemsAsyncLoadingState={({ item }) => {
              const id = item.id;
              return id ? (combinedGroupStatuses[id] ?? null) : null;
            }}
            expandToViewport={expandToViewport}
            filteringResultsText={combinedFilteringResultsText}
            onItemClick={onItemClick}
            onLoadItems={({ detail: { firstPage, filteringText, expandedGroupId, samePage } }) => {
              if (expandedGroupId) {
                // Group expansion — load the group's children.
                if (!samePage) {
                  setCombinedGroupItems(prev => ({ ...prev, [expandedGroupId]: [] }));
                }
                setCombinedGroupStatuses(prev => ({ ...prev, [expandedGroupId]: 'loading' }));
                fetchCombinedGroupItems(expandedGroupId).then(items => {
                  setCombinedGroupItems(prev => ({ ...prev, [expandedGroupId]: items }));
                  setCombinedGroupStatuses(prev => ({ ...prev, [expandedGroupId]: 'finished' }));
                });
              } else {
                // Top-level filtering / pagination / open.
                if (firstPage) {
                  setCombinedFilter(filteringText);
                  // Clear group items so nothing stale shows while the new filter is in-flight.
                  setCombinedGroupItems({});
                  setCombinedGroupStatuses({});
                  // Eagerly load any group whose text matches the filter.
                  combinedGroups
                    .filter(g => filteringText && (g.text ?? '').toLowerCase().includes(filteringText.toLowerCase()))
                    .forEach(g => {
                      const gid = g.id!;
                      setCombinedGroupStatuses(prev => ({ ...prev, [gid]: 'loading' }));
                      fetchCombinedGroupItems(gid).then(items => {
                        setCombinedGroupItems(prev => ({ ...prev, [gid]: items }));
                        setCombinedGroupStatuses(prev => ({ ...prev, [gid]: 'finished' }));
                      });
                    });
                }
                const normalized = filteringText.toLowerCase();
                const filtered = combinedFlatSource.filter(item =>
                  (item.text ?? '').toLowerCase().includes(normalized)
                );
                fetchCombinedItems({ firstPage, filteringText, sourceItems: filtered });
              }
            }}
          >
            Actions
          </ButtonDropdown>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
