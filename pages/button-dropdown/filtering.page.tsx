// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Checkbox } from '~components';
import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { useOptionsLoader } from '../common/options-loader';

import styles from './styles.scss';

const flatItems: ButtonDropdownProps['items'] = [
  { id: 'cut', text: 'Cut', labelTag: 'Ctrl+X' },
  { id: 'copy', text: 'Copy', labelTag: 'Ctrl+C' },
  { id: 'paste', text: 'Paste', labelTag: 'Ctrl+V' },
  { id: 'undo', text: 'Undo', labelTag: 'Ctrl+Z' },
  { id: 'redo', text: 'Redo', labelTag: 'Ctrl+Y' },
  { id: 'select-all', text: 'Select all', labelTag: 'Ctrl+A' },
  { id: 'find', text: 'Find and replace', secondaryText: 'Search within document', labelTag: 'Ctrl+H' },
  { id: 'preferences', text: 'Preferences', secondaryText: 'Configure editor settings' },
];

const groupedItems: ButtonDropdownProps['items'] = [
  {
    text: 'File',
    items: [
      { id: 'new', text: 'New file' },
      { id: 'open', text: 'Open file', secondaryText: 'Open an existing file' },
      { id: 'save', text: 'Save', labelTag: 'Ctrl+S' },
      { id: 'save-as', text: 'Save as...', labelTag: 'Ctrl+Shift+S' },
      { id: 'export', text: 'Export', secondaryText: 'Export to different format' },
    ],
  },
  {
    text: 'Edit',
    items: [
      { id: 'cut', text: 'Cut', labelTag: 'Ctrl+X' },
      { id: 'copy', text: 'Copy', labelTag: 'Ctrl+C' },
      { id: 'paste', text: 'Paste', labelTag: 'Ctrl+V' },
      { id: 'find', text: 'Find and replace', labelTag: 'Ctrl+H' },
    ],
  },
  {
    text: 'View',
    items: [
      { id: 'zoom-in', text: 'Zoom in', labelTag: 'Ctrl++' },
      { id: 'zoom-out', text: 'Zoom out', labelTag: 'Ctrl+-' },
      { id: 'fullscreen', text: 'Fullscreen', labelTag: 'F11' },
      { id: 'sidebar', text: 'Toggle sidebar' },
    ],
  },
];

const expandableGroupedItems: ButtonDropdownProps['items'] = [
  { id: 'connect', text: 'Connect', secondaryText: 'Connect to instance' },
  { id: 'password', text: 'Get password' },
  {
    id: 'instance-state',
    text: 'Instance state',
    items: [
      { id: 'start', text: 'Start' },
      { id: 'stop', text: 'Stop', disabled: true, disabledReason: 'Instance is already stopped' },
      { id: 'hibernate', text: 'Hibernate' },
      { id: 'reboot', text: 'Reboot' },
      { id: 'terminate', text: 'Terminate', secondaryText: 'Permanently delete instance' },
    ],
  },
  {
    id: 'networking',
    text: 'Networking',
    items: [
      { id: 'attach-eni', text: 'Attach network interface' },
      { id: 'detach-eni', text: 'Detach network interface' },
      { id: 'manage-ip', text: 'Manage IP addresses' },
      { id: 'elastic-ip', text: 'Associate Elastic IP address' },
    ],
  },
  {
    id: 'security',
    text: 'Security',
    items: [
      { id: 'change-sg', text: 'Change security groups' },
      { id: 'modify-iam', text: 'Modify IAM role' },
    ],
  },
];

const expandableWithRegularGroups: ButtonDropdownProps['items'] = [
  { id: 'connect', text: 'Connect', secondaryText: 'Connect to instance' },
  {
    id: 'instance-state',
    text: 'Instance state',
    items: [
      { id: 'start', text: 'Start' },
      { id: 'stop', text: 'Stop', disabled: true, disabledReason: 'Instance is already stopped' },
      { id: 'reboot', text: 'Reboot' },
    ],
  },
  {
    id: 'monitoring',
    text: 'Monitoring and troubleshooting',
    items: [
      {
        text: 'CloudWatch',
        items: [
          { id: 'detailed-monitoring', text: 'Enable detailed monitoring' },
          { id: 'view-metrics', text: 'View CloudWatch metrics' },
        ],
      },
      {
        text: 'Diagnostics',
        items: [
          { id: 'system-log', text: 'Get system log' },
          { id: 'screenshot', text: 'Get instance screenshot' },
        ],
      },
    ],
  },
  {
    id: 'networking',
    text: 'Networking',
    items: [
      {
        text: 'Interfaces',
        items: [
          { id: 'attach-eni', text: 'Attach network interface' },
          { id: 'detach-eni', text: 'Detach network interface' },
        ],
      },
      {
        text: 'IP addresses',
        items: [
          { id: 'manage-ip', text: 'Manage IP addresses' },
          { id: 'elastic-ip', text: 'Associate Elastic IP address' },
        ],
      },
    ],
  },
];

const withDisabledItems: ButtonDropdownProps['items'] = [
  { id: 'create', text: 'Create resource' },
  { id: 'update', text: 'Update resource' },
  { id: 'delete', text: 'Delete resource', disabled: true, disabledReason: 'Resource is protected' },
  { id: 'clone', text: 'Clone resource' },
  { id: 'archive', text: 'Archive resource', disabled: true },
];

const withCheckboxItems: ButtonDropdownProps['items'] = [
  { id: 'action-1', text: 'Run build' },
  { id: 'action-2', text: 'Deploy' },
  { itemType: 'checkbox', id: 'notifications', text: 'Notifications', checked: true },
  { itemType: 'checkbox', id: 'auto-deploy', text: 'Auto-deploy on commit', checked: false },
  { itemType: 'checkbox', id: 'verbose-logs', text: 'Verbose logging', checked: true },
];

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

type PageContext = React.Context<
  AppContextType<{
    fakeResponses?: boolean;
  }>
>;

export default function ButtonDropdownFilteringPage() {
  const [expandToViewport, setExpandToViewport] = useState(false);

  const {
    urlParams: { fakeResponses = true },
  } = useContext(AppContext as PageContext);

  const [checkboxItems, setCheckboxItems] = useState(withCheckboxItems);
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
    <SimplePage title="Button dropdown with filtering">
      <SpaceBetween size="xl">
        <Checkbox
          checked={expandToViewport}
          onChange={event => setExpandToViewport(event.detail.checked)}
          data-testid="expand-to-viewport"
        >
          Expand to viewport
        </Checkbox>

        <div className={styles.container}>
          <h2>Flat items</h2>
          <ButtonDropdown
            id="filtering-flat"
            data-testid="filtering-flat"
            items={flatItems}
            filteringType="auto"
            filteringPlaceholder="Search actions"
            filteringAriaLabel="Filter actions"
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={onItemClick}
          >
            Actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Grouped items (non-expandable)</h2>
          <ButtonDropdown
            data-testid="filtering-grouped"
            items={groupedItems}
            filteringType="auto"
            filteringPlaceholder="Search menu"
            filteringAriaLabel="Filter menu items"
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={onItemClick}
          >
            Menu
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Expandable groups (collapse to flat when searching)</h2>
          <ButtonDropdown
            data-testid="filtering-expandable"
            items={expandableGroupedItems}
            expandableGroups={true}
            filteringType="auto"
            filteringPlaceholder="Search instance actions"
            filteringAriaLabel="Filter instance actions"
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={onItemClick}
          >
            Instance actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Expandable groups containing regular (nested) groups</h2>
          <ButtonDropdown
            data-testid="filtering-expandable-with-groups"
            items={expandableWithRegularGroups}
            expandableGroups={true}
            filteringType="auto"
            filteringPlaceholder="Search instance actions"
            filteringAriaLabel="Filter instance actions"
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={onItemClick}
          >
            Instance actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>With disabled items and disabled reasons</h2>
          <ButtonDropdown
            data-testid="filtering-disabled"
            items={withDisabledItems}
            filteringType="auto"
            filteringPlaceholder="Search actions"
            filteringAriaLabel="Filter actions"
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={onItemClick}
          >
            Resource actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>With checkbox items</h2>
          <ButtonDropdown
            data-testid="filtering-checkboxes"
            items={checkboxItems}
            filteringType="auto"
            filteringPlaceholder="Search"
            filteringAriaLabel="Filter items"
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={event => {
              onItemClick(event);
              if (event.detail.checked !== undefined) {
                setCheckboxItems(prev =>
                  prev.map(item => (item.id === event.detail.id ? { ...item, checked: event.detail.checked! } : item))
                );
              }
            }}
          >
            Pipeline
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Custom empty state</h2>
          <ButtonDropdown
            data-testid="filtering-custom-empty"
            items={flatItems}
            filteringType="auto"
            filteringPlaceholder="Search actions"
            filteringAriaLabel="Filter actions"
            noMatch={<span>No actions match your search. Try a different keyword.</span>}
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={onItemClick}
          >
            Actions (custom empty)
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Split button (with main action) and filtering</h2>
          <ButtonDropdown
            data-testid="filtering-split-button"
            items={expandableGroupedItems}
            expandableGroups={true}
            variant="primary"
            mainAction={{ text: 'Launch instance', onClick: () => void 0 }}
            filteringType="auto"
            filteringPlaceholder="Search instance actions"
            filteringAriaLabel="Filter instance actions"
            ariaLabel="Instance actions"
            expandToViewport={expandToViewport}
            filteringResultsText={filteringResultsText}
            onItemClick={onItemClick}
          />
        </div>

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
              fetchItems({ firstPage, filteringText, sourceItems: fakeResponses ? filtered : undefined });
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
