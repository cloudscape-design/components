// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Tabs from '~components/tabs';

import ScreenshotArea from '../utils/screenshot-area';

export default function TabsScenario() {
  const embeddedTabs = [
    {
      id: 'first',
      label: 'Tab one',
      content: (
        <span>
          This is the <b>content</b> of the tab.
        </span>
      ),
    },
  ];

  const content = <Tabs tabs={embeddedTabs} variant="container" />;

  const tabs = [
    {
      id: 'first',
      label: 'Tab one',
      content,
    },
    {
      id: 'second',
      label: 'Tab two',
      content,
    },
    {
      id: 'third',
      label: 'Tab three',
      content,
    },
    {
      id: 'fourth',
      label: 'Tab four',
      content,
    },
    {
      id: 'fifth',
      label: 'Tab five',
      content,
    },
    {
      id: 'sixth',
      label: 'Tab six',
      content,
    },
  ];

  return (
    <div id="test" style={{ padding: 10 }}>
      <h1>Tabs integration test page</h1>
      <ScreenshotArea disableAnimations={true}>
        <div id="click-this" tabIndex={0} style={{ blockSize: 10 }} />
        <Tabs
          id="first-tabs"
          tabs={tabs}
          i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
        />
        <div id="click-this-2" tabIndex={0} style={{ blockSize: 10 }} />

        <Tabs
          tabs={tabs}
          variant="container"
          i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
        />
      </ScreenshotArea>
    </div>
  );
}
