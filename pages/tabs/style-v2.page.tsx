// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Tabs } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function TabsStyleV2Page() {
  const [activeTabId, setActiveTabId] = useState('first');

  return (
    <SimplePage title="Tabs with Style API v2" screenshotArea={{}}>
      <Tabs
        className={styles['styled-tabs']}
        activeTabId={activeTabId}
        variant="container"
        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
        tabs={[
          { id: 'first', label: 'Overview', content: 'Alternate color scheme for tabs.' },
          { id: 'second', label: 'Settings', content: 'Alternate settings view.' },
          { id: 'third', label: 'Analytics', content: 'Alternate analytics view.' },
          { id: 'disabled', label: 'Archived', content: '', disabled: true },
        ]}
      />
    </SimplePage>
  );
}
