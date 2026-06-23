// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';

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

export default function ButtonDropdownFilteringPage() {
  const [checkboxItems, setCheckboxItems] = React.useState(withCheckboxItems);
  const onItemClick = (event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => console.log(event.detail);

  return (
    <article>
      <h1>Button Dropdown with Filtering</h1>

      <SpaceBetween size="xl">
        <div className={styles.container}>
          <h2>Flat items</h2>
          <ButtonDropdown
            id="filtering-flat"
            items={flatItems}
            filteringType="auto"
            filteringPlaceholder="Search actions"
            filteringAriaLabel="Filter actions"
            ariaLabel="Editor actions"
            onItemClick={onItemClick}
          >
            Actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Grouped items (non-expandable)</h2>
          <ButtonDropdown
            id="filtering-grouped"
            items={groupedItems}
            filteringType="auto"
            filteringPlaceholder="Search menu"
            filteringAriaLabel="Filter menu items"
            ariaLabel="Application menu"
            onItemClick={onItemClick}
          >
            Menu
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Expandable groups (collapse to flat when searching)</h2>
          <ButtonDropdown
            id="filtering-expandable"
            items={expandableGroupedItems}
            expandableGroups={true}
            filteringType="auto"
            filteringPlaceholder="Search instance actions"
            filteringAriaLabel="Filter instance actions"
            ariaLabel="Instance actions"
            onItemClick={onItemClick}
          >
            Instance actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Expandable groups containing regular (nested) groups</h2>
          <ButtonDropdown
            id="filtering-expandable-with-groups"
            items={expandableWithRegularGroups}
            expandableGroups={true}
            filteringType="auto"
            filteringPlaceholder="Search instance actions"
            filteringAriaLabel="Filter instance actions"
            ariaLabel="Instance actions"
            onItemClick={onItemClick}
          >
            Instance actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>With disabled items and disabled reasons</h2>
          <ButtonDropdown
            id="filtering-disabled"
            items={withDisabledItems}
            filteringType="auto"
            filteringPlaceholder="Search actions"
            filteringAriaLabel="Filter actions"
            ariaLabel="Resource actions"
            onItemClick={onItemClick}
          >
            Resource actions
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>With checkbox items</h2>
          <ButtonDropdown
            id="filtering-checkboxes"
            items={checkboxItems}
            filteringType="auto"
            filteringPlaceholder="Search"
            filteringAriaLabel="Filter items"
            ariaLabel="Pipeline actions"
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
            id="filtering-custom-empty"
            items={flatItems}
            filteringType="auto"
            filteringPlaceholder="Search actions"
            filteringAriaLabel="Filter actions"
            noMatch={<span>No actions match your search. Try a different keyword.</span>}
            ariaLabel="Editor actions"
            onItemClick={onItemClick}
          >
            Actions (custom empty)
          </ButtonDropdown>
        </div>

        <div className={styles.container}>
          <h2>Split button (with main action) and filtering</h2>
          <ButtonDropdown
            id="filtering-split-button"
            items={expandableGroupedItems}
            expandableGroups={true}
            variant="primary"
            mainAction={{ text: 'Launch instance', onClick: () => void 0 }}
            filteringType="auto"
            filteringPlaceholder="Search instance actions"
            filteringAriaLabel="Filter instance actions"
            ariaLabel="Instance actions"
            onItemClick={onItemClick}
          />
        </div>
      </SpaceBetween>
    </article>
  );
}
