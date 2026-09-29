// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { useOptionsLoader } from '../common/options-loader';

type StatusType = ButtonDropdownProps.AsyncLoadingStatusType;

type PageContext = React.Context<
  AppContextType<{
    fakeResponses?: boolean;
    randomErrors?: boolean;
    expandToViewport?: boolean;
  }>
>;

// ---- Fake server data: EC2 instance actions ----

const ACTION_NAMES = [
  'Connect',
  'Start instance',
  'Stop instance',
  'Reboot instance',
  'Hibernate instance',
  'Terminate instance',
  'Change instance type',
  'Change termination protection',
  'Change stop protection',
  'Change shutdown behavior',
  'Modify user data',
  'Modify IAM role',
  'Modify instance placement',
  'Modify capacity reservation settings',
  'Edit auto-recovery behavior',
  'Manage tags',
  'Manage detailed monitoring',
  'Attach to Auto Scaling group',
  'Launch more like this',
  'Create image',
  'Create template from instance',
  'Get system log',
  'Get instance screenshot',
  'Get Windows password',
  'Replace root volume',
  'Attach network interface',
  'Detach network interface',
  'Manage IP addresses',
  'Change security groups',
  'Change source/destination check',
];

const flatActions: ButtonDropdownProps.Item[] = ACTION_NAMES.map((text, index) => ({
  id: `action-${index + 1}`,
  text,
  secondaryText: index % 4 === 0 ? `Applies to the selected instance` : undefined,
  disabled: index === 5,
  disabledReason: index === 5 ? 'Termination protection is enabled' : undefined,
}));

const GROUPS = {
  networking: 'Networking (loads, may fail randomly)',
  storage: 'Storage (always fails)',
  monitoring: 'Monitoring (loads forever)',
  tags: 'Tags (loads empty)',
} as const;
type GroupId = keyof typeof GROUPS;

const groupSource: Record<GroupId, ButtonDropdownProps.Item[]> = {
  networking: [
    'Attach network interface',
    'Detach network interface',
    'Manage IP addresses',
    'Change security groups',
    'Change source/destination check',
    'Associate Elastic IP',
    'Disassociate Elastic IP',
  ].map((text, i) => ({ id: `networking-${i + 1}`, text })),
  storage: [],
  monitoring: [],
  tags: [],
};

// ---- Per-group fake loader ----

interface GroupLoaderConfig {
  delay: number; // Infinity = never resolves
  failRate: number; // 0..1
}

function useGroupLoader(groupId: GroupId, { delay, failRate }: GroupLoaderConfig) {
  const [items, setItems] = useState<ButtonDropdownProps.Item[]>([]);
  const [status, setStatus] = useState<StatusType>('pending');
  const requestId = useRef(0);

  function load({ samePage }: { samePage: boolean }) {
    const id = ++requestId.current;
    if (!samePage) {
      setItems([]);
    }
    setStatus('loading');
    if (!isFinite(delay)) {
      return;
    }
    setTimeout(() => {
      if (id !== requestId.current) {
        return;
      }
      if (Math.random() < failRate) {
        setStatus('error');
      } else {
        setItems(groupSource[groupId]);
        setStatus('finished');
      }
    }, delay);
  }

  return { items, status, load };
}

export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const { fakeResponses = true, randomErrors = true, expandToViewport = false } = urlParams;

  // Root list: paginated, server-side filtered, random errors (same loader as Select/Multiselect pages).
  const root = useOptionsLoader<ButtonDropdownProps.ItemOrGroup>({ pageSize: 10, timeout: 5000, randomErrors });

  // Groups: one loader each so every group state is reachable on demand.
  const groups: Record<GroupId, ReturnType<typeof useGroupLoader>> = {
    networking: useGroupLoader('networking', { delay: 5000, failRate: randomErrors ? 0.3 : 0 }),
    storage: useGroupLoader('storage', { delay: 5000, failRate: 1 }),
    monitoring: useGroupLoader('monitoring', { delay: Infinity, failRate: 0 }),
    tags: useGroupLoader('tags', { delay: 5000, failRate: 0 }),
  };

  // Groups are part of the "server" response so they paginate and filter like everything else.
  const allItems: ButtonDropdownProps.ItemOrGroup[] = [
    ...flatActions.slice(0, 4),
    ...(Object.keys(GROUPS) as GroupId[]).map(id => ({ id, text: GROUPS[id], items: [] })),
    ...flatActions.slice(4),
  ];

  // Group items live in their own loaders, so merge them in at render time.
  const items: ButtonDropdownProps.Items = root.items.map(item =>
    item.id && item.id in groups ? { ...item, items: groups[item.id as GroupId].items } : item
  );

  function filteringResultsText(matchesCount: number, totalCount: number) {
    if (root.status === 'pending') {
      return `${matchesCount}+ results`;
    }
    if (root.status === 'finished') {
      return `${matchesCount} out of ${totalCount} results`;
    }
    return '';
  }

  return (
    <SimplePage
      title="Button dropdown: asynchronously fetched actions"
      settings={
        <SpaceBetween size="s" direction="horizontal">
          <Checkbox checked={fakeResponses} onChange={e => setUrlParams({ fakeResponses: e.detail.checked })}>
            Fake responses (off: requests stay pending for integ tests)
          </Checkbox>
          <Checkbox checked={randomErrors} onChange={e => setUrlParams({ randomErrors: e.detail.checked })}>
            Random errors (30%)
          </Checkbox>
          <Checkbox checked={expandToViewport} onChange={e => setUrlParams({ expandToViewport: e.detail.checked })}>
            Expand to viewport
          </Checkbox>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="m">
        <ButtonDropdown
          items={items}
          expandableGroups={true}
          expandToViewport={expandToViewport}
          filteringType="manual"
          filteringPlaceholder="Find action"
          filteringAriaLabel="Filter actions"
          filteringResultsText={filteringResultsText}
          noMatch="No actions match the filter"
          asyncLoadingProps={{
            statusType: root.status,
            loadingText: groupId => (groupId ? `Loading ${groupId} actions` : 'Loading actions'),
            errorText: groupId => (groupId ? `Error fetching ${groupId} actions.` : 'Error fetching actions.'),
            recoveryText: 'Retry',
            errorIconAriaLabel: 'Error',
            finishedText: groupId =>
              groupId
                ? `End of ${groupId} actions`
                : root.filteringText
                  ? `End of "${root.filteringText}" results`
                  : 'End of all actions',
            empty: groupId => (groupId ? `No ${groupId} actions` : 'No actions available'),
          }}
          getExpandableItemsAsyncLoadingState={({ item }) =>
            item.id && item.id in groups ? groups[item.id as GroupId].status : null
          }
          onLoadItems={({ detail: { firstPage, filteringText, samePage, expandedGroupId } }) => {
            if (expandedGroupId) {
              if (expandedGroupId in groups) {
                groups[expandedGroupId as GroupId].load({ samePage });
              }
              return;
            }
            const normalized = filteringText.toLowerCase();
            const filtered = allItems.filter(item => (item.text ?? '').toLowerCase().includes(normalized));
            root.fetchItems({ firstPage, filteringText, sourceItems: fakeResponses ? filtered : undefined });
          }}
          onItemClick={({ detail }) => console.log('onItemClick', detail)}
        >
          Instance actions
        </ButtonDropdown>
      </SpaceBetween>
    </SimplePage>
  );
}
