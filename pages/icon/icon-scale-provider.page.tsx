// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '~components/alert';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup from '~components/button-group';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Icon from '~components/icon';
import IconProvider from '~components/icon-provider';
import Link from '~components/link';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import TextFilter from '~components/text-filter';
import Toggle from '~components/toggle';

import ScreenshotArea from '../utils/screenshot-area';

const flashbarItems: FlashbarProps.MessageDefinition[] = [
  {
    type: 'warning',
    dismissible: true,
    dismissLabel: 'Dismiss',
    statusIconAriaLabel: 'Warning',
    header: 'High memory usage detected',
    id: 'flash-warning',
  },
  {
    type: 'info',
    dismissible: true,
    dismissLabel: 'Dismiss',
    statusIconAriaLabel: 'Info',
    header: 'New feature available',
    content: 'Check out the new dashboard improvements.',
    id: 'flash-info',
  },
];

function DemoContent({ label }: { label: string }) {
  const [filteringText, setFilteringText] = useState('');
  const [selectedSegmentId, setSelectedSegmentId] = useState('seg-1');

  return (
    <section>
      <Box variant="h2">{label}</Box>
      <SpaceBetween size="s">
        <SpaceBetween size="xs">
          <StatusIndicator type="success">Deployment succeeded</StatusIndicator>
          <StatusIndicator type="error">Build failed</StatusIndicator>
          <StatusIndicator type="warning">High memory usage</StatusIndicator>
          <StatusIndicator type="info">Update available</StatusIndicator>
          <StatusIndicator type="pending">Awaiting approval</StatusIndicator>
          <StatusIndicator type="in-progress">Deploying</StatusIndicator>
          <StatusIndicator type="stopped">Instance stopped</StatusIndicator>
        </SpaceBetween>
        <SpaceBetween size="xs" direction="horizontal" alignItems="center">
          <Icon name="settings" />
          <Icon name="search" />
          <Icon name="notification" />
          <Icon name="lock-private" />
          <Icon name="gen-ai" />
        </SpaceBetween>
        <SpaceBetween size="xs" direction="horizontal" alignItems="center">
          <Button iconName="settings">Settings</Button>
          <Button iconName="download" variant="primary">
            Download
          </Button>
          <Button iconName="add-plus" variant="link">
            Add item
          </Button>
          <Button iconName="refresh" variant="icon" ariaLabel="Refresh" />
        </SpaceBetween>
        <ButtonGroup
          ariaLabel="Actions"
          variant="icon"
          items={[
            { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy' },
            { type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' },
            { type: 'icon-button', id: 'delete', iconName: 'remove', text: 'Delete' },
            { type: 'icon-button', id: 'share', iconName: 'share', text: 'Share' },
          ]}
        />
        <SegmentedControl
          selectedId={selectedSegmentId}
          onChange={({ detail }) => setSelectedSegmentId(detail.selectedId)}
          label="View mode"
          options={[
            { id: 'seg-1', iconName: 'view-full', text: 'Full' },
            { id: 'seg-2', iconName: 'view-horizontal', text: 'Horizontal' },
            { id: 'seg-3', iconName: 'view-vertical', text: 'Vertical' },
          ]}
        />
        <Alert type="info" dismissible={true}>
          This is an info alert with a dismiss icon.
        </Alert>
        <Alert statusIconAriaLabel="Info" header="Known issues">
          Review the documentation for compatibility details.
        </Alert>
        <SpaceBetween size="xs">
          <div>
            <Link href="#" external={true}>
              External link (primary)
            </Link>
          </div>
          <div>
            <Link href="#" external={true} variant="secondary">
              External link (secondary)
            </Link>
          </div>
          <div>
            Visit the{' '}
            <Link href="#" external={true}>
              documentation
            </Link>{' '}
            for more details.
          </div>
        </SpaceBetween>
        <TextFilter
          filteringText={filteringText}
          filteringAriaLabel="Filter items"
          onChange={({ detail }) => setFilteringText(detail.filteringText)}
        />
        <Flashbar items={flashbarItems} />
        <ButtonDropdown
          items={[
            { id: 'start', text: 'Start' },
            { id: 'stop', text: 'Stop' },
            { id: 'terminate', text: 'Terminate' },
          ]}
        >
          Actions
        </ButtonDropdown>
      </SpaceBetween>
    </section>
  );
}

export default function IconScaleProviderScenario() {
  const [useLongText, setUseLongText] = useState(false);

  return (
    <ScreenshotArea>
      <h1>IconProvider per-variant pixel size (CSS transform: scale approach)</h1>

      <Toggle checked={useLongText} onChange={({ detail }) => setUseLongText(detail.checked)}>
        Toggle (placeholder)
      </Toggle>

      <SpaceBetween size="l">
        {/* Baseline: no overrides */}
        <DemoContent label="No overrides (default sizes)" />

        {/* Scale normal icons to 12px (75% of 16px) */}
        <IconProvider icons={null} iconSizeNormal="12px">
          <DemoContent label='iconSizeNormal="12px" (scale 0.75)' />
        </IconProvider>

        {/* Scale normal to 12px AND inherit to 12px */}
        <IconProvider icons={null} iconSizeNormal="12px" iconSizeInherit="12px">
          <DemoContent label='iconSizeNormal="12px" iconSizeInherit="12px"' />
        </IconProvider>

        {/* Scale normal to 14px (~87.5% of 16px) */}
        <IconProvider icons={null} iconSizeNormal="14px" iconSizeInherit="13px">
          <DemoContent label='iconSizeNormal="14px" iconSizeInherit="13px"' />
        </IconProvider>

        {/* Scale up: normal to 24px (150% of 16px) */}
        <IconProvider icons={null} iconSizeNormal="32px">
          <DemoContent label='iconSizeNormal="24px" (scale 1.5)' />
        </IconProvider>

        {/* Nested: outer scales down, inner resets */}
        <IconProvider icons={null} iconSizeNormal="12px" iconSizeInherit="12px">
          <section>
            <Box variant="h2">Nested: outer 12px, inner resets (no override)</Box>
            <SpaceBetween size="s">
              <SpaceBetween size="xs">
                <StatusIndicator type="success">Scaled to 12px</StatusIndicator>
                <StatusIndicator type="error">Scaled to 12px</StatusIndicator>
              </SpaceBetween>
              <div>
                <Link href="#" external={true}>
                  External link scaled to 12px
                </Link>
              </div>

              {/* Inner provider with no iconSize* props inherits parent overrides */}
              <IconProvider icons={null}>
                <SpaceBetween size="xs">
                  <StatusIndicator type="success">Still 12px (inherited)</StatusIndicator>
                </SpaceBetween>
              </IconProvider>
            </SpaceBetween>
          </section>
        </IconProvider>

        {/* Only override inherit, leave normal alone */}
        <IconProvider icons={null} iconSizeInherit="10px">
          <section>
            <Box variant="h2">Only iconSizeInherit=&quot;10px&quot; (normal unchanged)</Box>
            <SpaceBetween size="s">
              <SpaceBetween size="xs">
                <StatusIndicator type="success">Normal size (unchanged)</StatusIndicator>
                <StatusIndicator type="error">Normal size (unchanged)</StatusIndicator>
              </SpaceBetween>
              <div>
                <Link href="#" external={true}>
                  External link icon scaled to 10px
                </Link>
              </div>
            </SpaceBetween>
          </section>
        </IconProvider>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
