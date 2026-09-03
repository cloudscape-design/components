// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import { useOptionsLoader } from '../common/options-loader';

// ---- Source data ----

const ALL_ITEMS: ButtonDropdownProps.Item[] = Array.from({ length: 12 }, (_, i) => ({
  id: `action-${i + 1}`,
  text: `Action ${i + 1}`,
  secondaryText: i % 3 === 0 ? `Description for action ${i + 1}` : undefined,
}));

const GROUP_ITEMS: ButtonDropdownProps.Item[] = Array.from({ length: 6 }, (_, i) => ({
  id: `sub-${i + 1}`,
  text: `Sub-action ${i + 1}`,
}));

const STATUS_OPTIONS = [
  { value: 'loading', label: 'loading' },
  { value: 'error', label: 'error' },
  { value: 'pending', label: 'pending' },
  { value: 'finished', label: 'finished' },
];

const ITEMS_OPTIONS = [
  { value: 'none', label: 'No items' },
  { value: 'some', label: '6 items' },
  { value: 'all', label: '12 items' },
];

type StatusType = ButtonDropdownProps.AsyncLoadingStatusType;

function itemsFromPreset(preset: string, source: ButtonDropdownProps.Item[]): ButtonDropdownProps.Items {
  if (preset === 'none') {
    return [];
  }
  if (preset === 'some') {
    return source.slice(0, Math.floor(source.length / 2));
  }
  return source;
}

const flatSourceItems: ButtonDropdownProps.Item[] = Array.from({ length: 25 }, (_, i) => ({
  id: `flat-action-${i + 1}`,
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
  return new Promise(() => {});
}

export default function ButtonDropdownAsyncLoadingPage() {
  const [expandToViewport, setExpandToViewport] = useState(false);
  const onItemClick = (e: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log('clicked', e.detail.id);

  // Interactive controls - flat
  const [flatStatus, setFlatStatus] = useState<StatusType>('loading');
  const [flatItemsPreset, setFlatItemsPreset] = useState('none');

  // Interactive controls - groups
  const [groupAStatus, setGroupAStatus] = useState<StatusType>('loading');
  const [groupAPreset, setGroupAPreset] = useState('none');
  const [groupBStatus, setGroupBStatus] = useState<StatusType>('error');
  const [groupBPreset, setGroupBPreset] = useState('none');

  // Preconfigured - paginated async
  const {
    items: paginatedItems,
    status: paginatedStatus,
    filteringText: paginatedFilteringText,
    fetchItems,
  } = useOptionsLoader<ButtonDropdownProps.Item>({ pageSize: 10 });

  // Preconfigured - groups
  const [groupItems, setGroupItems] = useState<Record<string, ButtonDropdownProps.Item[]>>({});
  const [groupStatuses, setGroupStatuses] = useState<Record<string, StatusType>>({});

  // Preconfigured - error + recovery
  const [errorStatus, setErrorStatus] = useState<StatusType>('error');
  const [errorItems, setErrorItems] = useState<ButtonDropdownProps.Items>([]);

  return (
    <SimplePage
      title="ButtonDropdown async loading"
      settings={
        <Checkbox checked={expandToViewport} onChange={e => setExpandToViewport(e.detail.checked)}>
          Expand to viewport
        </Checkbox>
      }
    >
      <SpaceBetween size="xxl">
        {/* Interactive: flat */}
        <div>
          <h2>Interactive - flat async</h2>
          <p>Set status and items directly to test any combination without waiting.</p>
          <SpaceBetween size="s" direction="horizontal">
            <FormField label="statusType">
              <Select
                selectedOption={STATUS_OPTIONS.find(o => o.value === flatStatus) ?? null}
                onChange={e => setFlatStatus(e.detail.selectedOption.value as StatusType)}
                options={STATUS_OPTIONS}
              />
            </FormField>
            <FormField label="items">
              <Select
                selectedOption={ITEMS_OPTIONS.find(o => o.value === flatItemsPreset) ?? null}
                onChange={e => setFlatItemsPreset(e.detail.selectedOption.value!)}
                options={ITEMS_OPTIONS}
              />
            </FormField>
          </SpaceBetween>
          <br />
          <ButtonDropdown
            items={itemsFromPreset(flatItemsPreset, ALL_ITEMS)}
            asyncLoadingProps={{
              statusType: flatStatus,
              loadingText: () => 'Loading actions...',
              errorText: () => 'Failed to load actions.',
              recoveryText: 'Retry',
              errorIconAriaLabel: 'Error',
              finishedText: () => 'End of results',
              empty: () => 'No actions found',
            }}
            expandToViewport={expandToViewport}
            onItemClick={onItemClick}
            onLoadItems={({ detail }) => console.log('onLoadItems', detail)}
          >
            Actions
          </ButtonDropdown>
        </div>

        {/* Interactive: groups */}
        <div>
          <h2>Interactive - expandable groups</h2>
          <p>Set status and items per group independently. Expand each group to see its state.</p>
          <SpaceBetween size="s" direction="horizontal">
            <FormField label="Group A - statusType">
              <Select
                selectedOption={STATUS_OPTIONS.find(o => o.value === groupAStatus) ?? null}
                onChange={e => setGroupAStatus(e.detail.selectedOption.value as StatusType)}
                options={STATUS_OPTIONS}
              />
            </FormField>
            <FormField label="Group A - items">
              <Select
                selectedOption={ITEMS_OPTIONS.find(o => o.value === groupAPreset) ?? null}
                onChange={e => setGroupAPreset(e.detail.selectedOption.value!)}
                options={ITEMS_OPTIONS}
              />
            </FormField>
            <FormField label="Group B - statusType">
              <Select
                selectedOption={STATUS_OPTIONS.find(o => o.value === groupBStatus) ?? null}
                onChange={e => setGroupBStatus(e.detail.selectedOption.value as StatusType)}
                options={STATUS_OPTIONS}
              />
            </FormField>
            <FormField label="Group B - items">
              <Select
                selectedOption={ITEMS_OPTIONS.find(o => o.value === groupBPreset) ?? null}
                onChange={e => setGroupBPreset(e.detail.selectedOption.value!)}
                options={ITEMS_OPTIONS}
              />
            </FormField>
          </SpaceBetween>
          <br />
          <ButtonDropdown
            items={
              [
                { id: 'group-a', text: 'Group A', items: itemsFromPreset(groupAPreset, GROUP_ITEMS) },
                { id: 'group-b', text: 'Group B', items: itemsFromPreset(groupBPreset, GROUP_ITEMS) },
              ] as ButtonDropdownProps.Items
            }
            expandableGroups={true}
            asyncLoadingProps={{
              loadingText: (gid?: string) => `Loading ${gid ?? 'items'}...`,
              errorText: (gid?: string) => `Failed to load ${gid ?? 'items'}.`,
              recoveryText: 'Retry',
              errorIconAriaLabel: 'Error',
              finishedText: (gid?: string) => `End of ${gid ?? 'results'}`,
              empty: (gid?: string) => `No items in ${gid ?? 'group'}.`,
            }}
            getExpandableItemsAsyncLoadingState={({ item }) => {
              if (item.id === 'group-a') {
                return groupAStatus;
              }
              if (item.id === 'group-b') {
                return groupBStatus;
              }
              return null;
            }}
            expandToViewport={expandToViewport}
            onItemClick={onItemClick}
            onLoadItems={({ detail }) => console.log('onLoadItems', detail)}
          >
            Instance actions
          </ButtonDropdown>
        </div>

        {/* Preconfigured: paginated flat async */}
        <div>
          <h2>Preconfigured - flat async (paginated)</h2>
          <p>Items load on open and paginate on scroll. Filter input triggers server-side search.</p>
          <ButtonDropdown
            items={paginatedItems as ButtonDropdownProps.Items}
            filteringType="manual"
            filteringPlaceholder="Filter actions"
            asyncLoadingProps={{
              statusType: paginatedStatus,
              loadingText: () => 'Loading actions...',
              errorText: () => 'Error fetching actions.',
              recoveryText: 'Retry',
              finishedText: () =>
                paginatedFilteringText ? `End of "${paginatedFilteringText}" results` : 'End of all results',
              empty: () => 'No actions found',
            }}
            expandToViewport={expandToViewport}
            filteringResultsText={(matchesCount, totalCount) =>
              paginatedStatus === 'pending' ? `${matchesCount}+ results` : `${matchesCount} of ${totalCount}`
            }
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

        {/* Preconfigured: per-group async */}
        <div>
          <h2>Preconfigured - per-group async</h2>
          <p>File loads in 600 ms. Edit always errors. View loads forever.</p>
          <ButtonDropdown
            items={
              [
                { id: 'group-files', text: 'File (loads successfully)', items: groupItems['group-files'] ?? [] },
                { id: 'group-edit', text: 'Edit (always errors)', items: groupItems['group-edit'] ?? [] },
                { id: 'group-view', text: 'View (loading forever)', items: groupItems['group-view'] ?? [] },
              ] as ButtonDropdownProps.Items
            }
            expandableGroups={true}
            asyncLoadingProps={{
              loadingText: (gid?: string) => `Loading ${gid ?? 'items'}...`,
              errorText: (gid?: string) => `Failed to load ${gid ?? 'items'}.`,
              recoveryText: 'Retry',
              empty: (gid?: string) => `No items in ${gid ?? 'group'}.`,
            }}
            getExpandableItemsAsyncLoadingState={({ item }) => (item.id ? (groupStatuses[item.id] ?? null) : null)}
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

        {/* Preconfigured: error + recovery */}
        <div>
          <h2>Preconfigured - error with recovery</h2>
          <p>Opens in error state. Retry recovers after 1 s.</p>
          <ButtonDropdown
            items={errorItems}
            asyncLoadingProps={{
              statusType: errorStatus,
              loadingText: () => 'Loading actions...',
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
                  setErrorItems(flatSourceItems.slice(0, 8));
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
