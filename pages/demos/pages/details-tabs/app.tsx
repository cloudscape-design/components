// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import SplitPanel from '@cloudscape-design/components/split-panel';
import Tabs from '@cloudscape-design/components/tabs';

import {
  CustomAppLayout,
  DemoTopNavigation,
  GlobalSplitPanelContent,
  Navigation,
  Notifications,
  useGlobalSplitPanel,
} from '../commons/common-components';
import { BehaviorsTable } from '../details/components/behaviors-table';
import { Breadcrumbs } from '../details/components/breadcrumbs';
import { EmptyTable } from '../details/components/empty-table';
import { GeneralConfig } from '../details/components/general-config';
import { OriginsTable } from '../details/components/origins-table';
import { PageHeader } from '../details/components/page-header';
import { TagsTable } from '../details/components/tags-table';
import { INSTANCE_DROPDOWN_ITEMS, INVALIDATIONS_COLUMN_DEFINITIONS } from '../details/details-config';
import ToolsContent from '../details/tools-content';
import { Details } from './components/details';
import { LogsTable } from './components/logs-table';

import '../../styles/top-navigation.scss';

export function App() {
  const [toolsIndex, setToolsIndex] = useState<number>(0);
  const [toolsOpen, setToolsOpen] = useState<boolean>(false);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const loadHelpPanelContent = (index: number): void => {
    setToolsIndex(index);
    setToolsOpen(true);
    appLayout.current?.focusToolsClose();
  };

  return (
    <>
      <DemoTopNavigation />
      <CustomAppLayout
        ref={appLayout}
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
        content={
          <SpaceBetween size="m">
            <PageHeader
              buttons={[
                {
                  text: 'Actions',
                  items: INSTANCE_DROPDOWN_ITEMS,
                  itemType: 'group',
                },
                {
                  text: 'Edit',
                  itemType: 'action',
                  id: 'edit',
                },
                {
                  text: 'Delete',
                  itemType: 'action',
                  id: 'delete',
                },
              ]}
            />
            <SpaceBetween size="l">
              <GeneralConfig />
              <Tabs
                tabs={[
                  {
                    label: 'Details',
                    id: 'details',
                    content: <Details loadHelpPanelContent={loadHelpPanelContent} />,
                  },
                  {
                    label: 'Logs',
                    id: 'logs',
                    content: <LogsTable />,
                  },
                  {
                    label: 'Origins',
                    id: 'origins',
                    content: <OriginsTable />,
                  },
                  {
                    label: 'Behaviors',
                    id: 'behaviors',
                    content: <BehaviorsTable />,
                  },
                  {
                    label: 'Invalidations',
                    id: 'invalidations',
                    content: <EmptyTable title="Invalidation" columnDefinitions={INVALIDATIONS_COLUMN_DEFINITIONS} />,
                  },
                  {
                    label: 'Tags',
                    id: 'tags',
                    content: <TagsTable loadHelpPanelContent={loadHelpPanelContent} />,
                  },
                ]}
                ariaLabel="Resource details"
              />
            </SpaceBetween>
          </SpaceBetween>
        }
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation activeHref="#/distributions" />}
        tools={ToolsContent[toolsIndex]}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }: { detail: { open: boolean } }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
      />
    </>
  );
}
