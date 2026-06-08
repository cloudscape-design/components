// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import SplitPanel from '@cloudscape-design/components/split-panel';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import {
  CustomAppLayout,
  DemoTopNavigation,
  GlobalSplitPanelContent,
  useGlobalSplitPanel,
} from '../commons/common-components';
import { Content } from './components/content';
import { DashboardHeader, DashboardMainInfo } from './components/header';
import { DashboardSideNavigation } from './components/side-navigation';

import '@cloudscape-design/global-styles/dark-mode-utils.css';
import '../../styles/top-navigation.scss';

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <DashboardMainInfo />);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  return (
    <HelpPanelProvider value={handleToolsContentChange}>
      <>
        <DemoTopNavigation />
        <CustomAppLayout
          ref={appLayout}
          content={
            <SpaceBetween size="m">
              <DashboardHeader actions={<Button variant="primary">Launch instance</Button>} />
              <Content />
            </SpaceBetween>
          }
          breadcrumbs={<Breadcrumbs items={[{ text: 'Dashboard', href: '#/' }]} />}
          navigation={<DashboardSideNavigation />}
          tools={toolsContent}
          toolsOpen={toolsOpen}
          onToolsChange={({ detail }) => setToolsOpen(detail.open)}
          splitPanelOpen={splitPanelOpen}
          onSplitPanelToggle={onSplitPanelToggle}
          splitPanelSize={splitPanelSize}
          onSplitPanelResize={onSplitPanelResize}
          splitPanelPreferences={splitPanelPreferences}
          splitPanel={
            <SplitPanel header="Design exploration">
              <GlobalSplitPanelContent />
            </SplitPanel>
          }
          notifications={<Notifications showDisclaimer={true} />}
        />
      </>
    </HelpPanelProvider>
  );
}
