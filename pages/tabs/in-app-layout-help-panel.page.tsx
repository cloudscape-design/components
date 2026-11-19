// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import Tabs from '~components/tabs';

export default function TabsInHelpPanelDemoPage() {
  const [toolsOpen, setToolsOpen] = useState(true);
  return (
    <AppLayout
      content={<h1>Tabs in help panel</h1>}
      navigationHide={true}
      ariaLabels={{
        tools: 'Tools',
        toolsToggle: 'Open tools',
        toolsClose: 'Close tools',
      }}
      toolsWidth={330}
      toolsOpen={toolsOpen}
      onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      tools={
        <Tabs
          tabs={[
            { id: 'help-panel', label: 'Info', content: 'Info' },
            {
              id: 'tutorials-panel',
              label: 'Tutorials',
              content: 'Tutorials',
            },
          ]}
          i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
        />
      }
    />
  );
}
