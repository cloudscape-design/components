// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import { SelectProps } from '@cloudscape-design/components/select';
import SplitPanel from '@cloudscape-design/components/split-panel';

import { resourceCreateBreadcrumbs } from '../../common/breadcrumbs';
import {
  CustomAppLayout,
  DemoTopNavigation,
  GlobalSplitPanelContent,
  Navigation,
  Notifications,
  useGlobalSplitPanel,
} from '../commons/common-components';
import { FormFull, FormHeader } from './components/form';
import ToolsContent from './components/tools-content';

import '../../styles/top-navigation.scss';

const Breadcrumbs = () => (
  <BreadcrumbGroup items={resourceCreateBreadcrumbs} expandAriaLabel="Show path" ariaLabel="Breadcrumbs" />
);

export function App() {
  const [toolsIndex, setToolsIndex] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  // Minimal cache policy props for form compatibility
  const [selectedCachePolicy, setSelectedCachePolicy] = useState<SelectProps.Option | null>(null);
  const cachePolicyButtonRef = useRef(null);
  const cachePolicyProps = {
    buttonRef: cachePolicyButtonRef,
    policies: [],
    selectedPolicy: selectedCachePolicy,
    setSelectedPolicy: (option: SelectProps.Option) => setSelectedCachePolicy(option),
    toggleSplitPanel: () => undefined,
  };

  const loadHelpPanelContent = (index: number) => {
    setToolsIndex(index);
    setToolsOpen(true);
    appLayout.current?.focusToolsClose();
  };

  return (
    <>
      <DemoTopNavigation />
      <CustomAppLayout
        ref={appLayout}
        contentType="form"
        content={
          <FormFull
            loadHelpPanelContent={loadHelpPanelContent}
            header={<FormHeader loadHelpPanelContent={loadHelpPanelContent} />}
            cachePolicyProps={cachePolicyProps}
          />
        }
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation activeHref="#/distributions" />}
        tools={ToolsContent[toolsIndex]}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
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
      />
    </>
  );
}
