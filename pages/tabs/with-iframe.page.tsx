// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, Button, Link } from '~components';
import Tabs from '~components/tabs';

import { IframeWrapper } from '../utils/iframe-wrapper';

export default function () {
  return (
    <Box margin="m">
      <h1>Tabs in iframe</h1>

      <IframeWrapper id="iframe" AppComponent={DemoTabs} />
    </Box>
  );
}

function DemoTabs() {
  const [selectedTab, setSelectedTab] = useState('first');
  return (
    <>
      <Link id="before">Focus before</Link>

      <Tabs
        tabs={[
          {
            label: 'First tab',
            id: 'first',
            content: <Button id="tab-content-button">Interactive content</Button>,
          },
          {
            label: 'Second tab',
            id: 'second',
            content: 'Non-interactive content',
          },
        ]}
        activeTabId={selectedTab}
        onChange={event => setSelectedTab(event.detail.activeTabId)}
        i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
      />

      <Link id="after">Focus after</Link>
    </>
  );
}
