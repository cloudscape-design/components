// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { SegmentedControl, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2SegmentedControlPage() {
  const [selectedId, setSelectedId] = useState('seg-1');

  return (
    <SimplePage title="SegmentedControl with Style API v2" screenshotArea={{}}>
      <SpaceBetween size="l">
        <SegmentedControl
          selectedId={selectedId}
          onChange={({ detail }) => setSelectedId(detail.selectedId)}
          options={[
            { text: 'Overview', iconName: 'view-full', id: 'seg-1' },
            { text: 'Details', iconName: 'file', id: 'seg-2' },
            { text: 'Metrics', iconName: 'status-positive', id: 'seg-3' },
            { text: 'Disabled', iconName: 'lock-private', id: 'seg-4', disabled: true },
          ]}
          classNames={{ root: styles['styled-segmented-control'] }}
        />
        <SegmentedControl
          selectedId={selectedId}
          onChange={({ detail }) => setSelectedId(detail.selectedId)}
          options={[
            { text: 'Overview', iconName: 'view-full', id: 'seg-1' },
            { text: 'Details', iconName: 'file', id: 'seg-2' },
            { text: 'Metrics', iconName: 'status-positive', id: 'seg-3' },
            { text: 'Disabled', iconName: 'lock-private', id: 'seg-4', disabled: true },
          ]}
          classNames={{ root: styles['square-segmented-control'] }}
        />
      </SpaceBetween>
    </SimplePage>
  );
}
