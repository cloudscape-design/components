// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import Box from '~components/box';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import Tooltip, { TooltipProps } from '~components/tooltip';

import { AppContextType } from '../app/app-context';
import AppContext from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    position?: TooltipProps.Position;
  }>
>;

export default function TriggerVariantsPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const position = urlParams.position ?? 'top';

  return (
    <SimplePage
      title="Tooltip trigger variants"
      screenshotArea={{}}
      settings={
        <FormField label="Position">
          <SegmentedControl
            selectedId={position}
            onChange={({ detail }) => setUrlParams({ position: detail.selectedId as TooltipProps.Position })}
            options={[
              { id: 'top', text: 'Top' },
              { id: 'right', text: 'Right' },
              { id: 'bottom', text: 'Bottom' },
              { id: 'left', text: 'Left' },
            ]}
          />
        </FormField>
      }
    >
      <SpaceBetween size="xl">
        <TruncationExample position={position} />
        <GroupExample position={position} />
        <VisuallyHiddenExample position={position} />
        <AnnouncementExample position={position} />
      </SpaceBetween>
    </SimplePage>
  );
}

function TruncationExample({ position }: { position: TooltipProps.Position }) {
  const [maxWidth, setMaxWidth] = useState('200');

  return (
    <SpaceBetween size="s">
      <Header variant="h2">truncation</Header>
      <Box variant="p">Tooltip only appears when the trigger text is truncated. Resize the max-width to test.</Box>
      <FormField label="Max width (px)">
        <Input value={maxWidth} onChange={({ detail }) => setMaxWidth(detail.value)} type="number" />
      </FormField>
      <ColumnLayout columns={1}>
        <div style={{ maxWidth: `${maxWidth}px` }}>
          <Tooltip
            content="Short text"
            trigger={<span>Short text</span>}
            triggerVariant="truncation"
            position={position}
          />
        </div>
        <div style={{ maxWidth: `${maxWidth}px` }}>
          <Tooltip
            content="This is a much longer piece of text that will definitely be truncated at smaller widths"
            trigger={
              <span>This is a much longer piece of text that will definitely be truncated at smaller widths</span>
            }
            triggerVariant="truncation"
            position={position}
          />
        </div>
        <div style={{ maxWidth: `${maxWidth}px` }}>
          <Tooltip
            content="arn:aws:iam::123456789012:role/my-very-long-role-name-that-exceeds-the-container-width"
            trigger={
              <span>arn:aws:iam::123456789012:role/my-very-long-role-name-that-exceeds-the-container-width</span>
            }
            triggerVariant="truncation"
            position={position}
          />
        </div>
      </ColumnLayout>
    </SpaceBetween>
  );
}

function GroupExample({ position }: { position: TooltipProps.Position }) {
  return (
    <SpaceBetween size="s">
      <Header variant="h2">group</Header>
      <Box variant="p">Tooltip shown on hover/focus. Content is role=group with aria-describedby.</Box>
      <SpaceBetween direction="horizontal" size="l">
        <Tooltip
          content="Status: Healthy"
          trigger={<Box variant="span">🟢 Instance i-0abc123</Box>}
          triggerVariant="group"
          position={position}
        />
        <Tooltip
          content="3 unresolved findings"
          trigger={<Box variant="span">⚠️ Security Hub</Box>}
          triggerVariant="group"
          position={position}
        />
        <Tooltip
          content="Last deployed 2 hours ago"
          trigger={<Box variant="span">📦 Production</Box>}
          triggerVariant="group"
          position={position}
        />
      </SpaceBetween>
    </SpaceBetween>
  );
}

function VisuallyHiddenExample({ position }: { position: TooltipProps.Position }) {
  return (
    <SpaceBetween size="s">
      <Header variant="h2">visually-hidden</Header>
      <Box variant="p">Tooltip shown on hover/focus. Content is visually hidden screen-reader only text.</Box>
      <SpaceBetween direction="horizontal" size="l">
        <Tooltip
          content="Status: Healthy"
          trigger={<Box variant="span">🟢 Instance i-0abc123</Box>}
          triggerVariant="visually-hidden"
          position={position}
        />
        <Tooltip
          content="3 unresolved findings"
          trigger={<Box variant="span">⚠️ Security Hub</Box>}
          triggerVariant="visually-hidden"
          position={position}
        />
        <Tooltip
          content="Last deployed 2 hours ago"
          trigger={<Box variant="span">📦 Production</Box>}
          triggerVariant="visually-hidden"
          position={position}
        />
      </SpaceBetween>
    </SpaceBetween>
  );
}

function AnnouncementExample({ position }: { position: TooltipProps.Position }) {
  return (
    <SpaceBetween size="s">
      <Header variant="h2">announcement</Header>
      <Box variant="p">Tooltip shown on hover/focus. Content is announced via LiveRegion for screen readers.</Box>
      <SpaceBetween direction="horizontal" size="l">
        <Tooltip
          content="Copy to clipboard"
          trigger={<Box variant="span">📋</Box>}
          triggerVariant="announcement"
          position={position}
        />
        <Tooltip
          content="Open settings"
          trigger={<Box variant="span">⚙️</Box>}
          triggerVariant="announcement"
          position={position}
        />
        <Tooltip
          content="View notifications"
          trigger={<Box variant="span">🔔</Box>}
          triggerVariant="announcement"
          position={position}
        />
      </SpaceBetween>
    </SpaceBetween>
  );
}
