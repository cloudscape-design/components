// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import { NonCancelableEventHandler } from '~components/internal/events';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { useOptionsLoader } from '../common/options-loader';

type StatusType = ButtonDropdownProps.AsyncLoadingStatusType;

type Scenario = 'flat' | 'groups' | 'paginated' | 'per-group' | 'error';

type PageContext = React.Context<
  AppContextType<{
    scenario: Scenario;
    expandToViewport: boolean;
    flatStatus: StatusType;
    flatItems: string;
    groupAStatus: StatusType;
    groupAItems: string;
    groupBStatus: StatusType;
    groupBItems: string;
  }>
>;

const SCENARIO_OPTIONS: { value: Scenario; label: string }[] = [
  { value: 'flat', label: 'Flat list, configurable status' },
  { value: 'groups', label: 'Expandable groups, configurable status' },
  { value: 'paginated', label: 'Flat list, paginated with manual filtering' },
  { value: 'per-group', label: 'Expandable groups, loaded on expand' },
  { value: 'error', label: 'Error with recovery' },
];

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

const ALL_ITEMS: ButtonDropdownProps.Item[] = Array.from({ length: 12 }, (_, i) => ({
  id: `action-${i + 1}`,
  text: `Action ${i + 1}`,
  secondaryText: i % 3 === 0 ? `Description for action ${i + 1}` : undefined,
}));

const GROUP_ITEMS: ButtonDropdownProps.Item[] = Array.from({ length: 6 }, (_, i) => ({
  id: `sub-${i + 1}`,
  text: `Sub-action ${i + 1}`,
}));

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

// Long enough to inspect the loading state and for integration tests to assert on it.
const FETCH_DELAY_MS = 5000;

function fetchGroupItems(groupId: string): Promise<ButtonDropdownProps.Item[]> {
  if (groupId === 'group-files') {
    return new Promise(resolve => setTimeout(() => resolve(groupSourceItems['group-files']), FETCH_DELAY_MS));
  }
  if (groupId === 'group-edit') {
    return new Promise((_, reject) => setTimeout(() => reject(new Error('Server error')), FETCH_DELAY_MS));
  }
  return new Promise(() => {});
}

const groupTexts: ButtonDropdownProps.AsyncLoadingProps = {
  loadingText: (gid?: string) => `Loading ${gid ?? 'items'}...`,
  errorText: (gid?: string) => `Failed to load ${gid ?? 'items'}.`,
  recoveryText: 'Retry',
  errorIconAriaLabel: 'Error',
  finishedText: (gid?: string) => `End of ${gid ?? 'results'}`,
  empty: (gid?: string) => `No items in ${gid ?? 'group'}.`,
};

export default function ButtonDropdownAsyncLoadingPage() {
  // Page configuration lives in the URL so that every scenario and status/items combination is directly
  // linkable and targetable by integration tests. Fetched results below stay in local state.
  const {
    urlParams: {
      scenario = 'flat',
      expandToViewport = false,
      flatStatus = 'loading',
      flatItems: flatItemsPreset = 'none',
      groupAStatus = 'loading',
      groupAItems: groupAPreset = 'none',
      groupBStatus = 'error',
      groupBItems: groupBPreset = 'none',
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const onItemClick = (e: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log('clicked', e.detail.id);
  const logLoadItems: NonCancelableEventHandler<ButtonDropdownProps.LoadItemsDetail> = ({ detail }) =>
    console.log('onLoadItems', detail);

  // Scenario "paginated"
  const {
    items: paginatedItems,
    status: paginatedStatus,
    filteringText: paginatedFilteringText,
    fetchItems,
  } = useOptionsLoader<ButtonDropdownProps.Item>({ pageSize: 10, timeout: FETCH_DELAY_MS });

  // Scenario "per-group"
  const [groupItems, setGroupItems] = useState<Record<string, ButtonDropdownProps.Item[]>>({});
  const [groupStatuses, setGroupStatuses] = useState<Record<string, StatusType>>({});

  // Scenario "error"
  const [errorStatus, setErrorStatus] = useState<StatusType>('error');
  const [errorItems, setErrorItems] = useState<ButtonDropdownProps.Items>([]);

  const statusSelect = (label: string, value: StatusType, onChange: (value: StatusType) => void) => (
    <FormField label={label}>
      <Select
        selectedOption={STATUS_OPTIONS.find(o => o.value === value) ?? null}
        onChange={e => onChange(e.detail.selectedOption.value as StatusType)}
        options={STATUS_OPTIONS}
      />
    </FormField>
  );
  const itemsSelect = (label: string, value: string, onChange: (value: string) => void) => (
    <FormField label={label}>
      <Select
        selectedOption={ITEMS_OPTIONS.find(o => o.value === value) ?? null}
        onChange={e => onChange(e.detail.selectedOption.value!)}
        options={ITEMS_OPTIONS}
      />
    </FormField>
  );

  const commonProps = { expandToViewport, onItemClick };

  let content: React.ReactNode = null;
  switch (scenario) {
    case 'flat':
      content = (
        <ButtonDropdown
          {...commonProps}
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
          onLoadItems={logLoadItems}
        >
          Actions
        </ButtonDropdown>
      );
      break;
    case 'groups':
      content = (
        <ButtonDropdown
          {...commonProps}
          items={
            [
              { id: 'group-a', text: 'Group A', items: itemsFromPreset(groupAPreset, GROUP_ITEMS) },
              { id: 'group-b', text: 'Group B', items: itemsFromPreset(groupBPreset, GROUP_ITEMS) },
            ] as ButtonDropdownProps.Items
          }
          expandableGroups={true}
          asyncLoadingProps={groupTexts}
          getExpandableItemsAsyncLoadingState={({ item }) => {
            if (item.id === 'group-a') {
              return groupAStatus;
            }
            if (item.id === 'group-b') {
              return groupBStatus;
            }
            return null;
          }}
          onLoadItems={logLoadItems}
        >
          Instance actions
        </ButtonDropdown>
      );
      break;
    case 'paginated':
      content = (
        <ButtonDropdown
          {...commonProps}
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
          filteringResultsText={(matchesCount, totalCount) =>
            paginatedStatus === 'pending' ? `${matchesCount}+ results` : `${matchesCount} of ${totalCount}`
          }
          onLoadItems={({ detail: { firstPage, filteringText } }) => {
            const normalized = filteringText.toLowerCase();
            const filtered = flatSourceItems.filter(item => (item.text ?? '').toLowerCase().includes(normalized));
            fetchItems({ firstPage, filteringText, sourceItems: filtered });
          }}
        >
          Async actions
        </ButtonDropdown>
      );
      break;
    case 'per-group':
      content = (
        <ButtonDropdown
          {...commonProps}
          items={
            [
              { id: 'group-files', text: 'File (loads successfully)', items: groupItems['group-files'] ?? [] },
              { id: 'group-edit', text: 'Edit (always errors)', items: groupItems['group-edit'] ?? [] },
              { id: 'group-view', text: 'View (loading forever)', items: groupItems['group-view'] ?? [] },
            ] as ButtonDropdownProps.Items
          }
          expandableGroups={true}
          asyncLoadingProps={groupTexts}
          getExpandableItemsAsyncLoadingState={({ item }) => (item.id ? (groupStatuses[item.id] ?? null) : null)}
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
      );
      break;
    case 'error':
      content = (
        <ButtonDropdown
          {...commonProps}
          items={errorItems}
          asyncLoadingProps={{
            statusType: errorStatus,
            loadingText: () => 'Loading actions...',
            errorText: () => 'Error fetching actions.',
            recoveryText: 'Retry',
            errorIconAriaLabel: 'Error',
            empty: () => 'No actions found',
          }}
          onLoadItems={({ detail: { samePage } }) => {
            if (samePage) {
              setErrorStatus('loading');
              setTimeout(() => {
                setErrorItems(flatSourceItems.slice(0, 8));
                setErrorStatus('finished');
              }, FETCH_DELAY_MS);
            } else {
              setErrorItems([]);
              setErrorStatus('error');
            }
          }}
        >
          Actions (error)
        </ButtonDropdown>
      );
      break;
  }

  return (
    <SimplePage
      title="ButtonDropdown async loading"
      settings={
        <SpaceBetween size="s" direction="horizontal">
          <FormField label="Scenario">
            <Select
              selectedOption={SCENARIO_OPTIONS.find(o => o.value === scenario) ?? null}
              onChange={e => setUrlParams({ scenario: e.detail.selectedOption.value as Scenario })}
              options={SCENARIO_OPTIONS}
            />
          </FormField>
          {scenario === 'flat' && (
            <>
              {statusSelect('statusType', flatStatus, value => setUrlParams({ flatStatus: value }))}
              {itemsSelect('items', flatItemsPreset, value => setUrlParams({ flatItems: value }))}
            </>
          )}
          {scenario === 'groups' && (
            <>
              {statusSelect('Group A - statusType', groupAStatus, value => setUrlParams({ groupAStatus: value }))}
              {itemsSelect('Group A - items', groupAPreset, value => setUrlParams({ groupAItems: value }))}
              {statusSelect('Group B - statusType', groupBStatus, value => setUrlParams({ groupBStatus: value }))}
              {itemsSelect('Group B - items', groupBPreset, value => setUrlParams({ groupBItems: value }))}
            </>
          )}
          <Checkbox checked={expandToViewport} onChange={e => setUrlParams({ expandToViewport: e.detail.checked })}>
            Expand to viewport
          </Checkbox>
        </SpaceBetween>
      }
    >
      {content}
    </SimplePage>
  );
}
