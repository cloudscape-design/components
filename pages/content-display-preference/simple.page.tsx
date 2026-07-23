// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import ContentDisplayPreference, { ContentDisplayPreferenceProps } from '~components/content-display-preference';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

import ScreenshotArea from '../utils/screenshot-area';

const options: ContentDisplayPreferenceProps['options'] = [
  { id: 'id1', label: 'Distribution ID', alwaysVisible: true },
  { id: 'id2', label: 'Domain name' },
  { id: 'id3', label: 'Price class' },
  { id: 'id4', label: 'Origin' },
  { id: 'id5', label: 'Status' },
  { id: 'id6', label: 'State' },
];

const MAX_VISIBLE = 3;

const i18nStrings: ContentDisplayPreferenceProps.I18nStrings = {
  columnFilteringPlaceholder: 'Filter columns',
  columnFilteringAriaLabel: 'Filter columns',
  columnFilteringClearFilterText: 'Clear filter',
  columnFilteringNoMatchText: 'No columns match',
  columnFilteringCountText: count => `${count} ${count === 1 ? 'match' : 'matches'}`,
};

export default function ContentDisplayPreferencePage() {
  const [value, setValue] = useState<ContentDisplayPreferenceProps['value']>([
    { id: 'id1', visible: true },
    { id: 'id2', visible: true },
    { id: 'id3', visible: true },
    { id: 'id4', visible: false },
    { id: 'id5', visible: false },
    { id: 'id6', visible: false },
  ]);

  const visibleCount = (value ?? []).filter(item => item.visible).length;
  const limitReached = visibleCount >= MAX_VISIBLE;

  return (
    <ScreenshotArea>
      <Box padding="l">
        <h1>Standalone ContentDisplayPreference</h1>
        <SpaceBetween size="m">
          <Box>
            Reacts to changes immediately (no confirm step). This example rejects turning on more than {MAX_VISIBLE}{' '}
            columns.
          </Box>
          {limitReached ? (
            <StatusIndicator type="warning">
              Maximum of {MAX_VISIBLE} visible columns reached. Hide a column to enable another.
            </StatusIndicator>
          ) : (
            <StatusIndicator type="info">
              {visibleCount} of {MAX_VISIBLE} visible columns selected.
            </StatusIndicator>
          )}
          <div style={{ maxInlineSize: 400, border: '1px solid #d5dbdb', padding: 16, borderRadius: 8 }}>
            <ContentDisplayPreference
              title="Content display"
              description="Select and reorder the columns to display."
              options={options}
              value={value}
              enableColumnFiltering={true}
              i18nStrings={i18nStrings}
              dragHandleAriaLabel="Drag handle"
              liveAnnouncementDndStarted={(position, total) => `Picked up item at position ${position} of ${total}`}
              liveAnnouncementDndItemReordered={(initial, current, total) =>
                `Moving item to position ${current} of ${total} (was ${initial})`
              }
              liveAnnouncementDndItemCommitted={(initial, final, total) =>
                `Item moved from position ${initial} to position ${final} of ${total}`
              }
              liveAnnouncementDndDiscarded="Reordering canceled"
              onChange={event => {
                const nextVisible = event.detail.value.filter(item => item.visible).length;
                // Only accept the change if it does not exceed the maximum number of visible columns.
                if (nextVisible <= MAX_VISIBLE) {
                  setValue(event.detail.value);
                }
              }}
            />
          </div>
          <Box variant="code">{JSON.stringify(value)}</Box>
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
