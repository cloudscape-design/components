// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Pagination from '@cloudscape-design/components/pagination';
import SplitPanel from '@cloudscape-design/components/split-panel';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { Distribution } from '../../fake-server/types';
import {
  distributionTableAriaLabels,
  getHeaderCounterText,
  getTextFilterCounterText,
  renderAriaLive,
} from '../../i18n-strings';
import { FullPageHeader } from '../commons';
import {
  CustomAppLayout,
  DemoTopNavigation,
  GlobalSplitPanelContent,
  Navigation,
  Notifications,
  TableEmptyState,
  TableNoMatchState,
  useGlobalSplitPanel,
} from '../commons/common-components';
import { COLUMN_DEFINITIONS, DEFAULT_PREFERENCES, Preferences } from '../commons/table-config';
import { useColumnWidths } from '../commons/use-column-widths';
import { useLocalStorage } from '../commons/use-local-storage';
import { Breadcrumbs, ToolsContent } from './common-components';

import '../../styles/base.scss';
import '../../styles/top-navigation.scss';

interface TableContentProps {
  distributions: Distribution[];
  loadHelpPanelContent: () => void;
}

function TableContent({ distributions, loadHelpPanelContent }: TableContentProps) {
  const [columnDefinitions, saveWidths] = useColumnWidths('React-Table-Widths', COLUMN_DEFINITIONS);
  const [preferences, setPreferences] = useLocalStorage('React-Table-Preferences', DEFAULT_PREFERENCES);
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    distributions,
    {
      filtering: {
        empty: <TableEmptyState resourceName="Distribution" />,
        noMatch: <TableNoMatchState onClearFilter={() => actions.setFiltering('')} />,
      },
      pagination: { pageSize: preferences?.pageSize },
      sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
      selection: {},
    }
  );
  return (
    <Table
      {...collectionProps}
      enableKeyboardNavigation={true}
      columnDefinitions={columnDefinitions}
      columnDisplay={preferences?.contentDisplay}
      items={items}
      selectionType="multi"
      ariaLabels={distributionTableAriaLabels}
      renderAriaLive={renderAriaLive}
      variant="full-page"
      stickyHeader={true}
      resizableColumns={true}
      onColumnWidthsChange={saveWidths}
      wrapLines={preferences?.wrapLines}
      stripedRows={preferences?.stripedRows}
      contentDensity={preferences?.contentDensity}
      stickyColumns={preferences?.stickyColumns}
      header={
        <FullPageHeader
          selectedItemsCount={collectionProps.selectedItems?.length ?? 0}
          counter={getHeaderCounterText(distributions, collectionProps.selectedItems)}
          onInfoLinkClick={loadHelpPanelContent}
        />
      }
      filter={
        <TextFilter
          {...filterProps}
          filteringAriaLabel="Filter distributions"
          filteringPlaceholder="Find distributions"
          filteringClearAriaLabel="Clear"
          countText={getTextFilterCounterText(filteredItemsCount ?? 0)}
        />
      }
      pagination={<Pagination {...paginationProps} />}
      preferences={<Preferences preferences={preferences} setPreferences={setPreferences} />}
    />
  );
}

export interface AppProps {
  distributions: Distribution[];
}

export function App({ distributions }: AppProps) {
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
        notifications={<Notifications successNotification={true} showDisclaimer={true} />}
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
          <TableContent
            distributions={distributions}
            loadHelpPanelContent={() => {
              setToolsOpen(true);
              appLayout.current?.focusToolsClose();
            }}
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
