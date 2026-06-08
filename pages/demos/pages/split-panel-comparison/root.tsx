// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Pagination from '@cloudscape-design/components/pagination';
import SplitPanel from '@cloudscape-design/components/split-panel';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { getHeaderCounterText, getTextFilterCounterText, renderAriaLive } from '../../i18n-strings';
import INSTANCES from '../../resources/ec2-instances';
import { FullPageHeader } from '../commons';
import {
  CustomAppLayout,
  ec2NavItems,
  Navigation,
  Notifications,
  TableEmptyState,
  TableNoMatchState,
} from '../commons/common-components';
import { useLocalStorage } from '../commons/use-local-storage';
import { EC2ToolsContent } from '../table/common-components';
import { COLUMN_DEFINITIONS_MAIN, DEFAULT_PREFERENCES, EC2Preferences, SELECTION_LABELS } from './table-config';
import { Breadcrumbs, getPanelContent, useSplitPanel } from './utils';

// It's necessary to import a scss file or the build will fail
import '../../styles/base.scss';

export const App = () => {
  const [preferences, setPreferences] = useLocalStorage('React-SplitPanelComparison-Preferences', DEFAULT_PREFERENCES);
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    INSTANCES,
    {
      filtering: {
        empty: <TableEmptyState resourceName="Instance" />,
        noMatch: <TableNoMatchState onClearFilter={() => actions.setFiltering('')} />,
      },
      pagination: { pageSize: preferences?.pageSize },
      selection: {},
    }
  );
  const { header: panelHeader, body: panelBody } = getPanelContent(collectionProps.selectedItems, 'comparison');
  const [toolsOpen, setToolsOpen] = useState(false);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize } = useSplitPanel(
    collectionProps.selectedItems
  );
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  return (
    <CustomAppLayout
      ref={appLayout}
      contentType="table"
      navigation={<Navigation items={ec2NavItems} activeHref="#/instances" />}
      breadcrumbs={<Breadcrumbs />}
      notifications={<Notifications successNotification={true} />}
      tools={<EC2ToolsContent />}
      toolsOpen={toolsOpen}
      onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      splitPanelOpen={splitPanelOpen}
      onSplitPanelToggle={onSplitPanelToggle}
      splitPanelSize={splitPanelSize}
      onSplitPanelResize={onSplitPanelResize}
      splitPanel={<SplitPanel header={panelHeader}>{panelBody}</SplitPanel>}
      content={
        <Table
          {...collectionProps}
          enableKeyboardNavigation={true}
          header={
            <FullPageHeader
              title="Instances"
              createButtonText="Create instance"
              selectedItemsCount={collectionProps.selectedItems?.length ?? 0}
              counter={getHeaderCounterText(INSTANCES, collectionProps.selectedItems)}
              onInfoLinkClick={() => {
                setToolsOpen(true);
                appLayout.current?.focusToolsClose();
              }}
            />
          }
          columnDefinitions={COLUMN_DEFINITIONS_MAIN}
          columnDisplay={preferences?.contentDisplay}
          items={items}
          variant="full-page"
          stickyHeader={true}
          selectionType="multi"
          ariaLabels={SELECTION_LABELS}
          renderAriaLive={renderAriaLive}
          filter={
            <TextFilter
              {...filterProps}
              filteringAriaLabel="Filter instances"
              filteringPlaceholder="Find instances"
              countText={filteredItemsCount ? getTextFilterCounterText(filteredItemsCount) : undefined}
            />
          }
          wrapLines={preferences?.wrapLines}
          stripedRows={preferences?.stripedRows}
          contentDensity={preferences?.contentDensity}
          stickyColumns={preferences?.stickyColumns}
          pagination={<Pagination {...paginationProps} />}
          preferences={<EC2Preferences preferences={preferences} setPreferences={setPreferences} />}
        />
      }
    />
  );
};
