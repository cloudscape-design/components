// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import HelpPanel from '@cloudscape-design/components/help-panel';
import SplitPanel from '@cloudscape-design/components/split-panel';

import { ExternalLinkGroup, Navigation, Notifications } from '../commons';
import { CustomAppLayout, ec2NavItems, GlobalSplitPanelContent } from '../commons/common-components';
import { useGlobalSplitPanel } from '../commons/use-global-split-panel';

export function Breadcrumbs() {
  return (
    <BreadcrumbGroup
      expandAriaLabel="Show path"
      ariaLabel="Breadcrumbs"
      items={[
        { text: 'RDS', href: '#' },
        { text: 'Instances', href: '#' },
      ]}
    />
  );
}

export function ToolsContent() {
  return (
    <HelpPanel
      header={<h2>Instances</h2>}
      footer={
        <ExternalLinkGroup
          items={[
            {
              href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.html',
              text: 'Amazon RDS database instances',
            },
            {
              href: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.Status.html',
              text: 'DB instance status',
            },
          ]}
        />
      }
    >
      <p>
        View your current DB instances and related information such as the engine, status, connections, class, and more.
        You can filter your instances by engine or class. To drill down even further into the details, choose the name
        of an individual instance.
      </p>
      <p>
        The status of a DB instance indicates the health of the DB instance. When you first create a DB instance, it has
        a status of <b>Creating</b> until the instance is ready to use. When the state changes to <b>Available</b>, you
        can connect to the instance.
      </p>
    </HelpPanel>
  );
}

interface PageActions {
  openTools: () => void;
}

export function PageLayout({ children }: { children: (actions: PageActions) => React.ReactNode }) {
  const appLayout = useRef<AppLayoutProps.Ref>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();
  return (
    <CustomAppLayout
      ref={appLayout}
      navigation={<Navigation items={ec2NavItems} activeHref="#/instances" />}
      notifications={<Notifications />}
      breadcrumbs={<Breadcrumbs />}
      content={children({
        openTools: () => {
          setToolsOpen(true);
          appLayout.current?.focusToolsClose();
        },
      })}
      contentType="table"
      tools={<ToolsContent />}
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
      stickyNotifications={true}
    />
  );
}
