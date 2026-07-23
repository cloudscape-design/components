// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Select, SpaceBetween } from '~components';
import Tabs, { TabsProps } from '~components/tabs';

const manyTabs: Array<TabsProps.Tab> = Array.from({ length: 12 }, (_, i) => ({
  id: `tab-${i + 1}`,
  label: `Tab ${i + 1}`,
  content: `Content for Tab ${i + 1}`,
}));

const fewTabs: Array<TabsProps.Tab> = [
  { id: 'first', label: 'First tab', content: 'First tab content' },
  { id: 'second', label: 'Second tab', content: 'Second tab content' },
  { id: 'third', label: 'Third tab', content: 'Third tab content' },
];

export default function TabsOverflowPage() {
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [overflowBehavior, setOverflowBehavior] = useState<TabsProps.OverflowBehavior>('dropdown');

  return (
    <SpaceBetween size="l">
      <h1>Tabs — overflow behavior</h1>

      <Select
        options={[
          { value: 'scroll', label: 'scroll (default)' },
          { value: 'dropdown', label: 'dropdown' },
        ]}
        selectedOption={{ value: overflowBehavior }}
        onChange={e => setOverflowBehavior(e.detail.selectedOption.value as TabsProps.OverflowBehavior)}
        inlineLabelText="overflowBehavior"
      />

      <h2>Many tabs — overflow visible</h2>
      <div style={{ maxWidth: 400, border: '1px dashed #aaa', padding: 8 }}>
        <Tabs
          id="overflow-tabs"
          tabs={manyTabs}
          activeTabId={activeTabId}
          onChange={e => setActiveTabId(e.detail.activeTabId)}
          overflowBehavior={overflowBehavior}
          i18nStrings={{
            scrollLeftAriaLabel: 'Scroll left',
            scrollRightAriaLabel: 'Scroll right',
            overflowMenuAriaLabel: 'More tabs',
          }}
          ariaLabel="Overflow tabs demo"
        />
      </div>

      <h2>Few tabs — no overflow</h2>
      <div style={{ maxWidth: 600, border: '1px dashed #aaa', padding: 8 }}>
        <Tabs
          id="no-overflow-tabs"
          tabs={fewTabs}
          overflowBehavior={overflowBehavior}
          i18nStrings={{
            scrollLeftAriaLabel: 'Scroll left',
            scrollRightAriaLabel: 'Scroll right',
            overflowMenuAriaLabel: 'More tabs',
          }}
          ariaLabel="No overflow tabs demo"
        />
      </div>

      <h2>Container variant — overflow</h2>
      <div style={{ maxWidth: 400 }}>
        <Tabs
          id="container-overflow-tabs"
          variant="container"
          tabs={manyTabs}
          activeTabId={activeTabId}
          onChange={e => setActiveTabId(e.detail.activeTabId)}
          overflowBehavior={overflowBehavior}
          i18nStrings={{
            scrollLeftAriaLabel: 'Scroll left',
            scrollRightAriaLabel: 'Scroll right',
            overflowMenuAriaLabel: 'More tabs',
          }}
          ariaLabel="Container overflow tabs demo"
        />
      </div>
    </SpaceBetween>
  );
}
