// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';
import SplitPanel from '@cloudscape-design/components/split-panel';

import {
  CustomAppLayout,
  DemoTopNavigation,
  GlobalSplitPanelContent,
  Navigation,
  Notifications,
  useGlobalSplitPanel,
} from '../commons/common-components';
import { Breadcrumbs } from '../details/components/breadcrumbs';
import { GeneralConfig } from '../details/components/general-config';
import { OriginsTable } from '../details/components/origins-table';
import { PageHeader } from '../details/components/page-header';
import { INSTANCE_DROPDOWN_ITEMS } from '../details/details-config';
import { LogsTable } from './components/logs-table';

import '../../styles/top-navigation.scss';

export function App() {
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();
  return (
    <>
      <DemoTopNavigation />
      <CustomAppLayout
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
                { text: 'Actions', items: INSTANCE_DROPDOWN_ITEMS },
                { text: 'Edit', itemType: 'action', id: 'edit' },
                { text: 'Delete', itemType: 'action', id: 'delete' },
              ]}
            />
            <SpaceBetween size="l">
              <GeneralConfig />
              <LogsTable />
              <OriginsTable />
            </SpaceBetween>
          </SpaceBetween>
        }
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation activeHref="#/distributions" />}
        toolsHide={true}
        contentType="default"
        notifications={<Notifications />}
      />
    </>
  );
}
