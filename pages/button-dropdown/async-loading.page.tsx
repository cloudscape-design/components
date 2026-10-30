// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

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
    delay: string;
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

const GROUP_A_ITEMS: ButtonDropdownProps.Item[] = Array.from({ length: 12 }, (_, i) => ({
  id: `group-a-sub-${i + 1}`,
  text: `Sub-action A${i + 1}`,
}));

const GROUP_B_ITEMS: ButtonDropdownProps.Item[] = Array.from({ length: 12 }, (_, i) => ({
  id: `group-b-sub-${i + 1}`,
  text: `Sub-action B${i + 1}`,
}));

const PRESET_COUNTS: Record<string, number> = { none: 0, some: 6, all: 12 };

function itemsFromPreset(preset: string, source: ButtonDropdownProps.Item[]): ButtonDropdownProps.Items {
  return source.slice(0, PRESET_COUNTS[preset] ?? 0);
}

const flatSourceItems: ButtonDropdownProps.Item[] = Array.from({ length: 25 }, (_, i) => ({
  id: `flat-action-${i + 1}`,
  text: `Action ${i + 1}`,
  secondaryText: i % 3 === 0 ? `Description for action ${i + 1}` : undefined,
}));

const groupSourceItems: Record<string, ButtonDropdownProps.Item[]> = {
  'group-files': Array.from({ length: 8 }, (_, i) => ({ id: `file-${i + 1}`, text: `File action ${i + 1}` })),
};

// Long enough to inspect the loading state when testing by hand.
const DEFAULT_DELAY_MS = 5000;

const DELAY_OPTIONS = [0, 500, 1000, 2000, 5000, 10000].map(ms => ({ value: String(ms), label: `${ms} ms` }));

function fetchGroupItems(groupId: string, delay: number): Promise<ButtonDropdownProps.Item[]> {
  if (groupId === 'group-files') {
    return new Promise(resolve => setTimeout(() => resolve(groupSourceItems['group-files']), delay));
  }
  if (groupId === 'group-edit') {
    return new Promise((_, reject) => setTimeout(() => reject(new Error('Server error')), delay));
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

interface ScenarioProps {
  expandToViewport: boolean;
}

interface DelayedScenarioProps extends ScenarioProps {
  delay: number;
}

const onItemClick = (e: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log('clicked', e.detail.id);
const logLoadItems: NonCancelableEventHandler<ButtonDropdownProps.LoadItemsDetail> = ({ detail }) =>
  console.log('onLoadItems', detail);

function FlatScenario({
  expandToViewport,
  flatStatus,
  flatItemsPreset,
}: ScenarioProps & { flatStatus: StatusType; flatItemsPreset: string }) {
  return (
    <ButtonDropdown
      expandToViewport={expandToViewport}
      onItemClick={onItemClick}
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
}

function GroupsScenario({
  expandToViewport,
  groupAStatus,
  groupAPreset,
  groupBStatus,
  groupBPreset,
}: ScenarioProps & { groupAStatus: StatusType; groupAPreset: string; groupBStatus: StatusType; groupBPreset: string }) {
  return (
    <ButtonDropdown
      expandToViewport={expandToViewport}
      onItemClick={onItemClick}
      items={
        [
          { id: 'group-a', text: 'Group A', items: itemsFromPreset(groupAPreset, GROUP_A_ITEMS) },
          { id: 'group-b', text: 'Group B', items: itemsFromPreset(groupBPreset, GROUP_B_ITEMS) },
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
}

function PaginatedScenario({ expandToViewport, delay }: DelayedScenarioProps) {
  const {
    items: paginatedItems,
    status: paginatedStatus,
    filteringText: paginatedFilteringText,
    fetchItems,
  } = useOptionsLoader<ButtonDropdownProps.Item>({ pageSize: 10, timeout: delay });
  return (
    <ButtonDropdown
      expandToViewport={expandToViewport}
      onItemClick={onItemClick}
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
}

function PerGroupScenario({ expandToViewport, delay }: DelayedScenarioProps) {
  const [groupItems, setGroupItems] = useState<Record<string, ButtonDropdownProps.Item[]>>({});
  const [groupStatuses, setGroupStatuses] = useState<Record<string, StatusType>>({});
  const groupRequestIds = useRef<Record<string, number>>({});
  return (
    <ButtonDropdown
      expandToViewport={expandToViewport}
      onItemClick={onItemClick}
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
        const requestId = (groupRequestIds.current[expandedGroupId] ?? 0) + 1;
        groupRequestIds.current[expandedGroupId] = requestId;
        const isLatest = () => groupRequestIds.current[expandedGroupId] === requestId;
        setGroupStatuses(prev => ({ ...prev, [expandedGroupId]: 'loading' }));
        fetchGroupItems(expandedGroupId, delay)
          .then(items => {
            if (isLatest()) {
              setGroupItems(prev => ({ ...prev, [expandedGroupId]: items }));
              setGroupStatuses(prev => ({ ...prev, [expandedGroupId]: 'finished' }));
            }
          })
          .catch(() => {
            if (isLatest()) {
              setGroupStatuses(prev => ({ ...prev, [expandedGroupId]: 'error' }));
            }
          });
      }}
    >
      Instance actions
    </ButtonDropdown>
  );
}

function ErrorScenario({ expandToViewport, delay }: DelayedScenarioProps) {
  const [errorStatus, setErrorStatus] = useState<StatusType>('error');
  const [errorItems, setErrorItems] = useState<ButtonDropdownProps.Items>([]);
  const errorRequestId = useRef(0);
  return (
    <ButtonDropdown
      expandToViewport={expandToViewport}
      onItemClick={onItemClick}
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
        const requestId = ++errorRequestId.current;
        if (samePage) {
          setErrorStatus('loading');
          setTimeout(() => {
            if (requestId !== errorRequestId.current) {
              return;
            }
            setErrorItems(flatSourceItems.slice(0, 8));
            setErrorStatus('finished');
          }, delay);
        } else {
          setErrorItems([]);
          setErrorStatus('error');
        }
      }}
    >
      Actions (error)
    </ButtonDropdown>
  );
}

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
      delay: delayParam = '',
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const delay = delayParam === '' ? DEFAULT_DELAY_MS : Math.max(0, Number(delayParam) || 0);
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
          {scenario !== 'flat' && scenario !== 'groups' && (
            <FormField label="Response delay">
              <Select
                selectedOption={DELAY_OPTIONS.find(o => o.value === String(delay)) ?? null}
                onChange={e => setUrlParams({ delay: e.detail.selectedOption.value! })}
                options={DELAY_OPTIONS}
              />
            </FormField>
          )}
          <Checkbox checked={expandToViewport} onChange={e => setUrlParams({ expandToViewport: e.detail.checked })}>
            Expand to viewport
          </Checkbox>
        </SpaceBetween>
      }
    >
      {scenario === 'flat' && (
        <FlatScenario expandToViewport={expandToViewport} flatStatus={flatStatus} flatItemsPreset={flatItemsPreset} />
      )}
      {scenario === 'groups' && (
        <GroupsScenario
          expandToViewport={expandToViewport}
          groupAStatus={groupAStatus}
          groupAPreset={groupAPreset}
          groupBStatus={groupBStatus}
          groupBPreset={groupBPreset}
        />
      )}
      {scenario === 'paginated' && <PaginatedScenario expandToViewport={expandToViewport} delay={delay} />}
      {scenario === 'per-group' && <PerGroupScenario expandToViewport={expandToViewport} delay={delay} />}
      {scenario === 'error' && <ErrorScenario expandToViewport={expandToViewport} delay={delay} />}
    </SimplePage>
  );
}
