// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, SpaceBetween, Tabs, TabsProps } from '~components';

import { SimplePage } from '../app/templates';

export default function TabsDemoPage() {
  const tabs: Array<TabsProps.Tab> = [
    {
      label: 'First tab',
      id: 'first',
      content:
        'Diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      label: 'Second tab',
      id: 'second',
      content:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);
  return (
    <SimplePage title="Tabs">
      <SpaceBetween size="xs">
        <div>
          <h2>Controlled component</h2>
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={() => setSelectedTab(tabs[0].id)}>Select first tab</Button>
            <Button onClick={() => setSelectedTab(tabs[1].id)}>Select second tab</Button>
          </SpaceBetween>
          <Tabs
            tabs={tabs}
            activeTabId={selectedTab}
            onChange={event => setSelectedTab(event.detail.activeTabId)}
            i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
          />
        </div>
        <div>
          <h2>Uncontrolled component</h2>
          <Tabs
            tabs={tabs}
            i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
          />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
