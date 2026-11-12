// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { SpaceBetween, Tabs, TabsProps } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const tabs: TabsProps['tabs'] = [
  { id: 'overview', label: 'Overview', content: 'Overview content.' },
  { id: 'details', label: 'Details', content: 'Details content.', disabled: true },
  { id: 'history', label: 'History', content: 'History content.', dismissible: true, dismissLabel: 'Dismiss History' },
  { id: 'settings', label: 'Settings', content: 'Settings content.', action: <span>Beta</span> },
  { id: 'docs', label: 'Docs', content: 'Docs content.', href: '#docs' },
];

export default function () {
  const [activeId, setActiveId] = useState('overview');

  return (
    <SimplePage title="Tabs - Style API v2" screenshotArea={{ disableAnimations: true }}>
      <SpaceBetween size="l">
        <Tabs
          tabs={tabs}
          activeTabId={activeId}
          onChange={({ detail }) => setActiveId(detail.activeTabId)}
          {...{
            styleClassNames: {
              tabsHeader: styles.header,
              tab: ({ tab }: { tab: TabsProps.Tab }) =>
                clsx(tab.id === activeId ? styles['tab-active'] : styles.tab, tab.disabled && styles['tab-disabled']),
              tabLink: styles.link,
              dismissButton: styles['dismiss-btn'],
            },
          }}
        />
        <Tabs
          tabs={tabs}
          {...{
            styleClassNames: {
              tab: styles['tab-indicator'],
              tabLink: styles['link-wide'],
              content: styles['content-focus-ring'],
            },
          }}
        />
      </SpaceBetween>
    </SimplePage>
  );
}
