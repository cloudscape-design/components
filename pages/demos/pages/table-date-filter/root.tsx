// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import SplitPanel from '@cloudscape-design/components/split-panel';

import {
  CustomAppLayout,
  DemoTopNavigation,
  GlobalSplitPanelContent,
  Navigation,
  Notifications,
  useGlobalSplitPanel,
} from '../commons/common-components';
import { useColumnWidths } from '../commons/use-column-widths';
import { useLocalStorage } from '../commons/use-local-storage';
import { Breadcrumbs, ToolsContent } from '../table/common-components';
import { PropertyFilterTable } from '../table-property-filter/property-filter-table';
import {
  COLUMN_DEFINITIONS,
  CONTENT_DISPLAY_OPTIONS,
  DEFAULT_PREFERENCES,
  FILTERING_PROPERTIES,
} from './table-date-filter-config';

import '../../styles/table-date-filter.scss';

export function App() {
  const [columnDefinitions, saveWidths] = useColumnWidths('React-TableDateFilter-Widths', COLUMN_DEFINITIONS);
  const [preferences, setPreferences] = useLocalStorage('React-TableDateFilter-Preferences', DEFAULT_PREFERENCES);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  return (
    <>
      <DemoTopNavigation />
      <CustomAppLayout
        ref={appLayout}
        navigation={<Navigation activeHref="#/distributions" />}
        notifications={<Notifications successNotification={true} />}
        breadcrumbs={<Breadcrumbs />}
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
          <PropertyFilterTable
            loadHelpPanelContent={() => {
              setToolsOpen(true);
              appLayout.current?.focusToolsClose();
            }}
            columnDefinitions={columnDefinitions}
            contentDisplayOptions={CONTENT_DISPLAY_OPTIONS}
            saveWidths={saveWidths}
            preferences={preferences}
            setPreferences={setPreferences}
            filteringProperties={FILTERING_PROPERTIES}
          />
        }
        contentType="table"
        tools={<ToolsContent />}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        stickyNotifications={true}
      />
    </>
  );
}
